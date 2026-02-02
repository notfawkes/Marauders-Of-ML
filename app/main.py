from datetime import timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.models import User, UserCreate, Token, ChatRequest, ChatResponse, MemoryItem
from app.auth import get_current_user, users_collection, get_password_hash, verify_password, create_access_token
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES
from app.qdrant import ensure_collection, search_user_memory, store_interaction, get_all_memories
from app.ollama import get_embedding, generate_response
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI(title="Private AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    ensure_collection()

# ---------------------------------------------------------
# Authentication Endpoints
# ---------------------------------------------------------
@app.post("/auth/register", response_model=User)
async def register(user: UserCreate):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    
    user_id = f"u_{uuid.uuid4().hex[:8]}"
    hashed_password = get_password_hash(user.password)
    
    new_user = User(
        user_id=user_id,
        username=user.username,
        password_hash=hashed_password,
        status="active"
    )
    
    users_collection.insert_one(new_user.model_dump())
    return new_user

@app.post("/auth/login", response_model=Token)
async def login_for_access_token(user_data: UserCreate):
    user_doc = users_collection.find_one({"username": user_data.username})
    if not user_doc or not verify_password(user_data.password, user_doc["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_doc["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# ---------------------------------------------------------
# Chat & Memory Endpoints
# ---------------------------------------------------------
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    user: User = Depends(get_current_user)
):
    user_input = request.message
    
    # 1. Embed user message
    try:
        query_vector = get_embedding(user_input)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Embedding service unavailable")

    # 2. Retrieve relevant memory (Strict User Isolation)
    relevant_memories = search_user_memory(user.user_id, query_vector)
    
    # Format memory for context
    context_str = "\n".join([f"- {m.text}" for m in relevant_memories])
    
    # 3. Build System Prompt (Authentication & JSON Enforced)
    system_prompt = f"""
    You are a helpful assistant for the user {user.username}.
    
    MEMORY CONTEXT:
    {context_str}
    
    INSTRUCTIONS:
    You are an backend architect AI.
    The user will give you a requirement.
    You MUST return a VALID JSON object with the following structure:
    {{
        "stories": ["As a user, I want...", ...],
        "apis": [{{ "method": "POST", "endpoint": "..." }}, ...],
        "edge_cases": [{{ "type": "WARN", "desc": "..." }}, ...]
    }}
    
    DO NOT wrap in markdown code blocks.
    DO NOT return any text outside the JSON.
    Return ONLY the raw JSON string.
    """
    
    # 4. Generate Response
    try:
        ai_response = generate_response(system_prompt, user_input)
    except Exception as e:
        raise HTTPException(status_code=500, detail="LLM service unavailable")

    # 5. Store Interaction in Vector DB
    combined_text = f"User: {user_input}\nAssistant: {ai_response}"
    combined_vector = get_embedding(combined_text)
    
    store_interaction(user.user_id, combined_text, combined_vector)
    
    return ChatResponse(
        response=ai_response,
        user_id=user.user_id
    )

@app.get("/memory", response_model=List[MemoryItem])
async def get_memory(
    limit: int = 20,
    user: User = Depends(get_current_user)
):
    return get_all_memories(user.user_id, limit=limit)

@app.get("/health")
def health_check():
    return {"status": "ok"}
