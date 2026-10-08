"use client";

import { useEffect, useState } from "react";

type Player = {
  rank: number;
  name: string;
  username: string;
  xp: number;
  streak: number;
  is_current_user: boolean;
};

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/leaderboard`)
    .then((res) => res.json())
    .then((data) => setPlayers(data));
}, []);

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-2xl font-black text-[#58cc02]"
          >
            DuoLearn
          </button>

          <button
            onClick={() => (window.location.href = "/profile")}
            className="font-black text-gray-600"
          >
            Profile
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="text-center">
          <div className="text-6xl">🏆</div>

          <h1 className="mt-3 text-3xl font-black">
            Leaderboard
          </h1>

          <p className="mt-1 font-semibold text-gray-500">
            Compete with other learners
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
          {players.map((player) => (
            <div
              key={player.username}
              className={`flex items-center gap-4 border-b p-5 last:border-none ${
                player.is_current_user
                  ? "bg-[#efffdc]"
                  : ""
              }`}
            >
              <div className="w-10 text-center text-xl font-black">
                {player.rank === 1
                  ? "🥇"
                  : player.rank === 2
                  ? "🥈"
                  : player.rank === 3
                  ? "🥉"
                  : player.rank}
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#58cc02] text-2xl">
                🦉
              </div>

              <div className="flex-1">
                <p className="font-black">
                  {player.name}
                  {player.is_current_user && " (You)"}
                </p>

                <p className="text-sm text-gray-500">
                  🔥 {player.streak} day streak
                </p>
              </div>

              <div className="font-black text-[#ff9600]">
                ⭐ {player.xp} XP
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}