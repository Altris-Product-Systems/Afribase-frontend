# API Setup Guide

## Environment Configuration

The API URL is now configured via environment variables. Follow these steps:

### 1. Environment File Setup

Create a `.env.local` file in the root directory (already created for you):

```env
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.113:8000
```

### 2. Update API URL

Edit `.env.local` to match your backend server:

**For local development:**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

**For network access:**
```env
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.113:8000
```

**For production:**
```env
NEXT_PUBLIC_API_BASE_URL=https://api.afribase.com
```

### 3. Troubleshooting "name resolution failed" Error

This error means the frontend cannot connect to your backend server. Check:

#### Backend Server Status
```bash
# Make sure your backend is running
# Check if the server is listening on the correct port
```

#### Correct IP Address
- If backend is on the same machine: use `http://localhost:8000`
- If backend is on another machine: use the correct IP address
- Make sure the port number (8000) is correct

#### Network Connectivity
```bash
# Test if the backend is reachable
curl http://192.168.1.113:8000/health
# or
curl http://localhost:8000/health
```

#### Firewall Settings
- Ensure your firewall allows connections to port 8000
- If using Windows Defender, add an exception for the port

#### CORS Configuration
Make sure your backend allows requests from the frontend domain

### 4. Restart Development Server

After changing `.env.local`, restart your Next.js dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 5. User Registration

If you see "User not found" errors:
- Users must sign up first before they can sign in
- The error message now includes a link to the sign-up page
- New error handling provides clear feedback for:
  - Non-existent users (404)
  - Invalid credentials (401)
  - Connection issues (network errors)

## Testing the Connection

1. Open browser console (F12)
2. Try to sign in
3. Check the Network tab for the failed request
4. Verify the request URL matches your backend server

## Common Solutions

| Error | Solution |
|-------|----------|
| "name resolution failed" | Update API URL in `.env.local` to correct IP/domain |
| "User not found" | Create an account on the sign-up page first |
| "Cannot connect to server" | Start your backend server |
| "Invalid credentials" | Check email/password combination |
| CORS error | Configure CORS headers in backend |
