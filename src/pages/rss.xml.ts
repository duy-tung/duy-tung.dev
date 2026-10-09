import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { company } from "@/config/company";

export async function GET(context: APIContext) {
    const posts = (await getCollection("blog", ({ data }) => !data.draft))
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    return rss({
        title: `${company.name} Blog`,
        description: `Engineering notes by ${company.founder.name} on software engineering.`,
        site: context.site!,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/blog/${post.id}/`,
        })),
    });
}
