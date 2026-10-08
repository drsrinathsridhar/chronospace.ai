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

test("initial release shows a logo-only header and hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "World Models for the Physical World",
  );
  await expect(page).toHaveTitle(
    "ChronoSpace — World Models for the Physical World",
  );
  await expect(page.locator("main > section")).toHaveCount(1);
  const header = page.getByRole("banner");
  await expect(header).toBeVisible();
  await expect(header.getByRole("link")).toHaveCount(1);
  await expect(
    header.getByRole("link", { name: "ChronoSpace home" }),
  ).toHaveAttribute("href", "/");
  await expect(header.getByRole("button")).toHaveCount(0);
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await expect(page.locator("footer, video")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "contact@chronospace.ai", exact: true }),
  ).toHaveAttribute("href", "mailto:contact@chronospace.ai");
  await expect(page.locator("main")).toHaveText(
    "World Models for the Physical Worldcontact@chronospace.ai",
  );
});

test("hero pointer interaction works without runtime errors", async ({
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
});

// Preserve video coverage for the full launch, when these sections are restored.
test.skip("video scrubber follows presented time and seeks linearly", async ({
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

  const dragTarget = await dial.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const radius = box.width - box.height;
    const angle = ((-75 + 0.75 * 150) * Math.PI) / 180;
    return {
      x: box.left + box.width / 2 + Math.sin(angle) * radius,
      y: box.top + (box.height + radius) / 2 - Math.cos(angle) * radius,
    };
  });
  await page.mouse.move(dragTarget.x, dragTarget.y);
  await page.mouse.down();
  await page.waitForTimeout(150);
  await expect
    .poll(() =>
      dial.evaluate((node) =>
        Number(node.style.getPropertyValue("--player-progress")),
      ),
    )
    .toBeCloseTo(0.75, 2);
  await page.mouse.up();
  await expect
    .poll(() =>
      video.evaluate((node) => {
        const media = node as HTMLVideoElement;
        return media.currentTime / media.duration;
      }),
    )
    .toBeCloseTo(0.75, 1);

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

for (const scenario of [
  { section: "product", paused: false, end: "pointerup" },
  { section: "product", paused: true, end: "pointercancel" },
  { section: "viewer", paused: false, end: "lostpointercapture" },
  { section: "viewer", paused: true, end: "pointerup" },
]) {
  test.skip(`${scenario.section} scrubber holds frames and restores ${scenario.paused ? "paused" : "playing"} playback after ${scenario.end}`, async ({
    page,
  }) => {
    await page.goto("/");
    const video = page.locator(`#${scenario.section} video`).first();
    const dial = page
      .locator(`#${scenario.section} input[type="range"]`)
      .first()
      .locator("..");
    await video.scrollIntoViewIfNeeded();
    await expect
      .poll(() => video.evaluate((node) => !(node as HTMLVideoElement).paused))
      .toBe(true);
    if (scenario.paused)
      await video.evaluate((node) => (node as HTMLVideoElement).pause());

    for (const along of [0.75, 0.25]) {
      const target = await dial.evaluate((node, progress) => {
        const box = node.getBoundingClientRect();
        const radius = box.width - box.height;
        const angle = ((-75 + progress * 150) * Math.PI) / 180;
        return {
          x: box.left + box.width / 2 + Math.sin(angle) * radius,
          y: box.top + (box.height + radius) / 2 - Math.cos(angle) * radius,
        };
      }, along);
      await page.mouse.move(target.x, target.y);
      if (along === 0.75) await page.mouse.down();
      await expect
        .poll(() =>
          video.evaluate((node) => {
            const media = node as HTMLVideoElement;
            return {
              paused: media.paused,
              seeking: media.seeking,
              progress: media.currentTime / media.duration,
            };
          }),
        )
        .toEqual({
          paused: true,
          seeking: false,
          progress: expect.closeTo(along, 2),
        });
      const heldTime = await video.evaluate(
        (node) => (node as HTMLVideoElement).currentTime,
      );
      await page.waitForTimeout(250);
      expect(
        await video.evaluate((node) => (node as HTMLVideoElement).currentTime),
      ).toBe(heldTime);
    }

    if (scenario.end !== "pointerup") {
      await dial.dispatchEvent(scenario.end, { pointerId: 1 });
    }
    await page.mouse.up();
    await expect
      .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
      .toBe(scenario.paused);
    if (scenario.paused) {
      await page.waitForTimeout(250);
      expect(
        await video.evaluate((node) => {
          const media = node as HTMLVideoElement;
          return media.currentTime / media.duration;
        }),
      ).toBeCloseTo(0.25, 2);
    } else {
      await expect
        .poll(() =>
          video.evaluate((node) => {
            const media = node as HTMLVideoElement;
            return media.currentTime / media.duration;
          }),
        )
        .toBeGreaterThan(0.25);
    }
  });
}

test("contact uses the client inbox without a meeting link", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(
    page.locator('a[href="mailto:contact@chronospace.ai"]'),
  ).toHaveText("contact@chronospace.ai");
  await expect(page.getByText("Book a call", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Request a demo", { exact: true })).toHaveCount(
    0,
  );
  await expect(page.locator('a[href*="calendly.com"]')).toHaveCount(0);
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.locator("main")).toHaveText("contact@chronospace.ai");
});

// The team section is deferred until the full launch.
test.skip("team portraits stay compact on narrow displays", async ({
  page,
}) => {
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
