import React, { useState, useRef, useEffect } from "react";
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
  UserMenuWrapper,
  DropdownMenu,
  UserInfo,
  DropdownItem,
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
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      const rawToken = localStorage.getItem("@Karranka:token");
      const token = rawToken ? rawToken.replace(/['"]+/g, '').trim() : null;

      if (token && token.length > 10) {
        try {
          const response = await fetch("http://localhost:3344/auth/me", { 
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          if (response.ok) {
            const data = await response.json();
            const primeiroNome = data.name ? data.name.split(" ")[0] : "Usuário";
            setUserName(primeiroNome);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    fetchUserData();
  }, []);

  function handleUserClick() {
    const rawToken = localStorage.getItem("@Karranka:token");
    const token = rawToken ? rawToken.replace(/['"]+/g, '').trim() : null;
    const isLogged = !!token && token !== "null" && token !== "undefined" && token.length > 10;

    if (!isLogged) {
      navigate("/login");
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  }

  function handleLogout() {
    localStorage.removeItem("@Karranka:token");
    setIsDropdownOpen(false);
    navigate("/login");
  }

  function navigateTo(path: string) {
    setIsDropdownOpen(false);
    navigate(path);
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

        <UserMenuWrapper ref={dropdownRef}>
          <IconButton onClick={handleUserClick}>
            <img src={userIcon} alt="Usuário" />
          </IconButton>

          {isDropdownOpen && (
            <DropdownMenu>
              <UserInfo>
                <span className="greeting">Olá,</span>
                <span className="name">{userName || "Carregando..."}</span>
              </UserInfo>
              
              <DropdownItem onClick={() => navigateTo("/my-orders")}>
                Meus Pedidos
              </DropdownItem>
              <DropdownItem onClick={() => navigateTo("/profile")}>
                Meus Dados
              </DropdownItem>
              <DropdownItem onClick={() => navigateTo("/profile/enderecos")}>
                Meus Endereços
              </DropdownItem>
              <DropdownItem onClick={() => navigateTo("/profile/trocas")}>
                Trocas e Devoluções
              </DropdownItem>
              <DropdownItem onClick={handleLogout} className="logout">
                Sair
              </DropdownItem>
            </DropdownMenu>
          )}
        </UserMenuWrapper>

        <CartContainer onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>
          <img src={cartIcon} alt="Carrinho" />
          {cartItems.length > 0 && <CartBadge>{cartItems.length}</CartBadge>}
        </CartContainer>
      </Actions>
    </HeaderContainer>
  );
}