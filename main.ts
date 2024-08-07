// deno-lint-ignore-file no-explicit-any
import * as core from "npm:@actions/core";
import Parser from "npm:rss-parser";

interface Article {
  name: string;
  title: string;
  avatar: string;
  link: string;
  website: string;
  date: number;
}

const LINKS_PATH = "./links";
const TEMPLATE = await Deno.readTextFile("./template.html");

const articles: Article[] = [];

// const max_everyone = Number(core.getInput("max_everyone"));
// const max_number = Number(core.getInput("max_number"));
const max_everyone = 5;
const max_number = 50;

async function readLinks(): Promise<string[][]> {
  const content = await Deno.readTextFile(LINKS_PATH);
  return content.split("\n").map((s: string) => s.split(" "));
}

async function fetchRSS([link, avatar]: string[]): Promise<any> {
  const parser = new Parser();
  const feed = await parser.parseURL(link);
  feed.avatar = avatar;
  return feed;
}

function articleExtracter(item: any, feed: any) {
  const date = Date.parse(item.isoDate);
  const too_old_date = Number(new Date(2015, 0, 1));
  if (item.content.trim() != "" && date > too_old_date) {
    const article = {
      name: item.title,
      title: feed.title,
      avatar: feed.avatar,
      link: item.link,
      website: feed.link,
      date: date,
    };
    articles.push(article);
  }
}

async function fetchArticles(links: any) {
  const rss = links.filter((i: string[]) => Boolean(i[0])).map(fetchRSS);
  let index = 0;
  for (const i of rss) {
    core.info(`Fetching ${links[index][0]}`);
    const feed = await i;
    for (const item of feed.items.slice(0, max_everyone)) {
      articleExtracter(item, feed);
    }
    index += 1;
  }

  articles.sort((a, b) => b.date - a.date);
}

async function generate_page() {
  let list = "";
  for (
    const { name, title, avatar, link, website, date } of articles.slice(
      0,
      max_number,
    )
  ) {
    list += `
<div class="item">
<img src="${avatar}" alt="avatar" class="avatar">
<div class="info">
<a href="${website}" target="_blank" class="title">${title}</a>
<a href="${link}" target="_blank" class="name">${name}</a>
<time class="date">${new Date(date).toLocaleDateString()}</time>
</div>
</div>
`;
  }

  const html = TEMPLATE.replace("<LIST>", list);
  await Deno.mkdir("public", { recursive: true });
  await Deno.writeTextFile("public/index.html", html, { create: true });
}

async function main() {
  core.info("Fetching links");
  const links = await readLinks();

  core.startGroup("Fetching articles");
  await fetchArticles(links);
  core.endGroup();

  core.info("Generating page");
  await generate_page();

  core.info("DONE");
}

try {
  main();
} catch (err) {
  core.setFailed(`${err}`);
}
