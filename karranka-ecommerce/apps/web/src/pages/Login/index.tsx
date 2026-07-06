import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { Input as KarrankaInput } from "../../components/Input";
import { api } from "../../services/api";

import background from "../../assets/login-background.png";
import lockIcon from "../../assets/icons/lock.png";
import googleIcon from "../../assets/icons/google.png";
import appleIcon from "../../assets/icons/apple.png";
import eyeOpen from "../../assets/icons/eye-open.svg";
import eyeClosed from "../../assets/icons/eye-closed.svg";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Ajuste: Redireciona para a Home ("/") após login via Google
  useEffect(() => {
    const tokenFromUrl = searchParams.get("access_token") || searchParams.get("token");

    if (tokenFromUrl) {
      // Remove todas as aspas simples ('), duplas (") e espaços em branco das pontas
      const cleanToken = tokenFromUrl.replace(/['"]+/g, '').trim();
      
      localStorage.setItem("@Karranka:token", cleanToken);
      setSearchParams({}, { replace: true });
      navigate("/", { replace: true });
    }
  }, [searchParams, setSearchParams, navigate]);


  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token } = response.data;

      if (access_token) {
        //localStorage.setItem("token", access_token);
        localStorage.setItem("@Karranka:token", access_token);
        
        // Ajuste: Redireciona para a Home ("/") após login manual
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 100);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3333'}/auth/google`;
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

      <LoginContainer>
        <Card>
          <Header>
            <Title>Login</Title>
            <Subtitle>Bem-vindo de volta</Subtitle>
            <Description>Acesse sua conta Karranka</Description>
          </Header>

          <Form onSubmit={handleLogin}>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <KarrankaInput
              label="E-mail"
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputWrapper>
              <Icon src={lockIcon} />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <EyeButton type="button" onClick={() => setShowPassword((prev) => !prev)}>
                <EyeIcon src={showPassword ? eyeOpen : eyeClosed} alt="Mostrar senha" />
              </EyeButton>
            </InputWrapper>

            <ForgotPassword>Esqueci minha senha</ForgotPassword>

            <LoginButton type="submit" disabled={loading}>
              {loading ? "CARREGANDO..." : "ENTRAR"}
            </LoginButton>

            <Divider />

            <Register>
              Não tem uma conta? 
              <strong 
              onClick={() => navigate('/register')} 
              style={{ cursor: 'pointer' }}
              >
              Cadastre-se
              </strong>
            </Register>

            <SocialContainer>
              <SocialButton type="button" onClick={handleGoogleLogin}>
                <SocialIcon src={googleIcon} alt="Entrar com Google" />
              </SocialButton>
              <SocialButton type="button">
                <SocialIcon src={appleIcon} alt="Entrar com Apple" />
              </SocialButton>
            </SocialContainer>
          </Form>
        </Card>
      </LoginContainer>
    </Container>
  );
}

// ... (seus Styled Components permanecem inalterados abaixo)
const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 600;
  margin: 0 0 4px 0;
`;

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
    content: "";
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
  font-family: ${(props) => props.theme.fonts.titles};
  font-weight: 400;
  line-height: 0.9;
  margin: 0;
`;

const LoginContainer = styled.div`
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

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #ddd;
  border-radius: 999px;
  padding: 16px 20px;
  background: #fff;
  transition: 0.2s;

  &:focus-within {
    border-color: #999;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }
`;

const Icon = styled.img`
  width: 18px;
  opacity: 0.7;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
`;

const EyeButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const EyeIcon = styled.img`
  width: 20px;
  height: 20px;
  opacity: 0.7;
  transition: 0.2s;
  &:hover { opacity: 1; }
`;

const ForgotPassword = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;
  margin-top: 4px;
  &:hover { text-decoration: underline; }
`;

const LoginButton = styled.button`
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
  &:disabled { background: #999; cursor: not-allowed; transform: none; }
`;

const Divider = styled.div`
  height: 1px;
  background: #e6e6e6;
  margin: 18px 0;
`;

const Register = styled.p`
  text-align: center;
  font-size: 0.95rem;
  strong { cursor: pointer; }
`;

const SocialContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 14px;
`;

const SocialButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  transition: 0.2s;
  &:hover { transform: scale(1.1); }
`;

const SocialIcon = styled.img`
  width: 30px;
`;