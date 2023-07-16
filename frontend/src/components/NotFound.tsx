
import {Link} from 'react-router-dom'

function NotFound({message}: any) {
    return ( 
        <div className="not-found">
            <h2>{message}</h2>
            <Link className='back-link' to='/'>Let's go back</Link>
        </div>
    );
}

export default NotFound;