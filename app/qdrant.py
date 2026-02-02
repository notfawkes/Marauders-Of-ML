from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct, Filter, FieldCondition, MatchValue
from app.config import QDRANT_HOST, QDRANT_PORT, VECTOR_COLLECTION, VECTOR_SIZE, DISTANCE_METRIC
from app.models import MemoryItem
from datetime import datetime
import uuid

client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

def ensure_collection():
    """Idempotent collection creation."""
    cols = client.get_collections().collections
    if VECTOR_COLLECTION not in [c.name for c in cols]:
        client.create_collection(
            collection_name=VECTOR_COLLECTION,
            vectors_config=VectorParams(
                size=VECTOR_SIZE,
                distance=Distance.COSINE
            )
        )
        print(f"Created collection: {VECTOR_COLLECTION}")

def search_user_memory(user_id: str, query_vector: list[float], limit: int = 5) -> list[MemoryItem]:
    """
    Search for memories relevant to the query, strictly filtering by user_id.
    """
    search_result = client.query_points(
        collection_name=VECTOR_COLLECTION,
        query=query_vector,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="user_id",
                    match=MatchValue(value=user_id)
                )
            ]
        ),
        limit=limit
    ).points

    memories = []
    for hit in search_result:
        if "text" in hit.payload and "timestamp" in hit.payload:
            memories.append(MemoryItem(
                text=hit.payload["text"],
                timestamp=datetime.fromisoformat(hit.payload["timestamp"])
            ))
    return memories

def store_interaction(user_id: str, text: str, vector: list[float]):
    """
    Store a new memory item for a user.
    """
    point_id = str(uuid.uuid4())
    payload = {
        "user_id": user_id,
        "text": text,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    client.upsert(
        collection_name=VECTOR_COLLECTION,
        points=[
            PointStruct(
                id=point_id,
                vector=vector,
                payload=payload
            )
        ]
    )

def get_all_memories(user_id: str, limit: int = 100) -> list[MemoryItem]:
    """
    Retrieve recent memories for a user (scroll).
    """
    # Using scroll to get latest items, though scroll order depends on insertion or ID usually.
    # Qdrant scroll API:
    result, _ = client.scroll(
        collection_name=VECTOR_COLLECTION,
        scroll_filter=Filter(
            must=[
                FieldCondition(
                    key="user_id",
                    match=MatchValue(value=user_id)
                )
            ]
        ),
        limit=limit,
        with_payload=True,
        with_vectors=False
    )
    
    memories = []
    for point in result:
        if "text" in point.payload:
            # Handle potential missing timestamp or format issues gracefully
            ts = point.payload.get("timestamp", datetime.utcnow().isoformat())
            memories.append(MemoryItem(
                text=point.payload["text"],
                timestamp=datetime.fromisoformat(ts)
            ))
            
    return memories
