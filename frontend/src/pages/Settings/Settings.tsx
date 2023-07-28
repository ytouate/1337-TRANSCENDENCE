import "./Settings.css";
import updateNameIcon from "../../assets/update-name.svg";
import updateAvatarIcon from "../../assets/update-avatar.svg";
import { useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { useContext } from "react";
import { authContext } from "../../context/Context";
import { Navigate, redirect } from "react-router-dom";
import { useLoaderData } from "react-router-dom";

export async function loader() {
    const Token = Cookies.get("Token");
    if (!Token) return redirect("/signin");
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${Token}`,
        },
    };
    const res = await fetch(
        `http://${import.meta.env.VITE_API_URL}/user`,
        options
    );
    if (res.ok) return await res.json();
    else {
        if (res.status == 401)
            throw new Error("make sure you have the right access");
    }
}

export default function Settings() {
    const [isSignedIn, setIsSignedIn]: any = useContext(authContext);
    if (isSignedIn == false) return <Navigate to={"/signin"} />;
    const [newName, setNewName] = useState("");
    const [newAvatar, setNewAvatar] = useState("");
    const [clicked2fa, setClicked2fa] = useState(false);
    const [email2fa, setEmail2fa] = useState("");
    const token = Cookies.get("Token");
    const user: any = useLoaderData();
    if (user.optionalMail && user.isSignedIn == false)
        return <Navigate to={"/twofactor"} />;

    async function deleteAvatar() {
        fetch(`http://${import.meta.env.VITE_API_URL}/profile/deletephoto`, {
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
        const res = await fetch(
            `http://${import.meta.env.VITE_API_URL}/2fa`,
            options
        );
        if (!res.ok) throw new Error("could not activate 2fa");
        Cookies.remove("isSignedIn");
        Cookies.remove("Token");
        setIsSignedIn(false);
    }

    async function disable2FA(e: any) {
        e.preventDefault();
        const token = Cookies.get("Token");
        const options = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await fetch(
            `http://${import.meta.env.VITE_API_URL}/disable2fa`,
            options
        );
        if (!res.ok) throw new Error("Could not disable 2fa");
    }

    function handleClick2fa() {
        setClicked2fa(!clicked2fa);
    }

    async function changeAvatar(e: any) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", newAvatar);
        const options = {
            method: "PUT",
            headers: { Authorization: `Bearer ${Cookies.get("Token")}` },
            body: formData,
        };
        fetch(
            `http://${import.meta.env.VITE_API_URL}/profile/updatephoto`,
            options
        )
            .then((res) => res.json())
            .then(() => location.reload());
    }

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
            `http://${import.meta.env.VITE_API_URL}/profile/updatename`,
            options
        );
        if (!res.ok) throw new Error("failed to change name");
    }

    function updateAvatar(e: any) {
        const selectedFile = e.target.files[0];
        setNewAvatar(selectedFile);
    }

    const notify = () => toast.success("2fa enabled succefully");

    let { preference } = user;
    const [preferences, setPreferences] = useState({
        paddle: preference.paddleColor,
        ball: preference.ballColor,
        background: preference.mapTheme,
    });
    // console.log("preferences: ", preferences);

    function handlePreferenceChange(e: any) {
        setPreferences((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    }

    const updatePreference = async () => {
        console.log({preferences});
        const options = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: Number(user.id),
                paddleColor: String(preferences.paddle),
                mapTheme: String(preferences.background),
                ballColor: String(preferences.ball),
            })
        };
        const res = await fetch(
            `http://${import.meta.env.VITE_API_URL}/pref/update`,
            options
        );
        if (res.ok)
            console.log('ok')

    }

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
                    <button className="settings-btn" onClick={disable2FA}>
                        disable 2FA
                    </button>
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
                    <input
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={updateAvatar}
                    />
                    <button className="upload-btn">Upload</button>
                </form>
            </div>
            <div className="settings-update-wrapper">
                <div className="settings--header">
                    <p>Game Preferences</p>
                </div>
                <form
                    onSubmit={(e) => {
                        // TODO: sent the form data to the backend
                        e.preventDefault();
                        updatePreference();
                    }}
                    className="settings--update-avatar"
                    style={{ display: "flex", flexDirection: "column" }}
                >
                    <div
                        className="inputs"
                        style={{ display: "flex", gap: "5px", width: "100%" }}
                    >
                        <Customizer
                            setValue={handlePreferenceChange}
                            name="paddle"
                            value={preferences.paddle}
                        />
                        <Customizer
                            name="background"
                            value={preferences.background}
                            setValue={handlePreferenceChange}
                        />
                        <Customizer
                            name="ball"
                            value={preferences.ball}
                            setValue={handlePreferenceChange}
                        />
                    </div>
                    <button className="button">save</button>
                </form>
            </div>

            <div className="settings-update-wrapper">
                <div className="settings--header">
                    <img src={updateNameIcon} alt="" />
                    <p>update name</p>
                </div>
                <form onSubmit={changeName} className="settings--update-name">
                    <input
                        maxLength={10}
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

function Customizer({
    name,
    setValue,
    value,
}: {
    name: string;
    value: string;
    setValue(val: any): any;
}) {
    return (
        <div style={{ width: "100%" }} className="customizer">
            <p>{name} color:</p>
            <input
                onChange={(e: any) => setValue(e)}
                style={{ border: "1px solid black" }}
                type="color"
                name={name}
                value={value}
                className="twofactor-input"
            />
        </div>
    );
}
