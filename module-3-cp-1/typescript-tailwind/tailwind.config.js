/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.ts", "./dist/**/*.js"],
  theme: {
    extend: {
      colors: {
        // BMW M motorsport palette
        brand: {
          DEFAULT: "#0166b1", // BMW blue
          dark: "#00295b", // deep navy
        },
        mblue: "#0166b1",
        mpurple: "#5b1f77",
        mred: "#e2001a",
        carbon: {
          900: "#0a0d12",
          800: "#12161d",
          700: "#1b212b",
          600: "#252d3a",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 10px 30px rgba(0, 0, 0, 0.45)",
        glow: "0 0 24px rgba(1, 102, 177, 0.45)",
      },
      backgroundImage: {
        "m-stripe":
          "linear-gradient(90deg, #0166b1 0%, #0166b1 33%, #5b1f77 33%, #5b1f77 66%, #e2001a 66%, #e2001a 100%)",
        "carbon-grid":
          "radial-gradient(circle at 25% 15%, rgba(1,102,177,0.18), transparent 45%), radial-gradient(circle at 80% 85%, rgba(226,0,26,0.14), transparent 40%)",
      },
    },
  },
  plugins: [],
};
