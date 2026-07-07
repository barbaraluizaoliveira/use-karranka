import styled from 'styled-components';

interface IconWrapperProps {
  $size?: number; // Usando o prefixo $ para propriedades transitórias do styled-components
  $color?: string;
}

export const IconWrapper = styled.span<IconWrapperProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: ${({ $size }) => $size || 24}px;
    height: ${({ $size }) => $size || 24}px;
    /* Usa a cor passada por prop ou a cor do texto do elemento pai (currentColor) */
    fill: ${({ $color }) => $color || 'currentColor'};
    transition: fill 0.2s ease-in-out;
  }
`;