import { Injectable } from '@nestjs/common';
import { PrismaService } from '@karranka/database';

@Injectable()
export class ShippingService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateShipping(cep: string, uf: string, cidade: string) {
    const isPE = uf === 'PE';
    const isRMR = isPE && ['Recife', 'Olinda', 'Jaboatão dos Guararapes', 'Paulista'].includes(cidade);

    const methods = await this.prisma.shippingMethod.findMany({
      where: { active: true }
    });

    return methods
      .filter(method => !method.onlyLocal || isRMR)
      .map(method => {
        let price = Number(method.basePrice);
        let days = method.deliveryDays;

        if (!isPE) {
          price = price * 2.1;
          days = days + 3;
        } else if (!isRMR && !method.onlyLocal) {
          price = price * 1.3;
          days = days + 1;
        }

        return {
          id: String(method.id),
          nome: `${method.company} - ${method.name}`,
          prazo: `até ${days} dia${days > 1 ? 's' : ''} útil${days > 1 ? 'eis' : ''}`,
          preco: Number(price.toFixed(2))
        };
      })
      .sort((a, b) => a.preco - b.preco);
  }
}