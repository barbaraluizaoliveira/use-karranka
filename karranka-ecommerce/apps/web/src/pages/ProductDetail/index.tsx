import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

const Container = styled.main`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  width: 100%;
  max-width: 1100px;
  background-color: ${props => props.theme.colors.white || '#FFFFFF'};
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1.5rem;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F9F9F9;
  border-radius: 4px;
  padding: 2rem;
  
  img {
    max-width: 100%;
    height: auto;
    max-height: 450px;
    object-fit: contain;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.body};
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  align-self: flex-start;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const ProductName = styled.h1`
  font-family: ${props => props.theme.fonts.titles};
  color: ${props => props.theme.colors.primary};
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CurrentPrice = styled.span`
  font-family: ${props => props.theme.fonts.titles};
  color: ${props => props.theme.colors.primary};
  font-size: 2rem;
 chain-case: uppercase;
`;

const OldPrice = styled.span`
  font-family: ${props => props.theme.fonts.body};
  color: #999999;
  font-size: 1.2rem;
  text-decoration: line-through;
`;

const Description = styled.p`
  font-family: ${props => props.theme.fonts.body};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const SectionLabel = styled.h3`
  font-family: ${props => props.theme.fonts.titles};
  color: ${props => props.theme.colors.primary};
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  text-transform: uppercase;
`;

const VariantsGrid = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
`;

interface VariantButtonProps {
  selected: boolean;
  disabled: boolean;
}

const VariantButton = styled.button<VariantButtonProps>`
  font-family: ${props => props.theme.fonts.body};
  font-weight: bold;
  padding: 0.8rem 1.5rem;
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : '#E0E0E0'};
  background-color: ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.selected ? '#FFFFFF' : props.disabled ? '#CCCCCC' : props.theme.colors.text};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s;

  &:hover {
    border-color: ${props => !props.disabled && props.theme.colors.primary};
    background-color: ${props => !props.disabled && !props.selected && 'rgba(0,0,0,0.02)'};
  }
`;

const BuyButton = styled.button`
  font-family: ${props => props.theme.fonts.titles};
  background-color: ${props => props.theme.colors.primary};
  color: #FFFFFF;
  border: none;
  padding: 1.2rem;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: '#333333'
  }

  &:disabled {
    background-color: #CCCCCC;
    cursor: not-allowed;
  }
`;

const StatusText = styled.p`
  font-family: ${props => props.theme.fonts.body};
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
`;

export function ProductDetail() {
  // CHAMADA DO HOOK CORRETA: Sempre dentro do componente!
  const { addToCart } = useCart();
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        const variantsList = response.data.variants || [];
        if (variantsList.length > 0) {
          const firstAvailable = variantsList.find((v: any) => v.stockQuantity > 0);
          if (firstAvailable) setSelectedVariant(firstAvailable);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container>
        <StatusText>Carregando detalhes do produto...</StatusText>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <StatusText>Produto não encontrado.</StatusText>
      </Container>
    );
  }

  const nomeImagem = product.imageUrl || product.image_url || '';
  const fallbackImagem = product.id === 1 ? 'bone-karranka.png' : 'camisa-branca-karranka-cinza-vermelho.png';
  const urlFinalImagem = '/' + (nomeImagem || fallbackImagem);

  const productVariants = product.variants || [];

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: urlFinalImagem,
      quantity: 1,
      selectedSize: selectedVariant.size?.sizeName || 'Único',
      selectedColor: selectedVariant.color?.colorHex || '#000000',
      variantId: selectedVariant.id
    });
    
    navigate('/cart');
  };

  return (
    <Container>
      <ContentGrid>
        <ImageContainer>
          <img src={urlFinalImagem} alt={product.name} />
        </ImageContainer>

        <InfoContainer>
          <BackButton onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar para a vitrine
          </BackButton>

          <ProductName>{product.name}</ProductName>
          
          <PriceContainer>
            <CurrentPrice>
              {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
             </CurrentPrice>
            {product.oldPrice && (
              <OldPrice>
                {Number(product.oldPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </OldPrice>
            )}
          </PriceContainer>

          <Description>{product.description}</Description>

          {productVariants.length > 0 && (
            <>
              <SectionLabel>Selecione o Tamanho</SectionLabel>
              <VariantsGrid>
                {productVariants.map((variant: any) => {
                  const sizeName = variant.size?.sizeName || 'Único';
                  const isAvailable = variant.stockQuantity > 0;
                  
                  return (
                    <VariantButton
                      key={variant.id}
                      disabled={!isAvailable}
                      selected={selectedVariant?.id === variant.id}
                      onClick={() => isAvailable && setSelectedVariant(variant)}
                    >
                      {sizeName} {!isAvailable && '(Esgotado)'}
                    </VariantButton>
                  );
                })}
              </VariantsGrid>
            </>
          )}

          <BuyButton 
            disabled={!selectedVariant || selectedVariant.stockQuantity === 0} 
            onClick={handleAddToCart}
          >
            {!selectedVariant ? 'Selecione um tamanho' : selectedVariant.stockQuantity === 0 ? 'Esgotado' : 'Adicionar à Sacola'}
          </BuyButton>
        </InfoContainer>
      </ContentGrid>
    </Container>
  );
}