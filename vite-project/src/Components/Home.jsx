import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import app, { db } from "../firebase/firebase.config";
import {
    collection,
    deleteDoc,
    getDocs,
    doc,
    snapshotEqual,
    where,
} from "firebase/firestore";
import { FaTrash } from "react-icons/fa";
import { getAuth } from "firebase/auth";
const Home = () => {
    // const [usersInfo, setUsersInfo] = useState([]);
    // console.log(usersInfo);
    const navigate = useNavigate();
    const [emails, setEmails] = useState([]);
    const [users, setUsers] = useState([]);
    const auth = getAuth(app);

    // const handleRowClick = (email) => {
    //     navigate("/userinfo", { state: { email } });
    // };

    // useEffect(() => {
    //     const fetchEmails = async () => {
    //         const fetchedEmails = await getAllUsersEmail();
    //         setEmails(fetchedEmails);
    //     };
    //     fetchEmails();
    // }, []);

    // const getAllUsersEmail = async () => {
    //     try {
    //         const userDocRef = collection(db, "usersData");
    //         const userDoc = await getDocs(userDocRef);

    //         const userEmails = userDoc.docs.map((doc) => doc.id);
    //         console.log("Users who have filled the form", userEmails);
    //         return userEmails;
    //     } catch (error) {
    //         console.log("Error while fetching the userEmails");
    //         return [];
    //     }
    // };

    // useEffect(() => {
    //     const fetchUserEmails = async () => {
    //         try {
    //             const userCollectionRef = collection(db, "usersData");
    //             console.log(userCollectionRef);
    //             const userDocs = await getDocs(userCollectionRef);

    //             const storedEmails = userDocs.docs.map((doc) => doc.id);
    //             console.log("Stored Users in Firestore: ", storedEmails);
    //             setEmails(storedEmails);
    //         } catch (error) {
    //             console.log(
    //                 "Unable to Fetch the Emails of all the Stored Users"
    //             );
    //         }
    //     };
    //     fetchUserEmails();
    // }, []);

    // fetching the users which are logged in the firebase
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(
                    collection(db, "allUsersData")
                );
                const usersList = querySnapshot.docs
                    .map((doc) => {
                        const userData = doc.data();
                        return userData.email ? userData.email : null;
                    })
                    .filter(Boolean);
                console.log(usersList);
                setUsers(usersList);
            } catch (error) {
                console.log("Unable to fetch the users Data", error);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (email) => {
        // event.stopPropagation();
        if (window.confirm(`Are you sure you want to delete`)) {
            try {
                // await deleteDoc(doc(db, "usersData", email));
                // console.log("User Deleted");
                // // setEmails(emails.filter((user) => user.id !== email));
                // setEmails((prevEmails) =>
                //     prevEmails.filter((userEmail) => userEmail !== email)
                // );
                const usersRef = collection(db, "allUsersData");
                const q = query(usersRef, where("email", "==", email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    querySnapshot.forEach(async (docSnap) => {
                        await deleteDoc(doc(db, "allUsersData", docSnap.id));
                        console.log("User Deleted Successfully:", email);

                        // Update the state to remove the deleted user
                        setEmails((prevEmails) =>
                            prevEmails.filter(
                                (userEmail) => userEmail !== email
                            )
                        );
                    });
                } else {
                    console.log("User not found in Firestore!");
                }
            } catch (error) {
                console.log("Failed to delelte the user");
            }
        }
    };

    const handleClick = (receiverEmail) => {
        navigate("/chat", { state: { receiverEmail } });
    };

    // console.log(usersInfo);
    return (
        <>
            <div className="min-h-screen bg-gray-100 p-8">
                <h1 className="text-3xl font-bold text-center mb-8">Users</h1>
                <div className="flex justify-center bg-white rounded-lg shadow-md w-1/2 mx-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    No
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Delete
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Chat
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((email, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-200 hover:bg-gray-200"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {email}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(email);
                                            }}
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClick(email);
                                            }}
                                            className="text-green-500 hover:text-green-700 cursor-pointer"
                                        >
                                            Message
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Home;
