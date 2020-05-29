import React, { useEffect, useState, useCallback } from 'react';
import { useStopwatch } from 'react-timer-hook'
import { useSpeechSynthesis } from 'react-speech-kit'
import './App.css';

export default function App() {
  
  const { seconds, isRunning, start, reset } = useStopwatch();
  const { speak, supported } = useSpeechSynthesis();

  const [data, setData] = useState([
    {timer: 2, name: 'Write here '}
  ])

  const doReset = useCallback(() => reset(), [])
  const doSpeak = useCallback((text) => speak({text: text}), [])

  useEffect(() => {

    const result = data.find((item) => {
      return item.timer === seconds
    })

    if (result) {
      doSpeak(result.name)
    }

    if (seconds > data[data.length - 1].timer) {
      doReset()
    }

  }, [data, seconds, doSpeak, doReset])

  const onChangeHandler = (e, index) => {
    const dataClone = data.concat()
    const element = dataClone.find((item, idx) => {
      return idx === index
    })

    if (e.target.type === 'text') element.name = e.target.value
    if (e.target.type === 'number') element.timer = ++e.target.value

    dataClone[index] = element
    setData(dataClone)
  }

  const addNewTimer = () => {
    const newData = [...data, {timer: 10, name: 'Enter here your message'}]
    setData(newData)
  }

  return (
    <div className="app">
      <h2>Talk the Talk</h2>

      {!supported && <h1>Sorry, your browser is not supported this application.</h1>}

      <div className="timers">
        {/* timers go here */}
          {
            data.map((element, index) => {
              return(
                <form key={index} className="timer">
                  <input onChange={(e) => onChangeHandler(e, index)} type="number" defaultValue={element.timer}/>
                  <input onChange={(e) => onChangeHandler(e, index)} type="text" defaultValue={element.name}/>
                </form>
              )
            })
          }


        <button onClick={() => addNewTimer()} className="add-button">Add</button>
      </div>

      {/* seconds */}
      <h2>{seconds}</h2>

      {/* buttons */}
      <div className="buttons">
        {!isRunning && <button onClick={() => start()} className="start-button">Start</button> }
        {isRunning && <button onClick={() => reset()} className="stop-button">Stop</button> }
      </div>
    </div>
  );
}
