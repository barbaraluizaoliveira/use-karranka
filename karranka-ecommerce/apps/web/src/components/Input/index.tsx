import { type InputHTMLAttributes, forwardRef } from 'react';
import * as S from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, ...rest }, ref) => {
    return (
      <S.Container>
        {label && <S.Label>{label}</S.Label>}
        {/* Usando $hasError para evitar erro no console */}
        <S.InputWrapper $hasError={!!error}>
          {icon && <S.Icon src={icon} alt="" />}
          <S.StyledInput ref={ref} {...rest} />
        </S.InputWrapper>
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
      </S.Container>
    );
  }
);

Input.displayName = 'Input';