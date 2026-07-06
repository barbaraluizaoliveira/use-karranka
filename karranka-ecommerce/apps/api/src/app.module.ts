import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { PrismaModule } from './prisma/prisma.module';
// import { ShippingModule } from './modules/shipping/shipping.module';
// import { ProductsModule } from './modules/products/products.module';
// import { AuthModule } from './modules/auth/auth.module';
// import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // PrismaModule,
    // ProductsModule,
    // AuthModule,
    // CartModule,
    // ShippingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}