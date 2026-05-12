import { InvalidToolInputError } from "@mastra/core/_types/@internal_ai-sdk-v5/dist";
import {
  createCliRenderer,
  InputRenderable,
  InputRenderableEvents,
  BoxRenderable,
  RGBA,
  Text,
  Box,
  Input,
} from "@opentui/core";
import { mastra } from "./mastra";

// const workflow = mastra.getWorkflow("penetrationWorkflow");
// const run = await workflow.createRun();

// const streamedData = run.stream({ inputData: "Hack my current home wifi." });

// for await (const chunk of streamedData) {
//   console.log(chunk.payload);
// }

console.log = () => {};

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
  consoleMode: "disabled",
  externalOutputMode: "passthrough",
});

renderer.setBackgroundColor(RGBA.fromHex("#1a1a1a"));

let content = "";

let textBox = Text({
  id: "output",
  content: "",
  fg: "#00FF00",
});

const input = Input({
  id: "command-input",
  placeholder: "Type here...",
  textColor: "#FFFFFF",
  cursorColor: "#00FF00",
  width: "100%",
  marginTop: 2,
});

input.focus();

const panel = Box(
  {
    id: "panel",
    backgroundColor: "#1a1a1a",
    borderStyle: "rounded",
    borderColor: "#FFFFFF",
    width: "100%",
    height: "95%",
    paddingLeft: 1,
  },
  textBox,
);

function refereshTextBox() {
  renderer.root.getChildren()[0].remove("panel");
  renderer.root.getChildren()[0].remove("command-input");
  renderer.root.getChildren()[0].add(panel);
  renderer.root.getChildren()[0].add(input);
}

function addText(text: string) {
  content += text;
  // @ts-ignore
  textBox.content = content;
  // refereshTextBox();
  renderer.root.getChildren()[0].remove("panel");
  renderer.root.getChildren()[0].remove("command-input");
  renderer.root.getChildren()[0].add(panel);
  renderer.root.getChildren()[0].add(input);
}

input.on(InputRenderableEvents.ENTER, async (userPrompt: string) => {
  addText(userPrompt + "\n");

  const workflow = mastra.getWorkflow("penetrationWorkflow");
  const run = await workflow.createRun();

  const streamedData = run.stream({
    inputData: userPrompt,
  });

  for await (const chunk of streamedData) {
    if (chunk.type === "workflow-step-start")
      addText(
        `\nRunning the following step: ${chunk.payload.stepName as string}\n\n`,
      );
    else if (chunk.type === "workflow-step-output")
      addText(`${chunk.payload.output}`);
    else if (chunk.type === "workflow-step-finish")
      addText(`\n${chunk.payload}`);
  }
});

renderer.root.add(
  Box(
    {
      id: "container",
      flexDirection: "column",
      alignItems: "center",
      height: "100%",
      width: "100%",
      padding: 2,
    },
    panel,
    input,
  ),
);

renderer.start();
