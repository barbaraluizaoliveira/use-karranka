import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@karranka/database';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const collectionExists = await this.prisma.collection.findUnique({
      where: { id: createProductDto.collectionId },
    });

    if (!collectionExists) {
      throw new NotFoundException(`Coleção com ID ${createProductDto.collectionId} não encontrada.`);
    }

    // Mapeia o DTO usando as chaves exatas do seu schema.prisma
    return this.prisma.product.create({
      data: {
        collectionId: createProductDto.collectionId,
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        oldPrice: createProductDto.oldPrice,
        discountPercent: createProductDto.discountPercent,
        imageUrl: createProductDto.imageUrl,
        category: createProductDto.category || 'CLOTHING',
      },
    });
  }

  async findAll(page: number = 1, limit: number = 8) {
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: { collection: true },
      }),
      this.prisma.product.count(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            size: true,
            color: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    
    return product;
  }
}