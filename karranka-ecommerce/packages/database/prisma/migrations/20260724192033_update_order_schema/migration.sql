/*
  Warnings:

  - Added the required column `product_id` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "product_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "city" VARCHAR(100) NOT NULL,
ADD COLUMN     "complement" VARCHAR(100),
ADD COLUMN     "neighborhood" VARCHAR(100) NOT NULL,
ADD COLUMN     "number" VARCHAR(20) NOT NULL,
ADD COLUMN     "shipping_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "state" VARCHAR(10) NOT NULL,
ADD COLUMN     "street" VARCHAR(150) NOT NULL,
ADD COLUMN     "zip_code" VARCHAR(20) NOT NULL;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
