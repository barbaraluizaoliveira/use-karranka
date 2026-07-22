import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@karranka/database';
import { ShippingModule } from './shipping/shipping.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProductsModule,
    ShippingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}