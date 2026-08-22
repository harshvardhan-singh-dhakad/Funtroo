import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'llms-full.txt')
    const content = fs.readFileSync(filePath, 'utf8')

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    return new NextResponse('# Funtroo Full Documentation\n\n> Comprehensive AI documentation for Funtroo.', {
      status: 200,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    })
  }
}
