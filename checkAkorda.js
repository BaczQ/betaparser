import Parser from "rss-parser";
import { promises as fs } from "fs";



const parser = new Parser();

let knownPosts = []; // список уже известных постов

export async function checkAkorda(bot) {

    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  
  try {
    const feed = await parser.parseURL("https://www.akorda.kz/ru/rss");

    // Загрузка списка известных постов из файла known_posts.txt
    knownPosts = (await fs.readFile("known_posts.txt", "utf-8")).split("\n");

    const newPosts = feed.items.filter(
      (item) => !knownPosts.includes(item.link)
    );
    if (newPosts.length > 0) {
        console.log(`[${hours}:${minutes}:${seconds}] На сайте Акорда нет новых постов.`);
      bot.sendMessage(
        "@test222d",
        `${hours}:${minutes}:${seconds} <b>Найдено ${newPosts.length} новых постов на сайте Акорда:</b>`
      );
      newPosts.forEach((post) => {
        console.log(`${post.title}: ${post.link}`);
        bot.sendMessage(
          "@test222d",
          `${post.title}: https://www.akorda.kz${post.link}`
        );
      });

      knownPosts.push(...newPosts.map((post) => post.link)); // добавляем новые посты в список известных
      // Запись списка известных постов в файл known_posts.txt
      await fs.writeFile("known_posts.txt", knownPosts.join("\n"));
    } else {
        const currentDate = new Date();
        console.log(`[${hours}:${minutes}:${seconds}] На сайте Акорда нет новых постов.`);
    }
  } catch (err) {
    console.error("Ошибка при получении RSS-ленты сайта Акорда: \n", err);
    bot.sendMessage(
      "@test222d",
      "Ошибка при получении RSS-ленты сайта Акорда:" + err
    );
    setTimeout(() => {
      console.log("повторяем");
      checkAkorda(bot);
    }, 10000); // повторяем через 10 секунд
  }
}
