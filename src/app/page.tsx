import Image from "next/image";

export default function Home() {
  return (
    <div>

      <div>
        <label htmlFor="midterm">คะแนนสอบกลางภาค</label>
        <input type="number" name="midterm" />
      </div>

      <div>
        <label htmlFor="midterm">Quiz</label>
        <input type="number" name="midterm" />
      </div>
      <div>

        <div></div>


      </div>


    </div>
  );
}


function calcGrade(
  midterm: number,
  attentdance: number,
  quiz: number,
  assignment: number
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

  let finalScoreNoF = 45 - (midterm + attentdance + quiz + assignment)
  let finalPercentNoF = (finalScoreNoF / 45) * 100
  finalScoreNoF = rounded(finalScoreNoF)
  finalPercentNoF = rounded(finalPercentNoF)

  if (finalScoreNoF < 0) {
    finalScoreNoF = 0
    finalPercentNoF = 0
  }

  const mean_current = 51.774912
  const mean_target = 55.92
  const std_current = 10.370103
  const std_target = 10.58

  const totalScore = (midterm / 40) * 85 + attentdance + quiz + assignment
  const totalScoreAdjusted =
    mean_target + ((totalScore - mean_current) * std_target) / std_current

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
    const totalScore =
      ((gradeCeiling[gl] - mean_target) * std_current) / std_target +
      mean_current

    let finalTargetScore = totalScore - (attentdance + quiz + assignment + midterm)
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


  return { gradeLetter, finalScoreNoF, finalPercentNoF, finalTargetScores, finalTargetPercents }
}

function rounded(n: number) {
  return Number((Math.round(n * 100) / 100).toFixed(1))
}
