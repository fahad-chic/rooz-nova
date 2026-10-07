/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: { preflight: false },
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: { gold: '#2563eb' },

        royal: {
          black: "#0a071e",
          marble: "#0e0a2b",
          gold: "#2563eb",
          goldSoft: "#1d4ed8",
          goldDim: "#1e3a8a",
          white: "#f5f5f5",
        },

        glass: {
          light: "rgb(255, 255, 255,0.06)",
          medium: "rgb(255, 255, 255,0.12)",
          strong: "rgb(255, 255, 255,0.18)",
        },

        // إضافات خاصة لمربع صاحب الموقع
        "royal-gold": "#2563eb",
        "royal-goldBright": "#93c5fd",
        "royal-goldSoft": "#1d4ed8",
        "royal-white": "#f8f8f8",
        "royal-black": "#0d0a29",

        glassUltra: "rgb(255, 255, 255,0.15)",
        glassMedium: "rgb(255, 255, 255,0.25)",
      },

      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },

      spacing: {
        gutter: "1.25rem",
        section: "2rem",
      },

      borderRadius: {
        royal: "18px",
        smooth: "28px",
      },

      boxShadow: {
        royal: "0 0 20px rgb(37, 99, 235,0.30)",
        marble: "0 6px 20px rgb(9, 6, 27,0.40)",
        glass: "0 4px 14px rgb(255, 255, 255,0.12)",

        // ظل ملكي ثلاثي خاص لمربع صاحب الموقع
        royal3d: "0 12px 28px rgb(37, 99, 235,0.45)",
      },

      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        xl: "14px",
      },

      animation: {
        fadeIn: "fadeIn 0.35s ease-out",
        slideTop: "slideTop 0.55s ease-out",
        pulseGold: "pulseGold 1.8s ease-in-out infinite",

        // حركة الطفو المستمرة
        float: "float 3s ease-in-out infinite",

        // حركة دخول ناعمة للمربع
        fadeInSoft: "fadeInSoft 0.8s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },

        slideTop: {
          "0%": { transform: "translateY(35px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },

        pulseGold: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.55 },
        },

        // حركة الطفو المستمرة
        float: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
          "100%": { transform: "translateY(0)" },
        },

        // حركة دخول ناعمة
        fadeInSoft: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
