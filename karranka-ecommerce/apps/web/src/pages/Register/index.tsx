import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../../services/api';

import background from '../../assets/login-background.png';
import userIcon from '../../assets/icons/user.png';
import lockIcon from '../../assets/icons/lock.png';
import emailIcon from '../../assets/icons/user.png';

import { Input } from '../../components/Input';

export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = 'Nome obrigatório';
    if (!form.email) newErrors.email = 'E-mail obrigatório';
    if (!form.password) newErrors.password = 'Senha obrigatória';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'As senhas não coincidem';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate('/login');
    } catch (err: any) {
      setErrors({ general: err.response?.data?.message || 'Erro ao cadastrar' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <BrandContainer>
        <StreetwearText>
          KARRANKA -<br />
          O PODER<br />
          DO STREETWEAR
        </StreetwearText>
      </BrandContainer>

      <RegisterContainer>
        <Card>
          <Header>
            <Title>Cadastro</Title>
            <Subtitle>Crie sua conta</Subtitle>
            <Description>Junte-se à família Karranka</Description>
          </Header>

          <Form onSubmit={handleRegister}>
            <Input
              icon={userIcon}
              placeholder="Nome completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />

            <Input
              icon={emailIcon}
              placeholder="E-mail"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />

            <Input
              icon={lockIcon}
              placeholder="Senha"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
            />

            <Input
              icon={lockIcon}
              placeholder="Confirmar senha"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />

            {errors.general && <ErrorText>{errors.general}</ErrorText>}

            <RegisterButton type="submit" disabled={loading}>
              {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
            </RegisterButton>

            <Divider />

            <Login onClick={() => navigate('/login')}>
              Já tem uma conta? <strong>Faça login</strong>
            </Login>
          </Form>
        </Card>
      </RegisterContainer>
    </Container>
  );
}

// Styled components
const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-color: #f4f4f4;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 45%;
    background-image: url(${background});
    background-repeat: no-repeat;
    background-position: right bottom;
    background-size: contain;
    z-index: 0;
    pointer-events: none;
  }

  @media (max-width: 900px) {
    &::after { display: none; }
  }
`;

const BrandContainer = styled.div`
  position: absolute;
  left: 80px;
  z-index: 2;

  @media (max-width: 1200px) { left: 40px; }
  @media (max-width: 900px) { display: none; }
`;

const StreetwearText = styled.h1`
  font-size: clamp(2.2rem, 3vw, 5.2rem);
  font-weight: 400;
  line-height: 0.9;
  margin: 0;
`;

const RegisterContainer = styled.div`
  z-index: 2;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  width: 100%;
  max-width: 560px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 60px 55px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;

  @media (max-width: 1280px) {
    max-width: 460px;
    padding: 40px 40px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 4.6rem;
  margin: 0;
  line-height: 1;

  @media (max-width: 1280px) { font-size: 3.4rem; }
`;

const Subtitle = styled.h2`
  font-size: 1.3rem;
  margin: 10px 0 0;
  font-weight: 600;
  color: #222;
`;

const Description = styled.p`
  margin: 8px 0 0;
  color: #666;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const RegisterButton = styled.button`
  margin-top: 10px;
  width: 100%;
  border: none;
  border-radius: 999px;
  padding: 14px;
  background: linear-gradient(to right, #2f2f2f, #1f1f1f);
  color: white;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;

  &:hover { transform: translateY(-2px); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const Divider = styled.div`
  height: 1px;
  background: #e6e6e6;
  margin: 18px 0;
`;

const Login = styled.p`
  text-align: center;
  font-size: 0.95rem;
  cursor: pointer;

  strong { cursor: pointer; }
`;

const ErrorText = styled.p`
  color: #e53935;
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
`;