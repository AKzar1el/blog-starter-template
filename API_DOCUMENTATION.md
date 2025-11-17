# Blog API Documentation

## Overview

The Blog API allows you to create and manage blog posts programmatically. You can post to specific subcategories, use rich HTML content with SEO-optimized links, and embed YouTube videos and other media with flexible positioning.

## Authentication

All API requests require an API key in the `x-api-key` header:

```bash
x-api-key: YOUR_API_KEY
```

Set your API key in the `.env.local` file:
```
API_KEY=your-secret-api-key-here
```

## Endpoints

### POST /api/posts

Create a new blog post with rich HTML content and subcategory selection.

#### Request Headers

```
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | The blog post title |
| `content` | string | Yes | The blog post content (supports Markdown and HTML) |
| `excerpt` | string | Yes | Short summary/preview of the post |
| `author` | string | Yes | Author name |
| `tags` | array | Yes | Array of tags (minimum 1 tag) |
| `category` | string | No | Blog subcategory (see available categories below) |
| `slug` | string | No | Custom URL slug (auto-generated from title if not provided) |
| `coverImage` | string | No | URL to cover image |
| `embeddedMedia` | array | No | Array of media objects to embed (YouTube, Vimeo, video, audio) |

#### Available Categories

- `News`
- `Technology`
- `Business`
- `Education`
- `Ethics`
- `Art`
- `Entertainment`
- `Fun`
- `Games`
- `Music`
- `Politics`
- `History`

**Note:** `All Blog Posts` is the default category if none is specified.

#### Rich HTML Content Support

The `content` field supports:

1. **HTML Headings**: `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`
2. **Text Formatting**: `<strong>`, `<b>`, `<em>`, `<i>`, `<u>`
3. **SEO-Optimized Links**: `<a href="url" title="description">link text</a>`
4. **Lists**: `<ul>`, `<ol>`, `<li>`
5. **Code**: `<code>`, `<pre>`
6. **Blockquotes**: `<blockquote>`
7. **Images**: `<img src="url" alt="description">`
8. **Tables**: `<table>`, `<tr>`, `<td>`, `<th>`

You can also use standard Markdown syntax.

#### Embedded Media Support

The `embeddedMedia` field allows you to embed videos and audio with responsive layouts. Each media object in the array has the following structure:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | URL to the media (YouTube, Vimeo, or direct media file) |
| `type` | string | Yes | Media type: `youtube`, `vimeo`, `video`, or `audio` |
| `position` | string | No | Layout position: `inline`, `right`, `left`, or `full-width` (default: `inline`) |
| `caption` | string | No | Caption text to display below the media |

**Supported Media Types:**
- **YouTube**: Any YouTube URL (youtube.com/watch?v=..., youtu.be/...)
- **Vimeo**: Any Vimeo URL (vimeo.com/...)
- **Video**: Direct video files (.mp4, .webm, .ogg)
- **Audio**: Direct audio files (.mp3, .wav, .ogg, .m4a)

**Position Layouts:**
- **inline**: Centered within content flow (default, responsive)
- **right**: Video on right side, text wraps on left (desktop), stacks on mobile - Best for featuring video alongside explanatory text
- **left**: Video on left side, text wraps on right (desktop), stacks on mobile
- **full-width**: Spans full content width - Best for cinematic/important videos

#### Example Requests

##### Basic Post with Category

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Getting Started with Next.js 14",
    "content": "# Introduction\n\nNext.js 14 brings amazing new features...",
    "excerpt": "Learn about the new features in Next.js 14",
    "author": "John Doe",
    "tags": ["nextjs", "react", "web-development"],
    "category": "Technology"
  }'
```

##### Post with Rich HTML Content

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Advanced SEO Techniques for 2024",
    "content": "<h1>Advanced SEO Techniques</h1>\n\n<p>Search engine optimization is crucial for <strong>online visibility</strong>.</p>\n\n<h2>Key Strategies</h2>\n\n<p>Here are some proven techniques:</p>\n\n<ul>\n  <li><strong>Quality Content</strong>: Create valuable, original content</li>\n  <li><strong>Link Building</strong>: Build high-quality backlinks</li>\n  <li><strong>Technical SEO</strong>: Optimize site structure</li>\n</ul>\n\n<h2>Useful Resources</h2>\n\n<p>Check out <a href=\"https://moz.com\" title=\"Moz SEO Tools and Resources\">Moz</a> for comprehensive SEO guides.</p>\n\n<p>Learn more about <a href=\"https://web.dev\" title=\"Web.dev by Google - Web Performance\">web performance optimization</a>.</p>",
    "excerpt": "Master advanced SEO techniques to boost your online presence",
    "author": "Jane Smith",
    "tags": ["seo", "marketing", "web-development"],
    "category": "Business",
    "coverImage": "https://example.com/seo-cover.jpg"
  }'
