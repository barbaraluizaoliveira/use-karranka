import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('calculate')
  async calculate(@Body() body: { cep: string; items: { productId: number; quantity: number }[] }) {
    return this.shippingService.calculateShippingCart(body.cep, body.items);
  }

  @Get('melhor-envio/authorize')
  authorize(@Res() res: Response) {
    return res.redirect(this.shippingService.getAuthorizationUrl());
  }

  @Get('melhor-envio/callback')
  async callback(@Query('code') code: string) {
    await this.shippingService.exchangeCodeForToken(code);
    return { status: 'ok' };
  }
}