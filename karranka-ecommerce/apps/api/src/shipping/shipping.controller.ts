import { Controller, Post, Body } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('calculate')
  async calculate(@Body() body: { cep: string; uf: string; cidade: string }) {
    return this.shippingService.calculateShipping(body.cep, body.uf, body.cidade);
  }
}