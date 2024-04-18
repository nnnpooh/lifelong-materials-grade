"use client";
import { useState, ChangeEvent } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function Home() {
  const [midtermStr, setMidtermStr] = useState("");
  const [quizStr, setQuizStr] = useState("15");
  const [data, setData] = useState<ReturnType<typeof calcGrade> | null>(null);
  const [parent] = useAutoAnimate(/* optional config */);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    if (!name || !value) return null;
    setData(null);
    if (name === "midterm") {
      setMidtermStr(value);
    } else if (name === "quiz") {
      setQuizStr(value);
    }
  }

  function handleSubmit() {
    if (midtermStr == "" || quizStr == "") {
      alert("Please input both scores.");
      return null;
    }
    const midterm = parseFloat(midtermStr);
    const quiz = parseFloat(quizStr);

    if (midterm < 0 || midterm > 40) {
      alert("Midterm score must be 0-40.");
      return null;
    }

    if (quiz < 0 || quiz > 15) {
      alert("Quiz score must be 0-15.");
      return null;
    }
    const data = calcGrade(midterm, quiz);
    setData(data);
  }

  function handleReset() {
    setData(null);
    setMidtermStr("");
    setQuizStr("15");
  }

  return (
    <div className="container mt-4">
      <h1>Lifelong Materials: Grade Calculation</h1>

      {/* Form */}
      <article>
        <div>
          <label htmlFor="midterm">คะแนนสอบกลางภาค (0%-40%)</label>
          <input
            type="number"
            name="midterm"
            value={midtermStr}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label htmlFor="quiz">คะแนน Quiz (0%-15%)</label>
          <input
            type="number"
            name="quiz"
            value={quizStr}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </article>

      {/* Result */}
      <div ref={parent}>
        {data && (
          <div>
            <article>
              <h3>Prediction</h3>
              <div>
                ถ้าคุณทำไฟนอลได้เปอร์เช็นต์เท่ากับเปอร์เซ็นต์ของมิดเทอม (
                {data.midtermPercent}%) คุณจะได้เกรด: {data.gradeLetter}
              </div>
            </article>

            <article>
              <h3>Grade Target</h3>
              <table>
                <thead>
                  <tr>
                    <th>เกรดที่อยากจะได้</th>
                    <th>คะแนนไฟนอลที่ต้องทำได้ (Max 45)</th>
                    <th>เปอร์เซ็นต์คะแนนข้อสอบไฟนอล (Max 100%)</th>
                  </tr>
                </thead>
                <tbody>
                  {(["A", "B+", "B", "C"] as const).map((gr) => (
                    <tr>
                      <td>{gr}</td>
                      <td>
                        {data.finalTargetScores[gr] !== -1000
                          ? data.finalTargetScores[gr]
                          : "-"}
                      </td>
                      <td>
                        {data.finalTargetPercents[gr] !== -1000
                          ? `${data.finalTargetPercents[gr]}%`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}

function calcGrade(midterm: number, quiz: number) {
  const gradeCeiling = {
    A: 72.99,
    "B+": 67.64,
    B: 62.3,
    "C+": 56.95,
    C: 51.6,
    "D+": 46.26,
    D: 40.91,
  };

  const midtermPercent = rounded((midterm / 40) * 100);
  const totalScoreAdjusted = (midterm / 40) * 85 + quiz;

  let gradeLetter = "";
  if (totalScoreAdjusted > gradeCeiling["A"]) {
    gradeLetter = "A";
  } else if (totalScoreAdjusted > gradeCeiling["B+"]) {
    gradeLetter = "B+";
  } else if (totalScoreAdjusted > gradeCeiling["B"]) {
    gradeLetter = "B";
  } else if (totalScoreAdjusted > gradeCeiling["C+"]) {
    gradeLetter = "C+";
  } else if (totalScoreAdjusted > gradeCeiling["C"]) {
    gradeLetter = "C";
  } else if (totalScoreAdjusted > gradeCeiling["D+"]) {
    gradeLetter = "D+";
  } else if (totalScoreAdjusted > gradeCeiling["D"]) {
    gradeLetter = "D";
  } else {
    gradeLetter = "F";
  }

  const gradeLetters = ["A", "B+", "B", "C+", "C", "D+", "D"] as const;
  const finalTargetScores = {} as typeof gradeCeiling;
  const finalTargetPercents = {} as typeof gradeCeiling;
  gradeLetters.forEach((gl) => {
    const totalScore = gradeCeiling[gl];

    let finalTargetScore = totalScore - (quiz + midterm);
    let finalTargetPercent = (finalTargetScore / 45) * 100;
    if (finalTargetScore > 45) {
      finalTargetScore = -1000;
      finalTargetPercent = -1000;
    } else if (finalTargetScore < 0) {
      finalTargetScore = -1000;
      finalTargetPercent = -1000;
    }

    finalTargetScore = rounded(finalTargetScore);
    finalTargetPercent = rounded(finalTargetPercent);

    finalTargetScores[gl] = finalTargetScore;
    finalTargetPercents[gl] = finalTargetPercent;
  });

  return {
    gradeLetter,
    finalTargetScores,
    finalTargetPercents,
    midtermPercent,
  };
}

function rounded(n: number) {
  return Number((Math.round(n * 100) / 100).toFixed(1));
}
