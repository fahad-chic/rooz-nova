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
        luxury: { gold: '#c47a3a' },

        royal: {
          black: "#0a0a0a",
          marble: "#1c1c1c",
          gold: "#c47a3a",
          goldSoft: "#c9a531",
          goldDim: "#8f7a2e",
          white: "#f5f5f5",
        },

        glass: {
          light: "rgba(255,255,255,0.06)",
          medium: "rgba(255,255,255,0.12)",
          strong: "rgba(255,255,255,0.18)",
        },

        // إضافات خاصة لمربع صاحب الموقع
        "royal-gold": "#c47a3a",
        "royal-goldBright": "#f0d98c",
        "royal-goldSoft": "#c9a531",
        "royal-white": "#f8f8f8",
        "royal-black": "#1a1a1a",

        glassUltra: "rgba(255,255,255,0.15)",
        glassMedium: "rgba(255,255,255,0.25)",
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
        royal: "0 0 20px rgba(212,175,55,0.30)",
        marble: "0 6px 20px rgba(0,0,0,0.40)",
        glass: "0 4px 14px rgba(255,255,255,0.12)",

        // ظل ملكي ثلاثي خاص لمربع صاحب الموقع
        royal3d: "0 12px 28px rgba(212,175,55,0.45)",
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
