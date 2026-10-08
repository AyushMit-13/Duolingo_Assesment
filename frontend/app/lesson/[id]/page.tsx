"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function LessonPage() {
  const params = useParams<{ id: string }>();
  const lessonId = params.id;

 
type Exercise = {
  id: number;
  type: string;
  question: string;
  answer: string;
  options: string | null;
  pairs: string | null;
};

type Lesson = {
  id: number;
  title: string;
  xp_reward: number;
  exercises: Exercise[];
};



  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [typed, setTyped] = useState("");
  const [feedback, setFeedback] = useState("");
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lessonId}`)
      .then((res) => res.json())
      .then((data) => setLesson(data));
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center font-bold">
        Loading lesson...
      </div>
    );
  }

  if (finished) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="text-7xl">🎉</div>

          <h1 className="mt-6 text-4xl font-black text-[#58cc02]">
            Lesson Complete!
          </h1>

          <p className="mt-3 text-gray-500">
            Great job! You finished {lesson.title}.
          </p>

          <div className="my-8 rounded-2xl bg-[#fff7d6] p-5">
            <p className="text-sm font-bold text-gray-500">XP EARNED</p>
            <p className="text-4xl font-black text-[#ff9600]">
              +{xp} XP
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full rounded-xl bg-[#58cc02] py-4 font-black text-white shadow-[0_5px_0_#46a302]"
          >
            CONTINUE
          </button>
        </div>
      </main>
    );
  }

  const exercise = lesson.exercises[current];
  const progress = ((current + 1) / lesson.exercises.length) * 100;

  const options = exercise.options
    ? JSON.parse(exercise.options)
    : [];

  function checkAnswer(answer: string) {
    if (feedback) return;

    let correct = false;

    if (exercise.type === "type_answer") {
      correct =
        answer.trim().toLowerCase() === exercise.answer.trim().toLowerCase();
    } else {
      correct =
        answer.trim().toLowerCase() === exercise.answer.trim().toLowerCase();
    }

    if (correct) {
      setFeedback("correct");
      setXp((value) => value + 5);
    } else {
      setFeedback("wrong");

setHearts((value) => Math.max(0, value - 1));

fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/use-heart`, {
  method: "POST",
});
    }
  }

  function nextExercise() {
    if (current === lesson.exercises.length - 1) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lesson.id}/complete`, {
        method: "POST",
      });

      setFinished(true);
      return;
    }

    setCurrent((value) => value + 1);
    setSelected("");
    setTyped("");
    setFeedback("");
  }

  function renderExercise() {
    if (exercise.type === "multiple_choice") {
      return (
        <div>
          <div className="mb-8 text-2xl font-black">
            {exercise.question}
          </div>

          <div className="grid gap-3">
            {options.map((option: string) => (
              <button
                key={option}
                onClick={() => {
                  setSelected(option);
                  checkAnswer(option);
                }}
                className={`rounded-xl border-2 p-4 text-left font-bold transition ${
                  selected === option
                    ? "border-[#58cc02] bg-[#eaffdf]"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (exercise.type === "translate") {
      return (
        <div>
          <div className="mb-8 text-2xl font-black">
            {exercise.question}
          </div>

          <div className="mb-5 flex min-h-16 flex-wrap gap-2 rounded-xl border-2 border-dashed border-gray-300 p-3">
            {selected && (
              <span className="rounded-lg bg-[#ddf4ff] px-4 py-2 font-bold">
                {selected}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {options.map((option: string) => (
              <button
                key={option}
                onClick={() => {
                  const answer =
                    selected === ""
                      ? option
                      : `${selected} ${option}`;

                  setSelected(answer);
                  checkAnswer(answer);
                }}
                className="rounded-xl border-2 border-gray-200 bg-white px-5 py-3 font-bold shadow-sm hover:bg-gray-50"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (exercise.type === "fill_blank") {
      return (
        <div>
          <div className="mb-8 text-2xl font-black">
            {exercise.question}
          </div>

          <div className="grid gap-3">
            {options.map((option: string) => (
              <button
                key={option}
                onClick={() => {
                  setSelected(option);
                  checkAnswer(option);
                }}
                className="rounded-xl border-2 border-gray-200 bg-white p-4 text-left font-bold hover:bg-gray-50"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (exercise.type === "type_answer") {
      return (
        <div>
          <div className="mb-8 text-2xl font-black">
            {exercise.question}
          </div>

          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkAnswer(typed);
              }
            }}
            placeholder="Type your answer..."
            className="w-full rounded-xl border-2 border-gray-300 p-4 text-lg outline-none focus:border-[#58cc02]"
          />

          {!feedback && (
            <button
              onClick={() => checkAnswer(typed)}
              disabled={!typed.trim()}
              className="mt-4 w-full rounded-xl bg-[#58cc02] py-4 font-black text-white disabled:opacity-50"
            >
              CHECK
            </button>
          )}
        </div>
      );
    }

    if (exercise.type === "match_pairs") {
      const pairs = exercise.pairs ? JSON.parse(exercise.pairs) : [];

      return (
        <div>
          <div className="mb-8 text-2xl font-black">
            {exercise.question}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {pairs.map((pair: any) => (
              <button
                key={pair.left}
                onClick={() => {
                  setSelected(pair.left);
                  checkAnswer("");
                }}
                className="rounded-xl border-2 border-gray-200 bg-white p-4 font-bold"
              >
                {pair.left}
                <span className="mt-1 block text-sm text-gray-500">
                  {pair.right}
                </span>
              </button>
            ))}
          </div>

          {!feedback && (
            <button
              onClick={() => {
                setFeedback("correct");
                setXp((value) => value + 5);
              }}
              className="mt-6 w-full rounded-xl bg-[#58cc02] py-4 font-black text-white"
            >
              CONTINUE
            </button>
          )}
        </div>
      );
    }

    return <p>Unsupported exercise type</p>;
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-5 px-6 py-5">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-2xl font-bold text-gray-400"
          >
            ✕
          </button>

          <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#58cc02] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="font-black text-red-500">
            ❤️ {hearts}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-gray-400">
              {lesson.title}
            </p>

            <p className="font-bold text-gray-500">
              Question {current + 1} of {lesson.exercises.length}
            </p>
          </div>

          <div className="rounded-full bg-[#fff7d6] px-4 py-2 font-black text-[#ff9600]">
            ⭐ {xp} XP
          </div>
        </div>

        {renderExercise()}
        {hearts === 0 && !finished && (
  <div className="mt-8 rounded-2xl border-2 border-red-200 bg-red-50 p-6 text-center">
    <div className="text-4xl">💔</div>

    <h2 className="mt-3 text-xl font-black">
      Out of hearts!
    </h2>

    <p className="mt-1 text-gray-500">
      Refill your hearts and keep learning.
    </p>

    <button
      onClick={() => {
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/restore-hearts`,
          {
            method: "POST",
          }
        );

        setHearts(5);
      }}
      className="mt-5 rounded-xl bg-[#58cc02] px-8 py-3 font-black text-white shadow-[0_4px_0_#46a302]"
    >
      ❤️ REFILL HEARTS
    </button>
  </div>
)}
      </section>

      {feedback && (
        <div
          className={`fixed bottom-0 left-0 right-0 border-t px-6 py-5 ${
            feedback === "correct"
              ? "bg-[#d7ffb8]"
              : "bg-[#ffdfe0]"
          }`}
        >
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <div>
              <p
                className={`text-xl font-black ${
                  feedback === "correct"
                    ? "text-[#58a700]"
                    : "text-red-600"
                }`}
              >
                {feedback === "correct"
                  ? "Excellent! 🎉"
                  : "Not quite! 💔"}
              </p>

              {feedback === "wrong" && (
                <p className="font-bold text-red-500">
                  Correct answer: {exercise.answer}
                </p>
              )}
            </div>

            <button
              onClick={nextExercise}
              className={`rounded-xl px-8 py-3 font-black text-white ${
                feedback === "correct"
                  ? "bg-[#58cc02]"
                  : "bg-red-500"
              }`}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </main>
  );
}