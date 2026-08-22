import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { isAIConfigured } from '@/lib/ai/config';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    services: {
      api: { status: 'up' },
      database: { status: 'unknown' },
      ai: { status: 'unknown', configured: false },
    },
  };

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.services.database.status = 'up';
  } catch (error) {
    health.services.database.status = 'down';
    health.status = 'degraded';
  }

  // Check AI
  health.services.ai.configured = isAIConfigured();
  health.services.ai.status = health.services.ai.configured ? 'up' : 'not_configured';

  const statusCode = health.status === 'healthy' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}
