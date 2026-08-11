import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { OrdersService } from '../orders/orders.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, OrdersService],
})
export class PaymentModule {}
