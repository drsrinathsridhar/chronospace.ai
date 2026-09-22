import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const JS_BUDGET_BYTES = 500 * 1024;

const runtimeErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});

test.afterEach(async ({ page }) => {
  expect(
    runtimeErrors.get(page),
    "console, hydration, and uncaught runtime errors",
  ).toEqual([]);
});

test("cold load is responsive and stays within the JavaScript budget", async ({
  page,
}) => {
  const failedRequests: string[] = [];
  page.on("requestfailed", (request) => {
    const expectedMediaAbort =
      request.resourceType() === "media" &&
      request.failure()?.errorText === "net::ERR_ABORTED";
    if (!expectedMediaAbort) failedRequests.push(request.url());
  });

  const response = await page.goto("/", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const metrics = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    contentWidth: document.documentElement.scrollWidth,
    jsBytes: performance
      .getEntriesByType("resource")
      .filter(
        (entry) => entry.name.includes("/_next/") && entry.name.endsWith(".js"),
      )
      .reduce((total, entry) => {
        const resource = entry as PerformanceResourceTiming;
        return total + (resource.encodedBodySize || resource.transferSize);
      }, 0),
  }));

  expect(metrics.contentWidth).toBeLessThanOrEqual(metrics.viewportWidth);
  expect(metrics.jsBytes).toBeGreaterThan(0);
  expect(metrics.jsBytes).toBeLessThanOrEqual(JS_BUDGET_BYTES);
  expect(failedRequests).toEqual([]);
});

test("canonical and social metadata use absolute production URLs", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "http://127.0.0.1:3000",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "http://127.0.0.1:3000",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "http://127.0.0.1:3000/og.png",
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    "http://127.0.0.1:3000/og.png",
  );
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
    "content",
    "1200",
  );
  await expect(
    page.locator('meta[property="og:image:height"]'),
  ).toHaveAttribute("content", "630");

  const robots = await page.request.get("/robots.txt");
  expect(await robots.text()).toContain(
    "Sitemap: http://127.0.0.1:3000/sitemap.xml",
  );
  const sitemap = await page.request.get("/sitemap.xml");
  const sitemapXml = await sitemap.text();
  expect(sitemapXml).toContain("<loc>http://127.0.0.1:3000</loc>");
  expect(sitemapXml).toContain("<loc>http://127.0.0.1:3000/contact</loc>");
});

test("muted text and CTA states meet WCAG AA contrast", async ({ page }) => {
  await page.goto("/");
  const ratios = await page.evaluate(() => {
    function rgba(value: string) {
      const probe = document.createElement("span");
      probe.style.color = value;
      document.body.append(probe);
      const resolved = getComputedStyle(probe).color;
      const channels = resolved.match(/[\d.]+/g)!.map(Number);
      probe.remove();
      const scale = resolved.startsWith("color(srgb") ? 255 : 1;
      return [
        channels[0]! * scale,
        channels[1]! * scale,
        channels[2]! * scale,
        channels[3] ?? 1,
      ];
    }
    function flatten(foreground: number[], background: number[]) {
      const alpha = foreground[3]!;
      return foreground
        .slice(0, 3)
        .map(
          (channel, index) =>
            channel * alpha + background[index]! * (1 - alpha),
        );
    }
    function luminance(channels: number[]) {
      const linear = channels.map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
    }
    function contrast(foreground: number[], background: number[]) {
      const light = Math.max(luminance(foreground), luminance(background));
      const dark = Math.min(luminance(foreground), luminance(background));
      return (light + 0.05) / (dark + 0.05);
    }
    function resolveColor(
      property: "color" | "backgroundColor",
      value: string,
    ) {
      const probe = document.createElement("span");
      probe.style[property] = value;
      document.body.append(probe);
      const resolved = getComputedStyle(probe)[property];
      probe.remove();
      return resolved;
    }

    const tokens = getComputedStyle(document.documentElement);
    const paper = rgba(tokens.getPropertyValue("--paper"));
    const muted = flatten(
      rgba(resolveColor("color", tokens.getPropertyValue("--muted"))),
      paper,
    );
    const foreground = rgba(tokens.getPropertyValue("--accent-foreground"));
    const accent = rgba(tokens.getPropertyValue("--accent"));
    const accentHover = rgba(
      resolveColor(
        "backgroundColor",
        tokens.getPropertyValue("--accent-hover"),
      ),
    );
    return {
      muted: contrast(muted, paper),
      cta: contrast(foreground, accent),
      ctaHover: contrast(foreground, accentHover),
    };
  });

  expect(ratios.muted).toBeGreaterThanOrEqual(4.5);
  expect(ratios.cta).toBeGreaterThanOrEqual(4.5);
  expect(ratios.ctaHover).toBeGreaterThanOrEqual(4.5);
});

