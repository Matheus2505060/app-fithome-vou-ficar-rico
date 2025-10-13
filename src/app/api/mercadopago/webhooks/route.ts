import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoService } from '@/lib/mercadopago';

// POST /api/mercadopago/webhooks - Receber notificações do Mercado Pago
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature') || '';
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET || '';

    // Validar assinatura do webhook (se configurado)
    if (webhookSecret && !MercadoPagoService.validateWebhook(signature, body, webhookSecret)) {
      console.error('Webhook signature inválida');
      return NextResponse.json(
        { error: 'Signature inválida' },
        { status: 401 }
      );
    }

    const data = JSON.parse(body);
    
    console.log('Webhook recebido:', {
      type: data.type,
      action: data.action,
      data_id: data.data?.id,
      timestamp: new Date().toISOString()
    });

    // Processar diferentes tipos de notificação
    switch (data.type) {
      case 'preapproval':
        await handlePreApprovalNotification(data);
        break;
      
      case 'payment':
        await handlePaymentNotification(data);
        break;
      
      case 'plan':
        await handlePlanNotification(data);
        break;
      
      default:
        console.log('Tipo de notificação não reconhecido:', data.type);
    }

    return NextResponse.json({ success: true, message: 'Webhook processado' });

  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook', details: error.message },
      { status: 500 }
    );
  }
}

// Processar notificações de assinatura (preapproval)
async function handlePreApprovalNotification(data: any) {
  try {
    const subscriptionId = data.data?.id;
    const action = data.action;

    if (!subscriptionId) {
      console.error('ID da assinatura não encontrado na notificação');
      return;
    }

    console.log(`Processando notificação de assinatura: ${action} para ID ${subscriptionId}`);

    // Buscar dados atualizados da assinatura
    const result = await MercadoPagoService.getSubscription(subscriptionId);

    if (result.success) {
      const subscription = result.data;
      
      // Aqui você pode implementar a lógica de negócio baseada no status
      switch (subscription.status) {
        case 'authorized':
          console.log(`Assinatura ${subscriptionId} foi autorizada`);
          // Ativar Premium para o usuário
          await activateUserPremium(subscription);
          break;
          
        case 'paused':
          console.log(`Assinatura ${subscriptionId} foi pausada`);
          // Pausar Premium do usuário
          await pauseUserPremium(subscription);
          break;
          
        case 'cancelled':
          console.log(`Assinatura ${subscriptionId} foi cancelada`);
          // Cancelar Premium do usuário
          await cancelUserPremium(subscription);
          break;
          
        default:
          console.log(`Status da assinatura ${subscriptionId}: ${subscription.status}`);
      }
    }

  } catch (error) {
    console.error('Erro ao processar notificação de assinatura:', error);
  }
}

// Processar notificações de pagamento
async function handlePaymentNotification(data: any) {
  try {
    const paymentId = data.data?.id;
    const action = data.action;

    if (!paymentId) {
      console.error('ID do pagamento não encontrado na notificação');
      return;
    }

    console.log(`Processando notificação de pagamento: ${action} para ID ${paymentId}`);

    // Aqui você pode buscar detalhes do pagamento se necessário
    // const paymentResult = await MercadoPagoService.getPayment(paymentId);

  } catch (error) {
    console.error('Erro ao processar notificação de pagamento:', error);
  }
}

// Processar notificações de plano
async function handlePlanNotification(data: any) {
  try {
    const planId = data.data?.id;
    const action = data.action;

    console.log(`Processando notificação de plano: ${action} para ID ${planId}`);

  } catch (error) {
    console.error('Erro ao processar notificação de plano:', error);
  }
}

// Funções auxiliares para gerenciar status Premium dos usuários
// Estas funções devem ser implementadas de acordo com sua lógica de negócio

async function activateUserPremium(subscription: any) {
  try {
    // Implementar lógica para ativar Premium do usuário
    // Exemplo: atualizar banco de dados, enviar email, etc.
    
    console.log('Ativando Premium para usuário:', subscription.payer_email);
    
    // Aqui você pode:
    // 1. Buscar usuário pelo email
    // 2. Atualizar status Premium no banco
    // 3. Enviar email de confirmação
    // 4. Registrar log da ativação
    
  } catch (error) {
    console.error('Erro ao ativar Premium:', error);
  }
}

async function pauseUserPremium(subscription: any) {
  try {
    console.log('Pausando Premium para usuário:', subscription.payer_email);
    
    // Implementar lógica para pausar Premium
    
  } catch (error) {
    console.error('Erro ao pausar Premium:', error);
  }
}

async function cancelUserPremium(subscription: any) {
  try {
    console.log('Cancelando Premium para usuário:', subscription.payer_email);
    
    // Implementar lógica para cancelar Premium
    
  } catch (error) {
    console.error('Erro ao cancelar Premium:', error);
  }
}