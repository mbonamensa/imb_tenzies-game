import { useEffect, useState } from "react";
import Die from "./Die";
import "./css/styles.css";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import ScoresOverlay from "./ScoresOverlay";
import { useStopwatch } from "react-timer-hook";

function App() {
  const {
    seconds,
    minutes,
    pause,
    reset,
  } = useStopwatch({ autoStart: false })
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [startGame, setStartGame] = useState(false)
  const [rolls, setRolls] = useState(0)
  const [bestRoll, setBestRoll] = useState(() => JSON.parse(localStorage.getItem("bestRoll")) || rolls)
  const [width, height] = useWindowSize()
  const timeScore = (minutes * 60) + seconds 
  const [bestTime, sestBestTime] = useState(() => JSON.parse(localStorage.getItem("bestTime")) || timeScore)

  useEffect(() => {

    // check if all dice are held and have the same value
    const allHeldDice = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)

    if (allHeldDice && allSameValue) {
      setTenzies(true)
      setOverlay(true)
      setBestRoll(prevBestRoll => {

        const initialRolls = JSON.parse(localStorage.getItem("rolls"))

        if(prevBestRoll === 0) {
          return initialRolls
        }
        else if (prevBestRoll > initialRolls) {
          return initialRolls
        }else{
          return prevBestRoll
        }
      })

      sestBestTime(prevBestTime => {

        const initialTime = JSON.parse(localStorage.getItem("timeScore"))

        if(prevBestTime === 0) {
          return initialTime
        }else if(prevBestTime > initialTime) {
          return initialTime
        }else {
          return prevBestTime
        }
      })
      pause()
    }
  }, [dice])

  // save number of rolls and best number of rolls
  useEffect(() => {
    localStorage.setItem("rolls", JSON.stringify(rolls))
    localStorage.setItem("bestRoll", JSON.stringify(bestRoll))
  }, [rolls, bestRoll])

  // save time taken to complete game and best time taken to complete game
  useEffect(() => {
    localStorage.setItem("timeScore", JSON.stringify(timeScore))
    localStorage.setItem("bestTime", JSON.stringify(bestTime))
  }, [tenzies, timeScore, bestTime])

  // generate the die object
  function generateDie() {
    const randomDie = Math.ceil(Math.random() * 6);
    return {
      value: randomDie,
      id: nanoid(),
      isHeld: false,
    }
  }

  // generate 10 new dice and put in an array
  function allNewDice() {
    const newDice = [];

    for (let i = 0; i < 10; i++) {
      newDice.push(generateDie());
    }

    return newDice;
  }

  // roll dice, i.e generate new die if die is not held and update number of rolls
  function rollDice() {
    setDice(prevDice => prevDice.map(die => {
      return die.isHeld ? die : generateDie()
    }));
    setRolls(prevRolls => prevRolls + 1)
  }

  // hold die if it is clicked
  function holdDice(id) {
    setDice(prevDice => prevDice.map(die => {
      return die.id === id ?
        {...die, isHeld: !die.isHeld} :
        die
    }))
  }

  // reset game when new game is clicked
  function newGame() {
    setTenzies(false)
    setOverlay(false)
    setStartGame(false)
    setRolls(0)
    setDice(allNewDice())
  }

  // staet game again after game is reset
  function startTenzies() {
    setStartGame(true)
    setDice(allNewDice())
    reset()
  }

  // reset scores stored in local storage
  function resetScores() {
    localStorage.clear()
    setBestRoll(0)
    sestBestTime(0)
  }

  // map over dice array and display dice
  const diceElements = dice.map((die) => {
    return <Die 
        key={die.id} 
        value={die.value} 
        isHeld={die.isHeld} 
        holdDice={() => holdDice(die.id)}
        startGame={startGame}
    />;
  });

  return (
    <>
    {
      overlay && 
      <ScoresOverlay 
        newGame={newGame}
        rolls={rolls}
        bestRoll={bestRoll}
        seconds={seconds}
        minutes={minutes}
        bestTime={bestTime}
        resetScores={resetScores}
      />
    }
    <main>
      
      {tenzies && <Confetti width={width} height={height}/>}
      <div className="rules">
        <h1>Tenzies</h1>
        <p>
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
      </div>
      <div className="dice-container">{diceElements}</div>
      <button onClick={startGame ? rollDice : startTenzies} className="roll-btn">
        {startGame ? "Roll" : "Start Game"}
      </button>
    </main>
    </>
  );
}

export default App;
