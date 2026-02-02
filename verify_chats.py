import requests
import sys
import time
import uuid

BASE_URL = "http://localhost:8000"

def run_test():
    print("--- Starting Chat History Verification ---")
    
    unique_id = int(time.time())
    username = f"chat_user_{unique_id}"
    password = "securepassword123"
    
    # 1. Register
    print(f"\n1. Registering user '{username}'...")
    resp = requests.post(f"{BASE_URL}/auth/register", json={"username": username, "password": password})
    if resp.status_code != 200:
        print(f"Registration failed: {resp.text}")
        sys.exit(1)
    print("Registration successful.")

    # 2. Login
    print("\n2. Logging in...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={"username": username, "password": password})
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        sys.exit(1)
    
    token = resp.json()["access_token"]
    print("Login successful. Token acquired.")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Create New Chat
    print("\n3. Creating New Chat (First Message)...")
    msg1 = "Hello, I am testing chat history."
    resp = requests.post(f"{BASE_URL}/chat", headers=headers, json={"message": msg1})
    if resp.status_code != 200:
        print(f"Chat failed: {resp.text}")
        sys.exit(1)
    
    data = resp.json()
    conversation_id = data.get("conversation_id")
    print(f"Chat Response: {data['response']}")
    print(f"Conversation ID: {conversation_id}")
    
    if not conversation_id:
        print("[FAIL] No conversation_id returned!")
        sys.exit(1)

    # 4. Continue Chat
    print("\n4. Continuing Chat (Second Message)...")
    msg2 = "What did I just say??"
    resp = requests.post(f"{BASE_URL}/chat", headers=headers, json={"message": msg2, "conversation_id": conversation_id})
    if resp.status_code != 200:
        print(f"Chat failed: {resp.text}")
        sys.exit(1)
    
    print(f"Chat Response: {resp.json()['response']}")
    
    # 5. List Chats
    print("\n5. Listing All Chats...")
    resp = requests.get(f"{BASE_URL}/chats", headers=headers)
    if resp.status_code != 200:
        print(f"List chats failed: {resp.text}")
        sys.exit(1)
    
    chats = resp.json()
    print(f"Found {len(chats)} chats.")
    if len(chats) == 0:
        print("[FAIL] No chats found!")
        sys.exit(1)
        
    found_chat = False
    for chat in chats:
        if chat["conversation_id"] == conversation_id:
            found_chat = True
            print(f"Found our chat: {chat['name']} (ID: {chat['conversation_id']})")
            break
            
    if not found_chat:
        print("[FAIL] Our conversation_id was not in the list!")
        sys.exit(1)

    # 6. Get Chat Details
    print(f"\n6. Getting Details for Chat {conversation_id}...")
    resp = requests.get(f"{BASE_URL}/chats/{conversation_id}", headers=headers)
    if resp.status_code != 200:
        print(f"Get chat details failed: {resp.text}")
        sys.exit(1)
        
    chat_details = resp.json()
    messages = chat_details.get("messages", [])
    print(f"Found {len(messages)} messages in history.")
    
    # We expect 4 messages (User, AI, User, AI)
    if len(messages) >= 4:
        print("[SUCCESS] Chat history verified successfully!")
    else:
        print(f"[WARNING] Expected 4+ messages, found {len(messages)}.")

    # 7. Test 404
    print("\n7. Testing Non-Existent Chat Access...")
    bad_id = str(uuid.uuid4())
    resp = requests.get(f"{BASE_URL}/chats/{bad_id}", headers=headers)
    if resp.status_code == 404:
        print("Correctly received 404 for missing chat.")
    else:
        print(f"[FAIL] Expected 404, got {resp.status_code}")

if __name__ == "__main__":
    try:
        requests.get(f"{BASE_URL}/health")
        run_test()
    except requests.exceptions.ConnectionError:
        print("Error: FastAPI server is not running at localhost:8000")
