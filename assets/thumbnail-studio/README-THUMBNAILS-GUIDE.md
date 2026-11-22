# Tadbeer Thumbnail & Blog Cover Studio (`1920×1080`) — AI & Designer Working Guide

This directory contains the reproducible **Brand-Matched Thumbnail & Editorial Cover System** for **منصة تدبير (TadbeerWebSite)**. Every generated image uses native offline typography (`Thmanyah Sans` + `IBM Plex Sans Arabic`), authentic SVG wordmarks (`../brand/tadbeer-ar-*.svg`), clean product UI captures (`sources/*.png`), and custom vector infographics rendered natively via headless Chromium/Brave at `1920×1080`.

---

## 1. Architecture & Why It Exists (For Future AI Agents)

Previously, the website's 6 video posters used old cyan/glowing neon artwork and the blog posts reused those same video posters verbatim.
Our **Two-Family Editorial System** separates them cleanly while uniting them under Tadbeer's brand system:

1. **Family A — Video Demo Thumbnails (`#0F2238` Deep Navy Showcase):**
   - Outputs: `assets/demo-poster.png`, `assets/posters/{students,sync,exams,spotting,intro}.png`
   - Deep navy radial architectural canvas (`#10243D -> #0B192C -> #07111E`) with concentric Kufic arcs.
   - Left `~54%`: Real subtitle-free product UI screenshot inside a tilted window chrome frame (`rotateY(7deg)`).
   - Right `~43%`: Brand mark + bordered gold/cream edition pill + large *Thmanyah Sans* headline (with calibrated curved SVG underline under the highlight phrase) + max 3 crisp benefit dots + bottom duration pill.
   - **Critical RTL Safe Zone:** In `dir="rtl"`, the HTML overlay `<span class="video-play-badge">▶ تشغيل</span>` uses `inset-inline-start: 10px` and sits at the **bottom-right** corner. Never place text or copy near the bottom-right `240×95px` region of any video thumbnail (`padding-bottom: 58px` on `.copy-col`).

2. **Family B — Editorial Blog Covers (`#EFE9DC` Warm Ivory & Alternating Navy Infographics):**
   - Outputs: `assets/blog/{slug}.png` referenced by `TadbeerWebSite/posts-data.js` (`cover: "assets/blog/{slug}.png"`).
   - Deliberately alternates between **Warm Editorial Ivory (`#F4EFE3 -> #EFE9DC -> #E5DEC9`)** with bronze `#9A5B06` ink and **Deep Technical Navy (`#0F2238`)** covers so 3-column grids look like an editorial magazine (*Thmanyah / Ilham*).
   - Right `~48%`: Editorial masthead (`tadbeer-ar-*` logo + category pill + concise 5–8 word headline + sub-deck + read-time footer).
   - Left `~48%`: Bespoke architectural infographic/diagram SVG/HTML card visually summarizing the article's exact mental model (e.g., Monthly Financial Lock, `.centerlink` LAN Topology, 3-Mode Teacher Payroll Ledger, A4 Honors Certificate, Release Spec Matrix).
   - **Critical Featured Cropping Rule:** Because `.home-blog-showcase .post-card:first-child` overrides `aspect-ratio` to `height: 100%`, keep generous outer padding (`96px` vertical, `112px` horizontal on `1920×1080`) so `object-fit: cover` never clips edges.
   - **Arabic Underline Rule:** Never add flat CSS `::after` bottom rules under inline Arabic words containing descenders or guillemets (`«...»`). Either rely on crisp color contrast alone (`#9A5B06` / `#F3C169`) or use a curated curved `<svg>` placed below descenders.

---

## 2. File Inventory & Outputs

```
assets/
├── demo-poster.png                    <- Video #1 (لوحة المعلومات)
├── posters/
│   ├── students.png                   <- Video #2 (الطلاب والتحصيل)
│   ├── sync.png                       <- Video #3 (محطات العمل والمزامنة)
│   ├── exams.png                      <- Video #4 (الامتحانات والكنترول والشهادات)
│   ├── spotting.png                   <- Video #5 (الفعاليات وورش الاسبوتينغ)
│   └── intro.png                      <- Video #6 (الفيديو التعريفي المختصر)
├── blog/
│   ├── monthly-lock-finance.png       <- Article #1 (Ivory + Padlock Diagram)
│   ├── offline-lan-sync.png           <- Article #2 (Navy + .centerlink Topology)
│   ├── teacher-payroll-modes.png      <- Article #3 (Ivory + Payroll Matrix)
│   ├── exams-and-certificates.png     <- Article #4 (Ivory + Honor Roll / A4 Spec)
│   └── release-v2-3-0.png             <- Article #5 (Navy + Pro/Basic Release Spec)
└── thumbnail-studio/
    ├── generate-thumbnails.py         <- Parameterized 1920x1080 headless renderer
    ├── README-THUMBNAILS-GUIDE.md     <- This AI handoff guide
    └── sources/                       <- Clean subtitle-free UI source screenshots
```

---

## 3. How to Regenerate or Add a New Cover (Future AI Workflow)

To re-render **all 11 covers**, run from anywhere:

```bash
python3 "/Users/mouaid/Desktop/mouied file/MD FAROOQ/02-مشاريع/TadbeerWebSite/assets/thumbnail-studio/generate-thumbnails.py"
```

To add **Article #6+** (`slug: "my-new-article"`):
1. Add one entry to `BLOG_COVERS` inside `generate-thumbnails.py` choosing `theme: "ivory"` or `"navy"` + a clean `panel_html` infographic block.
2. Run `python3 generate-thumbnails.py` — it compiles & screenshots `assets/blog/my-new-article.png` at crisp `1920×1080` via Brave headless.
3. Inspect the generated PNG using `read_file` to verify zero text overflow, high contrast, and Arabic typography integrity.
4. Set `cover: "assets/blog/my-new-article.png?v=XX"` in `TadbeerWebSite/posts-data.js` (always bump `?v=` cache query on modified images).

---

## 4. Critical Copy Guardrail: Brand vs. Product Separation

Never repeat the conflation error between the parent brand and the desktop product:
- **«تدبير / منصة تدبير»** is the umbrella educational technology platform (covering management systems **and** future **online** learning platforms like `منصة تدبير التعليمية للطلاب`).
- **«برنامج إدارة السناتر التعليمية»** (`Pro 2.3.0` / `Basic 1.2.0`) is the specific Windows desktop software engineered 100% offline.
- **Forbidden Copy on Any Thumbnail or Cover:** Never write *"لماذا بنينا تدبير 100% أوفلاين؟"* or *"تدبير نظام يعمل بلا إنترنت"*. Always write **«برنامج إدارة السناتر»** when describing 100% offline operation, LAN sync, or center management features.
