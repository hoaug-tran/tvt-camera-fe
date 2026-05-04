import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import path from "path";
import os from "os";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const hostname = os.hostname();
  const allowedLanIps = (env.VITE_ALLOWED_LAN_IPS || "").split(",");
  const currentIp = allowedLanIps.find(
    (ip) => ip !== "localhost" && ip !== "127.0.0.1",
  );

  const allowedHosts = [
    "localhost",
    "127.0.0.1",
    hostname,
    `${hostname}.local`,
  ];
  if (currentIp) allowedHosts.push(currentIp);

  return {
    plugins: [
      react(),
      mkcert({
        hosts: [
          "localhost",
          "127.0.0.1",
          hostname,
          `${hostname}.local`,
          ...(currentIp ? [currentIp] : []),
        ],
      }),
    ],

    server: {
      host: env.VITE_DEV_SERVER_HOST || "0.0.0.0",
      port: 5173,
      strictPort: true,
      https: {},
      allowedHosts,
      proxy: {
        "/api": {
          target: env.VITE_API_URL?.replace("/api/v1", ""),
          changeOrigin: true,
          secure: false,
        },
      },
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@stores": path.resolve(__dirname, "./src/stores"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@layouts": path.resolve(__dirname, "./src/layouts"),
        "@themes": path.resolve(__dirname, "./src/themes"),
      },
    },

    build: {
      outDir: "dist",
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom"],
          },
        },
      },
    },
  };
});
