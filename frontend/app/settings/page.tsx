"use client";

import { useState } from "react";

export default function Settings() {
  const [sound, setSound] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
        <h1 className="text-3xl font-black">Settings</h1>

        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <p className="font-black">Sound Effects</p>
              <p className="text-sm text-gray-500">
                Play sounds during lessons
              </p>
            </div>

            <button
              onClick={() => setSound(!sound)}
              className={`rounded-full px-4 py-2 font-black text-white ${
                sound ? "bg-[#58cc02]" : "bg-gray-400"
              }`}
            >
              {sound ? "ON" : "OFF"}
            </button>
          </div>

          <div className="flex items-center justify-between border-b p-5">
            <div>
              <p className="font-black">Notifications</p>
              <p className="text-sm text-gray-500">
                Receive learning reminders
              </p>
            </div>

            <button
              onClick={() => setNotifications(!notifications)}
              className={`rounded-full px-4 py-2 font-black text-white ${
                notifications ? "bg-[#58cc02]" : "bg-gray-400"
              }`}
            >
              {notifications ? "ON" : "OFF"}
            </button>
          </div>

          <div className="flex items-center justify-between p-5">
            <div>
              <p className="font-black">Dark Mode</p>
              <p className="text-sm text-gray-500">
                Change application appearance
              </p>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`rounded-full px-4 py-2 font-black text-white ${
                darkMode ? "bg-[#58cc02]" : "bg-gray-400"
              }`}
            >
              {darkMode ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6">
          <h2 className="text-xl font-black">Account</h2>

          <div className="mt-4 space-y-3 text-gray-600">
            <p>Account management — placeholder</p>
            <p>Privacy settings — placeholder</p>
            <p>About DuoLearn — placeholder</p>
          </div>
        </div>
      </section>
    </main>
  );
}