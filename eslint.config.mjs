import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Matikan warning karena <img>
      "@next/next/no-img-element": "off",

      // Matikan error karena variabel tidak dipakai (misal: catch(err))
      "@typescript-eslint/no-unused-vars": "off",

      // Matikan error untuk `any`
      "@typescript-eslint/no-explicit-any": "off",

      // Matikan error jika dependency useEffect tidak lengkap
      "react-hooks/exhaustive-deps": "off",
    }
  }
];

export default eslintConfig;
