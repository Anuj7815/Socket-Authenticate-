import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
    addDoc,
    collection,
    getDocs,
    query,
    setDoc,
    getDoc,
    doc,
    arrayUnion,
    updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";

const UserForm = () => {
    // State to manage form inputs
    const auth = getAuth();
    const [user, setUser] = useState({
        name: "",
        email: "",
        age: "",
    });
    // const [users, setUsers] = useState([]);
    // const [usersData, setUsersData] = useState([]);
    // const [overallData, setOverallData] = useState([]);
    // const [currentUserInfo, setCurrentUserInfo] = useState([]);

    const [userData, setUserData] = useState([]);

    const loggedInUser = auth.currentUser ? auth.currentUser.email : null;
    // const database = collection(db, "usersData");
    console.log(loggedInUser);

    // Load saved data from localStorage on component mount
    // useEffect(() => {
    //     // const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    //     // setUsers(savedUsers);
    //     // console.log(savedUsers);
    //     // console.log(savedUsers.length);
    //     // const savedData = JSON.parse(localStorage.getItem("usersData")) || [];
    //     // // setOverallData(savedData);
    //     // setUsersData(savedData);
    //     // console.log(usersData);
    //     // const currentUserData = savedData.find(
    //     //     (user) => user.email === loggedInUser
    //     // );
    //     // // console.log(currentUserData);
    //     // if (currentUserData) {
    //     //     setUsersData(currentUserData.data);
    //     // }
    //     // const savedData = JSON.parse(localStorage.getItem("usersData")) || [];
    //     // console.log(savedData);
    //     // const currentUserData = savedData.find(
    //     //     (user) => user.email === loggedInUser
    //     // );
    //     // if (currentUserData) {
    //     //     setUsersData(currentUserData.data);
    //     // }
    //     // console.log(currentUserData.data);
    //     // console.log(usersData);
    // }, [loggedInUser]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const getUserForm = async (loggedInUser) => {
        try {
            const userDocRef = doc(db, "usersData", loggedInUser);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                console.log("Current Users Forms: ", data.forms);
                return data.forms;
            } else {
                console.log("Unable to get the forms for the current users");
                return [];
            }
        } catch (error) {
            console.log("Error while fetching forms");
            return [];
        }
    };

    // getUserForm(loggedInUser);

    const savedUserForm = async (loggedInUser, newData) => {
        try {
            const userDocRef = doc(db, "usersData", loggedInUser);

            // check if the users document exists
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                await updateDoc(userDocRef, { forms: arrayUnion(newData) });
            } else {
                await setDoc(userDocRef, { forms: [newData] });
            }

            console.log("Form Data Saved Successfully");
            alert("Formed Saved Successfully");
        } catch (error) {
            console.log("Unable to save the form Data");
        }
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // const updatedUser = [...users, { id: Date.now(), ...user }];
        // console.log(updatedUser);
        // setUsers(updatedUser);
        // // console.log(updatedUser.length);
        // localStorage.setItem("users", JSON.stringify(updatedUser));
        // alert("User information saved to localStorage!");

        // setUser({
        //     name: "",
        //     email: "",
        //     age: "",
        // });

        // console.log(user);

        // console.log(userData);
        // const addUser=async()=>{
        //     try{
        //         await addDoc(collection(db,"usersDatabase"),{

        //         })
        //     }
        // }

        // const existingUser =
        //     JSON.parse(localStorage.getItem("usersData")) || [];
        // const existingUserIndex = existingUser.findIndex(
        //     (user) => user.email === loggedInUser
        // );
        // if (existingUserIndex !== -1) {
        //     if (!existingUser[existingUserIndex].data) {
        //         existingUser[existingUserIndex].data = [];
        //     }
        //     existingUser[existingUserIndex].data.push(newUserData);
        // } else {
        //     existingUser.push({ email: loggedInUser, data: [newUserData] });
        // }
        // // console.log(existingUser);
        // // console.log(existingUserIndex);
        // setOverallData(existingUser);
        // setUsersData(existingUser);
        // console.log(usersData);
        // console.log(overallData);
        // localStorage.setItem("usersData", JSON.stringify(existingUser));
        // alert("Information Saved Successfully");
        // setUser({ name: "", age: "" });

        const newData = { id: Date.now(), ...user };
        console.log(newData);

        await savedUserForm(loggedInUser, newData);
        await getUserForm(loggedInUser);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    User Information
                </h2>

                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                        required
                    />
                </div>

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
                        value={user.email}
                        onChange={handleInputChange}
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
                        Age
                    </label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={user.age}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your age"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default UserForm;

// const [overallData,setOverallData]=useState([]);
// const userdata=useState({ email: loggedInuser,[]});
// const newObject={email: loggedInuser,data=[...updatedData]}

// traverse the overalldata and check if there is any email in that data which is already present
// and if it is present then check its data is empty or not
// if its not empty then update the data otherwise store the current data

// usersData=[{email,[data]}]
// currentUserData={email,data};
//  currentUserData.email;
//  currentData=currentUserData.data;
//  newData= {name,email,age}

// usersData-> db in firestore
