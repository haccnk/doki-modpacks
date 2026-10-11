import { FeatureTourItem, PricingPlan, CliCommand } from '../types';

export const PLATFORM_INFO = {
  name: "PackOps",
  tagline: "Modern Infrastructure for Modpack Engineering",
  description: "The modern developer platform to build, resolve dependencies, test in headless CI, and distribute modpacks globally with delta updates. Zero XML mess. Pure speed.",
  version: "v2.8.4",
  status: "Operational",
  uptime: "99.99%",
  avgBuildTime: "3.8s",
  buildsCount: "4.2M+",
  docsUrl: "https://docs.packops.dev",
  githubUrl: "https://github.com/packops/packops",
};

export const FEATURE_TOURS: FeatureTourItem[] = [
  {
    id: "resolver",
    badge: "AUTOMATED RESOLUTION",
    title: "Bytecode Mixin & Dependency Resolver",
    shortDesc: "Resolve thousands of mod dependencies and ASM mixin collisions in milliseconds.",
    fullDesc: "PackOps inspects jar bytecode ahead of time, cross-referencing Fabric, Forge, and NeoForge metadata. It detects overlapping mixin targets, missing transitive libraries, and duplicate class definitions before your client ever launches.",
    terminalCommand: "packops resolve --strict --loader fabric,forge",
    highlights: [
      "Deep bytecode conflict analysis",
      "Automated transitive dependency tree pruning",
      "Unified multi-loader matrix support",
      "Mojang official & Yarn mapping deobfuscator"
    ],
    metrics: [
      { label: "Conflict Detection", value: "100%" },
      { label: "Resolution Speed", value: "< 240ms" },
      { label: "Saved Debug Hours", value: "18h / week" }
    ]
  },
  {
    id: "ci-cd",
    badge: "HEADLESS PIPELINE",
    title: "Automated Headless CI/CD Sandbox",
    shortDesc: "Test world generation and crash stability on every pull request.",
    fullDesc: "Eliminate manual testing. Every commit spins up an ephemeral headless server instance in Linux containers, boots the world in 10 seconds, runs mock player movement, verifies tick stability, and logs memory heap allocations.",
    terminalCommand: "packops test --headless --timeout 30s",
    highlights: [
      "Zero-GUI containerized server boot in ~4 seconds",
      "Heap allocation & garbage collection profiler",
      "Automated PR review comments with crash diffs",
      "Native GitHub Actions & GitLab CI runners"
    ],
    metrics: [
      { label: "Test Duration", value: "4.2s avg" },
      { label: "False Positive Rate", value: "< 0.01%" },
      { label: "Memory Leak Alerts", value: "Real-time" }
    ]
  },
  {
    id: "delta-cdn",
    badge: "EDGE DISTRIBUTION",
    title: "Global Delta-Byte CDN & Sync",
    shortDesc: "Push 12MB updates instead of 450MB downloads to millions of players.",
    fullDesc: "Why force players to re-download 300 mods when you only tweaked two configs? PackOps computes binary bsdiff deltas at the edge and serves them across 310+ Cloudflare edge locations worldwide.",
    terminalCommand: "packops deploy --env production --delta",
    highlights: [
      "96% reduction in player download bandwidth",
      "One-click multi-target sync: CurseForge, Modrinth, Prism, Custom",
      "Atomic rollbacks to any prior release in 1 second",
      "Instant edge cache invalidation"
    ],
    metrics: [
      { label: "Bandwidth Cut", value: "96.4%" },
      { label: "Edge TTFB", value: "18ms" },
      { label: "Rollback Time", value: "< 1.2s" }
    ]
  },
  {
    id: "telemetry",
    badge: "CRASH INTELLIGENCE",
    title: "Real-Time Telemetry & Crash Profiling",
    shortDesc: "Group, symbolicate, and fix player crashes before they report them on Discord.",
    fullDesc: "PackOps captures unhandled runtime crashes, maps obfuscated intermediary names to human-readable methods, correlates player hardware profiles (RAM, GPU driver, Java version), and automatically creates a linked GitHub issue with the exact root cause.",
    terminalCommand: "packops telemetry tail --follow --severity fatal",
    highlights: [
      "Automated stack trace de-obfuscation",
      "Hardware correlation heatmaps (GPU / JVM)",
      "Grouping of identical crash signatures",
      "Webhook alerts straight to Discord & Slack"
    ],
    metrics: [
      { label: "Crash Grouping", value: "Automated" },
      { label: "Mapping Accuracy", value: "99.9%" },
      { label: "Resolution Time", value: "3x faster" }
    ]
  }
];

