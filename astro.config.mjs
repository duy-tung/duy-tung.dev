// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";

export default defineConfig({
    site: "https://duy-tung.dev",

    integrations: [mdx(), sitemap(), react()],

    markdown: {
        syntaxHighlight: "shiki",
        shikiConfig: {
            themes: {
                light: "vitesse-light",
                dark: "tokyo-night",
            },
        },
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
            [rehypeExternalLinks, { target: "_blank", rel: ["nofollow", "noopener"] }],
        ],
    },

    vite: {
        plugins: [tailwindcss()],
    },
});
