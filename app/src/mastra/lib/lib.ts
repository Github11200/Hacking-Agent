import { createOllama } from "ollama-ai-provider-v2";

const ollamaProvider = createOllama({
  baseURL: "http://localhost:3000/api",
});

export const ollamaModel = ollamaProvider("gemma4:e4b");
