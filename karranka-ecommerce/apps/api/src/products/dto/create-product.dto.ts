import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, IsPositive, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'O ID da coleção é obrigatório.' })
  @IsInt({ message: 'O ID da coleção deve ser um número inteiro.' })
  collectionId: number;

  @IsNotEmpty({ message: 'O nome do produto é obrigatório.' })
  @IsString({ message: 'O nome do produto deve ser uma string.' })
  name: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string.' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'A categoria deve ser uma string.' })
  category?: string;

  @IsNotEmpty({ message: 'O preço é obrigatório.' })
  @IsNumber({}, { message: 'O preço deve ser um número válido.' })
  @IsPositive({ message: 'O preço deve ser maior que zero.' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'O preço antigo deve ser un número válido.' })
  @Min(0, { message: 'O preço antigo não pode ser negativo.' })
  oldPrice?: number;

  @IsOptional()
  @IsInt({ message: 'O desconto deve ser um número inteiro.' })
  @Min(0, { message: 'O desconto não pode ser negativo.' })
  discountPercent?: number;

  @IsOptional()
  @IsString({ message: 'A URL da imagem deve ser uma string.' })
  imageUrl?: string;
}