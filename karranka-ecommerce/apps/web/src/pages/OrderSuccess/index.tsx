import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { PageWithHeader } from '../../components/PageWithHeader';

const Container = styled.main`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const IconCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #28a745;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;

  svg {
    width: 40px;
    height: 40px;
    stroke: #fff;
  }
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fonts.titles};
  font-size: 1.8rem;
  text-transform: uppercase;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-family: sans-serif;
  color: #666;
  font-size: 1rem;
  margin: 0 0 2rem 0;
  max-width: 400px;
`;

const OrderNumber = styled.p`
  font-family: sans-serif;
  font-size: 0.9rem;
  color: #999;
  margin: 0 0 2rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button<{ variant?: 'secondary' }>`
  padding: 1rem 2rem;
  background-color: ${props => props.variant === 'secondary' ? '#fff' : props.theme.colors.primary};
  color: ${props => props.variant === 'secondary' ? props.theme.colors.primary : '#fff'};
  border: ${props => props.variant === 'secondary' ? `1px solid ${props.theme.colors.primary}` : 'none'};
  font-family: ${props => props.theme.fonts.titles};
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 4px;
`;

export function OrderSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <PageWithHeader>
      <Container>
        <IconCircle>
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </IconCircle>
        <Title>Compra Confirmada!</Title>
        <Subtitle>
          Seu pedido foi recebido e já está sendo preparado. Você vai receber atualizações por e-mail.
        </Subtitle>
        {orderId && <OrderNumber>Pedido #{orderId}</OrderNumber>}
        {/* <ButtonGroup>
          <ActionButton onClick={() => navigate('/profile/orders')}>
            Acompanhar Pedido
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => navigate('/')}>
            Voltar à Loja
          </ActionButton>
        </ButtonGroup> */}
        <ButtonGroup>
  <ActionButton onClick={() => navigate('/')}>
    Voltar à Vitrine
  </ActionButton>
</ButtonGroup>
      </Container>
    </PageWithHeader>
  );
}