import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { PrismaModule } from '@karranka/database';
import { ProductsModule } from './products/products.module';
import { ShippingModule } from './shipping/shipping.module';
import { BannersModule } from './banners/banners.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    BannersModule,
    OrdersModule,
    PaymentModule,
    ProductsModule,
    ShippingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}