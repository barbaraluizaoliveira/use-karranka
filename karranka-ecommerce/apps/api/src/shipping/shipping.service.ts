import { Injectable } from '@nestjs/common';
import { PrismaService } from '@karranka/database';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface MelhorEnvioTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

const TOKEN_FILE = path.join(process.cwd(), '.melhor-envio-token.json');

@Injectable()
export class ShippingService {
  private readonly baseUrl = process.env.MELHOR_ENVIO_URL;
  private readonly clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  private readonly clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;
  private readonly redirectUri = process.env.MELHOR_ENVIO_REDIRECT_URI;

  constructor(private readonly prisma: PrismaService) {}

  getAuthorizationUrl() {
    const scopes = ['shipping-calculate', 'shipping-preview'].join(' ');
    const params = new URLSearchParams({
      client_id: this.clientId!,
      redirect_uri: this.redirectUri!,
      response_type: 'code',
      scope: scopes,
      state: 'karranka'
    });
    return `${this.baseUrl}/oauth/authorize?${params.toString()}`;
  }

  private saveTokens(data: any) {
    const tokens: MelhorEnvioTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000
    };
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
  }

  private loadTokens(): MelhorEnvioTokens | null {
    if (!fs.existsSync(TOKEN_FILE)) return null;
    return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
  }

  async exchangeCodeForToken(code: string) {
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code
      })
    });
    const data = await response.json();
    this.saveTokens(data);
  }

  private async refreshAccessToken(refreshToken: string) {
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken
      })
    });
    const data = await response.json();
    this.saveTokens(data);
    return data.access_token;
  }

  private async getAccessToken(): Promise<string> {
    const tokens = this.loadTokens();
    if (!tokens) throw new Error('Sem token do Melhor Envio. Acesse /shipping/melhor-envio/authorize');
    if (Date.now() < tokens.expires_at - 60000) return tokens.access_token;
    return this.refreshAccessToken(tokens.refresh_token);
  }

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

  async calculateShippingMelhorEnvio(
    cepDestino: string,
    products: { id: string; width: number; height: number; length: number; weight: number; insurance_value: number; quantity: number }[]
  ) {
    const accessToken = await this.getAccessToken();
    const response = await fetch(`${this.baseUrl}/api/v2/me/shipment/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'Karranka Ecommerce (barbarabay31@gmail.com)'
      },
      body: JSON.stringify({
        from: { postal_code: process.env.MELHOR_ENVIO_CEP_ORIGEM },
        to: { postal_code: cepDestino },
        products
      })
    });
    return response.json();
  }

  async calculateShippingCart(cepDestino: string, items: { productId: number; quantity: number }[]) {
  const productIds = items.map(i => i.productId);
  const products = await this.prisma.product.findMany({ where: { id: { in: productIds } } });

  const payloadProducts = items.map(item => {
    const product = products.find(p => p.id === item.productId)!;
    return {
      id: String(product.id),
      width: product.widthCm,
      height: product.heightCm,
      length: product.lengthCm,
      weight: Number(product.weightKg),
      insurance_value: Number(product.price),
      quantity: item.quantity
    };
  });

  const result = await this.calculateShippingMelhorEnvio(cepDestino, payloadProducts);

  return result
    .filter((r: any) => !r.error)
    .map((r: any) => ({
      id: String(r.id),
      nome: `${r.company?.name} - ${r.name}`,
      prazo: `até ${r.delivery_time} dia${r.delivery_time > 1 ? 's' : ''} útil${r.delivery_time > 1 ? 'eis' : ''}`,
      preco: Number(r.price)
    }))
    .sort((a: any, b: any) => a.preco - b.preco);
}
}