import { describe, expect, it } from "vitest";

describe("MANUS_API_KEY secret", () => {
  it("should be set in the environment", () => {
    const key = process.env.MANUS_API_KEY;
    expect(key).toBeDefined();
    expect(key?.length).toBeGreaterThan(10);
  });

  it("should successfully fetch tasks from the Manus API", async () => {
    const key = process.env.MANUS_API_KEY ?? "";
    const url = new URL("https://api.manus.ai/v2/task.list");
    url.searchParams.set("limit", "1");

    const res = await fetch(url.toString(), {
      headers: { "x-manus-api-key": key },
    });

    expect(res.ok).toBe(true);
    const data = await res.json() as { data: unknown[] };
    expect(Array.isArray(data.data)).toBe(true);
  }, 15000);
});