test("every main navigation anchor resolves to one section", async ({
  page,
}) => {
  await page.goto("/");
  const hrefs = await page
    .locator('nav[aria-label="Main"] a[href*="#"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));

  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    expect(href).toBeTruthy();
    const hash = new URL(href!, page.url()).hash;
    expect(hash).not.toBe("");
    await expect(page.locator(hash)).toHaveCount(1);
  }
});

test("pointer, scroll, and video interactions work without runtime errors", async ({
  page,
}) => {
  await page.goto("/");
  const stage = page.locator("[data-stage]");
  const box = await stage.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.8, box!.y + box!.height * 0.3);
  await expect
    .poll(() =>
      stage.evaluate((node) => node.style.getPropertyValue("--eye-x")),
    )
    .not.toBe("");

  await page.locator("#product").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator("#product video")
        .first()
        .evaluate((video) => !(video as HTMLVideoElement).paused),
    )
    .toBe(true);
  await page.locator("#team").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator("#product video")
        .first()
        .evaluate((video) => (video as HTMLVideoElement).paused),
    )
    .toBe(true);
});

test("video scrubber follows presented time and seeks linearly", async ({
  page,
}) => {
  const cameraRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".camera.json"))
      cameraRequests.push(request.url());
  });
  await page.goto("/");
  await page.locator("#product").scrollIntoViewIfNeeded();

  const video = page.locator("#product video").first();
  const range = page.locator('#product input[type="range"]').first();
  const dial = range.locator("..");
  await expect
    .poll(() => video.evaluate((node) => !(node as HTMLVideoElement).paused))
    .toBe(true);
  await expect
    .poll(async () => {
      const ratio = await video.evaluate((node) => {
        const media = node as HTMLVideoElement;
        return media.currentTime / media.duration;
      });
      const handle = Number(
        await dial.evaluate((node) =>
          node.style.getPropertyValue("--player-progress"),
        ),
      );
      return Math.abs(handle - ratio);
    })
    .toBeLessThan(0.08);

  await range.evaluate((node) => {
    const input = node as HTMLInputElement;
    input.value = "750";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect
    .poll(() =>
      video.evaluate((node) => {
        const media = node as HTMLVideoElement;
        return media.currentTime / media.duration;
      }),
    )
    .toBeCloseTo(0.75, 1);
  expect(cameraRequests).toEqual([]);
});

test("contact uses the client inbox without a meeting link", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(
    page.locator('a[href="mailto:contact@chronospace.ai"]'),
  ).toHaveText("contact@chronospace.ai");
  await expect(page.getByText("Book a call", { exact: true })).toHaveCount(0);
  await expect(page.locator('a[href*="calendly.com"]')).toHaveCount(0);
});

test("team portraits stay compact on narrow displays", async ({ page }) => {
  await page.goto("/");
  const viewport = page.viewportSize();
  if (!viewport || viewport.width >= 768) return;

  const portraits = page.locator("#team article > a");
  await expect(portraits).toHaveCount(3);
  const widths = await portraits.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect().width),
  );
  expect(Math.max(...widths)).toBeLessThanOrEqual(144);
});

test("reduced motion leaves a static page", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const stage = page.locator("[data-stage]");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(150);
  const before = await stage.evaluate((node) => node.getAttribute("style"));
  const box = await stage.boundingBox();
  if (box)
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2);
  await page.waitForTimeout(150);
  expect(await stage.evaluate((node) => node.getAttribute("style"))).toBe(
    before,
  );

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(150);
  expect(
    await page
      .locator("video")
      .evaluateAll((videos) =>
        videos.every((video) => (video as HTMLVideoElement).paused),
      ),
  ).toBe(true);
  expect(
    await page.evaluate(() =>
      document.documentElement.hasAttribute("data-scrolled"),
    ),
  ).toBe(false);
  await expect(page.locator("canvas")).toHaveCount(0);
});

for (const hiw of ["", "invalid", "Infinity", "1e309", "-1e309"]) {
  test(`production ignores the removed hiw debug parameter: ${hiw || "empty"}`, async ({
    page,
  }) => {
    await page.goto(`/?hiw=${encodeURIComponent(hiw)}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("[data-hiw]")).toHaveCount(0);
  });
}
