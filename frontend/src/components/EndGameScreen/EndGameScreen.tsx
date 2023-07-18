import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EndGameScreen.css';
import defaultImage from '../../assets/ape.jpeg';

interface Props {
    username1: string;
    username2: string;
    score1: number;
    score2: number;
    resetState: (() => void) | null;
    urlImage1: string;
    urlImage2: string;
}

const EndGameScreen = ({
    username1,
    username2,
    score1,
    score2,
    resetState,
    urlImage1,
    urlImage2,
}: Props) => {
    const navigate = useNavigate();

    const onHomeClick = () => {
        if (resetState) navigate('/');
        else window.location.reload();
    };

    return (
        <div className='flex-container'>
            <div className='player-container'>
                <div className='players-wrapper'>
                    <div className='player'>
                        {score1 > score2 && (
                            <span className='winner-label'>WINNER</span>
                        )}
                        <div className='player-image-container'>
                            <img
                                src={urlImage1}
                                alt='Player 1'
                                className='player-image'
                            />
                        </div>
                        <span className='player-text'>{username1}</span>
                        <span className='score'>{score1}</span>
                    </div>
                    <div className='vs'>VS</div>
                    <div className='player'>
                        {score2 > score1 && (
                            <span className='winner-label'>WINNER</span>
                        )}
                        <div className='player-image-container'>
                            <img
                                src={
                                    urlImage2 === '' ? defaultImage : urlImage2
                                }
                                alt='Player 2'
                                className='player-image'
                            />
                        </div>
                        <span className='player-text'>{username2}</span>
                        <span className='score'>{score2}</span>
                    </div>
                </div>
                <div className='flex flex-col mt-8'>
                    <button className='game-button' onClick={onHomeClick}>
                        {resetState ? 'HOME' : 'GO BACK'}
                    </button>
                    {resetState && (
                        <button
                            className='game-button play-again-button'
                            onClick={resetState}
                        >
                            PLAY AGAIN
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EndGameScreen;
