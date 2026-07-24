import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@karranka/database';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateOrderDto) {
    const totalItemsAmount = dto.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const totalAmount = totalItemsAmount + dto.shippingFee;

    return await this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant || variant.stockQuantity < item.quantity) {
          throw new BadRequestException(
            'Estoque insuficiente para a variação selecionada.',
          );
        }

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          shippingFee: dto.shippingFee,
          status: 'PENDING',
          zipCode: dto.zipCode,
          street: dto.street,
          number: dto.number,
          complement: dto.complement,
          neighborhood: dto.neighborhood,
          city: dto.city,
          state: dto.state,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtPurchase: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });
  }

  async findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
                color: true,
                size: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}