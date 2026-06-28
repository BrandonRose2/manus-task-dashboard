import { describe, expect, it } from "vitest";

describe("GitHub Token", () => {
  it("can fetch repos for BrandonRose2 using GITHUB_TOKEN", async () => {
    const token = process.env.GITHUB_TOKEN;
    expect(token, "GITHUB_TOKEN must be set").toBeTruthy();

    const res = await fetch(
      "https://api.github.com/users/BrandonRose2/repos?per_page=5",
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    expect(res.status).toBe(200);
    const repos = await res.json() as Array<{ name: string }>;
    expect(Array.isArray(repos)).toBe(true);
    expect(repos.length).toBeGreaterThan(0);
  }, 15000);
});
