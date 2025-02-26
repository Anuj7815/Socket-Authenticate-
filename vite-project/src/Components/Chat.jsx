// import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import { db } from "../firebase/firebase.config";
// import app from "../firebase/firebase.config";
// import { getAuth } from "firebase/auth";
// import { useSelector } from "react-redux";
// import {
//     addDoc,
//     collection,
//     onSnapshot,
//     orderBy,
//     query,
//     serverTimestamp,
//     snapshotEqual,
// } from "firebase/firestore";

// const Chat = () => {
//     const auth = getAuth(app);
//     const location = useLocation();
//     const receiverEmail = location.state?.receiverEmail;
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const messagesEndRef = useRef(null);

//     // getting the logged-in user
//     const loggedInUser = useSelector((state) => state.auth.user);
//     // console.log(loggedInUser);
//     const senderEmail = loggedInUser?.email;

//     useEffect(() => {
//         if (!senderEmail || !receiverEmail) return;

//         const messageRef = collection(db, "messages");
//         const q = query(messageRef, orderBy("timestamp"));

//         // snapshot.docs converts firestore documents into the JS array

//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const fetchMessages = snapshot.docs
//                 .map((doc) => ({
//                     id: doc.id,
//                     ...doc.data(),
//                 }))
//                 .filter(
//                     (msg) =>
//                         (msg.sender === senderEmail &&
//                             msg.receiver === receiverEmail) ||
//                         (msg.sender === receiverEmail &&
//                             msg.receiver === senderEmail)
//                 );
//             setMessages(fetchMessages);
//         });

//         return () => unsubscribe();
//     }, [senderEmail, receiverEmail]);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behaviour: true });
//     }, [messages]);

//     const sendMessage = async () => {
//         if (!newMessage.trim()) return;
//         try {
//             await addDoc(collection(db, "messages"), {
//                 sender: senderEmail,
//                 receiver: receiverEmail,
//                 text: newMessage,
//                 timestamp: serverTimestamp(),
//             });
//             setNewMessage("");
//         } catch (error) {
//             console.log("Error while sending the messages...", error);
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === "Enter") {
//             e.preventDefault();
//             sendMessage();
//         }
//     };

//     return (
//         <>
//             <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//                 <h1 className="text-xl font-bold mb-4">
//                     Chat With {receiverEmail}
//                 </h1>
//                 <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg">
//                     <div className="h-64 overflow-y-auto p-2 border-b flex flex-col space-y-2">
//                         {messages.map((msg) => (
//                             <div
//                                 key={msg.id}
//                                 className={`p-2 max-w-xs rounded-lg ${
//                                     msg.sender === senderEmail
//                                         ? "bg-blue-500 text-white self-end ml-auto"
//                                         : "bg-gray-200 text-black self-start"
//                                 }`}
//                             >
//                                 <p>{msg.text}</p>
//                                 <span className="block text-xs text-gray-600 mt-1">
//                                     {msg.timestamp
//                                         ? new Date(
//                                               msg.timestamp.seconds * 1000
//                                           ).toLocaleTimeString()
//                                         : "Sending..."}
//                                 </span>
//                             </div>
//                         ))}
//                         <div ref={messagesEndRef} />
//                     </div>
//                     <div className="flex items-center mt-2">
//                         <input
//                             type="text"
//                             value={newMessage}
//                             onChange={(e) => setNewMessage(e.target.value)}
//                             className="flex-grow p-2 border rounded-lg"
//                             placeholder="Type a message..."
//                             onKeyDown={handleKeyDown}
//                         />
//                         <button
//                             onClick={sendMessage}
//                             className="ml-2 bg-gray-900 text-white px-4 py-2 rounded-lg cursor-pointer"
//                         >
//                             Send
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Chat;

import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { db } from "../firebase/firebase.config";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    doc,
} from "firebase/firestore";

// Client tries to Connect to the backend WebSocket server
const socket = io("http://localhost:5000", { autoConnect: false }); // Replace with your backend server URL

const Chat = () => {
    const location = useLocation();
    const receiverEmail = location.state?.receiverEmail;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Getting the logged-in user
    const loggedInUser = useSelector((state) => state.auth.user);
    const senderEmail = loggedInUser?.email;
    // console.log(receiverEmail);

    useEffect(() => {
        if (!senderEmail || !receiverEmail) return;

        socket.connect();
        // Join a chat room -> request send to the server.
        socket.emit("join_room", { senderEmail, receiverEmail });
        socket.off("receive_message"); //removes any previous listeners to avoid duplicate messages

        const room = [senderEmail, receiverEmail].sort().join("_");
        const chatDocRef = doc(db, "chats", room);
        const messageRef = collection(chatDocRef, "messages");
        const q = query(messageRef, orderBy("timestamp"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => doc.data()));
        });

        // attaching a new event listener for incoming messages
        const handleMessage = (message) => {
            if (message.sender !== senderEmail) {
                console.log("received_message", message);
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        };

        socket.on("receive_message", handleMessage);

        // Listen for incoming messages if its not from the sender's email
        // socket.on("receive_message", (message) => {
        //     if (message.sender !== senderEmail) {
        //         console.log("received message", message);
        //         setMessages((prevMessages) => [...prevMessages, message]);
        //     }
        // });

        return () => {
            socket.off("receive_message");
            socket.disconnect();
            unsubscribe();
        };
    }, [senderEmail, receiverEmail]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageData = {
            sender: senderEmail,
            receiver: receiverEmail,
            text: newMessage,
            timestamp: new Date().toISOString(),
        };

        const room = [senderEmail, receiverEmail].sort().join("_");
        const chatDocRef = doc(db, "chats", room);
        const messageRef = collection(chatDocRef, "messages");
        await addDoc(messageRef, messageData);

        // Emit message event to the server
        socket.emit("send_message", messageData);

        // Update local state
        // setMessages((prevMessages) => [...prevMessages, messageData]);
        setNewMessage("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-xl font-bold mb-4">
                Chat With {receiverEmail}
            </h1>
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg">
                <div className="h-64 overflow-y-auto p-2 border-b flex flex-col space-y-2">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 max-w-xs rounded-lg ${
                                msg.sender === senderEmail
                                    ? "bg-blue-500 text-white self-end ml-auto"
                                    : "bg-gray-200 text-black self-start"
                            }`}
                        >
                            <p>{msg.text}</p>
                            <span className="block text-xs text-gray-600 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>

                            {/* <span className="block text-xs text-gray-600 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                )}
                            </span> */}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="flex items-center mt-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow p-2 border rounded-lg"
                        placeholder="Type a message..."
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={sendMessage}
                        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
