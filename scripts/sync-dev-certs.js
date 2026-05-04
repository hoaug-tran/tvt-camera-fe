import os from "os";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const backendApiDir = path.resolve(
  rootDir,
  "../../Camera-backend/CameraManagement/src/CameraManagement.Api",
);
const viteCertDir = path.resolve(os.homedir(), ".vite-plugin-mkcert");

const LOCAL_DOMAIN = "camera.local";
const HOSTS_FILE = "C:\\Windows\\System32\\drivers\\etc\\hosts";

// false for localhost-only dev, true for LAN access
const USE_LOCAL_DOMAIN = process.env.USE_DOMAIN === "true";

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        if (
          name.toLowerCase().includes("wi-fi") ||
          name.toLowerCase().includes("ethernet")
        ) {
          return iface.address;
        }
      }
    }
  }
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

function updateHostsFile(localIp) {
  const entry = `${localIp}	${LOCAL_DOMAIN}`;

  try {
    let hostsContent = fs.readFileSync(HOSTS_FILE, "utf8");

    // Check if entry already exists
    if (hostsContent.includes(LOCAL_DOMAIN)) {
      // Update existing entry
      hostsContent = hostsContent.replace(
        new RegExp(`^\\d+\\.\\d+\\.\\d+\\.\\d+\\s+${LOCAL_DOMAIN}`, "m"),
        entry,
      );
    } else {
      // Add new entry
      hostsContent += `\n${entry}\n`;
    }

    fs.writeFileSync(HOSTS_FILE, hostsContent);
    console.log(`Updated hosts file: ${entry}`);
  } catch (error) {
    console.warn(
      `Warning: Could not update hosts file. You may need to add manually:`,
    );
    console.warn(`${entry}`);
  }
}

function updateEnvFile(localIp) {
  const envPath = path.resolve(rootDir, ".env");
  if (!fs.existsSync(envPath)) return;

  let content = fs.readFileSync(envPath, "utf8");

  const apiHost = USE_LOCAL_DOMAIN ? LOCAL_DOMAIN : "localhost";

  content = content.replace(
    /VITE_API_URL=https:\/\/[\w.\-]+:(\d+)\/api\/v1/g,
    `VITE_API_URL=https://${apiHost}:$1/api/v1`,
  );
  content = content.replace(
    /VITE_ALLOWED_LAN_IPS=.*/g,
    `VITE_ALLOWED_LAN_IPS=localhost,127.0.0.1,${localIp},${LOCAL_DOMAIN}`,
  );
  content = content.replace(
    /VITE_DEV_SERVER_HOST=.*/g,
    `VITE_DEV_SERVER_HOST=0.0.0.0`,
  );

  fs.writeFileSync(envPath, content);
  console.log(`Updated Frontend .env: ${apiHost}:7014/api/v1`);
}

function updateBackendEnvFile(localIp) {
  const backendRootDir = path.resolve(backendApiDir, "../..");
  const envPath = path.resolve(backendRootDir, ".env");
  if (!fs.existsSync(envPath)) return;

  let content = fs.readFileSync(envPath, "utf8");

  const baseOrigins =
    "http://localhost:3000,http://localhost:5173,https://localhost:5173";
  const domainOrigins = `http://${LOCAL_DOMAIN}:5173,https://${LOCAL_DOMAIN}:5173`;
  const ipOrigins = `http://${localIp}:5173,https://${localIp}:5173`;

  const newOrigins = `${baseOrigins},${domainOrigins},${ipOrigins}`;
  content = content.replace(
    /CORS_ALLOWED_ORIGINS=.*/g,
    `CORS_ALLOWED_ORIGINS=${newOrigins}`,
  );
  content = content.replace(
    /ALLOWED_LAN_IPS=.*/g,
    `ALLOWED_LAN_IPS=${localIp},${LOCAL_DOMAIN}`,
  );

  fs.writeFileSync(envPath, content);
  console.log(`Updated Backend .env: ${LOCAL_DOMAIN} + ${localIp}`);
}

function readFirstLine(file) {
  return fs.readFileSync(file, "utf8").split(/\r?\n/)[0]?.trim() || "";
}

