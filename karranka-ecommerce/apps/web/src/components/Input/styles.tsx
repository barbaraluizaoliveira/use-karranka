import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  margin-bottom: 6px;
  color: #333;
  font-weight: 600;
`;

export const InputWrapper = styled.div<{ $hasError: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;

  border: 1px solid ${({ $hasError }) => ($hasError ? '#e53935' : '#ddd')};
  border-radius: 999px;
  padding: 14px 20px;
  background: #fff;
  transition: 0.2s;

  &:focus-within {
    border-color: ${({ $hasError }) => ($hasError ? '#e53935' : '#999')};
    box-shadow: 0 0 0 3px ${({ $hasError }) =>
      $hasError ? 'rgba(229,57,53,0.1)' : 'rgba(0,0,0,0.05)'};
  }
`;

export const Icon = styled.img`
  width: 18px;
  opacity: 0.7;
  flex-shrink: 0;
`;

export const StyledInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #222;

  &::placeholder {
    color: #aaa;
  }
`;

export const ErrorMessage = styled.span`
  font-size: 0.8rem;
  color: #e53935;
  margin-top: 4px;
  margin-left: 20px;
`;