import "./SignIn.css";
import background from "../../assets/signin-img.jpg";
import { useContext } from "react";
import { authContext } from "../../context/Context";
import { Navigate } from "react-router-dom";

function SignIn() {
    const [isSignedIn]: any = useContext(authContext);
    if (isSignedIn) return <Navigate to="/" />;

    return (
        <div className="signin">
            <div className="signin-wrapper">
                <div className="signin-left">
                    <h2>Welcome</h2>
                    <p>Please Signin To continue</p>
                    <a href={`http://${import.meta.env.VITE_API_URL}/login`}>
                        <button className="signin-btn">
                            Sign in using 42 intra
                        </button>
                    </a>
                </div>
                <div className="signin-right">
                    <img src={background} alt="" />
                </div>
            </div>
        </div>
    );
}

export default SignIn;
