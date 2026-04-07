import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto("https://www.kali.org/tools/hashcat/");

let packagesAndBinaries = await page.$eval(
  "div#packages-info",
  async (content) => {
    return content.innerHTML;
  },
);

const $ = cheerio.load(packagesAndBinaries);

$("pre").remove();
$("details").remove();

let outputString = "";

$("*").each((_, element) => {
  const currentTagName = $(element).prop("tagName");
  const text = $(element).text();

  if (
    (text.includes("How to install") && !text.includes("Installed size")) ||
    (!text.includes("How to install") && text.includes("Installed size"))
  )
    return;
  else if (text.includes("How to install")) {
    outputString += text.slice(0, text.indexOf("B") + 1);
    outputString += "\n" + text.slice(text.indexOf("B") + 1);
    return;
  }

  if (currentTagName === "H3") outputString += "# " + text + "\n\n";
  else if (currentTagName === "H5") outputString += "## " + text + "\n\n";
  else if (currentTagName === "P") outputString += text + "\n\n";
  else if (currentTagName === "UL") outputString += "\n";
  else if (currentTagName === "LI") outputString += "- " + text + "\n";
  else if (currentTagName === "BR") outputString += "\n";
});

await browser.close();
