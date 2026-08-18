// scripts/generate-theme.mjs
import fs from "node:fs";
import colors from "tailwindcss/colors";

const baseColors = [
  "gray",
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
];

const shadeMapping = {
  50: "900",
  100: "800",
  200: "700",
  300: "600",
  400: "500",
  500: "400",
  600: "300",
  700: "200",
  800: "100",
  900: "50",
};

const scale = (invert) =>
  baseColors.flatMap((color) =>
    Object.entries(shadeMapping).map(([shade, mapped]) => {
      const source = invert ? mapped : shade;
      return `  --color-${color}-${shade}: ${colors[color][source]};`;
    }),
  );

const css = `@theme {
${scale(false).join("\n")}
  --color-white: #ffffff;
}

@layer base {
  .dark {
${scale(true).join("\n")}
    --color-white: ${colors.gray["950"]};
    --color-black: ${colors.gray["50"]};
  }
}
`;

fs.writeFileSync("./src/app/theme.css", css);
