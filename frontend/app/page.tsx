"use client";

import { useEffect, useState } from "react";

type Skill = {
  id: number;
  title: string;
  icon: string;
  order: number;
  lessons: number;
  completed_lessons: number;
  crown_level: number;
  status: "locked" | "available" | "completed";
  first_lesson_id: number;
};

type Unit = {
  id: number;
  title: string;
  description: string;
  skills: Skill[];
};

type Course = {
  id: number;
  name: string;
  language: string;
  units: Unit[];
};

type User = {
  id: number;
  name: string;
  username: string;
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
  daily_goal: number;
  daily_xp: number;
};

export default function Home() {
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/1`).then((res) =>
        res.json()
      ),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`).then((res) =>
        res.json()
      ),
    ]).then(([courseData, userData]) => {
      setCourse(courseData);
      setUser(userData);
    });
  }, []);

  if (!course || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center font-bold">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      {/* TOP BAR */}
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-2xl font-black text-[#58cc02]"
          >
            DuoLearn
          </button>

          <div className="flex items-center gap-5 font-black">
  <button onClick={() => (window.location.href = "/profile")}>
    👤
  </button>

  <button onClick={() => (window.location.href = "/leaderboard")}>
    🏆
  </button>

  <button onClick={() => (window.location.href = "/settings")}>
    ⚙️
  </button>

  <span>🔥 {user.streak}</span>
  <span>⭐ {user.xp}</span>
  <span>❤️ {user.hearts}</span>
  <span>💎 {user.gems}</span>
</div>
        </div>
      </header>

      {/* COURSE HEADER */}
      <section className="mx-auto max-w-3xl px-6 pt-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase text-gray-400">
            {course.name} course
          </p>

          <h1 className="mt-1 text-3xl font-black">
            Learn {course.language}
          </h1>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm font-black">
              <span>Daily goal</span>
              <span>
                {user.daily_xp}/{user.daily_goal} XP
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#58cc02] transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (user.daily_xp / user.daily_goal) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING PATH */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        {course.units.map((unit, unitIndex) => (
          <section key={unit.id} className="mb-16">
            {/* UNIT HEADER */}
            <div className="mb-10 rounded-3xl bg-[#58cc02] p-6 text-white shadow-[0_5px_0_#46a302]">
              <p className="text-sm font-black uppercase opacity-80">
                Unit {unitIndex + 1}
              </p>

              <h2 className="mt-1 text-2xl font-black">
                {unit.title}
              </h2>

              <p className="mt-1 font-semibold opacity-90">
                {unit.description}
              </p>
            </div>

            {/* SKILL PATH */}
            <div className="relative flex flex-col items-center gap-10">
              {unit.skills.map((skill, index) => {
                const locked = skill.status === "locked";
                const completed = skill.status === "completed";

                return (
                  <div
                    key={skill.id}
                    className={`relative flex w-full max-w-md ${
                      index % 2 === 0
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    {/* PATH LINE */}
                    {index < unit.skills.length - 1 && (
                      <div
                        className={`absolute top-24 h-10 w-1 ${
                          completed
                            ? "bg-[#58cc02]"
                            : "bg-gray-300"
                        } ${
                          index % 2 === 0
                            ? "left-[25%]"
                            : "right-[25%]"
                        }`}
                      />
                    )}

                    {/* SKILL CARD */}
                    <div className="w-64 text-center">
                      <button
                        disabled={locked}
                        onClick={() =>
                          (window.location.href = `/lesson/${skill.first_lesson_id}`)
                        }
                        className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-4xl transition ${
                          completed
                            ? "bg-[#58cc02] shadow-[0_7px_0_#46a302]"
                            : locked
                            ? "cursor-not-allowed bg-gray-300 shadow-[0_7px_0_#aaa]"
                            : "bg-[#58cc02] shadow-[0_7px_0_#46a302] hover:scale-105"
                        }`}
                      >
                        {locked
                          ? "🔒"
                          : completed
                          ? "👑"
                          : skill.icon}
                      </button>

                      <h3 className="mt-4 font-black">
                        {skill.title}
                      </h3>

                      <p className="mt-1 text-sm font-bold text-gray-500">
                        {completed
                          ? "Completed"
                          : locked
                          ? "Locked"
                          : `${skill.completed_lessons}/${skill.lessons} lessons`}
                      </p>

                      {!locked && (
                        <div className="mt-2 flex justify-center gap-1">
                          {[1, 2, 3, 4, 5].map((crown) => (
                            <span
                              key={crown}
                              className={
                                crown <= skill.crown_level
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            >
                              👑
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}

