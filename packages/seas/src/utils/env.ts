import fs from "fs";

export function loadEnvVar(path: string) {
  try {
    const envData = fs.readFileSync(path, "utf8");
    const lines = envData.split("\n");
    lines.forEach((line) => {
      if (line.trim() !== "") {
        const [key, value] = line.split("=");
        process.env[key] = value.trim();
      }
    });
  } catch (error) {
    console.error("Error loading .env file:", error);
  }
}
