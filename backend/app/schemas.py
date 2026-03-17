from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

# API Key Schemas
class APIKeyCreate(BaseModel):
    name: str
    permissions: str = "read"
    expires_in_days: Optional[int] = None

class APIKeyResponse(BaseModel):
    id: int
    name: str
    prefix: str
    key: Optional[str] = None  # Only returned on creation
    is_active: bool
    permissions: str
    created_at: datetime
    last_used: Optional[datetime]
    expires_at: Optional[datetime]

    class Config:
        from_attributes = True
