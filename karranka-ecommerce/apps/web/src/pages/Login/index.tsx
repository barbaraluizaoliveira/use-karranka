import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { api } from "../../services/api";

import googleIcon from "../../assets/icons/google.png";
import eyeOpen from "../../assets/icons/eye-open.svg";
import eyeClosed from "../../assets/icons/eye-closed.svg";

export function Login() {
  const [identifier, setIdentifier] = useState(""); // Aceita Email ou CPF
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Exibe a senha apenas se o usuário digitou algo no campo Email/CPF
  const isIdentifierTyped = identifier.trim().length > 0;

  // Trata token vindo do Google OAuth via URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get("access_token") || searchParams.get("token");

    if (tokenFromUrl) {
      const cleanToken = tokenFromUrl.replace(/['"]+/g, "").trim();
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
      // DTO Atualizado: Enviando 'identifier' (Email/CPF) em vez de apenas 'email'
      const response = await api.post("/auth/login", { 
  identifier: identifier.trim(),
  password 
});
      
      const { accessToken } = response.data;

if (accessToken) {
  localStorage.setItem("@Karranka:token", accessToken);
  setTimeout(() => {
    navigate("/", { replace: true });
  }, 100);
}
    } catch (err: any) {
      setError(err.response?.data?.message || "Credenciais inválidas. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:3344"}/auth/google`;
  }

  return (
    <PageContainer>
      <ContentWrapper>
        {/* Chamada com linguagem Karranka */}
        <Title>QUAL É O SEU DROP?</Title>
        <Subtitle>Acesse sua conta para garantir sua proteção</Subtitle>

        {/* Botão do Google em Destaque */}
        <GoogleButton type="button" onClick={handleGoogleLogin}>
          <GoogleIcon src={googleIcon} alt="Google" />
          <span>Continuar com o Google</span>
        </GoogleButton>

        <DividerContainer>
          <Line />
          <DividerText>ou acesse com e-mail / cpf</DividerText>
          <Line />
        </DividerContainer>

        <Form onSubmit={handleLogin}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <InputGroup>
            <StyledInput
              type="text"
              placeholder="E-mail ou CPF"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </InputGroup>

          {/* O campo de senha e os botões só se revelam quando o usuário começa a digitar no CPF/E-mail */}
          {isIdentifierTyped && (
            <>
              <InputGroup>
                <PasswordInputWrapper>
                  <StyledInput
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <EyeButton type="button" onClick={() => setShowPassword((prev) => !prev)}>
                    <EyeIcon src={showPassword ? eyeOpen : eyeClosed} alt="Mostrar senha" />
                  </EyeButton>
                </PasswordInputWrapper>
              </InputGroup>

              <ForgotPasswordWrapper>
                <ForgotPassword type="button" onClick={() => navigate("/forgot-password")}>
                  Esqueceu a senha?
                </ForgotPassword>
              </ForgotPasswordWrapper>
            </>
          )}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "CARREGANDO..." : "ENTRAR"}
          </SubmitButton>

          {isIdentifierTyped && (
            <SecondaryButton type="button" onClick={() => navigate("/magic-link")}>
              Entrar com código via E-mail
            </SecondaryButton>
          )}
        </Form>

        {/* Rodapé "Novo por aqui" adaptado pro tom de voz Karranka */}
        <FooterText>
          Novo por aqui?{" "}
          <RegisterLink onClick={() => navigate("/register")}>
            Crie sua conta agora
          </RegisterLink>
        </FooterText>
      </ContentWrapper>
    </PageContainer>
  );
}

// ==========================================
// STYLED COMPONENTS - Layout Centralizado
// ==========================================

const PageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 120px); /* Desconta a altura do Header da Karranka */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background-color: #ffffff;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 900;
  color: #111111;
  margin: 0;
  text-align: center;
  letter-spacing: -0.5px;
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #666666;
  margin: 6px 0 28px 0;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #222222;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #f7f7f7;
  }
`;

const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const DividerContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 22px 0;
`;

const Line = styled.div`
  flex: 1;
  height: 1px;
  background-color: #e2e2e2;
`;

const DividerText = styled.span`
  font-size: 0.75rem;
  color: #888888;
  padding: 0 10px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ErrorMessage = styled.div`
  background-color: #fff0f0;
  color: #d93025;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  text-align: center;
  border: 1px solid #f8c4c4;
`;

const InputGroup = styled.div`
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 16px;
  border-radius: 6px;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  font-size: 0.95rem;
  color: #111111;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    border-color: #000000;
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

const EyeIcon = styled.img`
  width: 18px;
  height: 18px;
`;

const ForgotPasswordWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -4px;
`;

const ForgotPassword = styled.button`
  background: none;
  border: none;
  font-size: 0.8rem;
  color: #555555;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #000000;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 50px;
  margin-top: 8px;
  background-color: #111111;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;

  &:hover {
    background-color: #2c2c2c;
  }

  &:disabled {
    background-color: #aaaaaa;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: #ffffff;
  color: #111111;
  border: 1px solid #111111;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #f4f4f4;
  }
`;

const FooterText = styled.p`
  margin-top: 28px;
  font-size: 0.9rem;
  color: #666666;
`;

const RegisterLink = styled.strong`
  color: #000000;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 4px;
`;