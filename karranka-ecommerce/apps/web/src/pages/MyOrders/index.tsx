import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../../services/api';
import { PageWithHeader } from '../../components/PageWithHeader';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
    id: number;
    quantity: number;
    priceAtPurchase: number;
    variant: {
        sku: string;
        color: { colorHex: string };
        size: { sizeName: string };
        product: {
            name: string;
            imageUrl: string;
        };
    };
}

interface Order {
    id: number;
    totalAmount: number;
    shippingFee: number;
    status: string;
    createdAt: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    items: OrderItem[];
}

const Container = styled.main`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.div`
  width: 100%;
  max-width: 900px;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fonts.titles};
  text-transform: uppercase;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const OrderCard = styled.div`
  background-color: #FFF;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #E0E0E0;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #EEE;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-family: sans-serif;
  font-size: 0.9rem;
  color: #333;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #FFF;
  background-color: ${props => {
        if (props.status === 'PAID') return '#28a745';
        if (props.status === 'CANCELLED') return '#dc3545';
        return '#ffc107';
    }};
  align-self: flex-start;
`;

const DetailsButton = styled.button`
  background-color: #333;
  color: #FFF;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-family: sans-serif;
  transition: background-color 0.2s;

  &:hover {
    background-color: #555;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-family: sans-serif;
  font-size: 0.9rem;
  opacity: 0.6;
  cursor: pointer;
  align-self: flex-start;
  margin-bottom: 1.5rem;
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

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: sans-serif;
  font-size: 0.95rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #FFF;
  border-radius: 8px;
  font-family: sans-serif;
  color: #666;
`;

const TimelineContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 10%;
    right: 10%;
    height: 3px;
    background-color: #e0e0e0;
    z-index: 0;
  }
`;

const TimelineStep = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  font-family: sans-serif;
  gap: 0.5rem;

  .circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${props => props.active ? '#e76f51' : '#e0e0e0'};
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .label {
    font-size: 0.85rem;
    font-weight: ${props => props.active ? 'bold' : 'normal'};
    color: ${props => props.active ? '#333' : '#999'};
    text-align: center;
  }
`;

const GridTwoColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  font-family: sans-serif;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  h4 {
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #555;
    line-height: 1.5;
  }
`;

const SummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 2rem;
  font-family: sans-serif;
  font-size: 0.95rem;

  .line {
    display: flex;
    justify-content: space-between;
    width: 250px;
    margin-bottom: 0.5rem;
    color: #666;
  }

  .total {
    font-weight: bold;
    font-size: 1.2rem;
    color: #000;
    border-top: 1px solid #eee;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }
`;

