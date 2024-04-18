"use client"
import { useState, ChangeEvent } from 'react'


export default function Home() {

  const [midtermStr, setMidtermStr] = useState('')
  const [quizStr, setQuizStr] = useState('')


  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name
    const value = e.target.value
    if (!name || !value) return null
    if (name === 'midterm') {
      setMidtermStr(value)
    } else if (name === 'quiz') {
      setQuizStr(value)
    }
  }


  function handleSubmit() {


    if (midtermStr == '' || quizStr == '') {
      return null
    }
    const midterm = parseFloat(midtermStr)
    const quiz = parseFloat(quizStr)

    if (midterm < 0 || midterm > 40) {
      return null
    }

    if (quiz < 0 || quiz > 15) {
      return null
    }


  }


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="midterm">คะแนนสอบกลางภาค (0%-40%)</label>
        <input type="number" name="midterm" value={midtermStr} onChange={(e) => handleChange(e)} />
      </div>
      <div>
        <label htmlFor="quiz">คะแนน Quiz (0%-15%)</label>
        <input type="number" name="quiz" value={quizStr} onChange={(e) => handleChange(e)} />
      </div>
      <div><button type="submit">Submit</button></div>
      <div>

        <p>

          {midtermStr} {quizStr}
        </p>

      </div>


    </form>
  );
}


function calcGrade(
  midterm: number,
  quiz: number,
) {
  const gradeCeiling = {
    A: 71.79,
    "B+": 66.5,
    B: 61.21,
    "C+": 55.92,
    C: 50.63,
    "D+": 45.34,
    D: 40.05,
  }

  const totalScoreAdjusted = (midterm / 40) * 85 + quiz

  let gradeLetter = ""
  if (totalScoreAdjusted > gradeCeiling["A"]) {
    gradeLetter = "A"
  } else if (totalScoreAdjusted > gradeCeiling["B+"]) {
    gradeLetter = "B+"
  } else if (totalScoreAdjusted > gradeCeiling["B"]) {
    gradeLetter = "B"
  } else if (totalScoreAdjusted > gradeCeiling["C+"]) {
    gradeLetter = "C+"
  } else if (totalScoreAdjusted > gradeCeiling["C"]) {
    gradeLetter = "C"
  } else if (totalScoreAdjusted > gradeCeiling["D+"]) {
    gradeLetter = "D+"
  } else if (totalScoreAdjusted > gradeCeiling["D"]) {
    gradeLetter = "D"
  } else {
    gradeLetter = "F"
  }

  const gradeLetters = ["A", "B+", "B", "C+", "C", "D+", "D"] as const
  const finalTargetScores = {} as typeof gradeCeiling
  const finalTargetPercents = {} as typeof gradeCeiling
  gradeLetters.forEach((gl) => {
    const totalScore = gradeCeiling[gl]

    let finalTargetScore = totalScore - (quiz + midterm)
    if (finalTargetScore > 45) {
      finalTargetScore = 45
    }
    else if (finalTargetScore < 0) {
      finalTargetScore = 0
    }
    let finalTargetPercent = finalTargetScore / 45 * 100


    finalTargetScore = rounded(finalTargetScore)
    finalTargetPercent = rounded(finalTargetPercent)

    finalTargetScores[gl] = finalTargetScore
    finalTargetPercents[gl] = finalTargetPercent
  })


  return { gradeLetter, finalTargetScores, finalTargetPercents }
}

function rounded(n: number) {
  return Number((Math.round(n * 100) / 100).toFixed(1))
}
