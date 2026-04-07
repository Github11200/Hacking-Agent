export interface ToolsList {
  tools: Array<{
    name: string;
    installCommand: string;
  }>;
}

export interface Package {
  name: string;
  description: string;
}
