import "./SignIn.css";
import background from '../../assets/signin-img.jpg'
function SignIn() {
    return (
        <div className="signin">
            <div className="signin-wrapper">
                <div className="signin-left">
                    <h2>Welcome</h2>
                    <p>Please Signin To continue</p>
                    <a href="http://localhost:3001/login">
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
        // <div className="signin-page">
        //     <h2>Welcome Please Signin To continue</h2>
        //     <a href="#">
        //         <button>Sign in using 42 intra</button>
        //     </a>
        // </div>
    );
}

export default SignIn;
