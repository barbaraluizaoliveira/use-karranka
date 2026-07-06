import styled from 'styled-components';
import { Link } from 'react-router-dom';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  installments?: string;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
}

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
`;

const Card = styled.div`
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%; /* Garante que o card ocupe o espaço correto dentro do Link */
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 250px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.white};

  @media (max-width: 768px) {
    height: 180px;
    padding: 1rem;
  }
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const InfoContainer = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;

  @media (max-width: 768px) {
    padding: 0 1rem 1rem 1rem;
  }
`;

const ProductName = styled.h3`
  font-family: ${props => props.theme.fonts.subtitles};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const OriginalPrice = styled.span`
  font-family: ${props => props.theme.fonts.body};
  color: ${props => props.theme.colors.lightGray};
  font-size: 0.875rem;
  text-decoration: line-through;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CurrentPrice = styled.span`
  font-family: ${props => props.theme.fonts.body};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.fontWeights.bold};
  font-size: 1.25rem;

  @media (max-width: 768px) {
    font-size: 1.15rem;
  }
`;

const DiscountBadge = styled.span`
  font-family: ${props => props.theme.fonts.body};
  color: ${props => props.theme.colors.primary};
  font-size: 0.75rem;
  font-weight: ${props => props.theme.fontWeights.bold};
`;

const Installments = styled.span`
  font-family: ${props => props.theme.fonts.body};
  color: ${props => props.theme.colors.darkGray};
  font-size: 0.875rem;
`;

const BuyButton = styled.button`
  margin-top: auto;
  padding: 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.buttonText};
  font-family: ${props => props.theme.fonts.body};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none; /* Mantendo o reset padrão */
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.darkGray};
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <CardLink to={'/products/' + product.id}>
      <Card>
        <ImageContainer>
          <ProductImage src={product.imageUrl} alt={product.name} />
        </ImageContainer>
        
        <InfoContainer>
          <ProductName>{product.name}</ProductName>
          
          {product.originalPrice && (
            <OriginalPrice>
              {formatPrice(product.originalPrice)}
            </OriginalPrice>
          )}
          
          <PriceRow>
            <CurrentPrice>{formatPrice(product.price)}</CurrentPrice>
            {product.discount && <DiscountBadge>{product.discount}</DiscountBadge>}
          </PriceRow>

          {product.installments && (
            <Installments>
              {product.installments}
            </Installments>
          )}
        </InfoContainer>

        <BuyButton>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          Comprar
        </BuyButton>
      </Card>
    </CardLink>
  );
}