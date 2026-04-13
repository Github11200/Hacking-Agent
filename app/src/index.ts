import { createCliRenderer, Text } from "@opentui/core";
import { mastra } from "./mastra";
import { $ } from "execa";

const callback = async () => {
  const { stdout: woah } = await $`echo "hello world"`;
  console.log(woah);
};
callback();
