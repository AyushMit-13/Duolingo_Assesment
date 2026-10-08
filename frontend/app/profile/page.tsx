"use client";

import { useEffect, useState } from "react";

type User = {
  name: string;
  username: string;
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
  daily_goal: number;
  daily_xp: number;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center font-bold">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-2xl font-black text-[#58cc02]"
          >
            DuoLearn
          </button>

          <button
            onClick={() => (window.location.href = "/leaderboard")}
            className="font-black text-gray-600"
          >
            Leaderboard
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#58cc02] text-6xl">
            🦉
          </div>

          <h1 className="mt-5 text-3xl font-black">
            {user.name}
          </h1>

          <p className="text-gray-500">@{user.username}</p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[#fff7d6] p-4">
              <div className="text-2xl">🔥</div>
              <p className="mt-1 text-xl font-black">
                {user.streak}
              </p>
              <p className="text-xs font-bold text-gray-500">
                DAY STREAK
              </p>
            </div>

            <div className="rounded-2xl bg-[#e8f7ff] p-4">
              <div className="text-2xl">⭐</div>
              <p className="mt-1 text-xl font-black">
                {user.xp}
              </p>
              <p className="text-xs font-bold text-gray-500">
                TOTAL XP
              </p>
            </div>

            <div className="rounded-2xl bg-[#f3eaff] p-4">
              <div className="text-2xl">💎</div>
              <p className="mt-1 text-xl font-black">
                {user.gems}
              </p>
              <p className="text-xs font-bold text-gray-500">
                GEMS
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">
            Daily Goal
          </h2>

          <div className="mt-4 flex justify-between text-sm font-bold">
            <span>{user.daily_xp} XP earned</span>
            <span>{user.daily_goal} XP goal</span>
          </div>

          <div className="mt-2 h-4 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#58cc02]"
              style={{
                width: `${Math.min(
                  100,
                  (user.daily_xp / user.daily_goal) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        <button
          onClick={() => (window.location.href = "/leaderboard")}
          className="mt-6 w-full rounded-xl bg-[#58cc02] py-4 font-black text-white shadow-[0_5px_0_#46a302]"
        >
          VIEW LEADERBOARD
        </button>
      </section>
    </main>
  );
}