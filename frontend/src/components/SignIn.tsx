import { Link } from "react-router-dom";

function SignIn() {
    return (
        <div className="signin-page">
            <h2>Welcome Please Signin To continue</h2>
            <a href="http://localhost:3000/signin">
                <button>Sign in using 42 intra</button>
            </a>
        </div>
    );
}

export default SignIn;
