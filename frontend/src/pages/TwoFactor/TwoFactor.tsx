import { useState } from "react";
import Cookies from "js-cookie";
import { Navigate, redirect } from "react-router-dom";
export default function TwoFactor() {
    let [code, setCode] = useState("");
    let [success, setSuccess] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        const options = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: code }),
        };
        const res = await fetch(
            "http://localhost:3000/2fa/validateCode",
            options
        );
        console.log(res.json())
        if (res.ok) setSuccess(true);
    }
    if (success) return <Navigate to="/" />;
    return (
        <form onSubmit={handleSubmit} action="">
            Insert the Code:{" "}
            <input
                onChange={(e: any) => setCode(e.target.value)}
                value={code}
                type="text"
            />
            <button>Submit</button>
        </form>
    );
}
