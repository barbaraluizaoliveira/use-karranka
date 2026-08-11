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

  &::-webkit-scrollbar {
    display: none;
  }
`;

const LoadingText = styled.p`
  font-family: ${props => props.theme?.fonts?.body || 'sans-serif'};
  color: ${props => props.theme?.colors?.text || '#000000'};
  font-size: 1.2rem;
`;

const EmptyText = styled(LoadingText)`
  text-align: center;
  grid-column: 1 / -1;
`;

export function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBanners, setLoadingBanners] = useState(true);

  useEffect(() => {
    let active = true;

    // Busca produtos direto do banco/API
    api.get('/products?page=1&limit=8')
      .then(res => {
        if (!active) return;
        const pData = res.data;
        setProducts(Array.isArray(pData) ? pData : (pData.data || pData.products || []));
      })
      .catch(err => {
        console.error("Erro ao carregar produtos:", err);
        if (active) setProducts([]);
      })
      .finally(() => active && setLoadingProducts(false));

    // Busca banners direto do banco/API e formata corretamente
    api.get('/banners')
      .then(res => {
        if (!active) return;
        const bData = res.data;
        const rawBanners = Array.isArray(bData) ? bData : (bData.data || bData.banners || []);

        const formattedBanners: Banner[] = rawBanners.map((item: any) => ({
          id: item.id,
          title: item.title || '',
          imageDesktopUrl: item.imageDesktopUrl || item.image_desktop_url || item.imageUrl || item.image_url || '',
          imageMobileUrl: item.imageMobileUrl || item.image_mobile_url || null,
          targetUrl: item.targetUrl || item.target_url || '#'
        }));

        setBanners(formattedBanners);
      })
      .catch(err => {
        console.error("Erro ao carregar banners:", err);
        if (active) setBanners([]);
      })
      .finally(() => active && setLoadingBanners(false));

    return () => { 
      active = false; 
    };
  }, []);

  return (
    <PageWithHeader>
      
      <HomeSection>
        <CarouselContainer>
          {loadingBanners ? (
            <div style={{ height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LoadingText>Carregando destaques da Karranka...</LoadingText>
            </div>
          ) : banners.length > 0 ? (
            <HomeCarousel banners={banners} />
          ) : (
            <div style={{ height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LoadingText>Nenhum banner cadastrado no momento.</LoadingText>
            </div>
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
          {loadingProducts ? (
            <LoadingText>Carregando produtos...</LoadingText>
          ) : products.length > 0 ? (
            products.map((produto) => {
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
          ) : (
            <EmptyText>Nenhum produto encontrado no banco de dados.</EmptyText>
          )}
        </ProductsGrid>
      </ProductsSection>

    </PageWithHeader>
  );
}