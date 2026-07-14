import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.carouselBanner.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.user.deleteMany();
  await prisma.shippingMethod.deleteMany();

  console.log('🧹 Cleaned up database.');

  await prisma.shippingMethod.createMany({
  data: [
    { name: 'Motoboy Express', company: 'Karranka Logística', basePrice: 10.00, deliveryDays: 1, onlyLocal: true },
    { name: 'SEDEX', company: 'Correios', basePrice: 15.50, deliveryDays: 2, onlyLocal: false },
    { name: '.Com', company: 'Jadlog', basePrice: 12.90, deliveryDays: 4, onlyLocal: false },
    { name: 'PAC', company: 'Correios', basePrice: 9.90, deliveryDays: 7, onlyLocal: false },
    { name: 'Cargo Express', company: 'Azul Cargo', basePrice: 28.00, deliveryDays: 5, onlyLocal: false }
  ]
});

  // 2. Criar Usuários (Admin e Cliente para testes)
  await prisma.user.create({
    data: {
      name: 'Bárbara Admin',
      email: 'admin@karranka.com',
      password: 'senha_criptografada_aqui', // Em produção, use bcrypt
      role: 'ADMIN',
    },
  });

  console.log('👤 Created users.');

  // 3. Criar Coleção Inicial
  const colecaoProtecao = await prisma.collection.create({
    data: {
      name: 'Coleção Proteção',
      active: true,
    },
  });

  console.log('📦 Created collection: Proteção.');

  // ==========================================
  // PRODUTO 1: FIGA BRABA
  // ==========================================
  const camisaFiga = await prisma.product.create({
    data: {
      collectionId: colecaoProtecao.id,
      name: 'Camisa Oversized Figa Braba',
      description: 'Camiseta streetwear oversized em suedine com estampa autoral Figa Braba.',
      category: 'CLOTHING',
      price: 199.90,
      imageUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1783972405/figa_camisa_branca_pcwzrv.jpg',
    },
  });

  // Cores da Figa Braba
  const figaOffWhite = await prisma.productColor.create({ 
    data: { 
      productId: camisaFiga.id, 
      colorHex: '#F5F5F0',
      imageUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1783972405/figa_camisa_branca_pcwzrv.jpg', 
    } 
  });
  const figaAzulMarinho = await prisma.productColor.create({ 
    data: { 
      productId: camisaFiga.id, 
      colorHex: '#0A1128',
      imageUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1783972386/figa_camisa_azul_rwrf29.jpg', 
    } 
  });
  const figaPreta = await prisma.productColor.create({ 
    data: { 
      productId: camisaFiga.id, 
      colorHex: '#000000',
      imageUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1783972272/figa_camisa_preta_nj0seb.jpg', 
    } 
  });

  // Tamanhos da Figa Braba
  const figaTamM = await prisma.productSize.create({ data: { productId: camisaFiga.id, sizeName: 'M' } });
  const figaTamG = await prisma.productSize.create({ data: { productId: camisaFiga.id, sizeName: 'G' } });
  const figaTamGG = await prisma.productSize.create({ data: { productId: camisaFiga.id, sizeName: 'GG' } });

  // Estoque Figa Braba
  await prisma.productVariant.createMany({
    data: [
      { productId: camisaFiga.id, colorId: figaOffWhite.id, sizeId: figaTamM.id, sku: 'KRR-FIGA-OFF-M', stockQuantity: 15 },
      { productId: camisaFiga.id, colorId: figaOffWhite.id, sizeId: figaTamG.id, sku: 'KRR-FIGA-OFF-G', stockQuantity: 20 },
      { productId: camisaFiga.id, colorId: figaAzulMarinho.id, sizeId: figaTamG.id, sku: 'KRR-FIGA-AZL-G', stockQuantity: 10 },
      { productId: camisaFiga.id, colorId: figaPreta.id, sizeId: figaTamGG.id, sku: 'KRR-FIGA-PRT-GG', stockQuantity: 12 },
    ],
  });

  console.log('👕 Created Product: Figa Braba.');

  // ==========================================
  // PRODUTO 2: KARRANKA
  // ==========================================
  const camisaKarranka = await prisma.product.create({
    data: {
      collectionId: colecaoProtecao.id,
      name: 'Camisa Oversized Karranka',
      description: 'Camiseta streetwear oversized clássica em suedine pesada com logo Karranka.',
      category: 'CLOTHING',
      price: 199.90,
      imageUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1783972409/karranka_camisa_branca_yexgqx.jpg', // Substitua depois pela foto oficial Karranka
    },
  });

  // Cores da Karranka
  const krrOffWhite = await prisma.productColor.create({ data: { productId: camisaKarranka.id, colorHex: '#F5F5F0', imageUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1783972409/karranka_camisa_branca_yexgqx.jpg' } });
  const krrAzulMarinho = await prisma.productColor.create({ data: { productId: camisaKarranka.id, colorHex: '#0A1128', imageUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1783972415/karranka_camisa_azul_r2580j.jpg' } });
  const krrPreta = await prisma.productColor.create({ data: { productId: camisaKarranka.id, colorHex: '#000000', imageUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1783972412/karranka_camisa_preta_sje7ws.jpg' } });

  // Tamanhos da Karranka
  const krrTamM = await prisma.productSize.create({ data: { productId: camisaKarranka.id, sizeName: 'M' } });
  const krrTamG = await prisma.productSize.create({ data: { productId: camisaKarranka.id, sizeName: 'G' } });

  // Estoque Karranka
  await prisma.productVariant.createMany({
    data: [
      { productId: camisaKarranka.id, colorId: krrOffWhite.id, sizeId: krrTamM.id, sku: 'KRR-KRR-OFF-M', stockQuantity: 18 },
      { productId: camisaKarranka.id, colorId: krrAzulMarinho.id, sizeId: krrTamG.id, sku: 'KRR-KRR-AZL-G', stockQuantity: 14 },
      { productId: camisaKarranka.id, colorId: krrPreta.id, sizeId: krrTamM.id, sku: 'KRR-KRR-PRT-M', stockQuantity: 25 },
    ],
  });

  console.log('👕 Created Product: Karranka.');

  // ==========================================
  // PRODUTO 3: ESCUDO
  // ==========================================
  const camisaEscudo = await prisma.product.create({
    data: {
      collectionId: colecaoProtecao.id,
      name: 'Camisa Oversized Escudo',
      description: 'Camiseta streetwear oversized clássica em suedine pesada com logo no peito escudo karranka',
      category: 'CLOTHING',
      price: 179.90,
      imageUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1784029234/WhatsApp_Image_2026-07-14_at_08.27.39_uotvuh.jpg', 
    },
  });

  // Cores da escudo
  const escudoOffWhite = await prisma.productColor.create({ data: { productId: camisaEscudo.id, colorHex: '#F5F5F0' } });
  const escudoAzulMarinho = await prisma.productColor.create({ data: { productId: camisaEscudo.id, colorHex: '#0A1128' } });
  const escudoPreta = await prisma.productColor.create({ data: { productId: camisaEscudo.id, colorHex: '#000000' } });

  // Tamanhos da escudo
  const escudoTamM = await prisma.productSize.create({ data: { productId: camisaEscudo.id, sizeName: 'M' } });
  const escudoTamG = await prisma.productSize.create({ data: { productId: camisaEscudo.id, sizeName: 'G' } });
  const escudoTamP = await prisma.productSize.create({ data: { productId: camisaEscudo.id, sizeName: 'P' } });


  // Estoque Karranka
  await prisma.productVariant.createMany({
    data: [
      { productId: camisaEscudo.id, colorId: escudoOffWhite.id, sizeId: escudoTamM.id, sku: 'KRR-ESC-OFF-M', stockQuantity: 18 },
      { productId: camisaEscudo.id, colorId: escudoAzulMarinho.id, sizeId: escudoTamG.id, sku: 'KRR-ESC-AZL-G', stockQuantity: 14 },
      { productId: camisaEscudo.id, colorId: escudoPreta.id, sizeId: escudoTamP.id, sku: 'KRR-ESC-PRT-P', stockQuantity: 25 },
    ],
  });

  console.log('👕 Created Product: Karranka.');

  // ==========================================
  // PRODUTO 3: BONÉ DADHAT
  // ==========================================
  const boneDadhat = await prisma.product.create({
    data: {
      collectionId: colecaoProtecao.id,
      name: 'Boné Dadhat',
      description: 'Boné dadhat em algodão com bordado em alto relevo.',
      category: 'ACCESSORIES',
      price: 119.90,
      imageUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1784029244/WhatsApp_Image_2026-07-14_at_08.31.01_rmhcwu.jpg', 
    },
  });

  // Cor do Boné (Azul Marinho)
  const boneAzul = await prisma.productColor.create({ data: { productId: boneDadhat.id, colorHex: '#0A1128' } });

  // Tamanho Único (UN)
  const boneTamUnico = await prisma.productSize.create({ data: { productId: boneDadhat.id, sizeName: 'UN' } });

  // Estoque Boné Dadhat
  await prisma.productVariant.create({
    data: {
      productId: boneDadhat.id,
      colorId: boneAzul.id,
      sizeId: boneTamUnico.id,
      sku: 'KRR-DAD-AZL-UN',
      stockQuantity: 30,
    },
  });

  console.log('🧢 Created Product: Boné Dadhat.');

  // ==========================================
  // 8. BANNER DA HOME
  // ==========================================
  await prisma.carouselBanner.createMany({
    data: [
    {
      title: 'Mosaico',
      imageDesktopUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1784034205/Portf%C3%B3lio_profissional_minimalista_informativo_pre%C3%A7os_preto_e_branco_fot%C3%B3grafo_apresenta%C3%A7%C3%A3o_2_ptr7qz.jpg', 
      targetUrl: `/colecoes/${colecaoProtecao.id}`,
      isActive: true,
      displayOrder: 1,
    },
    {
      title: 'Lançamento Coleção Proteção - Karranka',
      imageDesktopUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1784033779/Portf%C3%B3lio_profissional_minimalista_informativo_pre%C3%A7os_preto_e_branco_fot%C3%B3grafo_apresenta%C3%A7%C3%A3o_1_d6ea94.jpg', 
      targetUrl: `/colecoes/${colecaoProtecao.id}`,
      isActive: true,
      displayOrder: 2,
    }
]
  });

  console.log('🖼️ Created carousel banners.');
  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });