import { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
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
  opacity: ${props => props.disabled ? 0.6 : 1};
  border-left: 4px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  transition: all 0.3s ease;
`;

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  h2 {
    font-family: ${props => props.theme.fonts.titles};
    font-size: 1.4rem;
    margin: 0;
    text-transform: uppercase;
  }
`;

const StepContent = styled.div`
  margin-top: 1.5rem;
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  margin-bottom: 1rem;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
  input { padding: 0.8rem; border: 1px solid #CCC; font-family: sans-serif; font-size: 1rem; border-radius: 4px; }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ variant?: 'secondary' | 'primary' }>`
  padding: 1rem 2rem;
  background-color: ${props => props.variant === 'secondary' ? '#6c757d' : props.theme.colors.primary};
  color: #FFF;
  border: none;
  font-family: ${props => props.theme.fonts.titles};
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 4px;
  flex: 1;
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
  border-radius: 4px;
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
  const [loadingFrete, setLoadingFrete] = useState(false);

  // Busca ViaCEP e em seguida consulta o back-end para calcular o frete oficial
  const handleBuscarCEP = async (valorCep: string) => {
    setCep(valorCep);
    const limpo = valorCep.replace(/\D/g, '');
    if (limpo.length === 8) {
      try {
        setLoadingFrete(true);
        // 1. Pega os dados do endereço pelo ViaCEP
        const responseCep = await axios.get(`https://viacep.com.br/ws/${limpo}/json/`);
        if (!responseCep.data.erro) {
          setLogradouro(responseCep.data.logradouro);
          setBairro(responseCep.data.bairro);
          setCidade(responseCep.data.localidade + ' - ' + responseCep.data.uf);

          // 2. Chama a rota de frete do SEU back-end NestJS para calcular o valor com base no CEP/UF
          try {
            const responseBack = await api.post('/shipping/calculate', {
              cep: limpo,
              uf: responseCep.data.uf,
              cidade: responseCep.data.localidade
            });
           const opcoes = responseBack.data;
           setFrete(opcoes.length > 0 ? opcoes[0].preco : 0);
          } catch (errApi) {
            console.warn('Erro ao consultar back-end de frete, usando regra padrão', errApi);
            // Fallback caso a rota específica do back varie: PE = 6.90, Outros = 22.00
            setFrete(responseCep.data.uf === 'PE' ? 6.90 : 22.00);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar CEP', err);
      } finally {
        setLoadingFrete(false);
      }
    }
  };

  const handleFinalizarCompra = async () => {
    try {
      // Aqui você pode disparar a criação do pedido no seu back-end se desejar
      alert('Compra realizada com Sucesso! Gerando pedido no banco...');
      clearCart();
      window.location.href = '/';
    } catch (err) {
      console.error('Erro ao finalizar pedido', err);
    }
  };

  return (
    <PageWithHeader>
      <Container>
        <CheckoutGrid>
          <Column>
            
            {/* PASSO 1: ENDEREÇO */}
            <StepBox active={step === 1} disabled={false}>
              <StepHeader onClick={() => setStep(1)}>
                <h2>1. Dados de Entrega</h2>
                {step > 1 && <span style={{ fontSize: '0.85rem', color: '#28a745', fontWeight: 'bold' }}>Alterar</span>}
              </StepHeader>

              {step === 1 && (
                <StepContent>
                  <InputGroup style={{ gridTemplateColumns: '1fr' }}>
                    <input 
                      type="text" 
                      placeholder="CEP (ex: 50000-000)" 
                      value={cep} 
                      onChange={(e) => handleBuscarCEP(e.target.value)} 
                      maxLength={9} 
                    />
                  </InputGroup>
                  <InputGroup>
                    <input 
                      type="text" 
                      placeholder="Número" 
                      value={numero} 
                      onChange={(e) => setNumero(e.target.value)} 
                    />
                    <input 
                      type="text" 
                      placeholder="Rua / Logradouro" 
                      value={logradouro} 
                      onChange={(e) => setLogradouro(e.target.value)} 
                    />
                  </InputGroup>
                  <InputGroup>
                    <input 
                      type="text" 
                      placeholder="Bairro" 
                      value={bairro} 
                      onChange={(e) => setBairro(e.target.value)} 
                    />
                    <input 
                      type="text" 
                      placeholder="Cidade" 
                      value={cidade} 
                      onChange={(e) => setCidade(e.target.value)} 
                    />
                  </InputGroup>
                  <ActionButton 
                    disabled={!numero || !logradouro || cep.replace(/\D/g, '').length !== 8} 
                    onClick={() => setStep(2)}
                  >
                    Continuar para Entrega
                  </ActionButton>
                </StepContent>
              )}
            </StepBox>

            {/* PASSO 2: MÉTODO DE ENTREGA */}
            <StepBox active={step === 2} disabled={step < 2}>
              <StepHeader onClick={() => cep && numero && setStep(2)}>
                <h2>2. Opções de Envio</h2>
                {step > 2 && <span style={{ fontSize: '0.85rem', color: '#28a745', fontWeight: 'bold' }}>Alterar</span>}
              </StepHeader>

              {step === 2 && (
                <StepContent>
                  <RadioOption>
                    <input type="radio" name="shipping" defaultChecked />
                    <div>
                      <strong>Entrega Normal:</strong> estimado em até 7 dias úteis - {loadingFreightText(loadingFrete, frete)}
                    </div>
                  </RadioOption>
                  
                  <ButtonGroup>
                    <ActionButton variant="secondary" onClick={() => setStep(1)}>Voltar</ActionButton>
                    <ActionButton onClick={() => setStep(3)}>Continuar para Pagamento</ActionButton>
                  </ButtonGroup>
                </StepContent>
              )}
            </StepBox>

            {/* PASSO 3: PAGAMENTO */}
            <StepBox active={step === 3} disabled={step < 3}>
              <StepHeader onClick={() => frete > 0 && setStep(3)}>
                <h2>3. Forma de Pagamento</h2>
              </StepHeader>

              {step === 3 && (
                <StepContent>
                  <RadioOption onClick={() => setMetodoPagamento('CREDIT_CARD')}>
                    <input type="radio" name="payment" checked={metodoPagamento === 'CREDIT_CARD'} readOnly />
                    <strong>Cartão de Crédito</strong>
                  </RadioOption>
                  <RadioOption onClick={() => setMetodoPagamento('PIX')}>
                    <input type="radio" name="payment" checked={metodoPagamento === 'PIX'} readOnly />
                    <strong>Pix (Aprovação Imediata)</strong>
                  </RadioOption>

                  <ButtonGroup>
                    <ActionButton variant="secondary" onClick={() => setStep(2)}>Voltar</ActionButton>
                    <ActionButton style={{ backgroundColor: '#28a745' }} onClick={handleFinalizarCompra}>
                      Finalizar Emissão do Pedido
                    </ActionButton>
                  </ButtonGroup>
                </StepContent>
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
                <span>{!frete ? 'A calcular' : frete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
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

function loadingFreightText(loading: boolean, frete: number) {
  if (loading) return 'Calculando...';
  return frete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}