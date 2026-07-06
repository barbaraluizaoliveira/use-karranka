import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../../context/CartContext';

const Container = styled.main`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
`;

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

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  width: 100%;
  max-width: 1100px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const WhiteBox = styled.div`
  background-color: #FFFFFF;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #E0E0E0;

  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    background-color: #F9F9F9;
    border-radius: 4px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  h3 { font-family: ${props => props.theme.fonts.subtitles}; margin: 0 0 0.5rem 0; }
  p { font-family: ${props => props.theme.fonts.body}; color: #666; margin: 0; size: 0.9rem; }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  button { padding: 0.3rem 0.6rem; cursor: pointer; border: 1px solid #CCC; background: #FFF; }
  span { font-family: ${props => props.theme.fonts.body}; font-weight: bold; width: 20px; text-align: center; }
`;

const PriceText = styled.span`
  font-family: ${props => props.theme.fonts.body};
  font-weight: bold;
  font-size: 1.1rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #FF4D4D;
  cursor: pointer;
  font-family: ${props => props.theme.fonts.body};
  font-size: 0.85rem;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background-color: ${props => props.theme.colors.primary};
  color: #FFFFFF;
  border: none;
  font-family: ${props => props.theme.fonts.titles};
  font-size: 1.2rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background-color: #333; }
`;

export function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  //descomentar esse trecho quando criar a tela de login

  const handleCheckoutRedirect = () => {
    const token = localStorage.getItem('@Karranka:token');
    
    if (!token) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

//apagar esse quando criar tela de login
// const handleCheckoutRedirect = () => {
//     // Linha temporária para você testar os passos de Endereço e ViaCEP sem exigir login
//     navigate('/checkout');
//   };

  if (cartItems.length === 0) {
    return (
      <Container>
        <WhiteBox style={{ textAlign: 'center', justifyContent: 'center', height: 'fit-content', minWidth: '320px' }}>
          <BackToHomeButton onClick={() => navigate('/')} style={{ alignSelf: 'center', marginBottom: '1.5rem' }}>
            <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar para a Vitrine
          </BackToHomeButton>
          <h2>Sua sacola está vazia.</h2>
        </WhiteBox>
      </Container>
    );
  }

  return (
    <Container>
      <CartGrid>
        <WhiteBox>
          <BackToHomeButton onClick={() => navigate('/')}>
            <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar para a Vitrine
          </BackToHomeButton>
          <h2 style={{ margin: 0 }}>Sua Sacola</h2>
          {cartItems.map((item) => (
            <ItemRow key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <ItemInfo>
                <h3>{item.name}</h3>
                <p>Tamanho: {item.selectedSize}</p>
                <RemoveButton onClick={() => removeFromCart(item.id)}>Remover</RemoveButton>
              </ItemInfo>
              <QuantityControls>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </QuantityControls>
              <PriceText>
                {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </PriceText>
            </ItemRow>
          ))}
        </WhiteBox>

        <WhiteBox style={{ height: 'fit-content' }}>
          <h3 style={{ margin: 0 }}>Resumo do Pedido</h3>
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
            <span>Subtotal:</span>
            <PriceText>{getCartTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</PriceText>
          </div>
          <CheckoutButton onClick={handleCheckoutRedirect}>Finalizar Compra</CheckoutButton>
        </WhiteBox>
      </CartGrid>
    </Container>
  );
}