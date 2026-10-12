import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'MeroPasal automated backup generator',
    format: 'JSON',
    version: '2.4.0',
    exportTime: new Date().toISOString(),
    status: 'success',
  });
}
