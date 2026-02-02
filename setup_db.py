from app.auth import create_user
from app.qdrant import ensure_collection

def main():
    print("Initializing Qdrant Collection...")
    ensure_collection()
    
    print("\nCreating 'test_user'...")
    try:
        user, api_key = create_user("test_user")
        print(f"User Created: {user.username}")
        print(f"API KEY: {api_key}")
        print("\nSave this API key to use in your requests header:")
        print(f"X-API-KEY: {api_key}")
    except Exception as e:
        print(f"Error creating user (might already exist): {e}")

if __name__ == "__main__":
    main()
