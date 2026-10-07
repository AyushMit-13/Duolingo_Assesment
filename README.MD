# DuoLearn — Duolingo Web App Clone

A full-stack Duolingo-inspired language learning web application built for the SDE Fullstack Assignment.

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- Python
- FastAPI
- SQLAlchemy

### Database
- SQLite

## Features

- Duolingo-style learning path
- Units and skills
- Locked, available and completed skills
- Lesson progress and crown levels
- Multiple-choice questions
- Translation word-bank questions
- Match-pair exercises
- Fill-in-the-blank questions
- Typed-answer questions
- Instant correct/wrong feedback
- Hearts system with refill
- XP rewards
- Daily XP goal
- Daily streak
- Persistent lesson progress
- User profile
- Seeded leaderboard
- Settings page
- Responsive UI

## Project Structure

duolingo-clone/
├── frontend/
│   ├── app/
│   │   ├── lesson/[id]/
│   │   ├── leaderboard/
│   │   ├── profile/
│   │   ├── settings/
│   │   └── page.tsx
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── seed.py
│   │   └── main.py
│   ├── requirements.txt
│   └── duolingo.db
│
└── README.md

## Database Schema

Main entities:

- User
- Course
- Unit
- Skill
- Lesson
- Exercise
- SkillProgress
- LessonProgress
- DailyActivity

Users are connected to lesson and skill progress, while courses contain units, units contain skills, and skills contain lessons and exercises.

## API Endpoints

### Courses

`GET /api/courses/`

Returns available courses.

`GET /api/courses/{course_id}`

Returns the course learning path with skill progress and lock/unlock status.

### Lessons

`GET /api/lessons/{lesson_id}`

Returns lesson exercises.

`POST /api/lessons/{lesson_id}/complete`

Completes a lesson and updates XP and progress.

### Users

`GET /api/users/me`

Returns the current user's profile and statistics.

`GET /api/users/leaderboard`

Returns the seeded leaderboard.

`POST /api/users/use-heart`

Uses one heart.

`POST /api/users/restore-hearts`

Restores hearts.

`POST /api/users/daily-check`

Updates daily streak and activity state.

## Local Setup

### Backend

Open a terminal and run:

```bash
cd backend

python -m venv venv

On Windows PowerShell:
.\venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Seed the database:

python -m app.seed

Start the backend:

python -m uvicorn app.main:app --reload

Backend runs at:

http://127.0.0.1:8000

Frontend

Open another terminal:

cd frontend

npm install

npm run dev

Frontend runs at:

http://localhost:3000

## Architecture

The Next.js frontend communicates with the FastAPI backend through REST APIs.

FastAPI uses SQLAlchemy to interact with SQLite. Course content and initial users are seeded into the database.

User lesson completion updates:

1. Lesson progress
2. Skill progress
3. XP
4. Daily activity
5. User statistics

The learning path uses the stored progress to determine which skills are locked, available, or completed.

## Assumptions

- Authentication is mocked with a seeded current user.
- One Spanish course is provided.
- Leaderboard users are seeded for demonstration.
- Hearts and settings use simplified/mock behaviour.
- Payments, speech recognition, and social features are outside the assignment scope.

## Future Improvements

- Real authentication
- Audio pronunciation
- Real-time multiplayer leaderboard
- More language courses
- Persistent production database
- Advanced animations and achievements