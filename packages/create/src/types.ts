import { Answers } from "prompts";

export interface PromptsAnswers
  extends Answers<"projectName" | "overwrite" | "framework" | "variant"> {}

export interface PromptsResult extends PromptsAnswers {
  targetDir: string;
}
