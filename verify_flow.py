import requests
import sys
import time

BASE_URL = "http://localhost:8000"

def run_test():
    print("--- Starting Verification Flow ---")
    
    # 1. Create User
    print("\n1. Creating temp user...")
    resp = requests.post(f"{BASE_URL}/api/users", json={"username": f"verifier_{int(time.time())}"})
    if resp.status_code != 200:
        print(f"Failed to create user: {resp.text}")
        sys.exit(1)
        
    data = resp.json()
    api_key = data["api_key"]
    user_id = data["user_id"]
    print(f"User created: {user_id}")
    
    headers = {"X-API-KEY": api_key}
    
    # 2. Send First Message (Fact)
    print("\n2. Sending First Message: 'My name is Bala'")
    resp = requests.post(f"{BASE_URL}/chat", headers=headers, json={"message": "My name is Bala"})
    if resp.status_code != 200:
        print(f"Chat failed: {resp.text}")
        sys.exit(1)
    print(f"AI Response: {resp.json()['response']}")
    
    # 3. Send Second Message (Recall)
    print("\n3. Sending Second Message: 'What is my name?'")
    resp = requests.post(f"{BASE_URL}/chat", headers=headers, json={"message": "What is my name?"})
    if resp.status_code != 200:
        print(f"Chat failed: {resp.text}")
        sys.exit(1)
    
    reply = resp.json()['response']
    print(f"AI Response: {reply}")
    
    if "Bala" in reply:
        print("\n[SUCCESS] Memory recall verified!")
    else:
        print("\n[WARNING] Memory recall might have failed. Check logs.")

if __name__ == "__main__":
    try:
        # Check if server is up
        requests.get(f"{BASE_URL}/health")
        run_test()
    except requests.exceptions.ConnectionError:
        print("Error: FastAPI server is not running at localhost:8000")
        print("Please run: uvicorn app.main:app --reload")
