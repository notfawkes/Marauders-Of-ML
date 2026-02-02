from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import uuid

# -----------------------------
# Ollama client (OpenAI syntax)
# -----------------------------
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

# -----------------------------
# Qdrant client
# -----------------------------
qdrant = QdrantClient(
    host="localhost",
    port=6333
)

COLLECTION = "chat_memory"

# -----------------------------
# Create collection (once)
# -----------------------------
if COLLECTION not in [c.name for c in qdrant.get_collections().collections]:
    qdrant.create_collection(
        collection_name=COLLECTION,
        vectors_config=VectorParams(
            size=768,  # nomic-embed-text embedding size
            distance=Distance.COSINE
        )
    )

# -----------------------------
# Helper: embed text using Ollama
# -----------------------------
def embed(text: str) -> list[float]:
    response = client.embeddings.create(
        model="nomic-embed-text",
        input=text
    )
    return response.data[0].embedding

# -----------------------------
# Chat loop
# -----------------------------
print("Chatbot with Qdrant memory started. Type 'exit' to quit.\n")

while True:
    user_input = input("> ").strip()
    if user_input.lower() in {"exit", "quit"}:
        break

    # 1. Embed query
    query_vector = embed(user_input)

    # 2. Search memory
    results = qdrant.query_points(
        collection_name=COLLECTION,
        query=query_vector,
        limit=3
    ).points

    memories = [
        r.payload["text"]
        for r in results
        if "text" in r.payload
    ]

    # 3. Build prompt
    system_prompt = f"""
            You are a helpful assistant.
            Use the following past context ONLY if relevant.
            Context:
            {memories}
"""

    # 4. LLM call
    response = client.chat.completions.create(
        model="qwen3",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ]
    )

    reply = response.choices[0].message.content
    print("AI:", reply)

    # 5. Store memory
    combined_text = f"User: {user_input}\nAssistant: {reply}"

    qdrant.upsert(
        collection_name=COLLECTION,
        points=[
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embed(combined_text),
                payload={"text": combined_text}
            )
        ]
    )