export const CLI_COMMANDS: Record<string, CliCommand> = {
  "packops check": {
    cmd: "packops check",
    description: "Scan local modpack directory for missing dependencies and mixin conflicts",
    output: [
      "✔ Reading packops.yaml config...",
      "✔ Discovered 284 mod archives in /mods directory",
      "✔ Analyzing bytecode mixin targets across 12,410 classes...",
      "✔ Cross-referencing Forge 47.3.0 & Fabric 0.16.5 ABI...",
      "-------------------------------------------------------",
      "✔ 0 critical collisions detected",
      "⚠ 1 non-fatal warning: 'iris' overrides 'sodium' pipeline",
      "✔ All 284 dependencies satisfied (resolved in 184ms)"
    ]
  },
  "packops build --delta": {
    cmd: "packops build --delta",
    description: "Generate minimal binary diff against the previous production release",
    output: [
      "✔ Comparing v2.8.3 (412.4 MB) -> v2.8.4 (418.1 MB)",
      "✔ Detected 3 updated mods, 1 added mod, 4 config tweaks",
      "✔ Computing binary bsdiff blocks...",
      "✔ Generated delta payload: 14.8 MB (saved 403.3 MB / 96.4%)",
      "✔ Generated manifest with SHA-256 integrity signatures",
      "✔ Package artifacts ready in ./dist/v2.8.4-delta.pak"
    ]
  },
  "packops deploy": {
    cmd: "packops deploy --env production",
    description: "Atomic global distribution to Edge CDN and launcher endpoints",
    output: [
      "✔ Authenticated as org: 'aetheria-studios' (Pro tier)",
      "✔ Uploading 14.8 MB delta package to 310 global edge nodes...",
      "✔ Edge distribution complete in 1.4s (avg latency 21ms)",
      "✔ Syncing metadata with Modrinth API...",
      "✔ Syncing metadata with CurseForge API...",
      "✔ Triggered Discord webhook notification: #release-notes",
      "🚀 Release v2.8.4 is live globally!"
    ]
  }
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "hobby",
    name: "Hobbyist",
    description: "For individual modpack creators and small private SMPs.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Up to 3 active modpacks",
      "Automated bytecode dependency resolver",
      "50 monthly headless CI build minutes",
      "10 GB monthly delta CDN bandwidth",
      "Community Discord support"
    ],
    cta: "Start Free"
  },
  {
    id: "pro",
    name: "Creator Pro",
    description: "For top modpack authors and public community networks.",
    monthlyPrice: 29,
    yearlyPrice: 24,
    popular: true,
    features: [
      "Unlimited modpacks & versions",
      "Instant mixin conflict intelligence",
      "500 monthly headless CI build minutes",
      "500 GB high-speed global Edge CDN",
      "Automated Modrinth & CurseForge syncing",
      "Deobfuscated crash telemetry dashboard",
      "Priority email & GitHub support"
    ],
    cta: "Start 14-Day Free Trial"
  },
  {
    id: "studio",
    name: "Studio / Enterprise",
    description: "For game studios, massive multiplayer networks, and publishers.",
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: [
      "Unlimited modpacks, team members & seats",
      "Dedicated headless CI runner clusters",
      "Custom Edge CDN domain & branding",
      "Custom anticheat & launcher SDK integration",
      "99.99% uptime SLA guarantee",
      "Dedicated account manager & 24/7 Slack channel"
    ],
    cta: "Contact Enterprise Sales"
  }
];

export const SAAS_FAQS = [
  {
    q: "How does PackOps resolve mixin conflicts before the game launches?",
    a: "PackOps runs an ahead-of-time bytecode scanner using ASM. It parses every `@Mixin` and `@Inject` annotation inside your jars, builds a virtual target map, and flags conflicting injections or invalid method signatures before any JVM classloader is invoked."
  },
  {
    q: "What is delta patching and how does it save 96% bandwidth?",
    a: "Standard launchers force players to re-download hundreds of megabytes of archives on every small update. PackOps computes binary differential blocks between your active release and new version. When players launch their client, they only download the modified blocks (typically 10-15MB) and the launcher recombines them locally in seconds."
  },
  {
    q: "Can I use PackOps with GitHub Actions or GitLab CI?",
    a: "Yes! PackOps provides an official GitHub Action (`packops/action@v2`) and a lightweight CLI binary for Linux, macOS, and Windows. You can automate builds, run headless tests on pull requests, and deploy releases straight from your repository."
  },
  {
    q: "Does PackOps work with both Fabric, Forge, and NeoForge?",
    a: "PackOps natively understands Fabric, Forge, NeoForge, and Quilt mod metadata formats. You can even configure a single repository to produce both Fabric and NeoForge builds automatically from unified configuration sources."
  }
];
