import { useNavigate } from "react-router-dom";
import {
  HeaderContainer,
  Logo,
  SearchContainer,
  SearchInput,
  SearchIcon,
  Actions,
  IconButton,
  CartContainer,
  CartBadge,
} from "./styles";

import logo from "../../assets/karranka-para-header.png";
import searchIcon from "../../assets/icons/search.svg";
import helpIcon from "../../assets/icons/help.svg";
import userIcon from "../../assets/icons/user.png";
import cartIcon from "../../assets/icons/cart.svg";
import { useCart } from "../../context/CartContext";

export function Header() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  function handleUserClick() {
    // 1. Buscamos o token salvo
    const rawToken = localStorage.getItem("@Karranka:token");

    // Limpa aspas simples, duplas e espaços invisíveis por garantia
    const token = rawToken ? rawToken.replace(/['"]+/g, '').trim() : null;

    // 2. Definimos o que é "estar logado" de forma segura
    const isLogged = !!token && token !== "null" && token !== "undefined" && token.length > 10;

    console.log("Token limpo no clique:", token);
    console.log("Usuário logado?", isLogged);

    // 3. Redirecionamento correto
    if (isLogged) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  }

  return (
    <HeaderContainer>
      <Logo src={logo} alt="Karranka" />

      <SearchContainer>
        <SearchInput placeholder="O que você está procurando?" />
        <SearchIcon src={searchIcon} alt="" />
      </SearchContainer>

      <Actions>
        <IconButton>
          <img src={helpIcon} alt="Ajuda" />
        </IconButton>

        {/* Botão de usuário sem interferência de estados internos */}
        <IconButton onClick={handleUserClick}>
          <img src={userIcon} alt="Usuário" />
        </IconButton>

        <CartContainer onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>
          <img src={cartIcon} alt="Carrinho" />
          {cartItems.length > 0 && <CartBadge>{cartItems.length}</CartBadge>}
        </CartContainer>
      </Actions>
    </HeaderContainer>
  );
}