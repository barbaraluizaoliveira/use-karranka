import { Controller, Post, Body, HttpCode, HttpStatus, Headers, Req, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreatePaymentDto) {
    try {
      return await this.paymentService.createPayment(dto);
    } catch (error: any) {
      const mpErrorMessage = error?.cause?.[0]?.description || error?.message || 'Pagamento recusado pelo Mercado Pago.';
      throw new BadRequestException(mpErrorMessage);
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('pix')
  async createPix(@Body() dto: any) {
    try {
      const result = await this.paymentService.createPixPayment(dto);

      return {
        id: result.id,
        status: result.status,
        qr_code: result.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
      };
    } catch (error: any) {
      const mpErrorMessage = error?.cause?.[0]?.description || error?.message || 'Erro ao gerar PIX.';
      throw new BadRequestException(mpErrorMessage);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  async webhook(
    @Body() body: any,
    @Headers('x-signature') signature: string,
    @Headers('x-request-id') requestId: string,
    @Req() req: Request,
  ) {
    const dataId = body?.data?.id;
    if (!dataId) return { received: true };

    // const isValid = this.paymentService.validateSignature(signature, requestId, dataId);
    // if (!isValid) return { received: false };

    await this.paymentService.processWebhook(dataId);
    return { received: true };
  }
}