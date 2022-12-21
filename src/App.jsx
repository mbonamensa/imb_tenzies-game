import { useEffect, useState } from "react";
import Die from "./Die";
import "./css/styles.css";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [width, height] = useWindowSize()


  useEffect(() => {

    const allHeldDice = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)

    if (allHeldDice && allSameValue) {
      setTenzies(true)
      console.log("You won!")
    }


  }, [dice])

  function generateDie() {
    const randomDie = Math.ceil(Math.random() * 6);
    return {
      value: randomDie,
      id: nanoid(),
      isHeld: false,
    }
  }

  function allNewDice() {
    const newDice = [];

    for (let i = 0; i < 10; i++) {
      newDice.push(generateDie());
    }

    return newDice;
  }

  function rollDice() {
    if (!tenzies){
      setDice(prevDice => prevDice.map(die => {
        return die.isHeld ? die : generateDie()
      }));
    }else {
      setTenzies(false)
      setDice(allNewDice())
    }
  }

  function holdDice(id) {
    setDice(prevDice => prevDice.map(die => {
      return die.id === id ?
        {...die, isHeld: !die.isHeld} :
        die
    }))
  }

  const diceElements = dice.map((die) => {
    return <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)}/>;
  });

  return (
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
      <button onClick={rollDice} className="roll-btn">
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
