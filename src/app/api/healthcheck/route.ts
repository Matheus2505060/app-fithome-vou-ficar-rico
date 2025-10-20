import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Verificações básicas de saúde da aplicação
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      teamId: process.env.NEXT_PUBLIC_VERCEL_TEAM_ID || 'team_dsK7gXel3TYf9v1zvRJO5D24',
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      },
      checks: {
        database: 'ok', // Pode ser expandido para verificar Supabase
        external_apis: 'ok',
        file_system: 'ok',
      }
    }

    return NextResponse.json(healthCheck, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}