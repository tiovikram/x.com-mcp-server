import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// Validation schemas for X.com API endpoints

// Lookup schemas
const SinglePostLookupSchema = z.object({
  id: z.string(),
  expansions: z.string().optional(),
  "tweet.fields": z.string().optional(),
  "user.fields": z.string().optional(),
  "media.fields": z.string().optional(),
  "poll.fields": z.string().optional(),
  "place.fields": z.string().optional(),
});

const BulkPostsLookupSchema = z.object({
  ids: z.string(), // comma-separated list
  expansions: z.string().optional(),
  "tweet.fields": z.string().optional(),
  "user.fields": z.string().optional(),
  "media.fields": z.string().optional(),
  "poll.fields": z.string().optional(),
  "place.fields": z.string().optional(),
});

// Manage Posts schemas
const CreatePostSchema = z.object({
  text: z.string(),
  direct_message_deep_link: z.string().optional(),
  for_super_followers_only: z.boolean().optional(),
  geo: z.object({
    place_id: z.string().optional(),
  }).optional(),
  media: z.object({
    media_ids: z.array(z.string()).optional(),
    tagged_user_ids: z.array(z.string()).optional(),
  }).optional(),
  poll: z.object({
    duration_minutes: z.number().min(5).max(10080).optional(),
    options: z.array(z.string()).max(4).optional(),
  }).optional(),
  quote_tweet_id: z.string().optional(),
  reply: z.object({
    exclude_reply_user_ids: z.array(z.string()).optional(),
    in_reply_to_tweet_id: z.string().optional(),
  }).optional(),
  reply_settings: z.enum(["mentionedUsers", "following", "everyone"]).optional(),
});

const DeletePostSchema = z.object({
  id: z.string(),
});

const HideReplySchema = z.object({
  id: z.string(),
  hidden: z.boolean(),
});

// Timeline schemas
const UserTimelineSchema = z.object({
  id: z.string(),
  pagination_token: z.string().optional(),
  max_results: z.number().min(5).max(100).optional(),
  expansions: z.string().optional(),
  "tweet.fields": z.string().optional(),
  "user.fields": z.string().optional(),
  exclude: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  since_id: z.string().optional(),
  until_id: z.string().optional(),
});

const UserMentionsSchema = z.object({
  id: z.string(),
  pagination_token: z.string().optional(),
  max_results: z.number().min(5).max(100).optional(),
  expansions: z.string().optional(),
  "tweet.fields": z.string().optional(),
  "user.fields": z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  since_id: z.string().optional(),
  until_id: z.string().optional(),
});

// Search schemas
const SearchRecentSchema = z.object({
  query: z.string(),
  max_results: z.number().min(10).max(100).optional(),
  next_token: z.string().optional(),
  expansions: z.string().optional(),
  "tweet.fields": z.string().optional(),
  "user.fields": z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  since_id: z.string().optional(),
  until_id: z.string().optional(),
});

const SearchAllSchema = z.object({
  query: z.string(),
  max_results: z.number().min(10).max(500).optional(),
  next_token: z.string().optional(),
  previous_token: z.string().optional(),
  expansions: z.string().optional(),
  "tweet.fields": z.string().optional(),
  "user.fields": z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  since_id: z.string().optional(),
  until_id: z.string().optional(),
});

