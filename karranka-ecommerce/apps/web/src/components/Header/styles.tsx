import styled from "styled-components";

export const HEADER_HEIGHT = "130px";

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  height: ${HEADER_HEIGHT};

  background: #ffffff;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 clamp(16px, 4vw, 80px);

  z-index: 99999;

  border-bottom: 1px solid #f2f2f2;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);

  @media (max-width: 1440px) {
    height: 120px;
  }

  @media (max-width: 1200px) {
    height: 100px;
  }

  @media (max-width: 768px) {
    height: 70px;
  }
`;

export const Logo = styled.img`
  width: clamp(130px, 18vw, 360px);

  object-fit: contain;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 120px;
  }
`;

export const SearchContainer = styled.div`
  flex: 1;

  max-width: 900px;
  min-width: 250px;

  height: 72px;

  position: relative;

 margin: 0 clamp(10px, 3vw, 50px);

  @media (max-width: 1440px) {
    height: 64px;
  }

  @media (max-width: 1200px) {
    height: 58px;
  }

  @media (max-width: 768px) {
    height: 40px;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 100%;

  border: none;
  outline: none;

  border-radius: 20px;

  background: #f6f6f6;

  padding: 0 50px 0 20px;

  font-size: clamp(14px, 1.2vw, 24px);
  font-weight: 400;

  color: #6d6d6d;

  &::placeholder {
    color: #b9b9b9;
  }

  @media (max-width: 600px) {
    font-size: 12px;
    &::placeholder {
      color: transparent;
    }
  }
`;

export const SearchIcon = styled.img`
  width: clamp(18px, 1.5vw, 30px);
  height: clamp(22px, 1.5vw, 30px);

  position: absolute;

  right: 18px;
  top: 50%;

  transform: translateY(-50%);

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-50%) scale(1.1);
    opacity: 0.8;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;

  gap: clamp(12px, 4vw, 70px);

  flex-shrink: 0;
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.08);
  }

  img,
  svg {
    width: clamp(22px, 2vw, 40px);
    height: clamp(28px, 2vw, 40px);

    object-fit: contain;
  }

  &:first-child {
    @media (max-width: 480px) {
      display: none;
    }
  }
`;

export const CartContainer = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.08);
  }

  img,
  svg {
    width: clamp(22px, 2vw, 40px);
    height: clamp(28px, 2vw, 40px);

    object-fit: contain;
  }
`;

export const CartBadge = styled.div`
  position: absolute;

  top: -8px;
  right: -10px;

  width: 18px;
  height: 22px;

  border-radius: 50%;

  background: #4169e1;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 11px;
  font-weight: 700;

  box-shadow: 0 2px 8px rgba(65, 105, 225, 0.3);
`;