from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database (default to SQLite for easy development)
    DATABASE_URL: str = "sqlite:///./energy_forecast.db"
    
    # Redis (optional - for caching and message queue)
    REDIS_URL: Optional[str] = "redis://localhost:6379"
    
    # JWT Settings
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Environment
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
