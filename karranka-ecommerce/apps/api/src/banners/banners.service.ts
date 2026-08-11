import { Injectable } from '@nestjs/common';
import { PrismaService } from '@karranka/database';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.carouselBanner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }
}