import puppeteer from "puppeteer";
import { isConstructorDeclaration } from "typescript";

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto("https://www.kali.org/tools/");

let filteredLinks: string[] = await page.$$eval("a", (links) => {
  return links
    .map((link) => {
      return link.href;
    })
    .filter(
      (href: string) =>
        href.includes("tools") &&
        !href.includes("#") &&
        href.length > 27 &&
        !href.includes("all-tools") &&
        !href.includes("submitting-tools"),
    );
});

filteredLinks = filteredLinks;
console.log(filteredLinks);
for (let link of filteredLinks) {
  await page.goto(link);

  try {
    const toolDocumentation = await page.$eval("#packages-info", (info) => {
      return info.textContent;
    });
    console.log(toolDocumentation);
  } catch (error) {
    console.log(`Link: ${link} does not have tool documentation.`);
  }

  const res = await page.$eval("#packages-info", (h2) => {
    return h2.textContent;
  });
}

await browser.close();
