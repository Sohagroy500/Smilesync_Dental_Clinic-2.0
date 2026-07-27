from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import datetime
from .models import Admin
from .password import verify_password
from .jwt import create_access_token

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"

def authenticate_admin(login_data: LoginRequest, db: Session) -> TokenResponse:
    admin = db.query(Admin).filter(Admin.email == login_data.email).first()
    if not admin or not verify_password(login_data.password, admin.password_hash):
        return None

    # Update last login
    admin.last_login = datetime.utcnow()
    db.commit()

    token = create_access_token(data={
        "sub": str(admin.id),
        "email": admin.email,
        "full_name": admin.full_name,
        "role": admin.role
    })

    return TokenResponse(access_token=token)
