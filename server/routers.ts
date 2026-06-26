import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

// Manus API key stored server-side — never exposed to the browser
const MANUS_API_KEY = process.env.MANUS_API_KEY ?? "";
const MANUS_API_BASE = "https://api.manus.ai";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
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
});

export type AppRouter = typeof appRouter;
