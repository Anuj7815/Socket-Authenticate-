// import React, { useState, useEffect, useRef } from "react";
// import { useCart } from "./CartContext";

// const Products = () => {
//     // const [product, setProducts] = useState([]);
//     const [page, setPage] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [hasMore, setHasMore] = useState(true);
//     const observerRef = useRef(null);
//     const { cart, addToCart, removeFromCart } = useCart();
//     const [favorites, setFavorites] = useState({});
//     // const [currentProduct, setCurrentProduct] = useState([]);
//     const [allProducts, setAllProducts] = useState([]);
//     const [product, setProducts] = useState([]);
//     const [currentProduct, setCurrentProduct] = useState([]);
//     const limit = 6;
//     const start = 0;

//     // page, loading,hasMore,favourites,allProducts,product,currentProduct

//     // console.log(addToCart);
//     // console.log(cart);

//     // useEffect(() => {
//     //     const storedFavorites =
//     //         JSON.parse(localStorage.getItem("favorites")) || {};
//     //     setFavorites(storedFavorites);
//     // }, []);

//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //         try {
//     //             const res = await fetch(
//     //                 "https://dummyjson.com/c/5e06-e209-449f-a485"
//     //             );
//     //             const data = await res.json();
//     //             // console.log(data);
//     //             setProducts(data || []);
//     //         } catch (error) {
//     //             console.log("Unable to fetch the data from the API");
//     //         }
//     //     };
//     //     fetchData();
//     // }, []);

//     const fetchProducts = async () => {
//         if (loading || !hasMore) return;
//         setLoading(true);
//         try {
//             const res = await fetch(
//                 `https://dummyjson.com/c/5e06-e209-449f-a485`
//             );
//             const data = await res.json();
//             console.log(data.length);
//             setAllProducts(data);
//             // console.log(allProducts);
//             // setCurrentProduct(data.slice(0, page * limit));
//             // setProducts((prev) => [...prev, ...currentProduct]);

//             // if (currentProduct.length > data.length) {
//             //     setHasMore(false);
//             //     return;
//             // }
//             setProducts((prev) => [...prev, ...data]);
//             setPage((prev) => prev + 1);
//             setCurrentProduct(data.slice(0, page * limit));
//             console.log(currentProduct);
//         } catch (error) {
//             console.log("Unable to fetch the data from the API");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         console.log(allProducts);
//         console.log(product);
//     }, [allProducts]);

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     // observe last effect for the infinite scrolling
//     useEffect(() => {
//         if (loading || !hasMore) return;
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 if (entries[0].isIntersecting) {
//                     fetchProducts();
//                 }
//             },
//             { threshold: 1.0 }
//         );
//         if (observerRef.current) {
//             observer.observe(observerRef.current);
//         }
//         return () => observer.disconnect();
//     }, [loading, hasMore]);

//     const handleFavoriteClick = (prod) => {
//         const checkCart = cart.some((item) => item.id === prod.id);
//         // console.log(prod.id);
//         if (checkCart) {
//             removeFromCart(prod.id);
//         } else {
//             addToCart(prod);
//         }
//         // setFavorites((prev) => ({
//         //     ...prev,
//         //     [prod.id]: !prev[prod.id],
//         // }));
//         const updatedFavourites = {
//             ...favorites,
//             [prod.id]: !favorites[prod.id],
//         };

//         setFavorites(updatedFavourites);
//         localStorage.setItem("favorites", JSON.stringify(updatedFavourites));
//     };

//     return (
//         <>
//             <div className="flex justify-center items-center min-h-screen p-10 bg-gray-200">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mx-auto">
//                     {product.map((prod, index) => (
//                         <div
//                             key={prod.id}
//                             ref={
//                                 index === product.length - 1
//                                     ? observerRef
//                                     : null
//                             }
//                             className="card card-compact bg-white w-80 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 relative"
//                         >
//                             <button
//                                 className="absolute top-4 right-4 text-xl cursor-pointer"
//                                 onClick={() => handleFavoriteClick(prod)}
//                             >
//                                 {favorites[prod.id] ? "❤️" : "🤍"}
//                             </button>
//                             <figure className="overflow-hidden rounded-t-2xl">
//                                 <img
//                                     src={prod.img}
//                                     alt={prod.title}
//                                     className="object-cover w-full h-48"
//                                     loading="lazy"
//                                 />
//                             </figure>
//                             <div className="card-body p-5 flex flex-col space-y-1">
//                                 <h2 className="card-title text-xl font-semibold text-gray-800">
//                                     {prod.title}
//                                 </h2>
//                                 <p className="text-gray-600">
//                                     {prod.description}
//                                 </p>
//                                 <div className="card-actions mt-2 flex justify-end">
//                                     <button
//                                         className="btn bg-gray-900 px-4 py-3 rounded-full text-white cursor-pointer hover:bg-gray-700 w-30px"
//                                         onClick={() => addToCart(prod)}
//                                     >
//                                         Buy Now
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//                 {loading && (
//                     <p className="text-gray-600 text-center mt-5">Loading...</p>
//                 )}
//                 {!hasMore && (
//                     <p className="text-gray-600 text-center mt-5">
//                         No more products
//                     </p>
//                 )}
//             </div>
//         </>
//     );
// };

// export default Products;
import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/productSlice";
import {
    addToCart,
    removeFromCart,
    toggleFavorites,
} from "../features/cartSlice";

const Products = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
    const { carts, favorites } = useSelector((state) => state.cart);
    // const observerRef = useRef(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleFavoriteClick = useCallback(
        (prod) => {
            // checking if the product is already in favorites
            const isFavorite = favorites[prod.id];
            if (isFavorite) {
                dispatch(removeFromCart(prod.id));
            } else {
                dispatch(addToCart(prod));
            }
            dispatch(toggleFavorites(prod.id));
        },
        [favorites, dispatch]
    );

    // const favoriteCount = useMemo(() => Object.keys(favorites.length), [
    //     favorites,
    // ]);
    // const cartCount = useMemo(() => carts.length, [carts]);

    return (
        <div className="flex justify-center items-center min-h-screen p-10 bg-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mx-auto">
                {products.map((prod, index) => (
                    <div
                        key={prod.id}
                        // ref={index === products.length - 1 ? observerRef : null}
                        className="card card-compact bg-white w-80 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 relative"
                    >
                        <button
                            className="absolute top-4 right-4 text-xl cursor-pointer"
                            onClick={() => handleFavoriteClick(prod)}
                        >
                            {favorites[prod.id] ? "❤️" : "🤍"}
                        </button>
                        <figure className="overflow-hidden rounded-t-2xl">
                            <img
                                src={prod.img}
                                alt={prod.title}
                                className="object-cover w-full h-48"
                                loading="lazy"
                            />
                        </figure>
                        <div className="card-body p-5 flex flex-col space-y-1">
                            <h2 className="card-title text-xl font-semibold text-gray-800">
                                {prod.title}
                            </h2>
                            <p className="text-gray-600">{prod.description}</p>
                            <div className="card-actions mt-2 flex justify-end">
                                <button
                                    className="btn bg-gray-900 px-4 py-3 rounded-full text-white cursor-pointer hover:bg-gray-700"
                                    onClick={() => dispatch(addToCart(prod))}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {loading && (
                <p className="text-gray-600 text-center mt-5">Loading...</p>
            )}
        </div>
    );
};
export default Products;
