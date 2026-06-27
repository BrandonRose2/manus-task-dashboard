import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Github, Search, X, FolderOpen, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

interface Repo {
  name: string;
  url: string;
  description: string;
  category: string;
  updated: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "ApartmentCorp Tools": {
    bg: "bg-blue-400/10",
    text: "text-blue-400",
    border: "border-blue-400/30",
    dot: "bg-blue-400",
  },
  "AI Projects": {
    bg: "bg-purple-400/10",
    text: "text-purple-400",
    border: "border-purple-400/30",
    dot: "bg-purple-400",
  },
  "Web Apps": {
    bg: "bg-emerald-400/10",
    text: "text-emerald-400",
    border: "border-emerald-400/30",
    dot: "bg-emerald-400",
  },
  "Resources & References": {
    bg: "bg-amber-400/10",
    text: "text-amber-400",
    border: "border-amber-400/30",
    dot: "bg-amber-400",
  },
};

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663449376037/6HAcW2mfRmxrM6oLjQmHt6/logo-icon-WtjLyRW8qf6yaEgLNX8XN9.webp";

export default function GitHub() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load repos from JSON
  useEffect(() => {
    fetch("/github_repos.json")
      .then((r) => r.json())
      .then((data: Repo[]) => setRepos(data))
      .catch(console.error);
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(repos.map((r) => r.category)));
    return cats;
  }, [repos]);

  const filtered = useMemo(() => {
    return repos.filter((r) => {
      if (activeCategory && r.category !== activeCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [repos, search, activeCategory]);

  const grouped = useMemo(() => {
    const map: Record<string, Repo[]> = {};
    filtered.forEach((r) => {
      if (!map[r.category]) map[r.category] = [];
      map[r.category].push(r);
    });
    return map;
  }, [filtered]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "oklch(0.10 0.012 260)", color: "oklch(0.93 0.01 260)" }}>
      {/* Sidebar overlay — mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-60 flex flex-col border-r border-border transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ background: "oklch(0.12 0.013 260)", borderColor: "oklch(0.78 0.16 75 / 12%)" }}
      >
        {/* Brand */}
        <div className="px-4 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <button
              className="md:hidden absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={16} />
            </button>
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.78 0.16 75 / 15%)", border: "1px solid oklch(0.78 0.16 75 / 30%)" }}
            >
              <img src={LOGO_URL} alt="Logo" className="w-5 h-5" />
            </div>
            <div>
              <div
                className="text-sm font-bold leading-none"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.78 0.16 75)" }}
              >
                TASK INTEL
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 tracking-wide">
                ApartmentCorp · Brandon
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-3 border-b border-border space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <FolderOpen size={13} />
            All Tasks
          </Link>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Github size={13} />
            GitHub Repos
          </div>
        </nav>

        {/* Category filters */}
        <div className="px-3 py-4 flex-1 overflow-y-auto">
          <div
            className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Categories
          </div>
          <div className="space-y-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${
                activeCategory === null
                  ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span>All Repos</span>
              <span className="text-[10px] font-mono">{repos.length}</span>
            </button>
            {categories.map((cat) => {
              const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS["Resources & References"];
              const count = repos.filter((r) => r.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors border ${
                    activeCategory === cat
                      ? `${colors.bg} ${colors.text} ${colors.border}`
                      : "text-muted-foreground hover:text-foreground hover:bg-accent border-transparent"
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                    {cat}
                  </div>
                  <span className="text-[10px] font-mono">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div
          className="sticky top-0 z-10 border-b border-border px-3 md:px-6 py-3 flex items-center gap-2 md:gap-4"
          style={{
            background: "oklch(0.13 0.015 260 / 96%)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid oklch(0.78 0.16 75 / 15%)",
          }}
        >
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground shrink-0"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={16} />
          </button>

          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories…"
              className="pl-9 pr-8 h-9 bg-card border-border text-sm placeholder:text-muted-foreground focus-visible:ring-amber-400/40"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Count */}
          <div
            className="hidden sm:block text-xs text-muted-foreground shrink-0"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="text-foreground font-medium">{filtered.length}</span>/{repos.length}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "oklch(0.78 0.16 75 / 12%)", border: "1px solid oklch(0.78 0.16 75 / 25%)" }}
            >
              <Github size={18} style={{ color: "oklch(0.78 0.16 75)" }} />
            </div>
            <div>
              <h1
                className="text-lg font-bold"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.78 0.16 75)" }}
              >
                GitHub Repositories
              </h1>
              <p className="text-xs text-muted-foreground">
                BrandonRose2 · {repos.length} repositories
              </p>
            </div>
          </div>

          {/* Grouped by category */}
          {Object.keys(grouped).length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No repositories match your search.
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(grouped).map(([category, catRepos]) => {
                const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS["Resources & References"];
                return (
                  <div key={category}>
                    {/* Category header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                      <h2
                        className={`text-xs font-bold uppercase tracking-widest ${colors.text}`}
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {category}
                      </h2>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}
                      >
                        {catRepos.length}
                      </span>
                    </div>

                    {/* Repo cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {catRepos.map((repo) => (
                        <a
                          key={repo.name}
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-col gap-2 p-4 rounded-lg border border-border bg-card hover:border-amber-400/30 hover:bg-amber-400/5 transition-all duration-150"
                          style={{ background: "oklch(0.14 0.013 260)" }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <Github size={13} className="text-muted-foreground shrink-0 mt-0.5" />
                              <span
                                className="text-sm font-semibold text-foreground truncate group-hover:text-amber-400 transition-colors"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                              >
                                {repo.name}
                              </span>
                            </div>
                            <ExternalLink
                              size={12}
                              className="text-muted-foreground/50 group-hover:text-amber-400 transition-colors shrink-0 mt-0.5"
                            />
                          </div>
                          <p
                            className="text-xs text-muted-foreground leading-relaxed line-clamp-2"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {repo.description || "No description"}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-1">
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}
                              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                              {category}
                            </span>
                            <span
                              className="text-[10px] text-muted-foreground/60"
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                              {repo.updated}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
