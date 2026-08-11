import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@karranka/database';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const cleanCpf = dto.cpf ? dto.cpf.replace(/\D/g, '') : null;

    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          ...(cleanCpf ? [{ cpf: cleanCpf }] : []),
        ],
      },
    });

    if (userExists) {
      if (userExists.email === dto.email) {
        throw new ConflictException('E-mail já cadastrado no sistema.');
      }
      throw new ConflictException('CPF já cadastrado no sistema.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        cpf: cleanCpf,
        password: hashedPassword,
        role: 'CUSTOMER' as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        role: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user,
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const input = dto.identifier.trim();
    const isEmail = input.includes('@');
    const cleanInput = isEmail ? input : input.replace(/\D/g, '');

    const user = await this.prisma.user.findFirst({
      where: isEmail
        ? { email: cleanInput }
        : { cpf: cleanInput },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    if (!user.password) {
      throw new UnauthorizedException('Conta criada via Google. Acesse utilizando o botão do Google.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        role: user.role,
      },
      accessToken: token,
    };
  }

  async validateGoogleUser(googleUser: { email: string; name: string }) {
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          password: '',
          role: 'CUSTOMER' as any,
        },
      });
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        role: user.role,
      },
      accessToken: token,
    };
  }

  private generateToken(userId: number, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }
}