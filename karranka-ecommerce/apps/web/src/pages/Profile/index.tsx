import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export function Profile() {
  const navigate = useNavigate();

  const BackToHomeButton = styled.button`
  background: none;
  border: none;
  display: flex;
  flex-direction: row; /* Alinhamento horizontal (seta do lado do texto) */
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.body};
  font-size: 0.9rem;
  opacity: 0.6;
  cursor: pointer;
  align-self: flex-start; /* Garante que ele fique na esquerda */
  margin-bottom: 1rem; /* Espaço entre ele e o título "Sua Sacola" */
  transition: opacity 0.2s;
  animation: bounceLeft 2s infinite;

  &:hover {
    opacity: 1;
  }

  @keyframes bounceLeft {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(0);
    }
    40% {
      transform: translateX(-6px);
    }
    60% {
      transform: translateX(-3px);
    }
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

  return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <BackToHomeButton onClick={() => navigate('/')} style={{ alignSelf: 'center', marginBottom: '1.5rem' }}>
            <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar para a Vitrine
          </BackToHomeButton>
        <h1>Página em Construção</h1>
        <p>Estamos trabalhando no seu perfil. Volte em breve!</p>
      </div>
  );
}