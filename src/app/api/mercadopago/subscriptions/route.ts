import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoService } from '@/lib/mercadopago';

// POST /api/mercadopago/subscriptions - Criar assinatura
export async function POST(request: NextRequest) {
  try {
    const { 
      planId, 
      userEmail, 
      cardToken,
      externalReference,
      startDate,
      endDate 
    } = await request.json();

    // Validações
    if (!planId) {
      return NextResponse.json(
        { error: 'ID do plano é obrigatório' },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar dados do plano
    const planResult = await MercadoPagoService.getSubscriptionPlan(planId);
    
    if (!planResult.success) {
      return NextResponse.json(
        { error: 'Plano não encontrado', details: planResult.error },
        { status: 404 }
      );
    }

    const plan = planResult.data;

    // Calcular datas de início e fim
    const subscriptionStartDate = startDate || new Date().toISOString();
    let subscriptionEndDate = endDate;
    
    if (!subscriptionEndDate) {
      const endDateCalc = new Date(subscriptionStartDate);
      if (plan.auto_recurring.frequency_type === 'months') {
        endDateCalc.setMonth(endDateCalc.getMonth() + (plan.auto_recurring.repetitions || 12));
      } else if (plan.auto_recurring.frequency_type === 'days') {
        endDateCalc.setDate(endDateCalc.getDate() + (plan.auto_recurring.repetitions || 365));
      }
      subscriptionEndDate = endDateCalc.toISOString();
    }

    // Criar assinatura seguindo exatamente o formato do curl
    const subscriptionData = {
      preapproval_plan_id: planId,
      reason: plan.reason || 'FitHome Premium',
      external_reference: externalReference || `fithome_${Date.now()}`,
      payer_email: userEmail,
      card_token_id: cardToken,
      auto_recurring: {
        frequency: plan.auto_recurring.frequency,
        frequency_type: plan.auto_recurring.frequency_type,
        start_date: subscriptionStartDate,
        end_date: subscriptionEndDate,
        transaction_amount: plan.auto_recurring.transaction_amount,
        currency_id: plan.auto_recurring.currency_id,
      },
      back_url: process.env.NEXT_PUBLIC_APP_URL || 'https://fithome.app/premium/success',
      status: 'authorized' as const
    };

    const result = await MercadoPagoService.createSubscription(subscriptionData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Assinatura criada com sucesso!',
        subscription_id: result.subscription_id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point,
        data: result.data
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Erro ao criar assinatura',
          details: result.error 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Erro na API de assinaturas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/mercadopago/subscriptions - Listar assinaturas do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Aqui você implementaria a lógica para buscar assinaturas por email
    // Por enquanto, retornamos uma resposta de exemplo
    return NextResponse.json({
      success: true,
      subscriptions: [],
      message: 'Funcionalidade de listagem será implementada conforme necessário'
    });

  } catch (error: any) {
    console.error('Erro ao listar assinaturas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}