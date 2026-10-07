from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, date

from ..database import get_db
from ..models import (
    Lesson,
    User,
    LessonProgress,
    SkillProgress,
    DailyActivity,
)

router = APIRouter(prefix="/lessons", tags=["Lessons"])


@router.get("/{lesson_id}")
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()

    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    exercises = []

    for exercise in sorted(lesson.exercises, key=lambda x: x.order):
        exercises.append({
            "id": exercise.id,
            "type": exercise.type,
            "question": exercise.question,
            "answer": exercise.answer,
            "options": exercise.options,
            "pairs": exercise.pairs,
            "order": exercise.order,
        })

    return {
        "id": lesson.id,
        "title": lesson.title,
        "xp_reward": lesson.xp_reward,
        "exercises": exercises,
    }


@router.post("/{lesson_id}/complete")
def complete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).first()

    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()

    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    progress = (
        db.query(LessonProgress)
        .filter(
            LessonProgress.user_id == user.id,
            LessonProgress.lesson_id == lesson_id,
        )
        .first()
    )

    if progress and progress.completed:
        return {
            "message": "Lesson already completed",
            "xp": user.xp,
            "daily_xp": user.daily_xp,
            "streak": user.streak,
            "hearts": user.hearts,
        }

    if not progress:
        progress = LessonProgress(
            user_id=user.id,
            lesson_id=lesson_id,
            completed=True,
            completed_at=datetime.utcnow(),
        )
        db.add(progress)
    else:
        progress.completed = True
        progress.completed_at = datetime.utcnow()

    # XP
    user.xp += lesson.xp_reward
    user.daily_xp += lesson.xp_reward

    # Daily activity
    today = str(date.today())

    activity = (
        db.query(DailyActivity)
        .filter(
            DailyActivity.user_id == user.id,
            DailyActivity.date == today,
        )
        .first()
    )

    if not activity:
        activity = DailyActivity(
            user_id=user.id,
            date=today,
            xp_earned=lesson.xp_reward,
        )
        db.add(activity)
    else:
        activity.xp_earned += lesson.xp_reward

    # Skill progress
    skill_progress = (
        db.query(SkillProgress)
        .filter(
            SkillProgress.user_id == user.id,
            SkillProgress.skill_id == lesson.skill_id,
        )
        .first()
    )

    if not skill_progress:
        skill_progress = SkillProgress(
            user_id=user.id,
            skill_id=lesson.skill_id,
            completed_lessons=1,
            crown_level=1,
        )
        db.add(skill_progress)
    else:
        skill_progress.completed_lessons += 1

        # Increase crown every 2 completed lessons
        skill_progress.crown_level = min(
            5,
            (skill_progress.completed_lessons + 1) // 2
        )

    # Update streak/activity
    user.last_activity = datetime.utcnow()

    db.commit()

    return {
        "message": "Lesson completed!",
        "xp": user.xp,
        "daily_xp": user.daily_xp,
        "streak": user.streak,
        "hearts": user.hearts,
    }