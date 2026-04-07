import { createCliRenderer, Text } from "@opentui/core";
import { mastra } from "./mastra";

// const renderer = await createCliRenderer({
//   exitOnCtrlC: true,
// });

const res = await fetch(
  `https://archlinux.org/packages/search/json/?q=${"hashcat"}`,
)
  .then((data) => data.json())
  .then((data) => {
    let names = [];
    data.results.map((result, _) => {
      names.push(result.pkgname);
    });

    return names;
  });

console.log(res);
