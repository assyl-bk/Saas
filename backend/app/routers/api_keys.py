from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from app.database import get_db
from app.models import User, APIKey
from app.schemas import APIKeyCreate, APIKeyResponse
from app.security import get_current_active_user

router = APIRouter()

@router.post("/", response_model=APIKeyResponse, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    key_data: APIKeyCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate a new API key for the current user"""
    # Generate key
    api_key = APIKey.generate_key()
    prefix = api_key[:12]  # "efp_" + first 8 chars
    
    # Calculate expiration
    expires_at = None
    if key_data.expires_in_days:
        expires_at = datetime.utcnow() + timedelta(days=key_data.expires_in_days)
    
    # Create API key record
    new_key = APIKey(
        user_id=current_user.id,
        name=key_data.name,
        key=api_key,
        prefix=prefix,
        permissions=key_data.permissions,
        expires_at=expires_at
    )
    
    db.add(new_key)
    db.commit()
    db.refresh(new_key)
    
    # Return with full key (only shown once)
    response = APIKeyResponse.from_orm(new_key)
    response.key = api_key  # Show full key only on creation
    return response

@router.get("/", response_model=List[APIKeyResponse])
async def list_api_keys(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all API keys for the current user"""
    keys = db.query(APIKey).filter(APIKey.user_id == current_user.id).all()
    return [APIKeyResponse.from_orm(key) for key in keys]

@router.delete("/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_api_key(
    key_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete an API key"""
    api_key = db.query(APIKey).filter(
        APIKey.id == key_id,
        APIKey.user_id == current_user.id
    ).first()
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )
    
    db.delete(api_key)
    db.commit()
    return None

@router.patch("/{key_id}/deactivate", response_model=APIKeyResponse)
async def deactivate_api_key(
    key_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Deactivate an API key"""
    api_key = db.query(APIKey).filter(
        APIKey.id == key_id,
        APIKey.user_id == current_user.id
    ).first()
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )
    
    api_key.is_active = False
    db.commit()
    db.refresh(api_key)
    
    return APIKeyResponse.from_orm(api_key)

@router.patch("/{key_id}/activate", response_model=APIKeyResponse)
async def activate_api_key(
    key_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Activate an API key"""
    api_key = db.query(APIKey).filter(
        APIKey.id == key_id,
        APIKey.user_id == current_user.id
    ).first()
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )
    
    api_key.is_active = True
    db.commit()
    db.refresh(api_key)
    
    return APIKeyResponse.from_orm(api_key)
