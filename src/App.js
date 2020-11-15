import React, { useEffect, useState, useCallback } from 'react'
import { useStopwatch } from 'react-timer-hook'
import { useSpeechSynthesis } from 'react-speech-kit'
import './App.css'

export default function App() {
	// Simple timer
	const { seconds, isRunning, start, reset } = useStopwatch()

	// Speach API
	const { speak, supported } = useSpeechSynthesis()

	// Initial State for render
	const [data, setData] = useState([{ timer: 2, name: 'Write here ' }])

	// Reset the timer
	const doReset = useCallback(() => reset(), [])

	// Start speaking
	const doSpeak = useCallback((text) => speak({ text: text }), [])

	useEffect(() => {
		// Compare the present count of seconds and the each timer in queue
		const result = data.find((item) => {
			return item.timer === seconds
		})

		// If time is has come
		if (result) {
			doSpeak(result.name)
		}

		// If timer has done
		if (seconds > data[data.length - 1].timer) {
			doReset()
		}
	}, [data, seconds, doSpeak, doReset])

	// Push new task to queue on speaking
	const onChangeHandler = (e, index) => {
		const dataClone = data.concat()
		const element = dataClone.find((item, idx) => {
			return idx === index
		})

		// Type cast
		if (e.target.type === 'text') element.name = e.target.value
		if (e.target.type === 'number') element.timer = ++e.target.value

		dataClone[index] = element
		setData(dataClone)
	}

	// Add new task to queue on speaking
	const addNewTimer = () => {
		const newData = [
			...data,
			{ timer: 10, name: 'Enter here your message' },
		]
		setData(newData)
	}

	return (
		<div className='app'>
			<h2>Talk the Talk</h2>

			{/* If user browser does not support speech api */}
			{!supported && (
				<h1>Sorry, your browser is not supported this application.</h1>
			)}

			<div className='timers'>
				{/* timers go here */}
				{data.map((element, index) => {
					return (
						<form key={index} className='timer'>
							<input
								onChange={(e) => onChangeHandler(e, index)}
								type='number'
								defaultValue={element.timer}
							/>
							<input
								onChange={(e) => onChangeHandler(e, index)}
								type='text'
								defaultValue={element.name}
							/>
						</form>
					)
				})}

				<button onClick={() => addNewTimer()} className='add-button'>
					Add
				</button>
			</div>

			{/* seconds */}
			<h2>{seconds}</h2>

			{/* buttons */}
			<div className='buttons'>
				{!isRunning && (
					<button onClick={() => start()} className='start-button'>
						Start
					</button>
				)}
				{isRunning && (
					<button onClick={() => reset()} className='stop-button'>
						Stop
					</button>
				)}
			</div>
		</div>
	)
}
