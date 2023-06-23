import gif from '../assets/error404-chad.gif'
import {Link} from 'react-router-dom'

function NotFound() {
    return ( 
        <div className="not-found">
            <h2>Page Not Found</h2>
            <img src={gif} alt="" />
            <Link className='back-link' to='/'>Let's go back</Link>
        </div>
    );
}

export default NotFound;