function detectPair() {
  const candidates = [
    {
      cert: path.resolve(viteCertDir, "camera.local.pem"),
      key: path.resolve(viteCertDir, "camera.local-key.pem"),
    },
    {
      cert: path.resolve(viteCertDir, "camera.local+3.pem"),
      key: path.resolve(viteCertDir, "camera.local+3-key.pem"),
    },
    {
      cert: path.resolve(viteCertDir, "cert.pem"),
      key: path.resolve(viteCertDir, "dev.pem"),
    },
    {
      cert: path.resolve(viteCertDir, "dev.pem"),
      key: path.resolve(viteCertDir, "cert.pem"),
    },
  ];

  for (const pair of candidates) {
    if (!fs.existsSync(pair.cert) || !fs.existsSync(pair.key)) continue;

    const certFirstLine = readFirstLine(pair.cert);
    const keyFirstLine = readFirstLine(pair.key);

    const certOk = certFirstLine.includes("BEGIN CERTIFICATE");
    const keyOk =
      keyFirstLine.includes("BEGIN PRIVATE KEY") ||
      keyFirstLine.includes("BEGIN RSA PRIVATE KEY") ||
      keyFirstLine.includes("BEGIN EC PRIVATE KEY");

    if (certOk && keyOk) {
      return pair;
    }
  }

  throw new Error(
    "Could not detect valid certificate/key pair in ~/.vite-plugin-mkcert",
  );
}

function generateCertForDomain(localIp) {
  const hosts = `${LOCAL_DOMAIN} localhost 127.0.0.1 ${localIp}`;
  console.log(`Generating certificate for: ${hosts}`);

  try {
    execSync(`mkcert -install && mkcert ${hosts}`, {
      stdio: "inherit",
    });
    console.log(`Certificate generated successfully`);
    return true;
  } catch (error) {
    console.warn(`Warning: mkcert generation failed. Using existing certs.`);
    return false;
  }
}

(async () => {
  try {
    const mode = USE_LOCAL_DOMAIN ? "LAN Domain Mode" : "Localhost Mode";
    console.log(`\nCertificate Synchronization Script - ${mode}\n`);

    const localIp = getLocalIp();
    console.log(`Detected local IP: ${localIp}`);
    console.log(
      `Using domain: ${USE_LOCAL_DOMAIN ? LOCAL_DOMAIN : "localhost"}\n`,
    );

    // Generate certificate for domain
    generateCertForDomain(localIp);

    // Update Windows hosts file
    console.log(`\nUpdating system hosts file...`);
    updateHostsFile(localIp);

    // Update environment files
    updateEnvFile(localIp);
    updateBackendEnvFile(localIp);

    // Copy certificate files
    const { cert, key } = detectPair();

    const frontendCert = path.resolve(rootDir, "cert.crt");
    const frontendKey = path.resolve(rootDir, "cert.key");
    const backendCert = path.resolve(backendApiDir, "cert.crt");
    const backendKey = path.resolve(backendApiDir, "cert.key");

    fs.copyFileSync(cert, frontendCert);
    fs.copyFileSync(key, frontendKey);

    if (fs.existsSync(backendApiDir)) {
      fs.copyFileSync(cert, backendCert);
      fs.copyFileSync(key, backendKey);
    }

    console.log(`\nCertificate files synced successfully!\n`);
    console.log(`Source: ${cert}`);
    console.log(`Frontend: ${frontendCert}`);
    if (fs.existsSync(backendApiDir)) {
      console.log(`Backend: ${backendCert}`);
    }

    console.log(`\nConfiguration Summary:`);
    console.log(`Domain: ${USE_LOCAL_DOMAIN ? LOCAL_DOMAIN : "localhost"}`);
    console.log(`IP: ${localIp}`);
    console.log(
      `Frontend: https://${USE_LOCAL_DOMAIN ? LOCAL_DOMAIN : "localhost"}:5173`,
    );
    console.log(
      `Backend API: https://${USE_LOCAL_DOMAIN ? LOCAL_DOMAIN : "localhost"}:7014/api/v1`,
    );

    if (USE_LOCAL_DOMAIN) {
      console.log(
        `\nAll devices on same LAN can now access via: https://${LOCAL_DOMAIN}:5173\n`,
      );
    } else {
      console.log(
        `\nMode: Localhost only. To enable LAN access, run: USE_DOMAIN=true npm run sync-certs\n`,
      );
    }
  } catch (error) {
    console.error(`\nError:`, error.message);
    process.exit(1);
  }
})();
