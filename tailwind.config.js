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
        luxury: { gold: '#3d0f18' },

        royal: {
          black: "#1f1116",
          marble: "#1f1116",
          gold: "#3d0f18",
          goldSoft: "#3d0f18",
          goldDim: "#3d0f18",
          white: "#f5f5f5",
        },

        glass: {
          light: "rgb(ffffff,0.06)",
          medium: "rgb(ffffff,0.12)",
          strong: "rgb(ffffff,0.18)",
        },

        // إضافات خاصة لمربع صاحب الموقع
        "royal-gold": "#3d0f18",
        "royal-goldBright": "#d4a5a5",
        "royal-goldSoft": "#3d0f18",
        "royal-white": "#f8f8f8",
        "royal-black": "#1f1116",

        glassUltra: "rgb(ffffff,0.15)",
        glassMedium: "rgb(ffffff,0.25)",
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
        royal: "0 0 20px rgb(6b1d2f,0.30)",
        marble: "0 6px 20px rgb(1f1116,0.40)",
        glass: "0 4px 14px rgb(ffffff,0.12)",

        // ظل ملكي ثلاثي خاص لمربع صاحب الموقع
        royal3d: "0 12px 28px rgb(6b1d2f,0.45)",
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
