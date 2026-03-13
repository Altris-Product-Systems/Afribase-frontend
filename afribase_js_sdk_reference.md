# @afribase/afribase-js Comprehensive Documentation

The official JavaScript and TypeScript client for Afribase. This SDK provides a single, unified interface that perfectly mimics the popular `supabase-js` API, allowing you to interact with Authentication, Database functionality, Realtime subscriptions, Storage, and Edge Functions.

---

## 1. Installation

Install the Afribase SDK via your preferred package manager.

**Using npm:**
```bash
npm install @afribase/afribase-js
```

**Using yarn:**
```bash
yarn add @afribase/afribase-js
```

**Using pnpm:**
```bash
pnpm add @afribase/afribase-js
```

---

## 2. Initialization

Before you can interact with your backend, implement the [AfribaseClient](file:///Users/ryuzakii/afribase-backend/sdks/afribase-js/src/index.ts#90-233). You will need your project's API URL and public anonymous key (`anon-key`).

```typescript
import { createClient } from '@afribase/afribase-js';

const apiUrl = process.env.NEXT_PUBLIC_AFRIBASE_URL || 'https://your-project.useafribase.app';
const anonKey = process.env.NEXT_PUBLIC_AFRIBASE_ANON_KEY || 'your-anon-key';

// Initialize the universal client
export const afribase = createClient(apiUrl, anonKey);
```

---

## 3. Services & API Reference

Afribase unifies all backend services under a single configured client.

### 🛡️ Authentication (`afribase.auth`)

Complete user management, built over GoTrue endpoints.

```typescript
// 1. Sign Up
const { data, error } = await afribase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123!',
});

// 2. Sign In
const { data: sessionData, error: signInError } = await afribase.auth.signIn({
  email: 'user@example.com',
  password: 'securePassword123!',
});
// `sessionData` contains the access_token and user object.

// 3. Get Current User 
// (Useful for validating a user session on initial load or route changes)
const { user, error: userError } = await afribase.auth.getUser();

// 4. Listen to Auth State Changes
afribase.auth.onAuthStateChange((event, session) => {
  console.log('Auth Event:', event); // e.g., 'SIGNED_IN', 'SIGNED_OUT'
  console.log('Session state:', session);
});

// 5. Sign Out
const { error: signOutError } = await afribase.auth.signOut();
```


### 🗄️ Database Operations (`afribase.from()`)

Directly and safely query your PostgreSQL database through the auto-generated PostgREST API.

```typescript
// 1. Fetching Data (Select)
const { data: allPosts, error: listError } = await afribase
  .from('posts')
  .select('*');

// Filtering and Pagination
const { data: activePosts } = await afribase
  .from('posts')
  .select('id, title, created_at')
  .eq('published', true)
  .order('created_at', { ascending: false })
  .limit(10);

// 2. Inserting Data
const { data: newPost, error: insertError } = await afribase
  .from('posts')
  .insert([
    { title: 'Hello Africa', content: 'Our new platform.', published: true }
  ]);

// 3. Updating Data
const { data: updated, error: updateError } = await afribase
  .from('posts')
  .update({ published: false })
  .eq('id', 1);

// 4. Deleting Data
const { data: deleted, error: delError } = await afribase
  .from('posts')
  .delete()
  .eq('id', 1);
```


### ⚡ PostgreSQL Functions (RPC) (`afribase.rpc()`)

You can execute custom PostgreSQL stored procedures (functions) from the client.

```typescript
// Call a custom database function named 'get_top_users'
const { data: totalUsers, error: rpcError } = await afribase.rpc('get_top_users', { 
  limit_count: 10 // Pass parameters directly to your Postgres function
});

if (!rpcError) {
  console.log('Top users:', totalUsers);
}
```


### 📡 Realtime Subscriptions (`afribase.channel()`)

Listen to database changes in real-time or send broadcast messages between clients via WebSockets.

```typescript
// Create a channel targeting a specific "room" or topic
const channel = afribase.channel('room:lobby');

channel
  // Listen for custom broadcast messages from other clients
  .on('broadcast', { event: 'message' }, (payload) => {
    console.log('Received message:', payload);
  })
  
  // (Assuming Postgres change payloads are active)
  // Listen for changes in the 'public' database schema
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
    console.log('New database message inserted!', payload.new);
  })
  
  // Commit the subscription
  .subscribe();

// To remove all active socket connections
// afribase.removeAllChannels();
```


### 🗃️ Storage (`afribase.storage`)

Manage file uploads and downloads.

```typescript
// Upload a file to a specific bucket
const file = event.target.files[0];

const { data, error } = await afribase.storage
  .from('avatars') // Bucket name
  .upload(`public/${file.name}`, file, {
    cacheControl: '3600',
    upsert: false
  });

// Retrieve a public URL for an asset
const { data: urlData } = afribase.storage
  .from('avatars')
  .getPublicUrl('public/avatar.png');

console.log('Public URL:', urlData.publicUrl);
```


### 🚀 Edge Functions (`afribase.functions`)

Invoke custom serverless functions deployed to your Afribase project.

```typescript
// Invoke a deployed function named "process-payment"
const { data, error } = await afribase.functions.invoke('process-payment', {
  body: { amount: 100, currency: 'USD' }
});

if (error) {
  console.error("Function failed:", error);
} else {
  console.log("Function response:", data);
}
```

---

## 4. Understanding Responses

The SDK uses a normalized tuple response format [({ data, error })](file:///Users/ryuzakii/afribase-backend/sdks/afribase-js/src/index.ts#183-203) across **all** modules (Auth, Db, Storage, Functions). 

Always check for `error` before using `data`:

```typescript
const { data, error } = await afribase.from('companies').select('*');

// Handle errors globally or locally
if (error) {
  // `error` usually contains .message, .details, and .code
  console.error(`Status ${error.code}: ${error.message}`);
  return;
}

// Data is guaranteed to exist inside this safe block
renderData(data);
```
