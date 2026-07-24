import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from '@karranka/database';
import { ProductsModule } from './products/products.module';
import { ShippingModule } from './shipping/shipping.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    OrdersModule,
    ProductsModule,
    ShippingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}