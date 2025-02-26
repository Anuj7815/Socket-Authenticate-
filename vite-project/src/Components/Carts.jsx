// import React, { useState, useEffect } from "react";
// import { useCart } from "./CartContext";

// const Carts = () => {
//     // const { cart, addToCart } = useCart();
//     // console.log(cart);

//     const { cart, addToCart, removeFromCart } = useCart();
//     const [favorites, setFavorites] = useState({});

//     // Load favorites from localStorage on component mount
//     useEffect(() => {
//         const storedFavorites =
//             JSON.parse(localStorage.getItem("favorites")) || {};
//         setFavorites(storedFavorites);
//     }, []);

//     // Sync favorites state to localStorage whenever it changes
//     useEffect(() => {
//         localStorage.setItem("favorites", JSON.stringify(favorites));
//     }, [favorites]);

//     const handleFavoriteClick = (prod) => {
//         const isInCart = cart.some((item) => item.id === prod.id);

//         if (isInCart) {
//             removeFromCart(prod.id);
//         }
//         setFavorites((prev) => ({
//             ...prev,
//             [prod.id]: !prev[prod.id],
//         }));
//     };
//     return (
//         <div className="p-10 bg-white mt-5 rounded-lg shadow-lg max-w-6xl mx-auto">
//             <h2 className="text-2xl font-semibold mb-4">🛒 Your Cart</h2>
//             {cart.length === 0 ? (
//                 <p className="text-gray-500">Your cart is empty.</p>
//             ) : (
//                 // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 //     {cart.map((item, index) => (
//                 //         <div key={index} className=" p-4 rounded-lg shadow">
//                 //             <button
//                 //                 className=" top-4 right-4 text-xl cursor-pointer"
//                 //                 onClick={() => handleFavoriteClick(item)}
//                 //             >
//                 //                 {favorites[item.id] ? "❤️" : "🤍"}
//                 //             </button>
//                 //             <img
//                 //                 src={item.img}
//                 //                 alt={item.title}
//                 //                 className="h-32 w-full object-cover rounded-md"
//                 //             />
//                 //             <h3 className="text-lg font-semibold mt-2">
//                 //                 {item.title}
//                 //             </h3>
//                 //             <p className="text-gray-600">{item.description}</p>
//                 //         </div>
//                 //     ))}
//                 // </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mx-auto">
//                     {cart.map((item, index) => (
//                         <div
//                             key={index}
//                             className="card card-compact bg-white w-80 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 relative"
//                         >
//                             <button
//                                 className="absolute top-4 right-4 text-xl cursor-pointer"
//                                 onClick={() => handleFavoriteClick(item)}
//                             >
//                                 {favorites[item.id] ? "❤️" : "🤍"}
//                             </button>
//                             <figure className="overflow-hidden rounded-t-2xl">
//                                 <img
//                                     src={item.img}
//                                     alt={item.title}
//                                     className="object-cover w-full h-48"
//                                 />
//                             </figure>
//                             <div className="card-body p-5 flex flex-col space-y-1">
//                                 <h2 className="card-title text-xl font-semibold text-gray-800">
//                                     {item.title}
//                                 </h2>
//                                 <p className="text-gray-600">
//                                     {item.description}
//                                 </p>
//                                 <div className="card-actions mt-2 flex justify-end">
//                                     <button
//                                         className="btn bg-gray-900 px-4 py-3 rounded-full text-white cursor-pointer hover:bg-gray-700 w-30px"
//                                         onClick={() => addToCart(item)}
//                                     >
//                                         Buy Now
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Carts;

import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, toggleFavorites } from "../features/cartSlice";

const Carts = () => {
    const dispatch = useDispatch();
    const { cartItems, favorites } = useSelector((state) => state.cart);

    const handleFavoriteClick = useCallback(
        (item) => {
            const isFavorite = favorites[item.id];
            if (isFavorite) {
                dispatch(removeFromCart(item.id));
            }
            dispatch(toggleFavorites(item.id));
            // console.log(item.id);
        },
        [favorites, dispatch]
    );

    return (
        <div className="p-10 bg-white mt-5 rounded-lg shadow-lg max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">🛒 Your Cart</h2>
            {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mx-auto">
                    {cartItems.map((item, index) => (
                        <div
                            key={index}
                            className="card bg-white w-80 rounded-2xl shadow-lg relative"
                        >
                            <button
                                className="absolute top-4 right-4 text-xl cursor-pointer"
                                onClick={() => handleFavoriteClick(item)}
                            >
                                {favorites[item.id] ? "❤️" : "🤍"}
                            </button>
                            <figure className="overflow-hidden rounded-t-2xl">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="object-cover w-full h-48"
                                />
                            </figure>
                            <div className="card-body p-5 flex flex-col space-y-1">
                                <h2 className="card-title text-xl font-semibold text-gray-800">
                                    {item.title}
                                </h2>
                                <p className="text-gray-600">
                                    {item.description}
                                </p>
                                {/* <div className="card-actions mt-2 flex justify-end">
                                    <button
                                        className="btn bg-gray-900 px-4 py-3 rounded-full text-white cursor-pointer hover:bg-gray-700"
                                        // onClick={() =>
                                        //     dispatch(addToCart(prod))
                                        // }
                                    >
                                        Buy Now
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carts;

// useRef() is a hook that provides a way to persist values across renders without trigerring a re-render.
//  It is mainly used for accessing DOM elements, storing mutable values, and optimizing performance by avoiding unnecessary re-renders.
