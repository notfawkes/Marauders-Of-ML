from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class User(BaseModel):
    user_id: str
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "active"

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    user_id: str
    conversation_id: Optional[str] = None # Optional for future use

class MemoryItem(BaseModel):
    text: str
    timestamp: datetime
