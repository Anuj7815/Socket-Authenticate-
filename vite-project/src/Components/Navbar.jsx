import React from "react";
import { getAuth, signOut } from "firebase/auth";
import app from "../firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { logout } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
    const auth = getAuth(app);
    const { cartItems, favorites } = useSelector((state) => state.cart);
    // console.log(cartItems);
    // console.log(cartItems.length);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const { cart } = useCart();

    const handleLogout = async () => {
        try {
            // signOut(auth);
            // navigate("/login");
            signOut(auth).then(() => {
                dispatch(logout());
            });
            console.log("Sign Out success");
            alert("Sign Out Successfully");
            navigate("/login");
        } catch (error) {
            console.log("Failed to signout", error.message);
        }
    };

    const handleNavigate = (URL) => {
        navigate(URL);
    };

    return (
        <header className="bg-white shadow-md dark:bg-gray-900 relative">
            <nav className="mx-auto flex items-center justify-between p-4 lg:px-8 max-w-7xl">
                {/* Left - Logo */}
                <div className="flex flex-1">
                    <a
                        onClick={() => handleNavigate("/")}
                        className="cursor-pointer"
                    >
                        <span className="sr-only">Your Company</span>
                        <img
                            className="h-8 w-auto"
                            src="/vite.svg"
                            alt="Logo"
                        />
                    </a>
                </div>

                {/* Center - Navigation Links (Properly Centered) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-12">
                    <a
                        onClick={() => handleNavigate("/home")}
                        className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
                    >
                        Home
                    </a>
                    <a
                        onClick={() => handleNavigate("/userform")}
                        className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
                    >
                        UserForm
                    </a>
                    <a
                        onClick={() => handleNavigate("/products")}
                        className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
                    >
                        Products
                    </a>
                    {/* <a
                        onClick={() => handleNavigate("/redux")}
                        className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
                    >
                        Redux
                    </a> */}
                    <a
                        onClick={() => handleNavigate("/carts")}
                        className="relative flex items-center text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
                    >
                        <span className="absolute -top-3 -right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs rounded-full">
                            {cartItems.length > 0 ? cartItems.length : 0}
                        </span>
                        <FaShoppingCart className="text-lg" size={20} />
                    </a>
                </div>

                {/* Right - Login/Logout */}
                <div className="flex items-center space-x-4">
                    <a
                        onClick={() => handleNavigate("/login")}
                        className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
                    >
                        Log in →
                    </a>
                    <button
                        type="button"
                        className="bg-white text-gray-900 rounded-full py-2 px-3 cursor-pointer hover:bg-gray-700 hover:text-white transition"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
