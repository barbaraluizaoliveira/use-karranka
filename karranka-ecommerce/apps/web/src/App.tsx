import { useEffect, useState } from 'react';
import styled from 'styled-components';
import logoImg from './assets/karranka-assinatura-home.png'; 
import { ProductCard, type Product } from './components/ProductCard';
import { api } from './services/api';

const ScrollContainer = styled.main`
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory; 
  scroll-behavior: smooth;
  scrollbar-width: none; 
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FullScreenSection = styled.section`
  height: 100vh;
  scroll-snap-align: start; 
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; 
`;

const HomeSection = styled(FullScreenSection)`
  background-color: ${props => props.theme.colors.background};
`;

const BrandContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  padding: 2rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse; 
    gap: 1.5rem;
  }
`;

const BrandName = styled.h1`
  font-family: ${props => props.theme.fonts.titles};
  color: ${props => props.theme.colors.primary};
  font-size: 6rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 3.5rem;
    text-align: center;
  }
`;

const Logo = styled.img`
  width: 350px;
  height: auto;

  @media (max-width: 768px) {
    width: 250px;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.body};
  font-size: 0.9rem;
  opacity: 0.7;
  animation: bounce 2s infinite;

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ProductsSection = styled(FullScreenSection)`
  background-color: ${props => props.theme.colors.white}; 
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  font-family: ${props => props.theme.fonts.titles};
  color: ${props => props.theme.colors.primary};
  font-size: 3rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px; 
  padding: 0 2rem;
  
  max-height: 70vh; 
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const LoadingText = styled.p`
  font-family: ${props => props.theme.fonts.body};
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
`;

export function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get('/products?page=1&limit=8')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  return (
    <ScrollContainer>
      
      <HomeSection>
        <BrandContainer>
          <BrandName>Karranka</BrandName>
          <Logo src={logoImg} alt="Logo Karranka" />
        </BrandContainer>

        <ScrollIndicator>
          Deslize para ver os produtos
          <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </ScrollIndicator>
      </HomeSection>

      <ProductsSection>
        <SectionTitle>Nossos Produtos</SectionTitle>
        <ProductsGrid>
          {loading ? (
            <LoadingText>Carregando produtos reais...</LoadingText>
          ) : products.length === 0 ? (
            <LoadingText>Nenhum produto encontrado na vitrine.</LoadingText>
          ) : (
            products.map((produto) => {
              const nomeImagem = produto.image_url || produto.imageUrl || (produto.id === 1 ? 'bone-karranka.png' : 'camisa-branca-karranka-cinza-vermelho.png');

              const produtoFormatado: Product = {
                id: String(produto.id),
                name: produto.name,
                price: Number(produto.price),
                originalPrice: produto.old_price || produto.originalPrice ? Number(produto.old_price || produto.originalPrice) : undefined,
                discount: produto.discount_percent ? produto.discount_percent + '% OFF' : undefined,
                imageUrl: '/' + nomeImagem
              };

              return (
                <ProductCard key={produtoFormatado.id} product={produtoFormatado} />
              );
            })
          )}
        </ProductsGrid>
      </ProductsSection>

    </ScrollContainer>
  );
}