from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from .models import Base, Admin
import bcrypt
from datetime import datetime

DATABASE_URL = "sqlite:///./smilesync_admin.sqlite"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed default admin if not existing
        admin = db.query(Admin).filter(Admin.email == "admin@smilesync.com").first()
        if not admin:
            hashed_pwd = bcrypt.hashpw("Admin@123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            default_admin = Admin(
                full_name="SmileSync Admin",
                email="admin@smilesync.com",
                password_hash=hashed_pwd,
                role="Administrator",
                created_at=datetime.utcnow()
            )
            db.add(default_admin)
            db.commit()
    finally:
        db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
