import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import crypto from 'crypto';

// Generate 6-digit OTP
function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP email (placeholder - integrate with your email service)
async function sendOtpEmail(email: string, code: string, purpose: string) {
  // TODO: Integrate with email service (SendGrid, Resend, etc.)
  console.log(`[OTP] Sending ${purpose} OTP ${code} to ${email}`);

  // For development, log the OTP
  // In production, use a proper email service
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, purpose = 'LOGIN' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Validate purpose
    const validPurposes = ['LOGIN', 'SIGNUP', 'PASSWORD_RESET', 'EMAIL_VERIFICATION'];
    if (!validPurposes.includes(purpose)) {
      return NextResponse.json(
        { error: 'Invalid OTP purpose' },
        { status: 400 }
      );
    }

    // Delete any existing OTPs for this email/purpose
    await prisma.otpCode.deleteMany({
      where: { email, purpose: purpose as any },
    });

    // Generate new OTP
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await prisma.otpCode.create({
      data: {
        email: email.toLowerCase(),
        code,
        purpose: purpose as any,
        expiresAt,
      },
    });

    // Send email
    await sendOtpEmail(email, code, purpose);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // Include for development only - remove in production
      ...(process.env.NODE_ENV === 'development' && { code }),
    });
  } catch (error) {
    console.error('[OTP Send Error]', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
