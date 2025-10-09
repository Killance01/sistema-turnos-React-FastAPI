from fastapi import APIRouter, Request, HTTPException, status, Depends
from sqlmodel import Session, select
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr, constr
from datetime import timedelta

from ... import db
from ...models import User
from ...core.security import get_password_hash, verify_password, create_access_token
from ...core.rate_limiter import check_rate
from ...core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# =============================
#   Pydantic Schemas
# =============================

class RegisterPayload(BaseModel):
    email: EmailStr
    password: constr(min_length=6, max_length=100)
    full_name: str | None = None


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


# =============================
#   Utils
# =============================

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    with Session(db.engine) as session:
        user = session.get(User, int(user_id))
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user


# =============================
#   Endpoints
# =============================

@router.post("/register")
def register(data: RegisterPayload, request: Request):
 
    ip = request.client.host
    check_rate(f"auth_register:{ip}", settings.RATE_LIMIT_AUTH_PER_MIN)

    with Session(db.engine) as session:
        user = session.exec(select(User).where(User.email == data.email)).first()
        if user:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_password = get_password_hash(data.password)

        new_user = User(
            email=data.email,
            full_name=data.full_name or "",
            hashed_password=hashed_password,
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        return {"id": new_user.id, "email": new_user.email}


@router.post("/login")
def login(data: LoginPayload, request: Request):
  
    ip = request.client.host
    check_rate(f"auth_login:{ip}", settings.RATE_LIMIT_AUTH_PER_MIN)

    with Session(db.engine) as session:
        user = session.exec(select(User).where(User.email == data.email)).first()
        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=access_token_expires
        )

        return {
            "access_token": token,
        }

