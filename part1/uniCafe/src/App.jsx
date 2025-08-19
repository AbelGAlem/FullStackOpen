import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const StatisticsLine = ({text, value}) => <p>{text} {value}</p>

const Statistics = ({good, neutral, bad, sum, postive, average}) => {
  if (good == 0 && neutral == 0 && bad == 0){
    return (
      <p>No Feedback Given.</p>
    )
  }
  return (
    <>
      <StatisticsLine text="Good" value={good} />
      <StatisticsLine text="Neutral" value={neutral} />
      <StatisticsLine text="Bad" value={bad} />
      <StatisticsLine text="All" value={sum} />
      <StatisticsLine text="Average" value={average.toFixed(1)} />
      <StatisticsLine text="Postive" value={`${postive.toFixed(1)} %`} />
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const [sum, setSum] = useState(0)
  const [average, setAverage] = useState(0)
  const [postive, setPostive] = useState(0)

  const handleGoodClick = () => {
    console.log("good click")
    const updatedGood = good + 1
    const updatedSum = updatedGood + neutral + bad
    setGood(updatedGood)
    setSum(updatedSum)
    setAverage((updatedGood - bad) / updatedSum)
    setPostive((updatedGood/updatedSum) * 100)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    const updatedSum = good + updatedNeutral + bad
    setNeutral(updatedNeutral)
    setSum(updatedSum)
    setAverage((good - bad) / updatedSum)
    setPostive((good/updatedSum) * 100)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    const updatedSum = good + neutral + updatedBad
    setBad(updatedBad)
    setSum(updatedSum)
    setAverage((good - updatedBad) / updatedSum)
    setPostive((good/updatedSum) * 100)
  }

  return (
    <>
      <h1>Give Feedback</h1>
      <Button onClick={handleGoodClick} text="Good" />
      <Button onClick={handleNeutralClick} text="Neutral" />
      <Button onClick={handleBadClick} text="Bad" />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} sum={sum} average={average} postive={postive} />
    </>
  )
}

export default App

// const App = () => {
//   // save clicks of each button to its own state
//   const [good, setGood] = useState(0)
//   const [neutral, setNeutral] = useState(0)
//   const [bad, setBad] = useState(0)

//   const sum = good + neutral + bad
//   const average = (good-bad)/sum 
//   const postive = (good/sum) * 100

//   return (
//     <>
//       <h1>Give Feedback</h1>
//       <Button onClick={() => setGood(good + 1)} text="Good" />
//       <Button onClick={() => setNeutral(neutral + 1)} text="Neutral" />
//       <Button onClick={() => setBad(bad + 1)} text="Bad" />
//       <h1>Statistics</h1>
//       <Statistics good={good} neutral={neutral} bad={bad} sum={sum} average={average} postive={postive} />
//     </>
//   )
// }

// export default App