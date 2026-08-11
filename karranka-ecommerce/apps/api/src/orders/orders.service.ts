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

        // Reserva o estoque no momento da criação
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

  // --- NOVO MÉTODO PARA ATUALIZAR STATUS E DEVOLVER ESTOQUE ---
  async updateOrderStatus(orderId: number, status: string) {
    return await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new BadRequestException('Pedido não encontrado.');
      }

      // Se o pedido já estava cancelado, ignora para não duplicar a devolução de estoque
      if (order.status === 'CANCELLED') {
        return order;
      }

      // Atualiza o status do pedido
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      // Se o novo status for CANCELLED, devolve as quantidades para o estoque
      if (status === 'CANCELLED') {
        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: {
                increment: item.quantity, // Devolve a quantidade exata comprada
              },
            },
          });
        }
      }

      return updatedOrder;
    });
  }
}