// Post Counts schemas
const PostCountsRecentSchema = z.object({
  query: z.string(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  since_id: z.string().optional(),
  until_id: z.string().optional(),
  granularity: z.enum(["minute", "hour", "day"]).optional(),
});

const PostCountsAllSchema = z.object({
  query: z.string(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  since_id: z.string().optional(),
  until_id: z.string().optional(),
  granularity: z.enum(["minute", "hour", "day"]).optional(),
});

// Retweets schemas
const ListRetweetsSchema = z.object({
  id: z.string(),
  max_results: z.number().min(1).max(100).optional(),
  pagination_token: z.string().optional(),
  expansions: z.string().optional(),
  "tweet.fields": z.string().optional(),
  "user.fields": z.string().optional(),
});

const CreateRetweetSchema = z.object({
  user_id: z.string(),
  tweet_id: z.string(),
});

const DeleteRetweetSchema = z.object({
  user_id: z.string(),
  tweet_id: z.string(),
});

// Likes schemas
const LikingUsersSchema = z.object({
  id: z.string(),
  max_results: z.number().min(1).max(100).optional(),
  pagination_token: z.string().optional(),
  expansions: z.string().optional(),
  "tweet.fields": z.string().optional(),
  "user.fields": z.string().optional(),
});

const LikedTweetsSchema = z.object({
  id: z.string(),
  max_results: z.number().min(1).max(100).optional(),
  pagination_token: z.string().optional(),
  expansions: z.string().optional(),
  "tweet.fields": z.string().optional(),
  "user.fields": z.string().optional(),
});

const LikePostSchema = z.object({
  user_id: z.string(),
  tweet_id: z.string(),
});

const UnlikePostSchema = z.object({
  user_id: z.string(),
  tweet_id: z.string(),
});

// Bookmarks schemas
const UserBookmarksSchema = z.object({
  id: z.string(),
  max_results: z.number().min(1).max(100).optional(),
  pagination_token: z.string().optional(),
  expansions: z.string().optional(),
  "tweet.fields": z.string().optional(),
  "user.fields": z.string().optional(),
});

const BookmarkPostSchema = z.object({
  user_id: z.string(),
  tweet_id: z.string(),
});

const RemoveBookmarkSchema = z.object({
  user_id: z.string(),
  tweet_id: z.string(),
});

// Define request types based on schemas
type SinglePostLookupRequest = z.infer<typeof SinglePostLookupSchema>;
type BulkPostsLookupRequest = z.infer<typeof BulkPostsLookupSchema>;
type CreatePostRequest = z.infer<typeof CreatePostSchema>;
type DeletePostRequest = z.infer<typeof DeletePostSchema>;
type HideReplyRequest = z.infer<typeof HideReplySchema>;
type UserTimelineRequest = z.infer<typeof UserTimelineSchema>;
type UserMentionsRequest = z.infer<typeof UserMentionsSchema>;
type SearchRecentRequest = z.infer<typeof SearchRecentSchema>;
type SearchAllRequest = z.infer<typeof SearchAllSchema>;
type PostCountsRecentRequest = z.infer<typeof PostCountsRecentSchema>;
type PostCountsAllRequest = z.infer<typeof PostCountsAllSchema>;
type ListRetweetsRequest = z.infer<typeof ListRetweetsSchema>;
type CreateRetweetRequest = z.infer<typeof CreateRetweetSchema>;
type DeleteRetweetRequest = z.infer<typeof DeleteRetweetSchema>;
type LikingUsersRequest = z.infer<typeof LikingUsersSchema>;
type LikedTweetsRequest = z.infer<typeof LikedTweetsSchema>;
type LikePostRequest = z.infer<typeof LikePostSchema>;
type UnlikePostRequest = z.infer<typeof UnlikePostSchema>;
type UserBookmarksRequest = z.infer<typeof UserBookmarksSchema>;
type BookmarkPostRequest = z.infer<typeof BookmarkPostSchema>;
type RemoveBookmarkRequest = z.infer<typeof RemoveBookmarkSchema>;

// X.com API client class with OAuth support
class XComAPI {
  private baseUrl = "https://api.twitter.com";
  private accessToken: string;

  constructor() {
    const accessToken = process.env.X_COM_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("X_COM_ACCESS_TOKEN environment variable is required");
    }
    this.accessToken = accessToken;
  }

  private encodeQueryParams(params: Record<string, unknown>): string {
    return Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        const encodedValue = encodeURIComponent(String(value));
        return `${encodeURIComponent(key)}=${encodedValue}`;
      })
      .join("&");
  }

  private async makeRequest(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    data?: unknown,
  ) {
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
    };

    let url = this.baseUrl + endpoint;

    if (method === "GET" && data) {
      url += "?" + this.encodeQueryParams(data as Record<string, unknown>);
    } else if (data && method !== "DELETE") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`X API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  // Lookup endpoints
  async getSinglePost(params: SinglePostLookupRequest) {
    const { id, ...queryParams } = params;
    return this.makeRequest(`/2/tweets/${id}`, "GET", queryParams);
  }

  async getBulkPosts(params: BulkPostsLookupRequest) {
    return this.makeRequest("/2/tweets", "GET", params);
  }

  // Manage Posts endpoints
  async createPost(params: CreatePostRequest) {
    return this.makeRequest("/2/tweets", "POST", params);
  }

  async deletePost(params: DeletePostRequest) {
    return this.makeRequest(`/2/tweets/${params.id}`, "DELETE");
  }

  async hideReply(params: HideReplyRequest) {
    const { id, ...body } = params;
    return this.makeRequest(`/2/tweets/${id}/hidden`, "PUT", body);
  }

  // Timeline endpoints
  async getUserTimeline(params: UserTimelineRequest) {
    const { id, ...queryParams } = params;
    return this.makeRequest(`/2/users/${id}/tweets`, "GET", queryParams);
  }

  async getUserMentions(params: UserMentionsRequest) {
    const { id, ...queryParams } = params;
    return this.makeRequest(`/2/users/${id}/mentions`, "GET", queryParams);
  }

  // Search endpoints
  async searchRecent(params: SearchRecentRequest) {
    return this.makeRequest("/2/tweets/search/recent", "GET", params);
  }

  async searchAll(params: SearchAllRequest) {
    return this.makeRequest("/2/tweets/search/all", "GET", params);
  }

  // Post Counts endpoints
  async getPostCountsRecent(params: PostCountsRecentRequest) {
    return this.makeRequest("/2/tweets/counts/recent", "GET", params);
  }

  async getPostCountsAll(params: PostCountsAllRequest) {
    return this.makeRequest("/2/tweets/counts/all", "GET", params);
  }

  // Retweets endpoints
  async getRetweets(params: ListRetweetsRequest) {
    const { id, ...queryParams } = params;
    return this.makeRequest(`/2/tweets/${id}/retweets`, "GET", queryParams);
  }

  async createRetweet(params: CreateRetweetRequest) {
    const { user_id, tweet_id } = params;
    return this.makeRequest(`/2/users/${user_id}/retweets`, "POST", { tweet_id });
  }

  async deleteRetweet(params: DeleteRetweetRequest) {
    const { user_id, tweet_id } = params;
    return this.makeRequest(`/2/users/${user_id}/retweets/${tweet_id}`, "DELETE");
  }

  // Likes endpoints
  async getLikingUsers(params: LikingUsersRequest) {
    const { id, ...queryParams } = params;
    return this.makeRequest(`/2/tweets/${id}/liking_users`, "GET", queryParams);
  }

  async getLikedTweets(params: LikedTweetsRequest) {
    const { id, ...queryParams } = params;
    return this.makeRequest(`/2/users/${id}/liked_tweets`, "GET", queryParams);
  }

  async likePost(params: LikePostRequest) {
    const { user_id, tweet_id } = params;
    return this.makeRequest(`/2/users/${user_id}/likes`, "POST", { tweet_id });
  }

  async unlikePost(params: UnlikePostRequest) {
    const { user_id, tweet_id } = params;
    return this.makeRequest(`/2/users/${user_id}/likes/${tweet_id}`, "DELETE");
  }

  // Bookmarks endpoints
  async getUserBookmarks(params: UserBookmarksRequest) {
    const { id, ...queryParams } = params;
    return this.makeRequest(`/2/users/${id}/bookmarks`, "GET", queryParams);
  }

  async bookmarkPost(params: BookmarkPostRequest) {
    const { user_id, tweet_id } = params;
    return this.makeRequest(`/2/users/${user_id}/bookmarks`, "POST", { tweet_id });
  }

  async removeBookmark(params: RemoveBookmarkRequest) {
    const { user_id, tweet_id } = params;
    return this.makeRequest(`/2/users/${user_id}/bookmarks/${tweet_id}`, "DELETE");
  }
}

// Define tools for X.com API
const TOOLS: Record<string, Tool> = {
  getSinglePost: {
    name: "getSinglePost",
    description: "Retrieve a single post by ID with optional field expansions",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The ID of the post to retrieve" },
        expansions: { type: "string", description: "Comma-separated list of expansion fields" },
        "tweet.fields": { type: "string", description: "Comma-separated list of tweet fields to include" },
        "user.fields": { type: "string", description: "Comma-separated list of user fields to include" },
        "media.fields": { type: "string", description: "Comma-separated list of media fields to include" },
        "poll.fields": { type: "string", description: "Comma-separated list of poll fields to include" },
        "place.fields": { type: "string", description: "Comma-separated list of place fields to include" },
      },
      required: ["id"],
    },
  },
  getBulkPosts: {
    name: "getBulkPosts",
    description: "Retrieve up to 100 posts by their IDs",
    inputSchema: {
      type: "object",
      properties: {
        ids: { type: "string", description: "Comma-separated list of post IDs (up to 100)" },
        expansions: { type: "string", description: "Comma-separated list of expansion fields" },
        "tweet.fields": { type: "string", description: "Comma-separated list of tweet fields to include" },
        "user.fields": { type: "string", description: "Comma-separated list of user fields to include" },
        "media.fields": { type: "string", description: "Comma-separated list of media fields to include" },
        "poll.fields": { type: "string", description: "Comma-separated list of poll fields to include" },
        "place.fields": { type: "string", description: "Comma-separated list of place fields to include" },
      },
      required: ["ids"],
    },
  },
  createPost: {
    name: "createPost",
    description: "Create a new post on behalf of the authenticated user",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "The text content of the post" },
        direct_message_deep_link: { type: "string", description: "Direct message deep link" },
        for_super_followers_only: { type: "boolean", description: "Whether the post is for super followers only" },
        geo: {
          type: "object",
          properties: {
            place_id: { type: "string", description: "The place ID for geo-tagging" },
          },
        },
        media: {
          type: "object",
          properties: {
            media_ids: { type: "array", items: { type: "string" }, description: "Array of media IDs to attach" },
            tagged_user_ids: { type: "array", items: { type: "string" }, description: "Array of user IDs to tag in media" },
          },
        },
        poll: {
          type: "object",
          properties: {
            duration_minutes: { type: "number", minimum: 5, maximum: 10080, description: "Poll duration in minutes" },
            options: { type: "array", items: { type: "string" }, maxItems: 4, description: "Poll options" },
          },
        },
        quote_tweet_id: { type: "string", description: "ID of the post to quote" },
        reply: {
          type: "object",
          properties: {
            exclude_reply_user_ids: { type: "array", items: { type: "string" }, description: "User IDs to exclude from reply" },
            in_reply_to_tweet_id: { type: "string", description: "ID of the post being replied to" },
          },
        },
        reply_settings: { type: "string", enum: ["mentionedUsers", "following", "everyone"], description: "Who can reply to this post" },
      },
      required: ["text"],
    },
  },
  deletePost: {
    name: "deletePost",
    description: "Delete a post by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The ID of the post to delete" },
      },
      required: ["id"],
    },
  },
  hideReply: {
    name: "hideReply",
    description: "Hide or unhide a reply to a post",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The ID of the reply to hide/unhide" },
        hidden: { type: "boolean", description: "Whether to hide (true) or unhide (false) the reply" },
      },
      required: ["id", "hidden"],
    },
  },
  getUserTimeline: {
    name: "getUserTimeline",
    description: "Get a user's timeline of posts",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The user ID whose timeline to retrieve" },
        pagination_token: { type: "string", description: "Token for pagination" },
        max_results: { type: "number", minimum: 5, maximum: 100, description: "Maximum number of results" },
        expansions: { type: "string", description: "Comma-separated list of expansion fields" },
        "tweet.fields": { type: "string", description: "Comma-separated list of tweet fields to include" },
        "user.fields": { type: "string", description: "Comma-separated list of user fields to include" },
        exclude: { type: "string", description: "Comma-separated list of types to exclude" },
        start_time: { type: "string", description: "Start time for the timeline" },
        end_time: { type: "string", description: "End time for the timeline" },
        since_id: { type: "string", description: "Only return posts after this ID" },
        until_id: { type: "string", description: "Only return posts before this ID" },
      },
      required: ["id"],
    },
  },
  getUserMentions: {
    name: "getUserMentions",
    description: "Get posts that mention a specific user",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The user ID whose mentions to retrieve" },
        pagination_token: { type: "string", description: "Token for pagination" },
        max_results: { type: "number", minimum: 5, maximum: 100, description: "Maximum number of results" },
        expansions: { type: "string", description: "Comma-separated list of expansion fields" },
        "tweet.fields": { type: "string", description: "Comma-separated list of tweet fields to include" },
        "user.fields": { type: "string", description: "Comma-separated list of user fields to include" },
        start_time: { type: "string", description: "Start time for the mentions" },
        end_time: { type: "string", description: "End time for the mentions" },
        since_id: { type: "string", description: "Only return posts after this ID" },
        until_id: { type: "string", description: "Only return posts before this ID" },
      },
      required: ["id"],
    },
  },
  searchRecent: {
    name: "searchRecent",
    description: "Search recent posts (last 7 days)",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query string" },
        max_results: { type: "number", minimum: 10, maximum: 100, description: "Maximum number of results" },
        next_token: { type: "string", description: "Token for next page of results" },
        expansions: { type: "string", description: "Comma-separated list of expansion fields" },
        "tweet.fields": { type: "string", description: "Comma-separated list of tweet fields to include" },
        "user.fields": { type: "string", description: "Comma-separated list of user fields to include" },
        start_time: { type: "string", description: "Start time for the search" },
        end_time: { type: "string", description: "End time for the search" },
        since_id: { type: "string", description: "Only return posts after this ID" },
        until_id: { type: "string", description: "Only return posts before this ID" },
      },
      required: ["query"],
    },
  },
  searchAll: {
    name: "searchAll",
    description: "Search all posts (full archive - requires Academic Research or Enterprise access)",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query string" },
        max_results: { type: "number", minimum: 10, maximum: 500, description: "Maximum number of results" },
        next_token: { type: "string", description: "Token for next page of results" },
        previous_token: { type: "string", description: "Token for previous page of results" },
        expansions: { type: "string", description: "Comma-separated list of expansion fields" },
        "tweet.fields": { type: "string", description: "Comma-separated list of tweet fields to include" },
        "user.fields": { type: "string", description: "Comma-separated list of user fields to include" },
        start_time: { type: "string", description: "Start time for the search" },
        end_time: { type: "string", description: "End time for the search" },
        since_id: { type: "string", description: "Only return posts after this ID" },
        until_id: { type: "string", description: "Only return posts before this ID" },
      },
      required: ["query"],
    },
  },
  getPostCountsRecent: {
    name: "getPostCountsRecent",
    description: "Get time-bucketed post counts for recent posts (last 7 days)",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query string for counting posts" },
        start_time: { type: "string", description: "Start time for the count period" },
        end_time: { type: "string", description: "End time for the count period" },
        since_id: { type: "string", description: "Only count posts after this ID" },
        until_id: { type: "string", description: "Only count posts before this ID" },
        granularity: { type: "string", enum: ["minute", "hour", "day"], description: "Time granularity for counts" },
      },
      required: ["query"],
    },
  },
  getPostCountsAll: {
    name: "getPostCountsAll",
    description: "Get time-bucketed post counts for all posts (full archive - requires Academic Research or Enterprise access)",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query string for counting posts" },
        start_time: { type: "string", description: "Start time for the count period" },
        end_time: { type: "string", description: "End time for the count period" },
        since_id: { type: "string", description: "Only count posts after this ID" },
        until_id: { type: "string", description: "Only count posts before this ID" },
        granularity: { type: "string", enum: ["minute", "hour", "day"], description: "Time granularity for counts" },
      },
      required: ["query"],
    },
  },
  getRetweets: {
    name: "getRetweets",
    description: "Get posts that retweet a specific post",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The post ID to get retweets for" },
        max_results: { type: "number", minimum: 1, maximum: 100, description: "Maximum number of results" },
        pagination_token: { type: "string", description: "Token for pagination" },
        expansions: { type: "string", description: "Comma-separated list of expansion fields" },
        "tweet.fields": { type: "string", description: "Comma-separated list of tweet fields to include" },
        "user.fields": { type: "string", description: "Comma-separated list of user fields to include" },
      },
      required: ["id"],
    },
  },
  createRetweet: {
    name: "createRetweet",
    description: "Retweet a post on behalf of the authenticated user",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "string", description: "The user ID who is retweeting" },
        tweet_id: { type: "string", description: "The post ID to retweet" },
      },
      required: ["user_id", "tweet_id"],
    },
  },
  deleteRetweet: {
    name: "deleteRetweet",
    description: "Remove a retweet on behalf of the authenticated user",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "string", description: "The user ID who is removing the retweet" },
        tweet_id: { type: "string", description: "The post ID to un-retweet" },
      },
      required: ["user_id", "tweet_id"],
    },
  },
  getLikingUsers: {
    name: "getLikingUsers",
    description: "Get users who liked a specific post",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The post ID to get liking users for" },
        max_results: { type: "number", minimum: 1, maximum: 100, description: "Maximum number of results" },
        pagination_token: { type: "string", description: "Token for pagination" },
        expansions: { type: "string", description: "Comma-separated list of expansion fields" },
        "tweet.fields": { type: "string", description: "Comma-separated list of tweet fields to include" },
        "user.fields": { type: "string", description: "Comma-separated list of user fields to include" },
      },
      required: ["id"],
    },
  },
  getLikedTweets: {
    name: "getLikedTweets",
    description: "Get posts that a user has liked",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The user ID whose liked posts to retrieve" },
        max_results: { type: "number", minimum: 1, maximum: 100, description: "Maximum number of results" },
        pagination_token: { type: "string", description: "Token for pagination" },
        expansions: { type: "string", description: "Comma-separated list of expansion fields" },
        "tweet.fields": { type: "string", description: "Comma-separated list of tweet fields to include" },
        "user.fields": { type: "string", description: "Comma-separated list of user fields to include" },
      },
      required: ["id"],
    },
  },
  likePost: {
    name: "likePost",
    description: "Like a post on behalf of the authenticated user",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "string", description: "The user ID who is liking the post" },
        tweet_id: { type: "string", description: "The post ID to like" },
      },
      required: ["user_id", "tweet_id"],
    },
  },
  unlikePost: {
    name: "unlikePost",
    description: "Unlike a post on behalf of the authenticated user",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "string", description: "The user ID who is unliking the post" },
        tweet_id: { type: "string", description: "The post ID to unlike" },
      },
      required: ["user_id", "tweet_id"],
    },
  },
  getUserBookmarks: {
    name: "getUserBookmarks",
    description: "Get a user's bookmarked posts",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The user ID whose bookmarks to retrieve" },
        max_results: { type: "number", minimum: 1, maximum: 100, description: "Maximum number of results" },
        pagination_token: { type: "string", description: "Token for pagination" },
        expansions: { type: "string", description: "Comma-separated list of expansion fields" },
        "tweet.fields": { type: "string", description: "Comma-separated list of tweet fields to include" },
        "user.fields": { type: "string", description: "Comma-separated list of user fields to include" },
      },
      required: ["id"],
    },
  },
  bookmarkPost: {
    name: "bookmarkPost",
    description: "Bookmark a post on behalf of the authenticated user",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "string", description: "The user ID who is bookmarking the post" },
        tweet_id: { type: "string", description: "The post ID to bookmark" },
      },
      required: ["user_id", "tweet_id"],
    },
  },
  removeBookmark: {
    name: "removeBookmark",
    description: "Remove a bookmark on behalf of the authenticated user",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "string", description: "The user ID who is removing the bookmark" },
        tweet_id: { type: "string", description: "The post ID to remove from bookmarks" },
      },
      required: ["user_id", "tweet_id"],
    },
  },
};

// Create and configure the MCP server
async function main() {
  const api = new XComAPI();

  const server = new Server(
    {
      name: "x-com-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Register tool list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: Object.values(TOOLS),
  }));

  // Register tool call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const args = request.params.arguments as Record<string, unknown>;

      switch (request.params.name) {
        case "getSinglePost": {
          const validatedArgs = SinglePostLookupSchema.parse(args);
          const result = await api.getSinglePost(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "getBulkPosts": {
          const validatedArgs = BulkPostsLookupSchema.parse(args);
          const result = await api.getBulkPosts(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "createPost": {
          const validatedArgs = CreatePostSchema.parse(args);
          const result = await api.createPost(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "deletePost": {
          const validatedArgs = DeletePostSchema.parse(args);
          const result = await api.deletePost(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "hideReply": {
          const validatedArgs = HideReplySchema.parse(args);
          const result = await api.hideReply(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "getUserTimeline": {
          const validatedArgs = UserTimelineSchema.parse(args);
          const result = await api.getUserTimeline(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "getUserMentions": {
          const validatedArgs = UserMentionsSchema.parse(args);
          const result = await api.getUserMentions(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "searchRecent": {
          const validatedArgs = SearchRecentSchema.parse(args);
          const result = await api.searchRecent(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "searchAll": {
          const validatedArgs = SearchAllSchema.parse(args);
          const result = await api.searchAll(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "getPostCountsRecent": {
          const validatedArgs = PostCountsRecentSchema.parse(args);
          const result = await api.getPostCountsRecent(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "getPostCountsAll": {
          const validatedArgs = PostCountsAllSchema.parse(args);
          const result = await api.getPostCountsAll(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "getRetweets": {
          const validatedArgs = ListRetweetsSchema.parse(args);
          const result = await api.getRetweets(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "createRetweet": {
          const validatedArgs = CreateRetweetSchema.parse(args);
          const result = await api.createRetweet(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "deleteRetweet": {
          const validatedArgs = DeleteRetweetSchema.parse(args);
          const result = await api.deleteRetweet(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "getLikingUsers": {
          const validatedArgs = LikingUsersSchema.parse(args);
          const result = await api.getLikingUsers(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "getLikedTweets": {
          const validatedArgs = LikedTweetsSchema.parse(args);
          const result = await api.getLikedTweets(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "likePost": {
          const validatedArgs = LikePostSchema.parse(args);
          const result = await api.likePost(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "unlikePost": {
          const validatedArgs = UnlikePostSchema.parse(args);
          const result = await api.unlikePost(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "getUserBookmarks": {
          const validatedArgs = UserBookmarksSchema.parse(args);
          const result = await api.getUserBookmarks(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "bookmarkPost": {
          const validatedArgs = BookmarkPostSchema.parse(args);
          const result = await api.bookmarkPost(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        case "removeBookmark": {
          const validatedArgs = RemoveBookmarkSchema.parse(args);
          const result = await api.removeBookmark(validatedArgs);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        default:
          return {
            content: [
              {
                type: "text",
                text: `Unknown tool: ${request.params.name}`,
              },
            ],
            isError: true,
          };
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `X API error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Start the server
  const transport = new StdioServerTransport();
  try {
    await server.connect(transport);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to start X.com MCP server:", error.message);
    } else {
      console.error("Failed to start X.com MCP server with unknown error");
    }
    process.exit(1);
  }
}

main();