```

##### Post with HTML Headings and Bolds

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "The Future of Artificial Intelligence",
    "content": "<h1>The Future of AI</h1>\n\n<p><strong>Artificial Intelligence</strong> is transforming every industry.</p>\n\n<h2>Current Trends</h2>\n\n<p>The following trends are shaping AI development:</p>\n\n<h3>Machine Learning</h3>\n<p><strong>Machine learning</strong> algorithms are becoming more sophisticated.</p>\n\n<h3>Natural Language Processing</h3>\n<p>NLP enables <strong>better human-computer interaction</strong>.</p>\n\n<h2>Future Predictions</h2>\n\n<p>Visit <a href=\"https://openai.com\" title=\"OpenAI - Leading AI Research\">OpenAI</a> for cutting-edge research.</p>",
    "excerpt": "Explore the current trends and future predictions in AI",
    "author": "Dr. Alex Johnson",
    "tags": ["ai", "machine-learning", "technology"],
    "category": "Technology"
  }'
```

##### Post to Education Subcategory

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Effective Study Techniques for Students",
    "content": "<h1>Study Smarter, Not Harder</h1>\n\n<h2>Active Learning</h2>\n<p><strong>Active learning</strong> involves engaging with the material.</p>\n\n<h2>Time Management</h2>\n<p>Use the <strong>Pomodoro Technique</strong> for better focus.</p>\n\n<p>Learn more about <a href=\"https://www.coursera.org\" title=\"Coursera - Online Courses\">online learning platforms</a>.</p>",
    "excerpt": "Discover proven study techniques to improve your learning",
    "author": "Prof. Sarah Williams",
    "tags": ["education", "learning", "productivity"],
    "category": "Education"
  }'
```

##### Post with YouTube Video Embed (Right Position)

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Learn React in 2024: Complete Tutorial",
    "content": "<h1>React Tutorial</h1>\n\n<p>React is the most popular JavaScript library for building user interfaces. In this comprehensive guide, we will cover everything you need to know.</p>\n\n<h2>Why Learn React?</h2>\n<p>React provides a <strong>component-based architecture</strong> that makes building complex UIs easier. It is used by companies like Facebook, Netflix, and Airbnb.</p>\n\n<h2>Getting Started</h2>\n<p>Watch the video tutorial on the right to get started with React. Follow along with the examples and build your first React application.</p>\n\n<p>For more resources, visit the <a href=\"https://react.dev\" title=\"React Official Documentation\">official React documentation</a>.</p>",
    "excerpt": "Master React with this comprehensive video tutorial and guide",
    "author": "John Developer",
    "tags": ["react", "javascript", "web-development", "tutorial"],
    "category": "Technology",
    "embeddedMedia": [
      {
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "type": "youtube",
        "position": "right",
        "caption": "Complete React Tutorial - 2024"
      }
    ]
  }'
```

##### Post with Multiple Media Embeds

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Ultimate Guide to Video Production",
    "content": "<h1>Video Production Masterclass</h1>\n\n<p>Learn professional video production techniques from industry experts.</p>\n\n<h2>Introduction</h2>\n<p>This course covers everything from <strong>pre-production planning</strong> to <strong>post-production editing</strong>.</p>\n\n<h2>Course Content</h2>\n<p>Follow along with our video tutorials and practice exercises to master video production.</p>",
    "excerpt": "Master video production with expert tutorials and hands-on practice",
    "author": "Maria Rodriguez",
    "tags": ["video", "production", "filmmaking", "tutorial"],
    "category": "Art",
    "coverImage": "https://example.com/video-production-cover.jpg",
    "embeddedMedia": [
      {
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "type": "youtube",
        "position": "full-width",
        "caption": "Introduction to Video Production"
      },
      {
        "url": "https://vimeo.com/123456789",
        "type": "vimeo",
        "position": "inline",
        "caption": "Advanced Lighting Techniques"
      }
    ]
  }'
