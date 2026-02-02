import os

# MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "ai_chat_app"
USER_COLLECTION = "users"

# Qdrant
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
VECTOR_COLLECTION = "chat_memory"
VECTOR_SIZE = 768  # nomic-embed-text
DISTANCE_METRIC = "Cosine"

# Ollama
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
EMBEDDING_MODEL = "nomic-embed-text"
CHAT_MODEL = "qwen3"

# JWT Auth
SECRET_KEY = os.getenv("SECRET_KEY", "hackathon_secret_key_change_in_prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
