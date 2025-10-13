import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoService } from '@/lib/mercadopago';

// GET /api/mercadopago/subscriptions/[id] - Buscar assinatura específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriptionId = params.id;

    const result = await MercadoPagoService.getSubscription(subscriptionId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        subscription: result.data
      });
    } else {
      return NextResponse.json(
        { error: 'Assinatura não encontrada', details: result.error },
        { status: 404 }
      );
    }

  } catch (error: any) {
    console.error('Erro ao buscar assinatura:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/mercadopago/subscriptions/[id] - Atualizar assinatura (cancelar, pausar, reativar)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriptionId = params.id;
    const { action } = await request.json();

    if (!action || !['cancel', 'pause', 'resume'].includes(action)) {
      return NextResponse.json(
        { error: 'Ação inválida. Use "cancel", "pause" ou "resume".' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'cancel':
        result = await MercadoPagoService.cancelSubscription(subscriptionId);
        break;
      case 'pause':
        result = await MercadoPagoService.pauseSubscription(subscriptionId);
        break;
      case 'resume':
        result = await MercadoPagoService.resumeSubscription(subscriptionId);
        break;
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Assinatura ${action === 'cancel' ? 'cancelada' : action === 'pause' ? 'pausada' : 'reativada'} com sucesso!`,
        subscription: result.data
      });
    } else {
      return NextResponse.json(
        { 
          error: `Erro ao ${action === 'cancel' ? 'cancelar' : action === 'pause' ? 'pausar' : 'reativar'} assinatura`,
          details: result.error 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Erro ao atualizar assinatura:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}