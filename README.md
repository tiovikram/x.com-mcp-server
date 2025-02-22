# X.com MCP Server

A Model Context Protocol server that provides access to X.com's API capabilities. This server enables LLMs to interact with X.com (formerly Twitter) through OAuth 2.0 authentication, supporting all major Post-related operations including reading, writing, searching, and managing posts, likes, retweets, and bookmarks.

## Features

- **OAuth 2.0 Authentication** - Secure Bearer token authentication
- **Complete Post API Coverage** - All X.com Post endpoints from the official API
- **Type Safety** - Full TypeScript implementation with Zod validation
- **Comprehensive Tools** - 21 tools covering all major X.com operations

## Available Tools

### Lookup
- `getSinglePost` - Retrieve a single post by ID with optional field expansions
- `getBulkPosts` - Retrieve up to 100 posts by their IDs

### Manage Posts
- `createPost` - Create a new post with text, media, polls, replies, etc.
- `deletePost` - Delete a post by ID
- `hideReply` - Hide or unhide a reply to a post

### Timelines
- `getUserTimeline` - Get a user's timeline of posts
- `getUserMentions` - Get posts that mention a specific user

### Search
- `searchRecent` - Search recent posts (last 7 days)
- `searchAll` - Search all posts (full archive - requires Academic/Enterprise access)

### Post Counts
- `getPostCountsRecent` - Get time-bucketed post counts for recent posts
- `getPostCountsAll` - Get time-bucketed post counts for all posts (Academic/Enterprise)

### Retweets
- `getRetweets` - Get posts that retweet a specific post
- `createRetweet` - Retweet a post
- `deleteRetweet` - Remove a retweet

### Likes
- `getLikingUsers` - Get users who liked a specific post
- `getLikedTweets` - Get posts that a user has liked
- `likePost` - Like a post
- `unlikePost` - Unlike a post

### Bookmarks
- `getUserBookmarks` - Get a user's bookmarked posts
- `bookmarkPost` - Bookmark a post
- `removeBookmark` - Remove a bookmark

## Installation

### Using pnpm (recommended)

```bash
pnpm install
pnpm run build
```

After installation, you can run it using:

```bash
node dist/index.js
```

### Using Docker

```bash
docker build -t x.com-mcp .
docker run -i --rm -e X_COM_ACCESS_TOKEN=your-access-token x.com-mcp
```

## Configuration

### Environment Variables

- `X_COM_ACCESS_TOKEN` (required): Your X.com OAuth 2.0 access token

### Authentication Setup

1. Create an X.com Developer Account at [developer.x.com](https://developer.x.com)
2. Create a new project and app
3. Generate OAuth 2.0 credentials
4. Implement the OAuth 2.0 Authorization Code with PKCE flow
5. Store the resulting access token as `X_COM_ACCESS_TOKEN`

### Configure for Claude.app

Add to your Claude settings:

<details>
<summary>Using pnpm</summary>

```json
"mcpServers": {
  "x-com": {
    "command": "node",
    "args": ["dist/index.js"],
    "env": {
      "X_COM_ACCESS_TOKEN": "your-access-token"
    }
  }
}
```
</details>

<details>
<summary>Using Docker</summary>

```json
"mcpServers": {
  "x-com": {
    "command": "docker",
    "args": ["run", "-i", "--rm", "-e", "X_COM_ACCESS_TOKEN=your-access-token", "x.com-mcp"]
  }
}
```
</details>

## Example Interactions

1. Create a post:
```json
{
  "name": "createPost",
  "arguments": {
    "text": "Hello world! This is my first post via the MCP server.",
    "reply_settings": "everyone"
  }
}
```

2. Search recent posts:
```json
{
  "name": "searchRecent",
  "arguments": {
    "query": "artificial intelligence",
    "max_results": 10,
    "tweet.fields": "created_at,author_id,public_metrics"
  }
}
```

3. Get user timeline:
```json
{
  "name": "getUserTimeline",
  "arguments": {
    "id": "123456789",
    "max_results": 20,
    "expansions": "author_id"
  }
}
```

4. Like a post:
```json
{
  "name": "likePost",
  "arguments": {
    "user_id": "123456789",
    "tweet_id": "987654321"
  }
}
```

5. Get post counts:
```json
{
  "name": "getPostCountsRecent",
  "arguments": {
    "query": "machine learning",
    "granularity": "day"
  }
}
```

## API Endpoints Covered

This server implements all Post-related endpoints from the X.com API v2 specification:

- **Lookup**: `/2/tweets/:id`, `/2/tweets`
- **Manage Posts**: `/2/tweets` (POST), `/2/tweets/:id` (DELETE), `/2/tweets/:id/hidden` (PUT)
- **Timelines**: `/2/users/:id/tweets`, `/2/users/:id/mentions`
- **Search**: `/2/tweets/search/recent`, `/2/tweets/search/all`
- **Post Counts**: `/2/tweets/counts/recent`, `/2/tweets/counts/all`
- **Retweets**: `/2/tweets/:id/retweets`, `/2/users/:id/retweets`
- **Likes**: `/2/tweets/:id/liking_users`, `/2/users/:id/liked_tweets`, `/2/users/:id/likes`
- **Bookmarks**: `/2/users/:id/bookmarks`

## Required Scopes

Ensure your X.com app has the following OAuth 2.0 scopes:
- `tweet.read` - Read posts and user information
- `tweet.write` - Create and delete posts
- `tweet.moderate.write` - Hide/unhide replies
- `users.read` - Read user information
- `like.read` - Read likes information
- `like.write` - Like and unlike posts
- `bookmark.read` - Read bookmarks
- `bookmark.write` - Create and delete bookmarks

## Debugging

You can use the MCP inspector to debug the server:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Examples of Questions for Claude

1. "Can you search for recent posts about artificial intelligence?"
2. "Create a post about the benefits of TypeScript."
3. "Find posts that mention machine learning and show their engagement metrics."
4. "Get my recent bookmarks and analyze the topics."

## Build

```bash
# Install dependencies
pnpm install

# Build TypeScript
pnpm run build

# Start server
pnpm start
```

## Rate Limits

Be aware of X.com API rate limits:
- Most read operations: 300 requests per 15 minutes
- Write operations: 50 requests per 15 minutes
- Bookmark operations: 50 write / 180 read per 15 minutes

Refer to the [X.com API documentation](https://docs.x.com/x-api/fundamentals/rate-limits) for detailed rate limit information.
