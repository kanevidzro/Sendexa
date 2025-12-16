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
  // Ensure it watches these files
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    date: { type: "date", required: false }
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
//# sourceMappingURL=compiled-contentlayer-config-L7YTMJT2.mjs.map
