(function () {
  const root = document.documentElement;

  // 1. Theme Toggle (Warm Parchment Light / Warm Obsidian Dark)
  const toggleBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("tadbeer-theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    root.setAttribute("data-theme", savedTheme);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("tadbeer-theme", next);
    });
  }

  // 2. Scroll Progress, Sticky Header Elevation, Mobile Dock & Bulletproof Reveal
  const progressBar = document.getElementById("scroll-progress");
  const navbar = document.getElementById("navbar");
  const mobileDock = document.getElementById("mobile-dock");
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));

  function revealVisibleOrPassed() {
    const thresholdY = window.innerHeight + 100;
    revealEls.forEach((el) => {
      if (el.classList.contains("is-visible")) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= thresholdY) {
        el.classList.add("is-visible");
      }
    });
  }

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && docHeight > 0) {
      progressBar.style.width = Math.min(100, (scrollTop / docHeight) * 100) + "%";
    }
    if (navbar) {
      navbar.classList.toggle("is-scrolled", scrollTop > 20);
    }
    if (mobileDock) {
      mobileDock.classList.toggle("is-visible", scrollTop > 380);
    }
    revealVisibleOrPassed();
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", revealVisibleOrPassed, { passive: true });
  handleScroll();

  // 3. Smart Staggered Scroll Reveals (IntersectionObserver + fallback sweep)
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "100px 0px 100px 0px" }
    );
    revealEls.forEach((el, idx) => {
      const siblingDelay = (idx % 4) * 45;
      el.style.transitionDelay = `${siblingDelay}ms`;
      observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // 4. Interactive Hero Stage Tabs + Auto-Cycle (pauses on user interaction)
  const stageEl = document.getElementById("product-stage");
  const tabBtns = Array.from(document.querySelectorAll(".stage-tab[data-tab]"));
  const panels = document.querySelectorAll(".stage-panel");
  let activeTabIdx = 0;
  let autoCycleTimer = null;

  function activateStageTab(targetName) {
    tabBtns.forEach((b, i) => {
      const isMatch = b.getAttribute("data-tab") === targetName;
      b.classList.toggle("active", isMatch);
      b.setAttribute("aria-selected", String(isMatch));
      if (isMatch) activeTabIdx = i;
    });

    panels.forEach((p) => {
      const isMatch = p.id === `panel-${targetName}`;
      p.hidden = !isMatch;
      p.classList.toggle("active", isMatch);
    });
  }

  function stopAutoCycle() {
    if (autoCycleTimer) {
      clearInterval(autoCycleTimer);
      autoCycleTimer = null;
    }
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      stopAutoCycle();
      activateStageTab(btn.getAttribute("data-tab"));
    });
  });

  if (stageEl && tabBtns.length > 1) {
    stageEl.addEventListener("mouseenter", stopAutoCycle);
    stageEl.addEventListener("touchstart", stopAutoCycle, { passive: true });
    autoCycleTimer = setInterval(() => {
      const nextIdx = (activeTabIdx + 1) % tabBtns.length;
      activateStageTab(tabBtns[nextIdx].getAttribute("data-tab"));
    }, 4500);
  }

  // 5. Pricing Currency Switcher (Global USD $100/$200 vs Egypt Exclusive EGP 5,000/10,000)
  const curBtns = document.querySelectorAll(".cur-btn[data-currency]");
  const basicVal = document.getElementById("price-basic-val");
  const basicCur = document.getElementById("price-basic-cur");
  const basicAlt = document.getElementById("price-basic-alt");
  const proVal = document.getElementById("price-pro-val");
  const proCur = document.getElementById("price-pro-cur");
  const proAlt = document.getElementById("price-pro-alt");
  const upgradeCopy = document.getElementById("upgrade-copy");

  const pricingData = {
    usd: {
      basicVal: "$100",
      basicCur: "دولار أمريكي · دفعة واحدة مدى الحياة",
      basicAlt: "حصرياً داخل مصر: 5,000 جنيه مصري",
      proVal: "$200",
      proCur: "دولار أمريكي · دفعة واحدة مدى الحياة",
      proAlt: "حصرياً داخل مصر: 10,000 جنيه مصري",
      upgrade: "تدفع فرق السعر فقط ($100 عالمياً، أو 5,000 جنيه مصري داخل مصر) وتنتقل جميع بياناتك بالكامل دون إعادة إدخال."
    },
    egp: {
      basicVal: "5,000",
      basicCur: "جنيه مصري · دفعة واحدة مدى الحياة",
      basicAlt: "السعر العالمي لبقية الدول: $100 دولار",
      proVal: "10,000",
      proCur: "جنيه مصري · دفعة واحدة مدى الحياة",
      proAlt: "السعر العالمي لبقية الدول: $200 دولار",
      upgrade: "تدفع فرق السعر فقط (5,000 جنيه مصري داخل مصر، أو $100 عالمياً) وتنتقل جميع بياناتك بالكامل دون إعادة إدخال."
    }
  };

  curBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-currency");
      const data = pricingData[mode];
      if (!data) return;

      curBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-selected", String(active));
      });

      if (basicVal) basicVal.textContent = data.basicVal;
      if (basicCur) basicCur.textContent = data.basicCur;
      if (basicAlt) basicAlt.textContent = data.basicAlt;
      if (proVal) proVal.textContent = data.proVal;
      if (proCur) proCur.textContent = data.proCur;
      if (proAlt) proAlt.textContent = data.proAlt;
      if (upgradeCopy) upgradeCopy.textContent = data.upgrade;
    });
  });

  // 6. Adaptive Video Library Lightbox Modal (5 Landscape Demos + 1 Portrait Reel)
  const videoModal = document.getElementById("video-modal");
  const modalBox = document.getElementById("modal-box");
  const modalVideoWrap = document.getElementById("modal-video-wrap");
  const videoPlayer = document.getElementById("intro-video-player");
  const closeVideoBtn = document.getElementById("close-video-btn");
  const modalTabs = document.querySelectorAll(".modal-tab[data-video-id]");
  const videoTriggers = document.querySelectorAll("[data-open-video]");

  function playModalTab(tabEl) {
    if (!tabEl) return;
    const src = tabEl.getAttribute("data-video-src");
    const poster = tabEl.getAttribute("data-video-poster") || "";
    const aspect = tabEl.getAttribute("data-video-aspect");

    modalTabs.forEach((t) => t.classList.toggle("active", t === tabEl));

    if (modalBox && modalVideoWrap) {
      const isPortrait = aspect === "portrait";
      modalBox.classList.toggle("is-portrait", isPortrait);
      modalVideoWrap.classList.toggle("aspect-portrait", isPortrait);
      modalVideoWrap.classList.toggle("aspect-landscape", !isPortrait);
    }

    if (videoPlayer && src) {
      videoPlayer.pause();
      videoPlayer.setAttribute("src", src);
      if (poster) {
        videoPlayer.setAttribute("poster", poster);
      } else {
        videoPlayer.removeAttribute("poster");
      }
      videoPlayer.load();
      videoPlayer.play().catch(() => {});
    }
  }

  function openModalById(videoId) {
    if (!videoModal) return;
    videoModal.hidden = false;
    const targetTab = document.querySelector(`.modal-tab[data-video-id="${videoId}"]`) || modalTabs[0];
    playModalTab(targetTab);
  }

  function closeVideo() {
    if (!videoModal) return;
    videoModal.hidden = true;
    if (videoPlayer) videoPlayer.pause();
  }

  videoTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openModalById(trigger.getAttribute("data-open-video"));
    });
  });

  modalTabs.forEach((tab) => {
    tab.addEventListener("click", () => playModalTab(tab));
  });

  if (closeVideoBtn) closeVideoBtn.addEventListener("click", closeVideo);
  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) closeVideo();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVideo();
  });

  // 7. Mobile Drawer
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener("click", () => {
      const isOpen = !mobileDrawer.hidden;
      mobileDrawer.hidden = isOpen;
      mobileBtn.setAttribute("aria-expanded", String(!isOpen));
    });
    mobileDrawer.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileDrawer.hidden = true;
        mobileBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 8. Dynamic Year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
})();
