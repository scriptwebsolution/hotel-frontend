/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#bcd1ff",
          300: "#8eb1ff",
          400: "#5e88fb",
          500: "#3b66f0",
          600: "#284ed6",
          700: "#223ead",
          800: "#21378a",
          900: "#1f326d",
        },
        ink: {
          50: "#f7f8fa",
          100: "#eef0f4",
          200: "#dde1e9",
          300: "#c3c9d5",
          400: "#9aa3b2",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      boxShadow: {
        soft: "0 6px 20px -8px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};
