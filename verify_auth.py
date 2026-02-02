import requests
import sys
import time

BASE_URL = "http://localhost:8000"

def run_test():
    print("--- Starting JWT Auth & Prompt Verification ---")
    
    username = f"jwt_user_{int(time.time())}"
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
    
    # 3. Test Normal Chat
    print("\n3. Testing Normal Chat...")
    resp = requests.post(f"{BASE_URL}/chat", headers=headers, json={"message": "Hello, who are you?"})
    if resp.status_code != 200:
        print(f"Chat failed: {resp.text}")
        sys.exit(1)
    print(f"AI: {resp.json()['response']}")
    
    # 4. Test Structured Prompt Output
    print("\n4. Testing Structured Output (Design Artifacts)...")
    prompt = "I need to build a Todo App. Give me user stories and endpoints."
    resp = requests.post(f"{BASE_URL}/chat", headers=headers, json={"message": prompt})
    if resp.status_code != 200:
        print(f"Chat failed: {resp.text}")
        sys.exit(1)
    
    reply = resp.json()['response']
    print("\n--- AI Response Start ---")
    print(reply)
    print("--- AI Response End ---")
    
    if "USER_STORIES.JSON" in reply and "API_ENDPOINTS.YAML" in reply:
        print("\n[SUCCESS] Structured output verified!")
    else:
        print("\n[WARNING] Structure missing. Check system prompt.")

if __name__ == "__main__":
    try:
        requests.get(f"{BASE_URL}/health")
        run_test()
    except requests.exceptions.ConnectionError:
        print("Error: FastAPI server is not running.")
