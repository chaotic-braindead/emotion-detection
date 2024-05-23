import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"

function GameOver(){
    let location = useLocation()
    let navigate = useNavigate();
    const score = location.state === null ? 0 : location.state.score
    useEffect(() => {
        if(score === 0){
            navigate('/');
        }
    }, [navigate, score])

    return (
        <>
            <h1>Game Over</h1>
            <h2>Points: {score}</h2>
        </>
    )
}

export default GameOver