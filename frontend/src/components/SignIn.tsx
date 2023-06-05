
import { useParams } from 'react-router-dom';

function SignIn() {
    console.log(useParams())
    function handleClick(event) {
        console.log("signed in");
    }
    return (
        <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e0bc7fc2d53e935d53595b6c4904218ea29a489ac3598d3a59a526dfa070a406&redirect_uri=http%3A%2F%2Flocalhost%3A5173&response_type=code">
            <button onClick={handleClick}>Sign in using 42 intra</button>
        </a>
    );
}

export default SignIn;
