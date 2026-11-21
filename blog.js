(function () {
  const posts = Array.isArray(window.TADBEER_POSTS) ? window.TADBEER_POSTS : [];
  if (!posts.length) return;

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildCardHtml(post) {
    return `
      <article class="post-card">
        <a href="article.html?slug=${encodeURIComponent(post.slug)}" class="post-thumb">
          <img src="${escapeHtml(post.cover)}" alt="${escapeHtml(post.coverAlt)}" loading="lazy" />
        </a>
        <div class="post-body">
          <div class="post-meta-row">
            <span class="post-cat">${escapeHtml(post.categoryLabel)}</span>
            <span class="post-date">${escapeHtml(post.dateFormatted)}</span>
          </div>
          <h3><a href="article.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h3>
          <p>${escapeHtml(post.excerpt)}</p>
          <a href="article.html?slug=${encodeURIComponent(post.slug)}" class="post-read-link">
            <span>اقرأ المقال (${escapeHtml(post.readTime)})</span>
            <span class="arrow-rtl" aria-hidden="true">←</span>
          </a>
        </div>
      </article>
    `;
  }

  // 1. Home Page Blog Preview (Top 3)
  const homeCount = document.getElementById("home-blog-count");
  if (homeCount) {
    homeCount.textContent = String(posts.length);
  }

  const homeGrid = document.getElementById("home-blog-grid");
  if (homeGrid) {
    homeGrid.innerHTML = posts.slice(0, 3).map(buildCardHtml).join("");
  }

  // 2. Blog Index Page (blog.html)
  const featuredSlot = document.getElementById("featured-post-slot");
  const postsGrid = document.getElementById("posts-grid");
  const emptyState = document.getElementById("empty-blog-state");
  const filterBtns = Array.from(document.querySelectorAll(".filter-pill[data-category]"));
  const searchInput = document.getElementById("blog-search-input");

  if (postsGrid) {
    const params = new URLSearchParams(window.location.search);
    let activeCategory = params.get("cat") || "all";
    let searchQuery = "";

    filterBtns.forEach((btn) => {
      const isMatch = btn.getAttribute("data-category") === activeCategory;
      btn.classList.toggle("active", isMatch);
      btn.setAttribute("aria-pressed", String(isMatch));
    });

    function renderBlogList() {
      const q = searchQuery.trim().toLowerCase();
      const filtered = posts.filter((post) => {
        const catMatch = activeCategory === "all" || post.category === activeCategory;
        const textMatch =
          !q ||
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.categoryLabel.toLowerCase().includes(q);
        return catMatch && textMatch;
      });

      const showFeatured = activeCategory === "all" && !q;
      let gridPosts = filtered;

      if (featuredSlot) {
        if (showFeatured) {
          const lead = posts.find((p) => p.featured) || posts[0];
          gridPosts = filtered.filter((p) => p.slug !== lead.slug);
          featuredSlot.hidden = false;
          featuredSlot.innerHTML = `
            <article class="featured-post">
              <a href="article.html?slug=${encodeURIComponent(lead.slug)}" class="featured-thumb">
                <img src="${escapeHtml(lead.cover)}" alt="${escapeHtml(lead.coverAlt)}" />
              </a>
              <div class="featured-content">
                <div class="featured-tag-row">
                  <span class="featured-label">مقال رئيسي</span>
                  <span class="post-cat">${escapeHtml(lead.categoryLabel)}</span>
                  <span class="post-date">${escapeHtml(lead.dateFormatted)}</span>
                </div>
                <h2><a href="article.html?slug=${encodeURIComponent(lead.slug)}">${escapeHtml(lead.title)}</a></h2>
                <p>${escapeHtml(lead.excerpt)}</p>
                <a href="article.html?slug=${encodeURIComponent(lead.slug)}" class="post-read-link">
                  <span>اقرأ الدليل الكامل (${escapeHtml(lead.readTime)})</span>
                  <span class="arrow-rtl" aria-hidden="true">←</span>
                </a>
              </div>
            </article>
          `;
        } else {
          featuredSlot.hidden = true;
          featuredSlot.innerHTML = "";
        }
      }

      if (gridPosts.length === 0 && (!showFeatured || filtered.length === 0)) {
        postsGrid.innerHTML = "";
        if (emptyState) emptyState.hidden = false;
      } else {
        if (emptyState) emptyState.hidden = true;
        postsGrid.innerHTML = gridPosts.map(buildCardHtml).join("");
      }
    }

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.getAttribute("data-category") || "all";
        filterBtns.forEach((b) => {
          const isMatch = b === btn;
          b.classList.toggle("active", isMatch);
          b.setAttribute("aria-pressed", String(isMatch));
        });
        renderBlogList();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value;
        renderBlogList();
      });
    }

    renderBlogList();
  }

  // 3. Article Reading Page (article.html)
  const articleShell = document.getElementById("article-shell");
  if (articleShell) {
    const params = new URLSearchParams(window.location.search);
    const targetSlug = params.get("slug");
    const post = posts.find((p) => p.slug === targetSlug) || posts[0];

    document.title = `${post.title} — مدونة تدبير`;

    const metaCat = document.getElementById("article-cat");
    const metaDate = document.getElementById("article-date");
    const metaRead = document.getElementById("article-read");
    const titleEl = document.getElementById("article-title");
    const excerptEl = document.getElementById("article-excerpt");
    const coverImg = document.getElementById("article-cover-img");
    const bodyEl = document.getElementById("article-body");
    const relatedGrid = document.getElementById("related-posts-grid");

    if (metaCat) metaCat.textContent = post.categoryLabel;
    if (metaDate) metaDate.textContent = post.dateFormatted;
    if (metaRead) metaRead.textContent = post.readTime;
    if (titleEl) titleEl.textContent = post.title;
    if (excerptEl) excerptEl.textContent = post.excerpt;
    if (coverImg) {
      coverImg.src = post.cover;
      coverImg.alt = post.coverAlt;
    }

    if (bodyEl && Array.isArray(post.blocks)) {
      bodyEl.innerHTML = post.blocks
        .map((blk) => {
          if (blk.type === "h2") {
            return `<h2>${escapeHtml(blk.text)}</h2>`;
          }
          if (blk.type === "callout") {
            return `
              <div class="article-callout">
                <strong>${escapeHtml(blk.title)}</strong>
                <p>${escapeHtml(blk.text)}</p>
              </div>
            `;
          }
          if (blk.type === "ul" && Array.isArray(blk.items)) {
            return `<ul>${blk.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
          }
          return `<p>${escapeHtml(blk.text)}</p>`;
        })
        .join("");
    }

    if (relatedGrid) {
      const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
      relatedGrid.innerHTML = others.map(buildCardHtml).join("");
    }
  }
})();
