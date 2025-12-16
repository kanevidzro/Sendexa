import { allBlogs } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { Mdx } from '@/components/mdx-components';
import Breadcrumb from '@/components/bread-crumb';
import { Calendar, User, Clock } from 'lucide-react';

type tParams = Promise<{ slug: string[] }>;

export const generateStaticParams = async () => {
  return allBlogs.map((blog) => {
    const slugArray = blog._raw.flattenedPath.split('/');
    return { slug: slugArray };
  });
};

export const generateMetadata = async ({ params }: { params: tParams }) => {
  const awaitedParams = await params;
  const path = awaitedParams.slug.join('/');
  const blog = allBlogs.find(
    (blog) => blog._raw.flattenedPath === path
  );

  if (!blog) throw new Error(`Blog not found for slug: ${path}`);

  return {
    title: blog.title,
    description: blog.description || 'A detailed guide to the topic.',
    openGraph: {
      title: blog.title,
      description: blog.description || 'A detailed guide to the topic.',
      url: `https://blog.sendexa.co/${blog.url}`,
      images: blog.image ? [{ url: blog.image }] : [],
    },
  };
};

const BlogsPage = async ({ params }: { params: tParams }) => {
  const awaitedParams = await params;
  const path = awaitedParams.slug.join('/');
  const blog = allBlogs.find(
    (blog) => blog._raw.flattenedPath === path
  );

  if (!blog) notFound();

  const calculateReadingTime = (text: string): string => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const readingTime =
    blog.readingTime || calculateReadingTime(blog.body.raw);

  return (
    <article className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <Breadcrumb path={blog.url} />

        <div className="mt-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {blog.title}
          </h1>

          {blog.description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
              {blog.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
            {blog.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={blog.publishedAt}>
                  {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            )}

            {blog.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blog.author}</span>
              </div>
            )}

            {readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 mt-10" />
      </header>

      {/* Content */}
      <div className="prose dark:prose-invert prose-lg mx-auto max-w-3xl">
        <Mdx code={blog.body.code} />
      </div>

      {/* Footer Divider */}
      <div className="h-px bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 my-12" />

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <section className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

export default BlogsPage;
