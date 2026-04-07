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

let packageNames: string[] = [];
for (let link of filteredLinks) {
  await page.goto(link);

  const res = await page.$eval("h3", (h3) => {
    return h3.textContent;
  });

  console.log(res);
  packageNames.push(res);
}

console.log(packageNames);
await browser.close();
