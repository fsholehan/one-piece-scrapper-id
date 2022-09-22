const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const PORT = process.env.PORT || 8000;

const app = express();

const base_url = "https://65.108.132.145";

app.use(cors());

app.get("/", (req, res) => {
  res.send("Fuad ganteng");
});

app.get("/api/all", async (req, res) => {
  const response = await axios.get(`${base_url}/anime/one-piece`);
  const html = response.data;

  const $ = cheerio.load(html);

  const episodes = [];

  $(".eplister ul li a").each((i, el) => {
    const uri = $(el).attr("href");
    const eps = $(el).find(".epl-num").text();
    const title = $(el).find(".epl-title").text();
    const date = $(el).find(".epl-date").text();
    const slug = $(el).attr("href").split("/")[3];

    episodes.push({
      title,
      uri,
      eps,
      date,
      slug,
    });
  });

  res.json({
    imgUrl: $(".thumb").find("img").eq(0).attr("src"),
    title: $(".infox").find("h1").text(),
    description: $(".entry-content").first().find("p").text(),
    episodes,
  });
});

// example url => /api/data/?slug=one-piece-episode-1033-subtitle-indonesia
app.get("/api/data", async (req, res) => {
  const { slug } = req.query;
  const response = await axios.get(`${base_url}/${slug}`);
  const html = response.data;

  const $ = cheerio.load(html);

  const prev_eps =
    $(".nvs").first().find("a").attr("href") !== undefined
      ? $(".nvs").first().find("a").attr("href").split("/")[3]
      : "";

  const next_eps =
    $(".nvs").last().find("a").attr("href") !== undefined
      ? $(".nvs").last().find("a").attr("href").split("/")[3]
      : "";

  res.json({
    title: $(".entry-title").text(),
    video_uri: $(".player-embed").find("iframe").attr("src"),
    released: $("span.updated").text(),
    next_eps,
    prev_eps,
  });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
