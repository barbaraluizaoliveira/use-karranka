import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ProductCard, type Product } from './components/ProductCard';
import { PageWithHeader } from './components/PageWithHeader'; 
import { HomeCarousel, type Banner } from './components/HomeCarousel';
import { api } from './services/api';

const FullScreenSection = styled.section`
  min-height: calc(100vh - 80px);
  scroll-snap-align: start; 
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; 
  width: 100%;
`;

const HomeSection = styled(FullScreenSection)`
  background-color: ${props => props.theme?.colors?.background || '#000000'};
  padding: 0;
  flex-direction: column;
  justify-content: flex-start; 
`;

const CarouselContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  border-radius: 0; 
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme?.colors?.text || '#ffffff'};
  font-family: ${props => props.theme?.fonts?.body || 'sans-serif'};
  font-size: 0.9rem;
  opacity: 0.7;
  animation: bounce 2s infinite;
  z-index: 10;

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
  background-color: ${props => props.theme?.colors?.white || '#ffffff'}; 
  flex-direction: column;
  padding: 4rem 0;
`;

const SectionTitle = styled.h2`
  font-family: ${props => props.theme?.fonts?.titles || 'sans-serif'};
  color: ${props => props.theme?.colors?.primary || '#ff0000'};
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
  font-family: ${props => props.theme?.fonts?.body || 'sans-serif'};
  color: ${props => props.theme?.colors?.text || '#000000'};
  font-size: 1.2rem;
`;

const mockBanners: Banner[] = [
  {
    id: 1,
    title: 'Mosaico',
    imageDesktopUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1784034205/Portf%C3%B3lio_profissional_minimalista_informativo_pre%C3%A7os_preto_e_branco_fot%C3%B3grafo_apresenta%C3%A7%C3%A3o_2_ptr7qz.jpg',
    targetUrl: '#'
  },
  {
    id: 2,
    title: 'Lançamento Coleção Proteção - Karranka',
    imageDesktopUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1784033779/Portf%C3%B3lio_profissional_minimalista_informativo_pre%C3%A7os_preto_e_branco_fot%C3%B3grafo_apresenta%C3%A7%C3%A3o_1_d6ea94.jpg',
    targetUrl: '#'
  }
];

const mockProducts = [
  {
    id: 5,
    name: 'Camisa Oversized Figa Braba',
    price: 199.90,
    imageUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1783972405/figa_camisa_branca_pcwzrv.jpg'
  },
  {
    id: 6,
    name: 'Camisa Oversized Karranka',
    price: 199.90,
    imageUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1783972409/karranka_camisa_branca_yexgqx.jpg'
  },
  {
    id: 8,
    name: 'Boné Dadhat',
    price: 119.90,
    imageUrl: 'https://res.cloudinary.com/xkgoutyi/image/upload/v1784029244/WhatsApp_Image_2026-07-14_at_08.31.01_rmhcwu.jpg'
  }
];

export function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [productsResponse, bannersResponse] = await Promise.all([
          api.get('/products?page=1&limit=8').catch(() => ({ data: null })),
          api.get('/banners').catch(() => ({ data: null }))
        ]);

        if (!active) return;

        if (productsResponse && productsResponse.data) {
          const pData = productsResponse.data;
          setProducts(Array.isArray(pData) ? pData : (pData.data || pData.products || []));
        } else {
          setProducts(mockProducts);
        }

        if (bannersResponse && bannersResponse.data) {
          const bData = bannersResponse.data;
          setBanners(Array.isArray(bData) ? bData : (bData.data || []));
        } else {
          setBanners(mockBanners);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setProducts(mockProducts);
          setBanners(mockBanners);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageWithHeader>
      
      <HomeSection>
        <CarouselContainer>
          {loading ? (
            <div style={{ height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LoadingText>Carregando destaques da Karranka...</LoadingText>
            </div>
          ) : (
            <HomeCarousel banners={banners.length > 0 ? banners : mockBanners} />
          )}
        </CarouselContainer>

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
          ) : (
            (products.length > 0 ? products : mockProducts).map((produto) => {
              const nomeImagem = produto.image_url || produto.imageUrl || '';
              const produtoFormatado: Product = {
                id: String(produto.id),
                name: produto.name,
                price: Number(produto.price),
                originalPrice: produto.old_price || produto.originalPrice ? Number(produto.old_price || produto.originalPrice) : undefined,
                discount: produto.discount_percent ? produto.discount_percent + '% OFF' : undefined,
                imageUrl: nomeImagem.startsWith('http') ? nomeImagem : '/' + nomeImagem
              };

              return (
                <ProductCard key={produtoFormatado.id} product={produtoFormatado} />
              );
            })
          )}
        </ProductsGrid>
      </ProductsSection>

    </PageWithHeader>
  );
}