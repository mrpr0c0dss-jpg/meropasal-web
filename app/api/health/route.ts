import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'MeroPasal Web POS & Inventory Management System',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
    database: 'healthy',
    sync: 'active',
  });
}
