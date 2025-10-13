import { MercadoPagoConfig, PreApprovalPlan, PreApproval, Payment } from 'mercadopago';

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
});

// Instâncias dos serviços
const preApprovalPlan = new PreApprovalPlan(client);
const preApproval = new PreApproval(client);
const payment = new Payment(client);

// Interface para plano de assinatura
export interface SubscriptionPlan {
  id?: string;
  reason: string;
  auto_recurring: {
    frequency: number;
    frequency_type: 'months' | 'days' | 'weeks';
    repetitions?: number;
    billing_day?: number;
    billing_day_proportional?: boolean;
    free_trial?: {
      frequency: number;
      frequency_type: 'months' | 'days' | 'weeks';
    };
    transaction_amount: number;
    currency_id: string;
  };
  payment_methods_allowed?: {
    payment_types?: Array<{
      id?: string;
    }>;
    payment_methods?: Array<{
      id?: string;
    }>;
  };
  back_url: string;
}

// Interface para assinatura - seguindo exatamente o formato do curl
export interface Subscription {
  id?: string;
  preapproval_plan_id: string;
  reason: string;
  external_reference?: string;
  payer_email: string;
  card_token_id?: string;
  auto_recurring: {
    frequency: number;
    frequency_type: 'months' | 'days' | 'weeks';
    start_date?: string;
    end_date?: string;
    transaction_amount: number;
    currency_id: string;
  };
  back_url: string;
  status?: 'pending' | 'authorized' | 'paused' | 'cancelled';
}

// Classe principal do serviço Mercado Pago
export class MercadoPagoService {
  
  /**
   * Criar plano de assinatura
   */
  static async createSubscriptionPlan(planData: SubscriptionPlan) {
    try {
      const response = await preApprovalPlan.create({
        body: {
          reason: planData.reason,
          auto_recurring: planData.auto_recurring,
          payment_methods_allowed: planData.payment_methods_allowed || {
            payment_types: [{}],
            payment_methods: [{}]
          },
          back_url: planData.back_url
        }
      });

      return {
        success: true,
        data: response,
        plan_id: response.id
      };
    } catch (error: any) {
      console.error('Erro ao criar plano de assinatura:', error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido',
        details: error
      };
    }
  }

  /**
   * Buscar plano de assinatura por ID
   */
  static async getSubscriptionPlan(planId: string) {
    try {
      const response = await preApprovalPlan.get({ id: planId });
      
      return {
        success: true,
        data: response
      };
    } catch (error: any) {
      console.error('Erro ao buscar plano:', error);
      return {
        success: false,
        error: error.message || 'Plano não encontrado'
      };
    }
  }

  /**
   * Listar todos os planos de assinatura
   */
  static async listSubscriptionPlans() {
    try {
      const response = await preApprovalPlan.search({
        options: {
          limit: 50,
          offset: 0
        }
      });

      return {
        success: true,
        data: response.results || [],
        total: response.paging?.total || 0
      };
    } catch (error: any) {
      console.error('Erro ao listar planos:', error);
      return {
        success: false,
        error: error.message || 'Erro ao buscar planos'
      };
    }
  }

  /**
   * Criar assinatura - seguindo exatamente o formato do curl fornecido
   */
  static async createSubscription(subscriptionData: Subscription) {
    try {
      // Estrutura exata conforme o curl fornecido
      const requestBody = {
        preapproval_plan_id: subscriptionData.preapproval_plan_id,
        reason: subscriptionData.reason,
        external_reference: subscriptionData.external_reference,
        payer_email: subscriptionData.payer_email,
        card_token_id: subscriptionData.card_token_id,
        auto_recurring: {
          frequency: subscriptionData.auto_recurring.frequency,
          frequency_type: subscriptionData.auto_recurring.frequency_type,
          start_date: subscriptionData.auto_recurring.start_date,
          end_date: subscriptionData.auto_recurring.end_date,
          transaction_amount: subscriptionData.auto_recurring.transaction_amount,
          currency_id: subscriptionData.auto_recurring.currency_id
        },
        back_url: subscriptionData.back_url,
        status: subscriptionData.status || 'authorized'
      };

      const response = await preApproval.create({
        body: requestBody
      });

      return {
        success: true,
        data: response,
        subscription_id: response.id,
        init_point: response.init_point, // URL para redirecionar o usuário
        sandbox_init_point: response.sandbox_init_point
      };
    } catch (error: any) {
      console.error('Erro ao criar assinatura:', error);
      return {
        success: false,
        error: error.message || 'Erro ao criar assinatura',
        details: error
      };
    }
  }

  /**
   * Buscar assinatura por ID
   */
  static async getSubscription(subscriptionId: string) {
    try {
      const response = await preApproval.get({ id: subscriptionId });
      
      return {
        success: true,
        data: response
      };
    } catch (error: any) {
      console.error('Erro ao buscar assinatura:', error);
      return {
        success: false,
        error: error.message || 'Assinatura não encontrada'
      };
    }
  }

  /**
   * Cancelar assinatura
   */
  static async cancelSubscription(subscriptionId: string) {
    try {
      const response = await preApproval.update({
        id: subscriptionId,
        body: {
          status: 'cancelled'
        }
      });

      return {
        success: true,
        data: response
      };
    } catch (error: any) {
      console.error('Erro ao cancelar assinatura:', error);
      return {
        success: false,
        error: error.message || 'Erro ao cancelar assinatura'
      };
    }
  }

  /**
   * Pausar assinatura
   */
  static async pauseSubscription(subscriptionId: string) {
    try {
      const response = await preApproval.update({
        id: subscriptionId,
        body: {
          status: 'paused'
        }
      });

      return {
        success: true,
        data: response
      };
    } catch (error: any) {
      console.error('Erro ao pausar assinatura:', error);
      return {
        success: false,
        error: error.message || 'Erro ao pausar assinatura'
      };
    }
  }

  /**
   * Reativar assinatura pausada
   */
  static async resumeSubscription(subscriptionId: string) {
    try {
      const response = await preApproval.update({
        id: subscriptionId,
        body: {
          status: 'authorized'
        }
      });

      return {
        success: true,
        data: response
      };
    } catch (error: any) {
      console.error('Erro ao reativar assinatura:', error);
      return {
        success: false,
        error: error.message || 'Erro ao reativar assinatura'
      };
    }
  }

  /**
   * Buscar pagamentos de uma assinatura
   */
  static async getSubscriptionPayments(subscriptionId: string) {
    try {
      const response = await payment.search({
        options: {
          criteria: {
            external_reference: subscriptionId
          }
        }
      });

      return {
        success: true,
        data: response.results || [],
        total: response.paging?.total || 0
      };
    } catch (error: any) {
      console.error('Erro ao buscar pagamentos:', error);
      return {
        success: false,
        error: error.message || 'Erro ao buscar pagamentos'
      };
    }
  }

  /**
   * Validar webhook do Mercado Pago
   */
  static validateWebhook(signature: string, body: string, secret: string): boolean {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
      
      return signature === expectedSignature;
    } catch (error) {
      console.error('Erro ao validar webhook:', error);
      return false;
    }
  }
}

// Planos pré-configurados para o FitHome
export const FITHOME_PLANS = {
  PREMIUM_MONTHLY: {
    reason: "FitHome Premium - Plano Mensal",
    auto_recurring: {
      frequency: 1,
      frequency_type: "months" as const,
      repetitions: 12,
      billing_day: 10,
      billing_day_proportional: true,
      free_trial: {
        frequency: 7,
        frequency_type: "days" as const
      },
      transaction_amount: 19.90,
      currency_id: "BRL"
    },
    payment_methods_allowed: {
      payment_types: [
        { id: "credit_card" },
        { id: "debit_card" },
        { id: "digital_wallet" }
      ],
      payment_methods: [
        { id: "visa" },
        { id: "master" },
        { id: "amex" },
        { id: "elo" },
        { id: "pix" }
      ]
    },
    back_url: process.env.NEXT_PUBLIC_APP_URL || "https://fithome.app"
  },
  
  PREMIUM_YEARLY: {
    reason: "FitHome Premium - Plano Anual (2 meses grátis)",
    auto_recurring: {
      frequency: 12,
      frequency_type: "months" as const,
      repetitions: 5,
      billing_day: 10,
      billing_day_proportional: true,
      free_trial: {
        frequency: 7,
        frequency_type: "days" as const
      },
      transaction_amount: 199.00, // 10 meses pelo preço de 12
      currency_id: "BRL"
    },
    payment_methods_allowed: {
      payment_types: [
        { id: "credit_card" },
        { id: "debit_card" },
        { id: "digital_wallet" }
      ],
      payment_methods: [
        { id: "visa" },
        { id: "master" },
        { id: "amex" },
        { id: "elo" },
        { id: "pix" }
      ]
    },
    back_url: process.env.NEXT_PUBLIC_APP_URL || "https://fithome.app"
  }
};

export default MercadoPagoService;