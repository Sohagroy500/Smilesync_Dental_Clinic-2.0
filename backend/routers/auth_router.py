from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..auth.login import LoginRequest, TokenResponse, authenticate_admin
from ..auth.database import get_db
from ..auth.middleware import get_current_admin

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
def login_admin(credentials: LoginRequest, db: Session = Depends(get_db)):
    result = authenticate_admin(credentials, db)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return result

@router.get("/me")
def get_me(current_admin = Depends(get_current_admin)):
    return current_admin
