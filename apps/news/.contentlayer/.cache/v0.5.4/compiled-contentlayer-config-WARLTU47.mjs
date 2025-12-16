// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import remarkGfm from "remark-gfm";
import { codeImport } from "remark-code-import";
import rehypeSlug from "rehype-slug";
import highlight from "rehype-highlight";
var Post = defineDocumentType(() => ({
  name: "Blogs",
  contentType: "mdx",
  filePathPattern: `**/*.mdx`,
  markdown: { fileExtensions: ["mdx", "md"] },
  fields: {
    title: {
      type: "string",
      required: true,
      description: "The title of the blog post"
    },
    description: {
      type: "string",
      required: false,
      description: "A short description of the blog post"
    },
    publishedAt: {
      type: "date",
      required: false,
      description: "The date the blog was published"
    },
    updatedAt: {
      type: "date",
      required: false,
      description: "The date the blog was last updated"
    },
    author: {
      type: "string",
      required: false,
      description: "The author of the blog post"
    },
    readingTime: {
      type: "string",
      required: false,
      description: "Estimated reading time"
    },
    tags: {
      type: "list",
      of: { type: "string" },
      required: false,
      description: "Tags associated with the blog post"
    },
    featured: {
      type: "boolean",
      required: false,
      default: false,
      description: "Whether the blog post is featured"
    },
    image: {
      type: "string",
      required: false,
      description: "Featured image URL"
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/${post._raw.flattenedPath}`
    },
    slug: {
      type: "string",
      resolve: (blogs) => blogs._raw.flattenedPath
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "blogs",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm, codeImport],
    rehypePlugins: [rehypeSlug, highlight]
  }
});
export {
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-WARLTU47.mjs.map
