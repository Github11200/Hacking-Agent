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

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
});

renderer.setBackgroundColor(RGBA.fromHex("#1a1a1a"));

let textContent = "woah";

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
    Box(
      {
        id: "panel",
        backgroundColor: "#1a1a1a",
        borderStyle: "rounded",
        borderColor: "#FFFFFF",
        width: "100%",
        height: "95%",
      },
      Text({
        id: "output",
        content: textContent,
        fg: "#00FF00",
      }),
    ),
    Input({
      id: "command-input",
      placeholder: "Type here...",
      textColor: "#FFFFFF",
      cursorColor: "#00FF00",
      width: "100%",
      marginTop: 2,
    }).on(InputRenderableEvents.ENTER, (value) => {}),
  ),
);
