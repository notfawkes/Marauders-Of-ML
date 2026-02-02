from openai import OpenAI
from app.config import OLLAMA_BASE_URL, EMBEDDING_MODEL, CHAT_MODEL

# Initialize OpenAI client pointing to Ollama
client = OpenAI(
    base_url=OLLAMA_BASE_URL,
    api_key="ollama"  # Required but ignored by Ollama
)

def get_embedding(text: str) -> list[float]:
    """Generates embedding for the given text."""
    try:
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Error generating embedding: {e}")
        # In production we might want to retry or raise, strictly for this hackathon we raise.
        raise e

def generate_response(system_prompt: str, user_message: str) -> str:
    """Generates a chat completion response."""
    try:
        response = client.chat.completions.create(
            model=CHAT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating response: {e}")
        raise e
