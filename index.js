const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const PORT = 8000;

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Fuad ganteng");
});

app.get("/api/all", async (req, res) => {
  const response = await axios.get("https://65.108.132.145/anime/one-piece/");
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
    episodes,
  });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
