import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useLocation } from "react-router-dom";
import { collection, getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

const UserData = () => {
    // State to manage the list of users
    const [usersData, setUsersData] = useState([]);
    const auth = getAuth();
    const [currentData, setCurrentData] = useState([]);
    const location = useLocation();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { email } = location.state || {};
    console.log(email);

    const loggedInUser = auth.currentUser ? auth.currentUser.email : null;
    // State to manage the form inputs for updating a user

    const [editUser, setEditUser] = useState({
        id: "",
        name: "",
        email: "",
        age: "",
    });

    const gettCurrentUserForm = async () => {
        try {
            const userDocRef = doc(db, "usersData", email);
            const userDoc = await getDoc(userDocRef);
            const data = userDoc.data();

            console.log(data.forms);
            setCurrentData(data.forms || []);
        } catch (error) {
            console.log("Unable to get the current user form data");
        }
    };

    // Load saved users from localStorage on component mount
    useEffect(() => {
        // const savedUsersData =
        //     JSON.parse(localStorage.getItem("usersData")) || [];
        // console.log(localStorage.getItem("user"), "new ind");
        // console.log(savedUsersData);
        // setCurrentData(savedUsersData);
        // console.log(currentData);
        // if (email) {
        //     const filteredUserData = savedUsersData.find(
        //         (user) => user.email === email
        //     );
        //     console.log(filteredUserData);
        //     if (filteredUserData?.data) {
        //         setCurrentData(filteredUserData.data);
        //     }
        // }
        // console.log(currentData);
        // if (loggedInUser) {
        //     const filteredUsers = savedUsersData.filter(
        //         (user) => user.email === loggedInUser
        //     );
        //     setUsers(filteredUsers);
        // }
        // console.log(savedUsers, "  :Local users ");

        const currData = async () => {
            await gettCurrentUserForm();
        };
        currData();
    }, [loggedInUser]);

    // Handle deleting a user
    const handleDelete = async (entry) => {
        // const updatedUsers = currentData.filter((user) => user.id !== id);
        // setUsersData(updatedUsers);
        // localStorage.setItem("usersData", JSON.stringify(updatedUsers));
        // alert("User deleted successfully!");

        if (!window.confirm("Are you sure you want to delete?")) return;
        try {
            const userDocRef = doc(db, "usersData", email);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const data = userDoc.data();
                const updatedForms = data.forms.filter(
                    (e) => e.id !== entry.id
                );
                await updateDoc(userDocRef, { forms: updatedForms });
                setCurrentData(updatedForms);
                console.log("Data deleted successfully");
            }
        } catch (error) {
            console.log("Failed to delete that entry");
        }
    };

    // Handle editing a user
    const handleEdit = (user) => {
        setEditUser(user);
        setIsEditModalOpen(true);
    };

    // Handle updating a user
    const handleUpdate = async () => {
        if (!editUser.id) {
            alert("Error: No user selected for update.");
            return;
        }
        // const updatedUsers = users.map((user) =>
        //     user.id === editUser.id ? { ...user, ...editUser } : user
        // );
        // setUsers(updatedUsers);
        // localStorage.setItem("usersData", JSON.stringify(updatedUsers));
        // setEditUser({ id: null, name: "", email: "", age: "" });
        try {
            const userDocRef = doc(db, "usersData", email);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                const updatedForms = data.forms.map((user) =>
                    user.id === editUser.id ? { ...user, ...editUser } : user
                );

                await updateDoc(userDocRef, { forms: updatedForms });
                setCurrentData(updatedForms);
                setIsEditModalOpen(false);
                alert("User updated successfully!");
                console.log("user updated success");
            }
        } catch (error) {
            console.log("Failed to Edit the data");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-center mb-8">User Data</h1>

            {/* Table to display users */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Age
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-gray-200"
                            >
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {user.age}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="mr-2 text-blue-500 hover:text-blue-700 cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user)}
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">Edit User</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={editUser.name}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editUser.email}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    value={editUser.age}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            age: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserData;
