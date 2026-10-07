from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Course, Skill, Lesson, LessonProgress, SkillProgress, User

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("/{course_id}")
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    user = db.query(User).first()

    completed_lessons = {
        progress.lesson_id
        for progress in db.query(LessonProgress)
        .filter(LessonProgress.user_id == user.id)
        .all()
        if progress.completed
    }

    skill_progress = {
        progress.skill_id: progress
        for progress in db.query(SkillProgress)
        .filter(SkillProgress.user_id == user.id)
        .all()
    }

    units = []

    for unit in course.units:
        skills = []

        ordered_skills = sorted(unit.skills, key=lambda x: x.order)

        for skill in ordered_skills:
            lessons = sorted(skill.lessons, key=lambda x: x.order)

            completed = sum(
                1 for lesson in lessons
                if lesson.id in completed_lessons
            )

            progress = skill_progress.get(skill.id)

            if completed == len(lessons):
                status = "completed"
            elif skill.id == 1 or completed > 0:
                status = "available"
            else:
                previous_skill = (
                    db.query(Skill)
                    .filter(
                        Skill.unit_id == skill.unit_id,
                        Skill.order == skill.order - 1
                    )
                    .first()
                )

                if previous_skill:
                    previous_lessons = sorted(
                        previous_skill.lessons,
                        key=lambda x: x.order
                    )

                    previous_completed = sum(
                        1 for lesson in previous_lessons
                        if lesson.id in completed_lessons
                    )

                    status = (
                        "available"
                        if previous_completed == len(previous_lessons)
                        else "locked"
                    )
                else:
                    status = "locked"

            skills.append({
                "id": skill.id,
                "title": skill.title,
                "icon": skill.icon,
                "order": skill.order,
                "lessons": len(lessons),
                "completed_lessons": completed,
                "crown_level": progress.crown_level if progress else 0,
                "status": status,
                "first_lesson_id": next(
    (
        lesson.id
        for lesson in lessons
        if lesson.id not in completed_lessons
    ),
    lessons[0].id if lessons else None
),
            })

        units.append({
            "id": unit.id,
            "title": unit.title,
            "description": unit.description,
            "skills": skills,
        })

    return {
        "id": course.id,
        "name": course.name,
        "language": course.language,
        "units": units,
    }


@router.get("/")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()

    return [
        {
            "id": course.id,
            "name": course.name,
            "language": course.language,
        }
        for course in courses
    ]
