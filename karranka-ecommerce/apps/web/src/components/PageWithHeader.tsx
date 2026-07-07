import styled from "styled-components";
import { Header } from "./Header";
import { HEADER_HEIGHT } from "./Header/styles";

const Content = styled.main`
  padding-top: ${HEADER_HEIGHT};
`;

type Props = {
  children: React.ReactNode;
};

export function PageWithHeader({ children }: Props) {
  return (
    <>
      <Header />
      <Content>{children}</Content>
    </>
  );
}