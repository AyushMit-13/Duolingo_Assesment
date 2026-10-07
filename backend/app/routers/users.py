from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).first()

    return {
        "id": user.id,
        "name": user.name,
        "username": user.username,
        "xp": user.xp,
        "streak": user.streak,
        "hearts": user.hearts,
        "gems": user.gems,
        "daily_goal": user.daily_goal,
        "daily_xp": user.daily_xp,
    }


@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    users = (
        db.query(User)
        .order_by(User.xp.desc())
        .all()
    )

    return [
        {
            "rank": index + 1,
            "name": user.name,
            "username": user.username,
            "xp": user.xp,
            "streak": user.streak,
            "is_current_user": index == 0,
        }
        for index, user in enumerate(users)
    ]
@router.post("/use-heart")
def use_heart(db: Session = Depends(get_db)):
    user = db.query(User).first()

    if user.hearts > 0:
        user.hearts -= 1

    db.commit()

    return {
        "hearts": user.hearts
    }


@router.post("/restore-hearts")
def restore_hearts(db: Session = Depends(get_db)):
    user = db.query(User).first()

    user.hearts = 5

    db.commit()

    return {
        "hearts": user.hearts
    }
@router.post("/daily-check")
def daily_check(db: Session = Depends(get_db)):
    user = db.query(User).first()

    from datetime import datetime, date

    today = date.today()

    if user.last_activity:
        last_date = user.last_activity.date()

        if last_date == today:
            pass

        elif (today - last_date).days == 1:
            user.streak += 1
            user.hearts = 5

        else:
            user.streak = 1
            user.hearts = 5

    else:
        user.streak = 1
        user.hearts = 5

    user.last_activity = datetime.utcnow()

    db.commit()

    return {
        "streak": user.streak,
        "hearts": user.hearts
    }