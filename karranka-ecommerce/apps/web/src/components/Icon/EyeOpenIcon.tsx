import { IconWrapper } from './IconWrapper';
// O "?react" no final avisa o Vite para transformar o SVG em um componente React
import EyeOpenSvg from '../../assets/icons/eye-open.svg?react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string; // Permite passar classes extras se precisar
}

export function EyeOpenIcon({ size, color, className }: IconProps) {
  return (
    <IconWrapper $size={size} $color={color} className={className}>
      <EyeOpenSvg />
    </IconWrapper>
  );
}