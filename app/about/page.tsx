import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about our professional blog and how to contribute using our API.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-8">
          About This Blog
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            Welcome to our professional blog platform - a modern, clean, and SEO-optimized space for sharing insights, articles, and thoughts on technology, development, and innovation.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
            Features
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>✨ Modern, minimalist design with a focus on readability</li>
            <li>🚀 Built with Next.js 14+ for optimal performance and SEO</li>
            <li>📝 Full markdown support with syntax highlighting</li>
            <li>🔍 SEO-optimized with dynamic meta tags, JSON-LD, and sitemap</li>
            <li>📱 Fully responsive and mobile-friendly</li>
            <li>🎨 Clean, professional UI with Tailwind CSS</li>
            <li>💾 SQLite database for reliable post storage</li>
            <li>🔐 Secure API endpoint for programmatic posting</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
            API Documentation
          </h2>
          <p className="text-gray-700 mb-4">
            This blog includes a powerful API for programmatically creating blog posts. Here&apos;s how to use it:
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
            Creating a New Post
          </h3>
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4">
            <pre className="text-sm">
{`curl -X POST http://localhost:3000/api/posts \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "title": "My First Blog Post",
    "content": "# Hello World\\n\\nThis is my first post!",
    "excerpt": "A brief introduction to my first post",
    "author": "John Doe",
    "tags": ["tutorial", "getting-started"],
    "slug": "my-first-post",
    "coverImage": "https://example.com/image.jpg"
  }'`}
            </pre>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
            Required Fields
          </h3>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li><strong>title</strong> - The post title</li>
            <li><strong>content</strong> - Markdown content for the post</li>
            <li><strong>excerpt</strong> - Brief summary of the post</li>
            <li><strong>author</strong> - Author name</li>
            <li><strong>tags</strong> - Array of tags</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
            Optional Fields
          </h3>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li><strong>slug</strong> - Custom URL slug (auto-generated from title if not provided)</li>
            <li><strong>coverImage</strong> - URL to cover image</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
            Setup Instructions
          </h3>
          <ol className="space-y-2 text-gray-700">
            <li>1. Clone the repository</li>
            <li>2. Copy <code className="text-sm bg-gray-100 px-2 py-1 rounded">.env.example</code> to <code className="text-sm bg-gray-100 px-2 py-1 rounded">.env</code></li>
            <li>3. Set your <code className="text-sm bg-gray-100 px-2 py-1 rounded">API_KEY</code> in the <code className="text-sm bg-gray-100 px-2 py-1 rounded">.env</code> file</li>
            <li>4. Install dependencies: <code className="text-sm bg-gray-100 px-2 py-1 rounded">npm install</code></li>
            <li>5. Run the development server: <code className="text-sm bg-gray-100 px-2 py-1 rounded">npm run dev</code></li>
            <li>6. Start creating posts via the API!</li>
          </ol>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
            Technology Stack
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li><strong>Framework:</strong> Next.js 14+ with App Router</li>
            <li><strong>Language:</strong> TypeScript</li>
            <li><strong>Styling:</strong> Tailwind CSS</li>
            <li><strong>Database:</strong> SQLite with better-sqlite3</li>
            <li><strong>Markdown:</strong> react-markdown with syntax highlighting</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-4">
            Contact
          </h2>
          <p className="text-gray-700">
            For questions, suggestions, or feedback, please reach out through our social media channels or submit an issue on GitHub.
          </p>
        </div>
      </div>
    </div>
  );
}
