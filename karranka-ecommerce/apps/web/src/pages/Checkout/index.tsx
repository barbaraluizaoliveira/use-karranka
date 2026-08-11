import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import axios from 'axios';
import { PageWithHeader } from '../../components/PageWithHeader';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { useNavigate } from 'react-router-dom';

interface ShippingOption {
  id: string;
  nome: string;
  prazo: string;
  preco: number;
}

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

const StepBox = styled.div<{ $active: boolean; disabled: boolean }>`
  background-color: #FFFFFF;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  opacity: ${props => props.disabled ? 0.6 : 1};
  border-left: 4px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
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
  input, select { 
    padding: 0.8rem; 
    border: 1px solid #CCC; 
    font-family: sans-serif; 
    font-size: 1rem; 
    border-radius: 4px; 
    width: 100%;
  }
`;

const CardDetailsContainer = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background-color: #FAFAFA;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  const [step, setStep] = useState<number>(1);
  const navigate = useNavigate();
  
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [numero, setNumero] = useState('');

  const [opcoesFrete, setOpcoesFrete] = useState<ShippingOption[]>([]);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<ShippingOption | null>(null);
  const [frete, setFrete] = useState<number>(0);
  const [metodoPagamento, setMetodoPagamento] = useState('CREDIT_CARD');
  const [loadingFrete, setLoadingFrete] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [pixData, setPixData] = useState<{ qr_code: string; qr_code_base64: string } | null>(null);

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiration, setCardExpiration] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [installments, setInstallments] = useState('1');
  const [userEmail, setUserEmail] = useState('');
  const [userCpf, setUserCpf] = useState('');

  useEffect(() => {
    loadMercadoPago();

    api.get('/auth/me').then((response) => {
      setUserEmail(response.data.email);
      setUserCpf(response.data.cpf);
    }).catch(() => {
      setUserEmail('');
      setUserCpf('');
    });
  }, []);

  const resetAddressAndShipping = () => {
    setLogradouro('');
    setBairro('');
    setCidade('');
    setNumero('');
    setOpcoesFrete([]);
    setOpcaoSelecionada(null);
    setFrete(0);
  };

  const handleBuscarCEP = async (valorCep: string) => {
    setCep(valorCep);
    const limpo = valorCep.replace(/\D/g, '');

    if (limpo.length !== 8) {
      resetAddressAndShipping();
      return;
    }

    try {
      setLoadingFrete(true);
      const responseCep = await axios.get(`https://viacep.com.br/ws/${limpo}/json/`);
      if (!responseCep.data.erro) {
        setLogradouro(responseCep.data.logradouro);
        setBairro(responseCep.data.bairro);
        setCidade(responseCep.data.localidade + ' - ' + responseCep.data.uf);

        try {
          const responseBack = await api.post('/shipping/calculate', {
            cep: limpo,
            items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity }))
          });
          const opcoes: ShippingOption[] = responseBack.data;
          setOpcoesFrete(opcoes);

          if (opcoes.length > 0) {
            setOpcaoSelecionada(opcoes[0]);
            setFrete(opcoes[0].preco);
          } else {
            setOpcaoSelecionada(null);
            setFrete(0);
          }
        } catch (errApi) {
          setOpcoesFrete([]);
          setOpcaoSelecionada(null);
          setFrete(responseCep.data.uf === 'PE' ? 6.90 : 22.00);
        }
      } else {
        resetAddressAndShipping();
      }
    } catch (err) {
      resetAddressAndShipping();
    } finally {
      setLoadingFrete(false);
    }
  };

  const isCardFormValid = () => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    const cleanExpiration = cardExpiration.replace(/\D/g, '');
    const cleanCvc = cardCvc.replace(/\D/g, '');
    return (
      cleanNumber.length >= 13 &&
      cardHolder.trim().length > 3 &&
      cleanExpiration.length === 4 &&
      cleanCvc.length >= 3
    );
  };

  const handleFinalizarCompra = async () => {
    setIsProcessingPayment(true);
    try {
      if (metodoPagamento === 'CREDIT_CARD') {
        const mp = new (window as any).MercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);

        const [expMonth, expYear] = cardExpiration.split('/');
        const cleanCardNumber = cardNumber.replace(/\D/g, '');
        const bin = cleanCardNumber.slice(0, 6);

        const paymentMethods = await mp.getPaymentMethods({ bin });
        const paymentMethodId = paymentMethods.results[0].id;

        const cardToken = await mp.createCardToken({
          cardNumber: cleanCardNumber,
          cardholderName: cardHolder,
          cardExpirationMonth: expMonth,
          cardExpirationYear: `20${expYear}`,
          securityCode: cardCvc,
        });

        const orderPayload = {
          items: cartItems.map(item => ({
            productId: Number(item.productId),
            variantId: Number(item.variantId),
            quantity: Number(item.quantity),
            price: Number(item.price) 
          })),
          shippingFee: Number(frete),
          zipCode: cep.replace(/\D/g, ''),
          street: logradouro,
          number: numero,
          neighborhood: bairro,
          city: cidade.split(' - ')[0].trim(),
          state: cidade.split(' - ')[1] ? cidade.split(' - ')[1].trim() : 'PE'
        };

        const orderResponse = await api.post('/orders', orderPayload);
        const orderId = orderResponse.data.id;

        const paymentResponse = await api.post('/payment', {
          orderId: orderId,
          token: cardToken.id,
          transaction_amount: getCartTotal() + frete,
          description: 'Pedido Karranka',
          installments: Number(installments),
          payment_method_id: paymentMethodId,
          email: userEmail,
          cpf: userCpf
        });

        if (paymentResponse.data.status === 'approved' || paymentResponse.data.status === 'in_process') {
          clearCart();
          navigate(`/order-success?orderId=${orderId}`);
        } else {
          alert('Pagamento recusado.');
        }
        
      } else {
        const orderPayloadPix = {
          items: cartItems.map(item => ({
            productId: Number(item.productId),
            variantId: Number(item.variantId),
            quantity: Number(item.quantity),
            price: Number(item.price) 
          })),
          shippingFee: Number(frete),
          zipCode: cep.replace(/\D/g, ''),
          street: logradouro,
          number: numero,
          neighborhood: bairro,
          city: cidade.split(' - ')[0].trim(),
          state: cidade.split(' - ')[1] ? cidade.split(' - ')[1].trim() : 'PE'
        };

        const orderResponse = await api.post('/orders', orderPayloadPix);
        const orderId = orderResponse.data.id;

        const paymentResponsePix = await api.post('/payment/pix', {
          orderId: orderId,
          transaction_amount: getCartTotal() + frete,
          description: 'Pedido Karranka',
          email: userEmail,
          cpf: userCpf
        });

        if (paymentResponsePix.data.qr_code) {
          clearCart();
          setPixData(paymentResponsePix.data);
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message;
      const formatError = Array.isArray(errorMessage) ? errorMessage.join('\n') : errorMessage;
      
      alert(`Erro ao processar pagamento:\n${formatError || 'Tente novamente.'}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (pixData) {
    return (
      <PageWithHeader>
        <Container>
          <div style={{ textAlign: 'center', backgroundColor: '#FFF', padding: '3rem', borderRadius: '8px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1rem', color: '#28a745' }}>Pedido gerado com sucesso!</h2>
            <p>Escaneie o QR Code abaixo no app do seu banco para pagar:</p>
            
            <img 
              src={`data:image/jpeg;base64,${pixData.qr_code_base64}`} 
              alt="QR Code Pix" 
              style={{ width: '250px', height: '250px', margin: '2rem 0' }} 
            />
            
            <div>
              <p style={{ fontWeight: 'bold' }}>Ou use o código Copia e Cola:</p>
              <textarea 
                readOnly 
                value={pixData.qr_code}
                style={{ width: '100%', height: '80px', padding: '1rem', marginTop: '1rem', resize: 'none' }}
              />
              <button 
                onClick={() => navigator.clipboard.writeText(pixData.qr_code)}
                style={{ padding: '0.8rem 1.5rem', marginTop: '1rem', backgroundColor: '#000', color: '#FFF', border: 'none', cursor: 'pointer' }}
              >
                Copiar Código
              </button>
            </div>
          </div>
        </Container>
      </PageWithHeader>
    );
  }

  return (
    <PageWithHeader>
      <Container>
        <CheckoutGrid>
          <Column>
            
            <StepBox $active={step === 1} disabled={false}>
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

            <StepBox $active={step === 2} disabled={step < 2}>
              <StepHeader onClick={() => cep && numero && setStep(2)}>
                <h2>2. Opções de Envio</h2>
                {step > 2 && <span style={{ fontSize: '0.85rem', color: '#28a745', fontWeight: 'bold' }}>Alterar</span>}
              </StepHeader>

              {step === 2 && (
                <StepContent>
                  {loadingFrete ? (
                    <p style={{ fontFamily: 'sans-serif', color: '#666' }}>Calculando frete no Melhor Envio...</p>
                  ) : opcoesFrete.length > 0 ? (
                    opcoesFrete.map((opcao) => (
                      <RadioOption 
                        key={opcao.id}
                        onClick={() => {
                          setOpcaoSelecionada(opcao);
                          setFrete(opcao.preco);
                        }}
                        style={{
                          borderColor: opcaoSelecionada?.id === opcao.id ? '#000' : '#E0E0E0',
                          backgroundColor: opcaoSelecionada?.id === opcao.id ? '#F9F9F9' : '#FFF'
                        }}
                      >
                        <input 
                          type="radio" 
                          name="shipping" 
                          checked={opcaoSelecionada?.id === opcao.id} 
                          readOnly 
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <div>
                            <strong>{opcao.nome}</strong>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: '#666' }}>
                              Prazo: {opcao.prazo}
                            </span>
                          </div>
                          <strong>
                            {opcao.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </strong>
                        </div>
                      </RadioOption>
                    ))
                  ) : frete > 0 ? (
                    <RadioOption>
                      <input type="radio" name="shipping" defaultChecked />
                      <div>
                        <strong>Entrega Padrão:</strong> {frete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </RadioOption>
                  ) : (
                    <p style={{ fontFamily: 'sans-serif', color: '#c00' }}>
                      Nenhuma opção de frete disponível.
                    </p>
                  )}
                  
                  <ButtonGroup>
                    <ActionButton variant="secondary" onClick={() => setStep(1)}>Voltar</ActionButton>
                    <ActionButton 
                      disabled={!opcaoSelecionada && frete === 0} 
                      onClick={() => setStep(3)}
                    >
                      Continuar para Pagamento
                    </ActionButton>
                  </ButtonGroup>
                </StepContent>
              )}
            </StepBox>

            <StepBox $active={step === 3} disabled={step < 3}>
              <StepHeader onClick={() => frete > 0 && setStep(3)}>
                <h2>3. Forma de Pagamento</h2>
              </StepHeader>

              {step === 3 && (
                <StepContent>
                  <RadioOption onClick={() => setMetodoPagamento('CREDIT_CARD')}>
                    <input type="radio" name="payment" checked={metodoPagamento === 'CREDIT_CARD'} readOnly />
                    <strong>Cartão de Crédito</strong>
                  </RadioOption>

                  {metodoPagamento === 'CREDIT_CARD' && (
                    <CardDetailsContainer>
                      <InputGroup style={{ gridTemplateColumns: '1fr' }}>
                        <input 
                          type="text" 
                          placeholder="Número do Cartão" 
                          value={cardNumber} 
                          onChange={(e) => setCardNumber(e.target.value)} 
                        />
                      </InputGroup>

                      <InputGroup style={{ gridTemplateColumns: '1fr' }}>
                        <input 
                          type="text" 
                          placeholder="Nome impresso no Cartão" 
                          value={cardHolder} 
                          onChange={(e) => setCardHolder(e.target.value)} 
                        />
                      </InputGroup>

                      <InputGroup>
                        <input 
                          type="text" 
                          placeholder="Validade (MM/AA)" 
                          value={cardExpiration} 
                          onChange={(e) => setCardExpiration(e.target.value)} 
                          maxLength={5} 
                        />
                        <input 
                          type="text" 
                          placeholder="CVC / CVV" 
                          value={cardCvc} 
                          onChange={(e) => setCardCvc(e.target.value)} 
                          maxLength={4} 
                        />
                      </InputGroup>

                      <InputGroup style={{ gridTemplateColumns: '1fr' }}>
                        <select 
                          value={installments} 
                          onChange={(e) => setInstallments(e.target.value)}
                        >
                          <option value="1">1x de {((getCartTotal() + frete)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</option>
                          <option value="2">2x de {((getCartTotal() + frete) / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</option>
                          <option value="3">3x de {((getCartTotal() + frete) / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</option>
                        </select>
                      </InputGroup>
                    </CardDetailsContainer>
                  )}

                  <RadioOption onClick={() => setMetodoPagamento('PIX')}>
                    <input type="radio" name="payment" checked={metodoPagamento === 'PIX'} readOnly />
                    <strong>Pix (Aprovação Imediata)</strong>
                  </RadioOption>

                  <ButtonGroup>
                    <ActionButton variant="secondary" onClick={() => setStep(2)}>Voltar</ActionButton>
                    <ActionButton 
                      style={{ 
                        backgroundColor: '#28a745',
                        opacity: isProcessingPayment ? 0.7 : 1,
                        cursor: isProcessingPayment ? 'not-allowed' : 'pointer'
                      }} 
                      disabled={(metodoPagamento === 'CREDIT_CARD' && !isCardFormValid()) || isProcessingPayment}
                      onClick={handleFinalizarCompra}
                    >
                      {isProcessingPayment ? 'Processando pagamento...' : 'Finalizar Emissão do Pedido'}
                    </ActionButton>
                  </ButtonGroup>
                </StepContent>
              )}
            </StepBox>

          </Column>

          <Column>
            <StepBox $active={false} disabled={false} style={{ position: 'sticky', top: '2rem' }}>
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