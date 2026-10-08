import json
from sqlalchemy.orm import Session

from .database import engine, Base, SessionLocal
from .models import (
    User,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    SkillProgress,
    LessonProgress,
)


def seed_database():
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    if db.query(Course).first():
        db.close()
        print("Database already seeded!")
        return

    user = User(
        name="Ayush",
        username="ayush",
        xp=120,
        streak=3,
        hearts=5,
        gems=500,
        daily_goal=50,
        daily_xp=20,
    )
    db.add(user)
    
    course = Course(
        name="Spanish",
        language="Spanish",
    )
    db.add(course)
    db.flush()

    units_data = [
        ("Basics", "Learn the basics of Spanish"),
        ("Food", "Learn words for food and drinks"),
        ("Family", "Talk about family and people"),
    ]

    for unit_order, (unit_title, description) in enumerate(units_data, 1):
        unit = Unit(
            course_id=course.id,
            title=unit_title,
            description=description,
        )
        db.add(unit)
        db.flush()

        if unit_title == "Basics":
            skills_data = [
                ("Greetings", "👋"),
                ("Introductions", "💬"),
            ]
        elif unit_title == "Food":
            skills_data = [
                ("Food & Drinks", "🍎"),
                ("Ordering Food", "🍽️"),
            ]
        else:
            skills_data = [
                ("Family Members", "👨‍👩‍👧"),
                ("People", "🧑"),
            ]

        for skill_order, (skill_title, icon) in enumerate(skills_data, 1):
            skill = Skill(
                unit_id=unit.id,
                title=skill_title,
                icon=icon,
                order=skill_order,
            )
            db.add(skill)
            db.flush()

            for lesson_order in range(1, 3):
                lesson = Lesson(
                    skill_id=skill.id,
                    title=f"{skill_title} {lesson_order}",
                    order=lesson_order,
                    xp_reward=10,
                )
                db.add(lesson)
                db.flush()

                exercises = create_exercises(
                    lesson.id,
                    skill_title,
                    lesson_order
                )

                db.add_all(exercises)

    db.commit()

    first_skill = db.query(Skill).order_by(Skill.id).first()

    if first_skill:
        progress = SkillProgress(
            user_id=user.id,
            skill_id=first_skill.id,
            completed_lessons=1,
            crown_level=1,
        )
        db.add(progress)

        first_lesson = (
            db.query(Lesson)
            .filter(Lesson.skill_id == first_skill.id)
            .order_by(Lesson.order)
            .first()
        )

        if first_lesson:
            lesson_progress = LessonProgress(
                user_id=user.id,
                lesson_id=first_lesson.id,
                completed=True,
            )
            db.add(lesson_progress)

    db.commit()
    db.close()

    print("Database seeded successfully!")


def create_exercises(lesson_id, skill_title, lesson_order):
    return [
        Exercise(
            lesson_id=lesson_id,
            type="multiple_choice",
            question="How do you say 'hello' in Spanish?",
            answer="Hola",
            options=json.dumps(["Hola", "Gracias", "Adiós", "Por favor"]),
            order=1,
        ),
        Exercise(
            lesson_id=lesson_id,
            type="translate",
            question="Translate: 'Good morning'",
            answer="Buenos días",
            options=json.dumps([
                "Buenos",
                "días",
                "Buenas",
                "noches",
            ]),
            order=2,
        ),
        Exercise(
            lesson_id=lesson_id,
            type="match_pairs",
            question="Match the Spanish words with their meanings",
            answer="",
            pairs=json.dumps([
                {"left": "Hola", "right": "Hello"},
                {"left": "Gracias", "right": "Thank you"},
                {"left": "Adiós", "right": "Goodbye"},
                {"left": "Sí", "right": "Yes"},
            ]),
            order=3,
        ),
        Exercise(
            lesson_id=lesson_id,
            type="fill_blank",
            question="Yo ___ estudiante.",
            answer="soy",
            options=json.dumps([
                "soy",
                "eres",
                "es",
                "somos",
            ]),
            order=4,
        ),
        Exercise(
            lesson_id=lesson_id,
            type="type_answer",
            question="Type the Spanish word for 'thank you'.",
            answer="gracias",
            order=5,
        ),
    ]


if __name__ == "__main__":
    seed_database()