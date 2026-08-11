import React, { useState } from 'react';
import styled from 'styled-components';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    identifier: '', // E-mail ou CPF
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de envio/integração com a API
  };

  return (
    <Container>
      <Card>
        <Header>
          <Title>Crie sua conta</Title>

          <Subtitle>Junte-se à comunidade e garanta acesso exclusivo aos próximos drops.</Subtitle>
        </Header>

        <SocialButton type="button">
          <GoogleIcon viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.4-.7-.6-1.5-.6-2.3z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </GoogleIcon>
          Cadastrar com o Google
        </SocialButton>

        <Divider>
          <span>ou preencha seus dados</span>
        </Divider>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="fullName">Nome Completo</Label>

            <Input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Ex: Bárbara Luiza"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="identifier">E-mail ou CPF</Label>

            <Input
              type="text"
              id="identifier"
              name="identifier"
              placeholder="seuemail@exemplo.com ou 000.000.000-00"
              value={formData.identifier}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputRow>
            <InputGroup>
              <Label htmlFor="password">Senha</Label>

              <Input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>

              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </InputRow>

          <SubmitButton type="submit">CRIAR CONTA</SubmitButton>
        </Form>

        <FooterText>
          Já possui uma conta? <Link href="/login">Fazer Login</Link>
        </FooterText>
      </Card>
    </Container>
  );
}

// ================= ESTILOS (Styled Components) =================

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0f0f11;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  color: #f4f4f5;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 40px 32px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 28px;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #a1a1aa;
  line-height: 1.4;
`;

const SocialButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: #27272a;
  color: #f4f4f5;
  border: 1px solid #3f3f46;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3f3f46;
    border-color: #52525b;
  }
`;

const GoogleIcon = styled.svg`
  width: 18px;
  height: 18px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #27272a;
  }

  span {
    padding: 0 12px;
    font-size: 0.75rem;
    color: #71717a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: #d4d4d8;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const Input = styled.input`
  width: 100%;
  background-color: #0f0f11;
  border: 1px solid #27272a;
  border-radius: 8px;
  padding: 12px 14px;
  color: #ffffff;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: #52525b;
  }

  &:focus {
    border-color: #f4f4f5;
    box-shadow: 0 0 0 1px #f4f4f5;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #ffffff;
  color: #09090b;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  margin-top: 8px;
  transition: transform 0.1s ease, background-color 0.2s ease;

  &:hover {
    background-color: #e4e4e7;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const FooterText = styled.p`
  margin-top: 24px;
  text-align: center;
  font-size: 0.85rem;
  color: #a1a1aa;
`;

const Link = styled.a`
  color: #ffffff;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;

  &:hover {
    color: #e4e4e7;
  }
`;