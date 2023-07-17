import { useContext, useState } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { authContext } from "../../context/Context";
export default function TwoFactor() {
    let [code, setCode] = useState("");
    const [validated, setValidated] = useState(false);
    if (validated) return <Navigate to={'/'} />
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
        if (res.ok) setValidated(true);

    }
    
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
