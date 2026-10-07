from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    gems = Column(Integer, default=500)
    daily_goal = Column(Integer, default=50)
    daily_xp = Column(Integer, default=0)
    last_activity = Column(DateTime, nullable=True)

    skill_progress = relationship("SkillProgress", back_populates="user")
    lesson_progress = relationship("LessonProgress", back_populates="user")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    language = Column(String, nullable=False)

    units = relationship("Unit", back_populates="course")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String, nullable=False)
    description = Column(String)

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    title = Column(String, nullable=False)
    icon = Column(String, default="⭐")
    order = Column(Integer, default=0)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill")
    progress = relationship("SkillProgress", back_populates="skill")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    title = Column(String, nullable=False)
    order = Column(Integer, default=0)
    xp_reward = Column(Integer, default=10)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    type = Column(String, nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(String, nullable=False)
    options = Column(Text, nullable=True)
    pairs = Column(Text, nullable=True)
    order = Column(Integer, default=0)

    lesson = relationship("Lesson", back_populates="exercises")


class SkillProgress(Base):
    __tablename__ = "skill_progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    completed_lessons = Column(Integer, default=0)
    crown_level = Column(Integer, default=0)

    user = relationship("User", back_populates="skill_progress")
    skill = relationship("Skill", back_populates="progress")


class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="lesson_progress")


class DailyActivity(Base):
    __tablename__ = "daily_activity"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(String, nullable=False)
    xp_earned = Column(Integer, default=0)