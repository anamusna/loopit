declare module "../tailwind.config" {
  import type { Config } from "tailwindcss";
  export const themeConfig: Config["theme"]["extend"];
  export default Config;
}
