from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from typing import Optional, Literal
import re

UserRole = Literal[
    "energy_grid_operator",
    "energy_trader",
    "energy_planner",
    "system_administrator",
]

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        normalized_name = value.strip()
        if len(normalized_name) < 2:
            raise ValueError("Name must be at least 2 characters long")
        if len(normalized_name) > 100:
            raise ValueError("Name must be at most 100 characters long")
        if not re.fullmatch(r"[A-Za-zÀ-ÖØ-öø-ÿ' -]+", normalized_name):
            raise ValueError("Name can only contain letters, spaces, apostrophes, and hyphens")
        return normalized_name

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    role: UserRole

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if len(value) > 128:
            raise ValueError("Password must be at most 128 characters long")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must include at least one uppercase letter")
        if not re.search(r"[a-z]", value):
            raise ValueError("Password must include at least one lowercase letter")
        if not re.search(r"\d", value):
            raise ValueError("Password must include at least one number")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise ValueError("Password must include at least one special character")
        return value

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()

class UserResponse(UserBase):
    id: int
    role: UserRole
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


class RoleCapabilitiesResponse(BaseModel):
    role: UserRole
    capabilities: list[str]


class RolesMatrixResponse(BaseModel):
    roles: dict[UserRole, list[str]]
