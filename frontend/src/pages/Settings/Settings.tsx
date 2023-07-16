import "./Settings.css";
import updateNameIcon from "../../assets/update-name.svg";
import updateAvatarIcon from "../../assets/update-avatar.svg";
import { useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
export async function loader() {
    const Token = Cookies.get("Token");
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${Token}`,
        },
    };
    const res = await fetch("http://localhost:3000/user", options);
    return await res.json();
}

export default function Settings() {
    const [newName, setNewName] = useState("");
    const [newAvatar, setNewAvatar] = useState(null);
    const [clicked2fa, setClicked2fa] = useState(false);
    const [email2fa, setEmail2fa] = useState("");
    const token = Cookies.get("Token");
    const user: any = useLoaderData();

    async function deleteAvatar() {
        fetch("http://localhost:3000/profile/deletephoto", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(() => location.reload());
    }

    async function activate2FA(e: any) {
        e.preventDefault();
        const token = Cookies.get("Token");
        const options: any = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email2fa }),
        };
        const res = await fetch("http://localhost:3000/2fa", options);
        if (!res.ok) throw new Error("could not activate 2fa");
    }

    function handleClick2fa() {
        setClicked2fa(!clicked2fa);
    }

    async function changeAvatar(e: any) {}

    async function changeName() {
        const token = Cookies.get("Token");
        const options = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: newName }),
        };
        const res = await fetch(
            "http://localhost:3000/profile/updatename",
            options
        );
        if (!res.ok) throw new Error("failed to change name");
    }

    function updateAvatar(e: any) {
        const selectedFile = e.target.files[0];
        setNewAvatar(selectedFile);
    }

    const notify = () => toast.success("2fa enabled succefully");
    return (
        <div className="settings">
            <div className="settings-top">
                <div className="settings-top-buttons">
                    <button className="settings-btn" onClick={deleteAvatar}>
                        Delete Avatar
                    </button>
                    <button onClick={handleClick2fa} className="settings-btn">
                        enable 2FA
                    </button>
                    <button className="settings-btn">disable 2FA</button>
                </div>
                {clicked2fa && (
                    <>
                        <form
                            onSubmit={activate2FA}
                            className="settings--active-2fa"
                        >
                            <input
                                className="name-field"
                                type="email"
                                placeholder="example@mail.com"
                                value={email2fa}
                                onChange={(e) => setEmail2fa(e.target.value)}
                            />
                            <button onClick={notify} className="btn">
                                Enable
                            </button>
                        </form>
                        <ToastContainer
                            position="top-left"
                            autoClose={2000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
                    </>
                )}
            </div>
            <div className="settings-update-wrapper">
                <div className="settings--header">
                    <img src={updateAvatarIcon} alt="" />
                    <p>update avatar</p>
                </div>
                <form
                    onSubmit={changeAvatar}
                    className="settings--update-avatar"
                >
                    {user && (
                        <div className="settings--update-avatar-user-data">
                            <img
                                className="settings--avatar"
                                src={user.urlImage}
                                alt=""
                            />
                            <p>{user.username}</p>
                        </div>
                    )}
                    <input type="file" onChange={updateAvatar} />
                    <button className="upload-btn">Upload</button>
                </form>
            </div>
            <div className="settings-update-wrapper">
                <div className="settings--header">
                    <img src={updateNameIcon} alt="" />
                    <p>update name</p>
                </div>
                <form className="settings--update-name">
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="name-field"
                        type="text"
                    />
                    <button onClick={changeName} className="btn">
                        Change
                    </button>
                </form>
            </div>
        </div>
    );
}
