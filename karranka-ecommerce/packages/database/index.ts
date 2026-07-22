// import { PrismaClient } from '@prisma/client';
// import 'dotenv/config';

// export const prisma = new PrismaClient({
//   datasourceUrl: process.env.DATABASE_URL,
// });

// export * from '@prisma/client';

export { PrismaService } from './src/prisma/prisma.service';
export { PrismaModule } from './src/prisma/prisma.module';
export * from '@prisma/client';