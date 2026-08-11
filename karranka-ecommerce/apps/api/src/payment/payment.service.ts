import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import * as crypto from 'crypto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentService {
  private client: MercadoPagoConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN')!,
    });
  }

  async createPayment(data: {
    orderId: number;
    token: string;
    transaction_amount: number;
    description: string;
    installments: number;
    payment_method_id: string;
    email: string;
    cpf?: string;
  }) {
    const payment = new Payment(this.client);
    const validAmount = Number(Number(data.transaction_amount).toFixed(2));

    return payment.create({
      body: {
        transaction_amount: validAmount,
        token: data.token,
        description: data.description,
        installments: data.installments,
        payment_method_id: data.payment_method_id,
        external_reference: String(data.orderId),
        payer: {
          email: data.email,
          ...(data.cpf && {
            identification: {
              type: 'CPF',
              number: data.cpf,
            },
          }),
        },
      },
    });
  }

  async createPixPayment(data: {
    orderId: number;
    transaction_amount: number;
    description: string;
    email: string;
    cpf?: string;
  }) {
    const payment = new Payment(this.client);
    const validAmount = Number(Number(data.transaction_amount).toFixed(2));

    return payment.create({
      body: {
        transaction_amount: validAmount,
        description: data.description,
        payment_method_id: 'pix',
        external_reference: String(data.orderId),
        payer: {
          email: data.email,
          ...(data.cpf && {
            identification: {
              type: 'CPF',
              number: data.cpf,
            },
          }),
        },
      },
    });
  }

  validateSignature(signature: string, requestId: string, dataId: string): boolean {
    if (!signature || !requestId) return false;

    const parts = signature.split(',');
    const ts = parts.find((p) => p.startsWith('ts='))?.split('=')[1];
    const hash = parts.find((p) => p.startsWith('v1='))?.split('=')[1];

    if (!ts || !hash) return false;

    const secret = this.configService.get<string>('MERCADOPAGO_WEBHOOK_SECRET')!;
    const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;

    const computedHash = crypto
      .createHmac('sha256', secret)
      .update(manifest)
      .digest('hex');

    return computedHash === hash;
  }

  async processWebhook(paymentId: string) {
    const payment = new Payment(this.client);
    const result = await payment.get({ id: paymentId });
    const orderId = result.external_reference;

    if (!orderId) {
      console.warn(`Pagamento ${paymentId} não possui external_reference. Ignorando.`);
      return result;
    }

    const mpStatus = result.status;
    let novoStatusDaKarranka = 'PENDING';

    if (mpStatus === 'approved') {
      novoStatusDaKarranka = 'PAID';
    } else if (mpStatus === 'rejected' || mpStatus === 'cancelled' || mpStatus === 'refunded' || mpStatus === 'charged_back') {
      novoStatusDaKarranka = 'CANCELLED';
    } else if (mpStatus === 'pending' || mpStatus === 'in_process') {
      novoStatusDaKarranka = 'PENDING';
    }

    await this.ordersService.updateOrderStatus(Number(orderId), novoStatusDaKarranka);

    console.log(`[Webhook] Pedido ${orderId} atualizado para o status: ${novoStatusDaKarranka}`);

    return result;
  }
}