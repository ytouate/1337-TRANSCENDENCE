import './Settings.css'
import ytouate from '../../assets/ytouate.jpeg'
export default function() {
    return (
        <div className="settings">
            <div className="settings-delete-avatar">
                <button className='settings-btn'>Delete Avatar</button>
                <button className='settings-btn'>enable 2FA</button>
            </div>
            <form className="settings--update-avatar">
                <img className='settings--avatar' src={ytouate} alt="" />
                <input type="file" />
                <button className='upload-btn'>Upload</button>
            </form>
            <form className="settings--update-name">
                <input className='name-field' type="text" />
                <button className='change-name-btn'>Change</button>
            </form>
        </div>
    )
}