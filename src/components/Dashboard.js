import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import { API_URL } from "../constants/api";
import GenerateClass from "./GenerateClass";

function Dashboard() {
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [role, setRole] = useState();

    const updateUser = (firstName, lastName, role) => {
        setFirstName(firstName);
        setLastName(lastName);
        setRole(role);
    };

    const requestHeader = {
        headers: {
            "auth-token": localStorage.getItem("auth-token"),
        },
    };

    useEffect(() => {
        const getUserDetails = () => {
            axios
                .get(`${API_URL}/user/dashboard`, requestHeader)
                .then((res) => {
                    console.log(res);
                    updateUser(
                        res.data.data.first_name,
                        res.data.data.last_name,
                        res.data.data.role
                    );
                })
                .catch((err) => console.log(err));
        };

        getUserDetails();
    }, []);

    return (
        <>
            <Header userName={firstName} isLoggedIn={true} />

            {firstName ? (
                <h2>
                    {firstName} {lastName}'s Dashboard ({role})
                </h2>
            ) : (
                ""
            )}

            {role === "teacher" ? <GenerateClass /> : ""}
        </>
    );
}

export default Dashboard;
