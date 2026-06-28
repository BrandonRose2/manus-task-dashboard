import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

// Manus API key stored server-side — never exposed to the browser
const MANUS_API_KEY = process.env.MANUS_API_KEY ?? "";
const MANUS_API_BASE = "https://api.manus.ai";

// GitHub token stored server-side
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";
const GITHUB_USERNAME = "BrandonRose2";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Proxy endpoint for Manus task list — keeps API key server-side
  tasks: router({
    list: publicProcedure
      .input(
        z.object({
          cursor: z.string().optional(),
          limit: z.number().min(1).max(100).default(100),
        })
      )
      .query(async ({ input }) => {
        const url = new URL(`${MANUS_API_BASE}/v2/task.list`);
        url.searchParams.set("limit", String(input.limit));
        if (input.cursor) url.searchParams.set("cursor", input.cursor);

        const res = await fetch(url.toString(), {
          headers: { "x-manus-api-key": MANUS_API_KEY },
        });

        if (!res.ok) {
          throw new Error(`Manus API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json() as {
          data: Array<{
            id: string;
            title: string;
            task_url: string;
            status: string;
            task_type: string;
            agent_profile: string;
            credit_usage: number;
            created_at: string;
            updated_at: string;
            share_visibility: string;
          }>;
          has_more: boolean;
          next_cursor?: string;
        };

        return {
          tasks: data.data ?? [],
          has_more: data.has_more ?? false,
          next_cursor: data.next_cursor,
        };
      }),
  }),

  // GitHub proxy endpoints — keeps token server-side
  github: router({
    // Fetch all repos for BrandonRose2 (live, not static)
    repos: publicProcedure.query(async () => {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
      }

      const repos = await res.json() as Array<{
        id: number;
        name: string;
        html_url: string;
        description: string | null;
        updated_at: string;
        private: boolean;
        stargazers_count: number;
        language: string | null;
      }>;

      // Return just the names (and URLs) for the indicator lookup
      return repos.map(r => ({
        name: r.name,
        url: r.html_url,
        description: r.description,
        updatedAt: r.updated_at,
        isPrivate: r.private,
        stars: r.stargazers_count,
        language: r.language,
      }));
    }),

    // Create a new GitHub repo
    createRepo: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(100),
          description: z.string().optional(),
          isPrivate: z.boolean().default(false),
        })
      )
      .mutation(async ({ input }) => {
        // Validate repo name (GitHub rules: alphanumeric, hyphens, underscores, dots)
        const validName = /^[a-zA-Z0-9._-]+$/.test(input.name);
        if (!validName) {
          throw new Error("Repo name can only contain letters, numbers, hyphens, underscores, and dots.");
        }

        const res = await fetch("https://api.github.com/user/repos", {
          method: "POST",
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: input.name,
            description: input.description ?? "",
            private: input.isPrivate,
            auto_init: true, // creates with a README so it's not empty
          }),
        });

        if (!res.ok) {
          const err = await res.json() as { message?: string };
          throw new Error(err.message ?? `GitHub API error: ${res.status}`);
        }

        const repo = await res.json() as {
          name: string;
          html_url: string;
          description: string | null;
        };

        return {
          name: repo.name,
          url: repo.html_url,
          description: repo.description,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
