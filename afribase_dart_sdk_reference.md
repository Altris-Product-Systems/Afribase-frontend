# Afribase Dart/Flutter SDK Comprehensive Documentation

The official Dart and Flutter client for Afribase. This SDK provides a strongly typed, async/await friendly, Supabase-like interface for interacting with your Afribase backend, ideal for cross-platform mobile, web, and desktop development.

---

## 1. Installation & Initialization

Add the SDK to your Flutter project's `pubspec.yaml` file:

```yaml
dependencies:
  afribase: ^0.2.0
  # Note: The SDK relies on `http` and `web_socket_channel` internally.
```

Install the dependencies:

```bash
flutter pub get      # For Flutter projects
dart pub get         # For pure Dart projects
```

Initialize the client with your Afribase Project URL and Anonymous API Key. In Flutter apps, this is usually done in your `main.dart` file before `runApp()`.

```dart
import 'package:afribase/afribase.dart';

final client = AfribaseClient(
  'https://your-project.useafribase.app', 
  'your-anon-key'
);
```

---

## 2. Authentication (`client.auth`)

Afribase Auth supports standard email/password, magic links, OTP, and OAuth sign-ins. All methods return strongly-typed `Future`s.

### Sign Up / Sign In

```dart
// Register a user
final signUpRes = await client.auth.signUp(
  email: 'user@example.com', 
  password: 'securePassword123'
);
print("New User ID: ${signUpRes.user?.id}");

// Authenticate with Password
final signInRes = await client.auth.signInWithPassword(
  email: 'user@example.com', 
  password: 'securePassword123'
);
print("Access Token: ${signInRes.session?.accessToken}");
```

### Passwordless & OAuth

```dart
// Send OTP / Magic Link
await client.auth.signInWithOtp(email: 'user@example.com');

// Verify the OTP code
final verifyRes = await client.auth.verifyOtp(
  email: 'user@example.com', 
  token: '123456'
);

// OAuth (Social Login) - Returns the redirect URL you should launch in the browser
final oauthUrl = await client.auth.signInWithOAuth(provider: 'google');
```

### Session Management & Event Listeners

```dart
// Sign Out
await client.auth.signOut();

// Listen to auth state changes actively using callbacks
final unsubscribe = client.auth.onAuthStateChange((event, session) {
  print('Auth state changed to: $event');
  if (event == 'SIGNED_IN') {
    // Navigate to Home Screen
  } else if (event == 'SIGNED_OUT') {
    // Navigate to Login Screen
  }
});

// To stop listening:
// unsubscribe();
```

---

## 3. Database (`client.from()`)

Query your PostgreSQL database using the PostgREST Query Builder. You must call `.execute()` at the end of the query chain to execute the HTTP request.

### CRUD Methods

```dart
// Select
final selectData = await client.from('posts').select('*').execute();

// Insert
final insertData = await client.from('posts').insert({
  'title': 'Flutter SDK', 
  'body': 'Dart is awesome.'
}).execute();

// Update
final updateData = await client.from('posts')
    .update({'title': 'Dart SDK Updated'})
    .eq('id', 1)
    .execute();

// Delete
final deleteData = await client.from('posts')
    .delete()
    .eq('id', 1)
    .execute();
```

### Filters and Modifiers

You can chain filters sequentially:

```dart
final data = await client.from('products')
    .select('*')
    .eq('category', 'electronics')      // Equal
    .neq('status', 'draft')             // Not Equal
    .gt('price', 100)                   // Greater than
    .gte('stock', 10)                   // Greater/Equal
    .lt('price', 500)                   // Less than
    .order('created_at', ascending: false) // Order by Descending
    .limit(20)                          // Pagination Limit
    .execute();
```

---

## 4. PostgreSQL Functions / RPC (`client.rpc()`)

Call custom database stored procedures explicitly.

```dart
// Call a Postgres function named 'calculate_tax'
final result = await client.rpc(
  'calculate_tax', 
  {'amount': 100, 'rate': 0.15}
).execute();

print("Tax calculation: $result");
```

---

## 5. Realtime (`client.channel()`)

Listen to database changes, broadcast custom messages, or track presence logic using WebSockets.

### Subscribing to Postgres Changes & Broadcasts

```dart
// 1. Create a channel
final channel = client.channel('room-general');

// 2. Register callback for Broadcast messages
channel.onBroadcast('message', (payload) {
  print('Received broadcast payload: $payload');
});

// 3. Register callback for Database changes
channel.onPostgresChanges(
  event: 'INSERT',
  schema: 'public',
  table: 'messages',
  callback: (payload) {
    print('New database message: $payload');
  },
);

// 4. Register Presence Sync
channel.onPresenceSync((state) {
  print('Users currently online: $state');
});

// 5. Subscribe to jump on the websocket connection
channel.subscribe();

// Optional: Send data on the connection once subscribed
channel.sendBroadcast('message', {'text': 'Hello from Flutter!'});
channel.track({'user': 'flutter_user_1', 'status': 'typing...'});
```

*Note: In Flutter, it is good practice to call `client.dispose();` if the client is no longer needed (e.g., when a widget is disposed) to close websocket connections gracefully.*

---

## 6. Storage (`client.storage`)

Manage file uploads securely from your Dart application using `dart:typed_data`.

### Bucket Management

```dart
// List all buckets
final buckets = await client.storage.listBuckets();

// Create a new public bucket
await client.storage.createBucket('app-images', public: true);
```

### File Operations

```dart
import 'dart:typed_data';

final bucket = client.storage.from('avatars');

// Upload a File (Useful in Flutter Web/Mobile using bytes)
// Uint8List fileBytes = ...;
await bucket.upload('avatar.png', fileBytes);

// Download a File (Returns raw bytes)
final Uint8List data = await bucket.download('avatar.png');

// Get Public URL (if the bucket is public). Supports image transformations!
final publicUrl = bucket.getPublicUrl('avatar.png',
  transform: TransformOptions(width: 200, resize: 'contain')
);

// Create a Signed URL (for private buckets)
final signedUrl = await bucket.createSignedUrl('private_doc.pdf', expiresIn: 3600);

// List files inside a directory
final files = await bucket.list(path: 'folder/');

// Move or Copy files
await bucket.move('old_path.png', 'new_path.png');
await bucket.copy('base_image.png', 'duplicate_image.png');
```

---

## 7. Edge Functions (`client.functions`)

Invoke serverless Edge Functions hosted on Afribase gracefully.

```dart
final result = await client.functions.invoke(
  'process_payment', 
  body: {'user_id': 123, 'amount': 99.99}
);

print("Function response: $result");
```
