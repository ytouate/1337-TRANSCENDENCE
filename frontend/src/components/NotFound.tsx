import { Link } from "react-router-dom";

function NotFound({ message }: { message: string }) {
    return (
        <div className="not-found">
            <h3>{message}</h3>
            <Link className="back-link" to="/">
                Let's go back
            </Link>
        </div>
    );
}

export default NotFound;