export function MyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMyOrders() {
            try {
                const response = await api.get('/orders/me');
                setOrders(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchMyOrders();
    }, []);

    const formatCurrency = (value: number) => {
        return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const translateStatus = (status: string) => {
        const statusMap: Record<string, string> = {
            'PAID': 'Aprovado',
            'PENDING': 'Aguardando Pagamento',
            'CANCELLED': 'Cancelado'
        };
        return statusMap[status] || status;
    };

    if (selectedOrder) {
        return (
            <PageWithHeader>
                <Container>
                    <Content>
                        <BackButton onClick={() => setSelectedOrder(null)}>
                            <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Voltar para a lista de pedidos
                        </BackButton>

                        <Title style={{ textAlign: 'center', fontSize: '1.8rem', textTransform: 'none' }}>
                            Pedido {selectedOrder.id}
                        </Title>

                        <TimelineContainer>
                            <TimelineStep active={true}>
                                <div className="circle">&#10003;</div>
                                <div className="label">
                                    Pedido Realizado<br />
                                    <span>{formatDate(selectedOrder.createdAt)}</span>
                                </div>
                            </TimelineStep>
                            <TimelineStep active={selectedOrder.status === 'PAID'}>
                                <div className="circle">{selectedOrder.status === 'PAID' ? '✓' : '...'}</div>
                                <div className="label">Pagamento<br />Confirmado</div>
                            </TimelineStep>
                            <TimelineStep active={selectedOrder.status === 'SHIPPED' || selectedOrder.status === 'DELIVERED'}>
                                <div className="circle">🚚</div>
                                <div className="label">Pedido<br />Despachado</div>
                            </TimelineStep>
                        </TimelineContainer>

                        <GridTwoColumns>
                            <div>
                                <h4>Endereço de Entrega</h4>
                                <p>
                                    {selectedOrder.street || 'Rua não informada'}, {selectedOrder.number || 'S/N'} <br />
                                    {selectedOrder.neighborhood || 'Bairro não informado'} <br />
                                    {selectedOrder.city || 'Cidade'}, {selectedOrder.state || 'UF'} <br />
                                    CEP: {selectedOrder.zipCode || '00000-000'}
                                </p>
                            </div>
                            <div>
                                <h4>Resumo</h4>
                                <p>Status: <strong>{translateStatus(selectedOrder.status)}</strong></p>
                                <p>Data da compra: {formatDate(selectedOrder.createdAt)}</p>
                            </div>
                        </GridTwoColumns>

                        <h4 style={{ fontFamily: 'sans-serif', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Itens do Pedido</h4>
                        <OrderCard style={{ border: 'none', boxShadow: 'none', padding: '0' }}>
                            <ItemList>
                                {selectedOrder.items.map(item => (
                                    <ItemRow key={item.id} style={{ borderBottom: '1px solid #f5f5f5', paddingBottom: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            {item.variant?.product?.imageUrl && (
                                                <img
                                                    src={item.variant.product.imageUrl}
                                                    alt={item.variant.product.name || 'Produto'}
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            )}
                                            <div>
                                                <strong>{item.variant?.product?.name || 'Produto Indisponível'}</strong>
                                                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.4rem' }}>
                                                    Quantidade: {item.quantity} | Tamanho: {item.variant?.size?.sizeName} | Cor:
                                                    <span style={{
                                                        display: 'inline-block',
                                                        width: '12px', height: '12px',
                                                        backgroundColor: item.variant?.color?.colorHex || '#CCC',
                                                        borderRadius: '50%',
                                                        marginLeft: '4px',
                                                        border: '1px solid #CCC',
                                                        verticalAlign: 'middle'
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#666' }}>Valor unitário: {formatCurrency(item.priceAtPurchase)}</div>
                                            <strong>{formatCurrency(item.priceAtPurchase * item.quantity)}</strong>
                                        </div>
                                    </ItemRow>
                                ))}
                            </ItemList>
                        </OrderCard>

                        <SummaryBox>
                            <div className="line">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(selectedOrder.totalAmount - selectedOrder.shippingFee)}</span>
                            </div>
                            <div className="line">
                                <span>Frete:</span>
                                <span>{formatCurrency(selectedOrder.shippingFee)}</span>
                            </div>
                            <div className="line total">
                                <span>Total:</span>
                                <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                            </div>
                        </SummaryBox>
                    </Content>
                </Container>
            </PageWithHeader>
        );
    }

    return (
        <PageWithHeader>
            <Container>
                <Content>
                    <BackButton onClick={() => navigate('/')}>
                        <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Voltar para a Vitrine
                    </BackButton>
                    
                    <Title>Meus Pedidos</Title>

                    {loading ? (
                        <p style={{ fontFamily: 'sans-serif' }}>Carregando seus pedidos...</p>
                    ) : orders.length === 0 ? (
                        <EmptyState>
                            <h3>Você ainda não fez nenhum pedido.</h3>
                            <p>Que tal dar uma olhada na nossa coleção?</p>
                        </EmptyState>
                    ) : (
                        orders.map(order => (
                            <OrderCard key={order.id}>
                                <OrderHeader>
                                    <OrderInfo>
                                        <StatusBadge status={order.status}>
                                            {translateStatus(order.status)}
                                        </StatusBadge>
                                        <div style={{ marginTop: '0.5rem' }}>
                                            NÚMERO DO PEDIDO: <strong>{order.id}</strong><br />
                                            DATA: {formatDate(order.createdAt)}<br />
                                            TOTAL: <strong>{formatCurrency(order.totalAmount)}</strong>
                                        </div>
                                    </OrderInfo>
                                    <DetailsButton onClick={() => setSelectedOrder(order)}>
                                        Ver mais detalhes
                                    </DetailsButton>
                                </OrderHeader>

                                <ItemList>
                                    {order.items.slice(0, 2).map(item => (
                                        <ItemRow key={item.id} style={{ borderBottom: 'none', paddingBottom: '0' }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                {item.variant?.product?.imageUrl && (
                                                    <img
                                                        src={item.variant.product.imageUrl}
                                                        alt={item.variant.product.name || 'Produto'}
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                                    />
                                                )}
                                                <div>
                                                    <span style={{ fontSize: '0.9rem', color: '#555' }}>{item.variant?.product?.name || 'Produto Indisponível'}</span>
                                                </div>
                                            </div>
                                            <span style={{ color: '#e76f51', fontWeight: 'bold' }}>{formatCurrency(item.priceAtPurchase * item.quantity)}</span>
                                        </ItemRow>
                                    ))}
                                    {order.items.length > 2 && (
                                        <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                                            + {order.items.length - 2} outro(s) item(ns)...
                                        </div>
                                    )}
                                </ItemList>
                            </OrderCard>
                        ))
                    )}
                </Content>
            </Container>
        </PageWithHeader>
    );
}