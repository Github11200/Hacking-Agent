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

export interface InstallationStatus {
  package: string | null;
  installed: boolean;
}

export interface InstallationResults {
  tools: InstallationStatus[];
}
