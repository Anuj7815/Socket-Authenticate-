import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import UserForm from "./Components/UserForm";
import UserData from "./Components/UserData";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from "./Components/Home";
import Products from "./Components/Products";
import Carts from "./Components/Carts";
// import ReduxExample from "./Components/ReduxExample";
// import { CartProvider } from "./Components/CartContext";

import { login, logout } from "./features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Chat from "./Components/Chat";

const App = () => {
    // const [user, setUser] = useState(null);
    const user = useSelector((state) => state.auth.user);
    // console.log(user);
    const dispatch = useDispatch();
    const auth = getAuth();

    useEffect(() => {
        // const auth = getAuth();
        const checkUser = onAuthStateChanged(auth, (currentUser) => {
            // console.log("Current User is: ", currentUser);
            if (currentUser) {
                dispatch(
                    login({
                        uid: currentUser.uid,
                        email: currentUser.email,
                    })
                );
            } else {
                dispatch(logout());
            }
        });

        return () => checkUser();
    }, [dispatch]);

    return (
        <>
            {user ? (
                <>
                    <Navbar />

                    <Routes>
                        <Route path="/userform" element={<UserForm />} />
                        <Route path="/userinfo" element={<UserData />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/carts" element={<Carts />} />
                        {/* <Route path="/redux" element={<ReduxExample />} /> */}
                        <Route path="/home" element={<Home />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </>
            ) : (
                <>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        {/* <Route path="*" element={<Login />} /> */}
                    </Routes>
                </>
            )}
        </>
    );
};

export default App;
