import { IsString, IsNumber, IsEmail, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  orderId: number;
  
  @IsString()
  token: string;

  @IsNumber()
  transaction_amount: number;

  @IsString()
  description: string;

  @IsNumber()
  installments: number;

  @IsString()
  payment_method_id: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  cpf?: string;
}