```

##### Post with YouTube Video on Left

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Understanding Machine Learning Algorithms",
    "content": "<h1>Machine Learning Explained</h1>\n\n<p>Machine learning is revolutionizing how we solve complex problems. This tutorial will help you understand the fundamental algorithms.</p>\n\n<h2>Key Algorithms</h2>\n<p>We will cover <strong>supervised learning</strong>, <strong>unsupervised learning</strong>, and <strong>reinforcement learning</strong> with practical examples.</p>\n\n<h2>Applications</h2>\n<p>Learn how these algorithms are used in real-world applications like image recognition, natural language processing, and recommendation systems.</p>",
    "excerpt": "Deep dive into machine learning algorithms with video explanations",
    "author": "Dr. Alan Chen",
    "tags": ["machine-learning", "ai", "algorithms", "data-science"],
    "category": "Technology",
    "embeddedMedia": [
      {
        "url": "https://www.youtube.com/watch?v=example123",
        "type": "youtube",
        "position": "left",
        "caption": "ML Algorithms Explained Visually"
      }
    ]
  }'
```

##### Post with Vimeo Video (Inline)

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Creative Photography Techniques",
    "content": "<h1>Master Photography</h1>\n\n<p>Discover creative photography techniques used by professional photographers.</p>",
    "excerpt": "Learn professional photography techniques with video demonstrations",
    "author": "Emma Wilson",
    "tags": ["photography", "creative", "tutorial"],
    "category": "Art",
    "embeddedMedia": [
      {
        "url": "https://vimeo.com/987654321",
        "type": "vimeo",
        "position": "inline"
      }
    ]
  }'
```

#### Response

**Success (201 Created):**

```json
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "slug": "getting-started-with-nextjs-14",
    "title": "Getting Started with Next.js 14",
    "content": "# Introduction\n\nNext.js 14 brings amazing new features...",
    "excerpt": "Learn about the new features in Next.js 14",
    "author": "John Doe",
    "tags": ["nextjs", "react", "web-development"],
    "coverImage": null,
    "category": "Technology",
    "publishedAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "views": 0
  }
}
```

**Error Responses:**

```json
// 401 Unauthorized
{
  "error": "Unauthorized. Invalid or missing API key."
}

// 400 Bad Request - Missing fields
{
  "error": "Missing required fields: title, content, excerpt, author"
}

// 400 Bad Request - Invalid category
{
  "error": "Invalid category. Must be one of: News, Technology, Business, Education, Ethics, Art, Entertainment, Fun, Games, Music, Politics, History",
  "availableCategories": ["News", "Technology", "Business", "Education", "Ethics", "Art", "Entertainment", "Fun", "Games", "Music", "Politics", "History"]
}

// 400 Bad Request - Invalid tags
{
  "error": "Tags must be a non-empty array"
}

// 409 Conflict
{
  "error": "A post with this slug already exists"
}
```

### GET /api/posts

Retrieve all blog posts with optional pagination.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of posts to return |
| `offset` | number | No | Number of posts to skip |

#### Example Request

```bash
curl -X GET "http://localhost:3000/api/posts?limit=10&offset=0" \
  -H "Content-Type: application/json"
```

#### Response

```json
{
  "success": true,
  "count": 10,
  "posts": [
    {
      "id": 1,
      "slug": "post-slug",
      "title": "Post Title",
      "content": "Post content...",
      "excerpt": "Post excerpt",
      "author": "Author Name",
      "tags": ["tag1", "tag2"],
      "coverImage": "https://example.com/image.jpg",
      "category": "Technology",
      "publishedAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "views": 42
    }
  ]
}
```

## SEO Best Practices

### Link Embedding for Better SEO

When creating links in your content, use the `title` attribute for better SEO:

```html
<a href="https://example.com" title="Descriptive Title for SEO">Link Text</a>
```

**Benefits:**
- Improves accessibility
- Provides context to search engines
- Enhances user experience
- Automatically opens external links in new tab with `rel="noopener noreferrer"`

### Example with SEO-Optimized Links

```json
{
  "content": "<p>Learn more about web development at <a href=\"https://developer.mozilla.org\" title=\"MDN Web Docs - Comprehensive Web Development Resources\">MDN Web Docs</a>.</p>"
}
```

The system will automatically:
- Add `rel="noopener noreferrer"` to external links
- Add `target="_blank"` to open external links in new tab
- Use link text as title if no title is provided
- Generate IDs for all headings for anchor linking

## Tips

1. **Category Selection**: Always specify a category to help users find your content
2. **Rich HTML**: Use HTML headings (h1, h2, h3) to structure your content
3. **SEO Links**: Include title attributes in all links for better SEO
4. **Tags**: Use relevant tags to improve discoverability
5. **Cover Images**: Include high-quality cover images for better engagement
6. **Excerpts**: Write compelling excerpts to encourage clicks

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

HTTP Status Codes:
- `201`: Post created successfully
- `200`: Request successful
- `400`: Bad request (validation error)
- `401`: Unauthorized (invalid API key)
- `409`: Conflict (duplicate slug)
- `500`: Internal server error
