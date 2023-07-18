import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./TwoFactor.css";

export default function TwoFactor() {
    const navigator = useNavigate();
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${Cookies.get("Token")}`,
        },
    };
    useEffect(() => {
        fetch("http://localhost:3000/user", options)
            .then((res) => {
                if (res.ok) return res.json();
                else navigator("/signin");
            })
            .then((data) => {
                if (data.isSignedIn) navigator("/");
            });
    }, []);

    let [code, setCode] = useState("");
    const [validated, setValidated] = useState(false);
    if (validated) return <Navigate to={"/"} />;
    async function handleSubmit(e: any) {
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
        <div className="twofactor">
            <form className="twofactor-form" onSubmit={handleSubmit} action="">
                <label>Insert the code sent to your email</label>
                <input
                    className="twofactor-input"
                    onChange={(e: any) => setCode(e.target.value)}
                    value={code}
                    type="text"
                    placeholder="xxxxxx"
                />
                <button className="button">Submit</button>
            </form>
        </div>
    );
}
