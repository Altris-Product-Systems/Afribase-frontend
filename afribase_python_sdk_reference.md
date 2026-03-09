# Afribase Python SDK Comprehensive Documentation

The official Python client for Afribase. This SDK provides an unopinionated, Supabase-like interface for interacting with your Afribase backend via Python, ideal for backend scripts, data pipelines, and Python-based web applications.

---

## 1. Installation & Initialization

You can install the SDK using pip. Note that the Python SDK relies on `httpx` for modern, async-capable requests (though the interface here is synchronous by default) and `websockets` for realtime capabilities.

```bash
pip install afribase
```

Initialize the client with your Afribase Project URL and Anonymous API Key:

```python
from afribase import create_client

url = "https://your-project.useafribase.app"
anon_key = "your-anon-key"

client = create_client(url, anon_key)
```

---

## 2. Authentication (`client.auth`)

Afribase Auth supports standard email/password, magic links, OTP, and OAuth sign-ins.

### Sign Up / Sign In

```python
# Register a user
response = client.auth.sign_up(
    email="user@example.com", 
    password="securePassword123"
)
print("Signed up user:", response)

# Authenticate with Password
session = client.auth.sign_in_with_password(
    email="user@example.com", 
    password="securePassword123"
)
print("Session token:", session)
```

### Passwordless & OAuth

```python
# Send OTP / Magic Link
client.auth.sign_in_with_otp(email="user@example.com")

# Verify the OTP code
session = client.auth.verify_otp(
    email="user@example.com", 
    token="123456"
)

# OAuth (Social Login) - Returns the redirect URL
url = client.auth.sign_in_with_oauth(provider="google")
```

### Session Management & Event Listeners

```python
# Sign Out
client.auth.sign_out()

# Listen to auth state changes
def on_auth_change(event, session):
    print(f"Auth state changed: {event}")

# Subscribe to events and keep the unsubscribe reference
unsubscribe = client.auth.on_auth_state_change(on_auth_change)

# Later...
# unsubscribe()
```

---

## 3. Database (`client.from_()`)

*Note: Because [from](file:///Users/ryuzakii/afribase-backend/sdks/afribase-js/src/lib/AfribaseStorageClient.ts#33-45) is a reserved keyword in Python, the SDK uses `from_()` to query tables.*

### CRUD Methods

All PostgREST queries require calling `.execute()` at the end of the query chain to execute the HTTP request.

```python
# Select
data = client.from_("posts").select("*").execute()

# Insert
new_post = client.from_("posts").insert({
    "title": "Python SDK", 
    "body": "It's super easy to use."
}).execute()

# Update
updated_data = client.from_("posts").update({
    "title": "Python SDK Updated"
}).eq("id", "1").execute()

# Delete
deleted_data = client.from_("posts").delete().eq("id", "1").execute()
```

### Filters

You can chain filters exactly as you would in Javascript:

```python
data = (
    client.from_("products")
    .select("*")
    .eq("category", "electronics")      # Equal
    .neq("status", "draft")             # Not Equal
    .gt("price", 100)                   # Greater than
    .gte("stock", 10)                   # Greater/Equal
    .lt("price", 500)                   # Less than
    .in_("brand", ["Apple", "Samsung"]) # IN array (Note the underscore constraint if applicable)
    .execute()
)
```

### Query Modifiers

```python
data = (
    client.from_("posts")
    .select("*")
    .order("created_at", desc=True)     # Order by Descending
    .limit(20)                          # Limit results
    .execute()
)
```

---

## 4. PostgreSQL Functions / RPC (`client.rpc()`)

Call custom database functions directly from Python.

```python
# Call a Postgres function named 'calculate_tax'
result = client.rpc(
    "calculate_tax", 
    {"amount": 100, "rate": 0.15}
).execute()

print("Tax calculation result:", result)
```

---

## 5. Realtime (`client.channel()`)

Listen to database changes, broadcast custom messages, or track presence logic using WebSockets.

### Subscribing to Postgres Changes & Broadcasts

```python
# 1. Create a channel targeting a specific topic
channel = client.channel("room-general")

# 2. Register callback for Broadcast messages
def on_message(payload):
    print("Received broadcast payload:", payload)

channel.on_broadcast("message", callback=on_message)

# 3. Register callback for Database changes
def on_db_change(payload):
    print("Database updated:", payload)

channel.on_postgres_changes(
    event="INSERT",
    schema="public",
    table="messages",
    callback=on_db_change
)

# 4. Subscribe and open the connection
channel.subscribe()

# 5. Send a custom broadcast message
channel.send_broadcast("message", {"text": "Hello from Python!"})
```

### Presence Syncing

Track which clients or users are currently connected.

```python
# Register a presence sync callback
channel.on_presence_sync(callback=lambda state: print("Current active clients:", state))

channel.subscribe()

# Announce your Python client's presence
channel.track({
    "user": "python_script_1", 
    "status": "processing"
})
```

---

## 6. Storage (`client.storage`)

Manage file uploads securely from your Python scripts.

### Bucket Management

```python
# List all buckets
buckets = client.storage.list_buckets()

# Create a new public bucket
client.storage.create_bucket("scripts-bucket", public=True)
```

### File Operations

```python
bucket = client.storage.from_("avatars")

# Upload a File (reads the raw bytes and sends them)
with open("local_avatar.png", "rb") as f:
    bucket.upload("avatar.png", f.read())

# Download a File
file_bytes = bucket.download("avatar.png")
with open("downloaded_avatar.png", "wb") as f:
    f.write(file_bytes)

# Get Public URL (if the bucket is public)
url = bucket.get_public_url("avatar.png", transform={"width": 200})

# Create a Signed URL (for private buckets)
signed_url = bucket.create_signed_url("private_doc.pdf", expires_in=3600)

# List files in a bucket directory
files = bucket.list(path="folder/")

# Move or Copy files
bucket.move("old_path.png", "new_path.png")
bucket.copy("base_image.png", "duplicate_image.png")
```

---

## 7. Edge Functions (`client.functions`)

Invoke serverless Edge Functions hosted on Afribase.

```python
result = client.functions.invoke(
    "process_data", 
    body={"dataset_id": "12345"}
)

print("Function execution result:", result)
```
