import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { RxGithubLogo } from "react-icons/rx";
// import { useForm } from "react-hook-form";
import app from "../firebase/firebase.config";
import { db } from "../firebase/firebase.config";
import {
    collection,
    setDoc,
    serverTimestamp,
    doc,
    getDoc,
} from "firebase/firestore";

import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

const Login = () => {
    const auth = getAuth(app);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();

    const storeUserData = async (user) => {
        if (!user) return;
        try {
            const userRef = doc(db, "allUsersData", user.uid);
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
                await setDoc(
                    userRef,
                    {
                        uid: user.uid,
                        name: user.displayName || "Anonymous",
                        email: user.email,
                        age: "",
                        timestamp: serverTimestamp(),
                    },
                    { merge: true }
                );
                console.log("User Data Successfully Stored in the firebase.");
            } else {
                console.log("user already present in the database");
            }
        } catch (error) {
            console.log("Unable to Store the user in the firebase.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userInfo = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log("Email and Password login Success", userInfo.user);
            alert("Email login successfully");
            await storeUserData(userInfo.user);
            navigate("/");
        } catch (error) {
            console.log("Failed to loggedIn", error.message);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Google Login Success:", result.user);
            alert("Login with Google Successfully");
            await storeUserData(result.user);
            navigate("/");
        } catch (error) {
            console.log("Google Login Error:", error.message);
        }
    };

    const handleGithubRegister = async () => {
        try {
            const result = await signInWithPopup(auth, githubProvider);
            console.log("GitHub Login Success:", result.user);
            alert("Login with Github Successfully");
            await storeUserData(result.user);
            navigate("/");
        } catch (error) {
            console.log("GitHub Login Error:", error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="age"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gray-900 text-white cursor-pointer py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Login
                </button>

                <div className="flex mt-4 justify-center gap-6">
                    <FcGoogle
                        size={25}
                        style={{ cursor: "pointer" }}
                        onClick={handleGoogleRegister}
                    />
                    <RxGithubLogo
                        size={25}
                        style={{ cursor: "pointer" }}
                        onClick={handleGithubRegister}
                    />
                </div>

                <p className="mt-3 flex justify-center">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-blue-800 pl-1">
                        Signup
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;
