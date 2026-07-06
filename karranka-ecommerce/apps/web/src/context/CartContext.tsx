import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface CartItem {
  id: string; 
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  variantId: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const localData = localStorage.getItem('@Karranka:cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('@Karranka:cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === newItem.productId && item.selectedSize === newItem.selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }

      return [...prevItems, { ...newItem, id: `${newItem.productId}-${newItem.selectedSize}-${Date.now()}` }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return;
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider');
  return context;
}