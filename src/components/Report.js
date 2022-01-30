import React, { useEffect, useState } from "react";
import Header from "./Header";
import { API_URL } from "../constants/api";
import ClassLog from "./ClassLog";
import { Accordion, Button, Card } from "react-bootstrap";

function Report() {
    const [classes, setClasses] = useState([]);

    const requestHeader = {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
    };

    useEffect(() => {
        async function fetchData() {
            var requestOptions = {
                method: "GET",
                headers: requestHeader,
                redirect: "follow",
            };

            await fetch(`${API_URL}/class`, requestOptions)
                .then(async (res) => {
                    if (res.ok) {
                        const classes = await res.json();
                        setClasses(classes.data);
                    } else console.log(res);
                })
                .catch((error) => console.log("error", error));
        }

        fetchData();
    }, []);

    return (
        <>
            <Header userName="" isLoggedIn={true} />
            <h1>Report</h1>

            <div>
                {classes.map((class1, i) => (
                    <Accordion defaultActiveKey="1" key={i}>
                        <Card>
                            <Accordion.Toggle
                                as={Button}
                                variant="a"
                                eventKey="0"
                            >
                                {class1.number}
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <ClassLog classLogs={class1} />
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Accordion.Toggle>
                        </Card>
                    </Accordion>
                ))}
            </div>
        </>
    );
}

export default Report;
