import { Tool } from "@mastra/core/tools";
import z from "zod";
import { Package } from "../lib/types";

function getPackagesString(packages: Package[]) {
  if (packages.length === 0) return "None found";
  let str = "";
  packages.map((userPackage, _) => {
    str += `Name: ${userPackage.name}\nDescription: ${userPackage.description}\n\n`;
  });

  return str;
}

export const searchPackageRepository = new Tool({
  id: "search-package-repository",
  description:
    "Searches for packages in the offical Arch repository and the AUR.",
  inputSchema: z.object({
    package: z
      .string()
      .describe("The exact name of the Kali Linux tool you want to download"),
  }),
  outputSchema: z
    .null()
    .describe("The package was not found in any package repository")
    .or(
      z
        .string()
        .describe(
          "The exact install commmand for getting the package on Arch linux",
        ),
    ),
  execute: async (packageName) => {
    const officialPackages: Package[] = await fetch(
      `https://archlinux.org/packages/search/json/?q=${packageName.package}`,
    )
      .then((data) => data.json())
      .then((data) => {
        let packages: Package[] = [];
        data.results.map((result, _) => {
          packages.push({ name: result.pkgname, description: result.pkgdesc });
        });

        return packages;
      });

    const userRepositoryPackages: Package[] = await fetch(
      `https://aur.archlinux.org/rpc/v5/search/${packageName.package}?by=name-desc`,
    )
      .then((data) => data.json())
      .then((data) => {
        let packages: Package[] = [];
        data.results.map((result, _) => {
          packages.push({ name: result.Name, description: result.Description });
        });

        return packages;
      });

    if (officialPackages.length === 0 && userRepositoryPackages.length === 0)
      return null;

    let officialPackagesString = getPackagesString(officialPackages);
    let userPackagesString = getPackagesString(userRepositoryPackages);

    return `Official Arch repositories packages: ${officialPackagesString}\n\nUser repository packages: ${userPackagesString}`;
  },
});
