import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    // console.log(cart);

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem("carts")) || [];
        setCart(cartItems);
    }, []);

    useEffect(() => {
        localStorage.setItem("carts", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart((prev) => {
            const updatedCart = [...prev, item];
            return updatedCart;
        });
        // localStorage.setItem("carts", JSON.stringify(cart));
    };

    const removeFromCart = (productId) => {
        setCart((prev) => {
            const updatedCart = prev.filter((item) => item.id !== productId);
            return updatedCart;
        });
    };

    return (
        <>
            <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
                {children}
            </CartContext.Provider>
        </>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
