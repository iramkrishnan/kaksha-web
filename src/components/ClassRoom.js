import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import TeacherControls from "./TeacherControls";
import ClassEndModal from "./ClassEndModal";
import { useHistory } from "react-router-dom";
import { API_URL } from "../constants/api";
import Header from "./Header";
import LeaveClassButton from "./LeaveClassButton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/ClassRoom.css";
toast.configure();

const Room = ({ match }) => {
    const [socketConnection, setSocketConnection] = useState();

    const [firstName, setFirstName] = useState();
    const [onlineStudents, setOnlineStudents] = useState([]);
    const [onlineTeachers, setOnlineTeachers] = useState([]);
    const [isClassActive, setIsClassActive] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const history = useHistory();

    const updateName = (name) => {
        setFirstName(name);
    };

    const updateOnlineUsers = (onlineStudents, onlineTeachers) => {
        setOnlineStudents(onlineStudents);
        setOnlineTeachers(onlineTeachers);
    };

    const updateClassStatus = (status) => {
        setIsClassActive(status);
    };

    const updateIsTeacher = (value) => {
        setIsTeacher(value);
    };

    const userJoinedNotification = (userName) => {
        toast.success(`${userName} joined the class`, { autoClose: 2000 });
    };

    const userLeftNotification = (userName) => {
        toast.error(`${userName} left the class`, { autoClose: 2000 });
    };

    const roomId = match.params.id;

    const requestHeader = {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
    };

    const fetchUser = async () => {
        await fetch(`${API_URL}/user/dashboard`, {
            mode: "cors",
            headers: requestHeader,
        })
            .then(async (res) => {
                const user = await res.json();
                const value = user.data.role === "teacher" ? true : false;
                updateIsTeacher(value);
                updateName(user.data.first_name);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchUser();
        startConnection();
    }, []);

    const startConnection = () => {
        const socket = io(API_URL, {
            query: {
                token: localStorage.getItem("auth-token"),
                roomId: roomId,
            },
            transports: ["websocket"],
        });

        setSocketConnection(socket);

        socket.on("class-status", (classStatus) => {
            updateClassStatus(classStatus);
        });

        socket.on("class-started", (classStatus) => {
            updateClassStatus(classStatus);
            window.location.reload();
        });

        socket.emit("join-class", roomId);

        socket.on(
            "user-connected",
            (onlineStudents, onlineTeachers, newUserName) => {
                updateOnlineUsers(onlineStudents, onlineTeachers);
                userJoinedNotification(newUserName);
            }
        );

        socket.on(
            "user-disconnected",
            (onlineStudents, onlineTeachers, leftUserName) => {
                updateOnlineUsers(onlineStudents, onlineTeachers);
                userLeftNotification(leftUserName);
            }
        );

        socket.on("leave-room", () => {
            socket.disconnect();
            updateClassStatus(false);

            setModalShow(true);
        });
    };

    const startClass = async () => {
        socketConnection.emit("start-class", roomId);
        window.location.reload();
    };

    const endClass = async () => {
        socketConnection.emit("class-end", roomId);
    };

    return (
        <div>
            <Header
                userName={firstName}
                leaveClass={socketConnection}
                isLoggedIn={true}
            />

            <div className="class-info">
                <h1>📚 Classroom - {roomId}</h1>
                <div className="controls">
                    {isTeacher ? (
                        <TeacherControls
                            isClassActive={isClassActive}
                            startClass={startClass}
                            endClass={endClass}
                        />
                    ) : (
                        ""
                    )}

                    {isClassActive ? (
                        <LeaveClassButton leaveClass={socketConnection} />
                    ) : (
                        ""
                    )}
                </div>
            </div>

            <div className="room my-5">
                <ClassEndModal
                    show={modalShow}
                    onHide={() => {
                        setModalShow(false);
                        history.push("/dashboard");
                    }}
                />

                <div className="users">
                    <h2 className="ml-3 mt-2">
                        <b> 👨‍🏫 Teachers</b>
                    </h2>
                    <ul>
                        {onlineTeachers.map((user) => {
                            return <li key={user}>{user}</li>;
                        })}
                    </ul>
                </div>

                <div className="users">
                    <h2 className="ml-3  mt-2">
                        <b>🧑‍🎓 Students</b>
                    </h2>
                    <ul>
                        {onlineStudents.map((user) => {
                            return <li key={user}>{user}</li>;
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Room;
