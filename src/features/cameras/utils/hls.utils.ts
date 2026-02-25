/**
 * Wait for HLS playlist to be ready by polling HEAD requests
 * HEAD is lighter than GET as it doesn't download the content
 */
export async function waitForHlsReady(
  url: string,
  timeoutMs = 5000,
  intervalMs = 200,
): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: "HEAD", cache: "no-store" });
      if (res.ok) return;
    } catch {
      // ignore network errors and keep polling
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error("HLS playlist not ready");
}
