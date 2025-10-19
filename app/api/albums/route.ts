import { NextResponse } from 'next/server'
import { albums } from '@/lib/photo-data'

export async function GET() {
  return NextResponse.json({ albums })
}
