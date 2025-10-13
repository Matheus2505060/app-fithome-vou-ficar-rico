import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoService, FITHOME_PLANS } from '@/lib/mercadopago';

// POST /api/mercadopago/plans - Criar plano de assinatura
export async function POST(request: NextRequest) {
  try {
    const { planType } = await request.json();
    
    // Validar tipo de plano
    if (!planType || !['monthly', 'yearly'].includes(planType)) {
      return NextResponse.json(
        { error: 'Tipo de plano inválido. Use "monthly" ou "yearly".' },
        { status: 400 }
      );
    }

    // Selecionar configuração do plano
    const planConfig = planType === 'monthly' 
      ? FITHOME_PLANS.PREMIUM_MONTHLY 
      : FITHOME_PLANS.PREMIUM_YEARLY;

    // Criar plano no Mercado Pago
    const result = await MercadoPagoService.createSubscriptionPlan(planConfig);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Plano criado com sucesso!',
        plan_id: result.plan_id,
        data: result.data
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Erro ao criar plano',
          details: result.error 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Erro na API de planos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/mercadopago/plans - Listar planos
export async function GET() {
  try {
    const result = await MercadoPagoService.listSubscriptionPlans();

    if (result.success) {
      return NextResponse.json({
        success: true,
        plans: result.data,
        total: result.total
      });
    } else {
      return NextResponse.json(
        { error: 'Erro ao buscar planos', details: result.error },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Erro ao listar planos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}