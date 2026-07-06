import { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import { PageWithHeader } from '../../components/PageWithHeader';

const Container = styled.main`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  width: 100%;
  max-width: 1100px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const Column = styled.div`display: flex; flex-direction: column; gap: 1.5rem;`;

const StepBox = styled.div<{ active: boolean; disabled: boolean }>`
  background-color: #FFFFFF;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  border-left: 4px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
`;

const StepHeader = styled.h2`
  font-family: ${props => props.theme.fonts.titles};
  font-size: 1.4rem;
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  margin-bottom: 1rem;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
  input { padding: 0.8rem; border: 1px solid #CCC; font-family: sans-serif; font-size: 1rem; }
`;

const ContinueButton = styled.button`
  padding: 1rem 2rem;
  background-color: ${props => props.theme.colors.primary};
  color: #FFF;
  border: none;
  font-family: ${props => props.theme.fonts.titles};
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 1rem;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #E0E0E0;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-family: sans-serif;
`;

export function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState<number>(1); // 1 = Endereço, 2 = Entrega, 3 = Pagamento
  
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [numero, setNumero] = useState('');

  const [frete, setFrete] = useState<number>(0);
  const [metodoPagamento, setMetodoPagamento] = useState('CREDIT_CARD');

  const handleBuscarCEP = async (valorCep: string) => {
    setCep(valorCep);
    const limpo = valorCep.replace(/\D/g, '');
    if (limpo.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${limpo}/json/`);
        if (!response.data.erro) {
          setLogradouro(response.data.logradouro);
          setBairro(response.data.bairro);
          setCidade(response.data.localidade + ' - ' + response.data.uf);
          setFrete(response.data.uf === 'PE' ? 6.90 : 22.00);
        }
      } catch (err) {
        console.error('Erro ao buscar CEP', err);
      }
    }
  };

  const handleFinalizarCompra = () => {
    alert('Compra realizada com Sucesso! Gerando pedido no banco...');
    clearCart();
    window.location.href = '/';
  };

  return (
    <PageWithHeader>
      <Container>
        <CheckoutGrid>
          <Column>
            {/* PASSO 1: ENDEREÇO */}
            <StepBox active={step === 1} disabled={step > 1}>
              <StepHeader>1. Dados de Entrega</StepHeader>
              {step === 1 && (
                <>
                  <InputGroup style={{ gridTemplateColumns: '1fr' }}>
                    <input type="text" placeholder="CEP" value={cep} onChange={(e) => handleBuscarCEP(e.target.value)} maxLength={9} />
                  </InputGroup>
                  <InputGroup>
                    <input type="text" placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />
                    <input type="text" placeholder="Rua / Logradouro" value={logradouro} readOnly />
                  </InputGroup>
                  <InputGroup>
                    <input type="text" placeholder="Bairro" value={bairro} readOnly />
                    <input type="text" placeholder="Cidade" value={cidade} readOnly />
                  </InputGroup>
                  <ContinueButton onClick={() => numero && logradouro && setStep(2)}>Continuar para Entrega</ContinueButton>
                </>
              )}
            </StepBox>

            {/* PASSO 2: MÉTODO DE ENTREGA */}
            <StepBox active={step === 2} disabled={step < 2 || step > 2}>
              <StepHeader>2. Opções de Envio</StepHeader>
              {step === 2 && (
                <>
                  <RadioOption>
                    <input type="radio" name="shipping" defaultChecked />
                    <div>
                      <strong>Entrega Normal:</strong> estimado em até 7 dias úteis - {frete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  </RadioOption>
                  <ContinueButton onClick={() => setStep(3)}>Continuar para Pagamento</ContinueButton>
                </>
              )}
            </StepBox>

            {/* PASSO 3: PAGAMENTO */}
            <StepBox active={step === 3} disabled={step < 3}>
              <StepHeader>3. Forma de Pagamento</StepHeader>
              {step === 3 && (
                <>
                  <RadioOption onClick={() => setMetodoPagamento('CREDIT_CARD')}>
                    <input type="radio" name="payment" checked={metodoPagamento === 'CREDIT_CARD'} readOnly />
                    <strong>Cartão de Crédito</strong>
                  </RadioOption>
                  <RadioOption onClick={() => setMetodoPagamento('PIX')}>
                    <input type="radio" name="payment" checked={metodoPagamento === 'PIX'} readOnly />
                    <strong>Pix (Aprovação Imediata)</strong>
                  </RadioOption>
                  <ContinueButton style={{ backgroundColor: '#28a745', width: '100%' }} onClick={handleFinalizarCompra}>
                    Finalizar Emissão do Pedido
                  </ContinueButton>
                </>
              )}
            </StepBox>
          </Column>

          {/* RESUMO DA DIREITA */}
          <Column>
            <StepBox active={false} disabled={false} style={{ position: 'sticky', top: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>Resumo do Pedido</h3>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>{item.name} (x{item.quantity})</span>
                  <span>{(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              ))}
              <hr style={{ border: 'none', borderTop: '1px solid #EEE', margin: '1rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total de itens:</span>
                <span>{getCartTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>
                <span>Frete:</span>
                <span>{frete === 0 ? 'A calcular' : frete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem', color: '#111' }}>
                <span>Total Geral:</span>
                <span>{(getCartTotal() + frete).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            </StepBox>
          </Column>
        </CheckoutGrid>
      </Container>
    </PageWithHeader>
  );
}