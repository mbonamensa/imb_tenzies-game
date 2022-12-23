


function ScoresOverlay(props) {

    const bestTime = props.bestTime > 60 ? `${Math.floor(props.bestTime / 60)}m ${props.bestTime % 60}s` : `${props.bestTime}s `

    return (
        <div className="overlay">
            <h2>&#127881; You won! &#127881;</h2>
            <div className="score-details">
                <table>
                    <caption>Score details</caption>
                    <tbody>
                        <tr>
                        <td>&#9200; Time taken:</td>
                        <td>{props.minutes}m {props.seconds}s</td>
                        </tr>
                        <tr>
                        <td>&#127922; Number of rolls:</td>
                        <td>{props.rolls}</td>
                        </tr>
                        <tr>
                        <td>&#127941; Best time:</td>
                        <td>{bestTime}</td>
                        </tr>
                        <tr>
                        <td>&#127942; Best Number of rolls:</td>
                        <td>{props.bestRoll}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="overlay-btns">
                <button onClick={props.newGame} className="new-game">New Game</button>
                <button onClick={props.resetScores} className="reset-scores">Reset Scores</button>
            </div>
        </div>  
    )
}
 
 
 

 
export default ScoresOverlay