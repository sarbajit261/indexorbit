import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { hash } from 'crypto';

const MAX_ATTEMPTS = 5;
const OTP_LENGTH = 6;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, purpose = 'LOGIN' } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 400 }
      );
    }

    // Find the OTP
    const otp = await prisma.otpCode.findFirst({
      where: {
        email: email.toLowerCase(),
        code,
        purpose: purpose as any,
        verified: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > otp.expiresAt) {
      return NextResponse.json(
        { error: 'Code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check attempts
    if (otp.attempts >= MAX_ATTEMPTS) {
      // Delete the OTP after max attempts
      await prisma.otpCode.delete({ where: { id: otp.id } });
      return NextResponse.json(
        { error: 'Too many attempts. Please request a new code.' },
        { status: 400 }
      );
    }

    // Mark as verified
    await prisma.otpCode.update({
      where: { id: otp.id },
      data: {
        verified: true,
        usedAt: new Date(),
      },
    });

    // Generate a session token (in production, use proper JWT or session)
    const sessionToken = Buffer.from(
      JSON.stringify({
        email: email.toLowerCase(),
        purpose,
        verified: true,
        timestamp: Date.now(),
      })
    ).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Code verified successfully',
      sessionToken,
    });
  } catch (error) {
    console.error('[OTP Verify Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
