(function () {
  const root = document.documentElement;

  // 1. Theme Toggle
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

  // 2. Scroll Progress, Navbar Shadow, Mobile Dock & Safe Reveal
  const progressBar = document.getElementById("scroll-progress");
  const navbar = document.getElementById("navbar");
  const mobileDock = document.getElementById("mobile-dock");
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));

  function sweepVisibleReveals() {
    const threshold = window.innerHeight + 120;
    revealEls.forEach((el) => {
      if (el.classList.contains("is-visible")) return;
      if (el.getBoundingClientRect().top <= threshold) {
        el.classList.add("is-visible");
      }
    });
  }

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && maxScroll > 0) {
      progressBar.style.width = Math.min(100, (scrollTop / maxScroll) * 100) + "%";
    }
    if (navbar) navbar.classList.toggle("is-scrolled", scrollTop > 18);
    if (mobileDock) mobileDock.classList.toggle("is-visible", scrollTop > 420);
    sweepVisibleReveals();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", sweepVisibleReveals, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "120px 0px 120px 0px" }
    );
    revealEls.forEach((el, idx) => {
      el.style.transitionDelay = `${(idx % 4) * 40}ms`;
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // 3. Interactive Command Console Tabs
  const consoleTabs = Array.from(document.querySelectorAll(".c-tab[data-ctab]"));
  const consolePanels = document.querySelectorAll(".c-panel");

  consoleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-ctab");
      consoleTabs.forEach((t) => {
        const match = t === tab;
        t.classList.toggle("active", match);
        t.setAttribute("aria-selected", String(match));
      });
      consolePanels.forEach((panel) => {
        const match = panel.id === `cpanel-${target}`;
        panel.hidden = !match;
        panel.classList.toggle("active", match);
      });
    });
  });

  // 3a. Live Student Search & Inspector
  const studentData = {
    ahmed: {
      name: "أحمد محمد عثمان",
      cls: "ثالث ثانوي · تسجيل مؤكّد بالاسم",
      due: "$120",
      paid: "$120",
      rem: "$0",
      remClass: "val-ok",
      method: "نقدي بالخزينة",
      reg: "مفصول في مسار مستقل ✓",
      staff: "الاستقبال (سجل باسمه)"
    },
    sara: {
      name: "سارة خالد إبراهيم",
      cls: "أول ثانوي · باقة المواد العلمية",
      due: "$100",
      paid: "$60",
      rem: "$40",
      remClass: "val-gold",
      method: "تحويل إلكتروني",
      reg: "مؤكّد ومفصول ✓",
      staff: "الاستقبال 2 (مزامن عبر LAN)"
    },
    omar: {
      name: "عمر عبدالله حسن",
      cls: "ثاني ثانوي · كيمياء + أحياء",
      due: "$90",
      paid: "$0",
      rem: "$90",
      remClass: "val-due",
      method: "قيد المتابعة في كشف المتأخرات",
      reg: "مسجّل رسوم فتح الملف فقط",
      staff: "المدير / الاستقبال"
    },
    lina: {
      name: "لينا مصطفى أحمد",
      cls: "ثالث ثانوي · المركز الأول (98.5%)",
      due: "$120",
      paid: "$120",
      rem: "$0",
      remClass: "val-ok",
      method: "نقدي بالخزينة",
      reg: "مسدّد بالكامل ✓",
      staff: "الاستقبال 1"
    }
  };

  const searchInput = document.getElementById("sim-student-search");
  const studentRows = Array.from(document.querySelectorAll(".sim-row[data-student-id]"));
  const inspName = document.getElementById("insp-name");
  const inspClass = document.getElementById("insp-class");
  const inspDue = document.getElementById("insp-due");
  const inspPaid = document.getElementById("insp-paid");
  const inspRem = document.getElementById("insp-rem");
  const inspMethod = document.getElementById("insp-method");
  const inspReg = document.getElementById("insp-reg");
  const inspStaff = document.getElementById("insp-staff");

  function selectStudent(id) {
    const rec = studentData[id];
    if (!rec) return;
    studentRows.forEach((r) => r.classList.toggle("active", r.getAttribute("data-student-id") === id));
    if (inspName) inspName.textContent = rec.name;
    if (inspClass) inspClass.textContent = rec.cls;
    if (inspDue) inspDue.textContent = rec.due;
    if (inspPaid) inspPaid.textContent = rec.paid;
    if (inspRem) {
      inspRem.textContent = rec.rem;
      inspRem.className = rec.remClass;
    }
    if (inspMethod) inspMethod.textContent = rec.method;
    if (inspReg) inspReg.textContent = rec.reg;
    if (inspStaff) inspStaff.textContent = rec.staff;
  }

  studentRows.forEach((row) => {
    row.addEventListener("click", () => selectStudent(row.getAttribute("data-student-id")));
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim();
      let firstMatch = null;
      studentRows.forEach((row) => {
        const matched = !q || row.textContent.includes(q);
        row.style.display = matched ? "" : "none";
        if (matched && !firstMatch) firstMatch = row.getAttribute("data-student-id");
      });
      if (firstMatch) selectStudent(firstMatch);
    });
  }

  // 3b. Treasury Month Lock Toggle
  const monthBtns = document.querySelectorAll(".sim-seg-btn[data-month]");
  const trState = document.getElementById("tr-state");
  const trStateDesc = document.getElementById("tr-state-desc");
  const trGuard = document.getElementById("tr-guard");
  const trGuardDesc = document.getElementById("tr-guard-desc");

  monthBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-month");
      monthBtns.forEach((b) => b.classList.toggle("active", b === btn));
      const isLocked = mode === "locked";
      if (trState) {
        trState.textContent = isLocked ? "مقفل بكلمة سر المدير 🔒" : "مفتوح للتحصيل المباشر";
        trState.className = isLocked ? "val-gold" : "val-ok";
      }
      if (trStateDesc) {
        trStateDesc.textContent = isLocked
          ? "تم إغلاق هذا الشهر تلقائياً؛ يمنع النظام أي موظف من تعديل قيوده أو حذف مبالغه."
          : "يسمح لموظف الاستقبال بتسجيل الدفعات ورسم التسجيل دون حاجة لإذن المدير.";
      }
      if (trGuard) {
        trGuard.textContent = isLocked ? "مسموح فقط بفترة استثنائية" : "التعديل الخلفي مرصود";
      }
      if (trGuardDesc) {
        trGuardDesc.textContent = isLocked
          ? "لتسجيل متأخر عن هذا الشهر، يفتح المدير «فترة استثنائية» مؤقتة وتُوثَّق باسمه في الكشف."
          : "عند نهاية الشهر يُقفل السجل آلياً. أي سداد متأخر يتطلب «فترة استثنائية» بكلمة سر المدير.";
      }
    });
  });

  // 3c. Teacher Payroll Mode Simulator
  const payModes = {
    session: {
      title: "حساب الأجر = الحصص المؤكدة فعلياً × أجر الحصة",
      desc: "لا يدخل أجر أي حصة ملغاة أو غير مؤكدة في كشف الأستاذ. يتم توليد جدول الشهر آلياً بمجرد ربط المادة باليوم والساعة.",
      confirmed: "14 حصة",
      total: "محسوب آلياً ✓"
    },
    percent: {
      title: "حساب الأجر = نسبة متفق عليها من صافي تحصيل الطلاب",
      desc: "تُربط حصة الأستاذ بنسبة واضحة من اشتراكات مادته فقط، بعد خصم أو فصل رسم التسجيل طبقاً لإعدادات السنتر.",
      confirmed: "حصص مؤكدة 100%",
      total: "نسبة الأستاذ جاهزة ✓"
    },
    salary: {
      title: "حساب الأجر = راتب شهري ثابت وموثّق في المصروفات",
      desc: "مناسب للأساتذة المتفرغين بمرتب شهري؛ يُرحَّل تلقائياً إلى كشف الرواتب الشهري في التقرير الرسمي PDF.",
      confirmed: "شهر دراسي كامل",
      total: "مرصود بالراتب الثابت ✓"
    }
  };
  const payBtns = document.querySelectorAll(".pay-mode-btn[data-paymode]");
  const payTitle = document.getElementById("pay-title");
  const payDesc = document.getElementById("pay-desc");
  const payConfirmed = document.getElementById("pay-confirmed");
  const payTotal = document.getElementById("pay-total");

  payBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const data = payModes[btn.getAttribute("data-paymode")];
      if (!data) return;
      payBtns.forEach((b) => b.classList.toggle("active", b === btn));
      if (payTitle) payTitle.textContent = data.title;
      if (payDesc) payDesc.textContent = data.desc;
      if (payConfirmed) payConfirmed.textContent = data.confirmed;
      if (payTotal) payTotal.textContent = data.total;
    });
  });

  // 3d. Spotting Tickets Interactive Profit Calculator
  const calcBtns = document.querySelectorAll(".calc-tkt-btn[data-tickets]");
  const spotGross = document.getElementById("spot-gross");
  const spotTeacher = document.getElementById("spot-teacher");
  const spotCenter = document.getElementById("spot-center");

  calcBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tickets = Number(btn.getAttribute("data-tickets")) || 85;
      const gross = tickets * 5;
      const teacher = Math.round(gross * 0.6);
      const center = gross - teacher;
      calcBtns.forEach((b) => b.classList.toggle("active", b === btn));
      if (spotGross) spotGross.textContent = `$${gross}`;
      if (spotTeacher) spotTeacher.textContent = `$${teacher}`;
      if (spotCenter) spotCenter.textContent = `$${center}`;
    });
  });

  // 3e. LAN Disconnect / Reconnect Simulation
  const lanBtn = document.getElementById("lan-disconnect-btn");
  const lanBridge = document.getElementById("lan-bridge");
  const lanBridgeText = document.getElementById("lan-bridge-text");
  const lanMasterStatus = document.getElementById("lan-master-status");
  const lanRecStatus = document.getElementById("lan-rec-status");
  let isLanOfflineSim = false;

  if (lanBtn) {
    lanBtn.addEventListener("click", () => {
      isLanOfflineSim = !isLanOfflineSim;
      lanBtn.classList.toggle("active", isLanOfflineSim);
      lanBtn.textContent = isLanOfflineSim ? "أعد توصيل الشبكة الداخلية 🔄" : "جرّب فصل الشبكة مؤقتاً ⚡";
      if (lanBridge) lanBridge.classList.toggle("is-offline", isLanOfflineSim);
      if (lanBridgeText) {
        lanBridgeText.textContent = isLanOfflineSim
          ? "⚠️ الشبكة مفصولة مؤقتاً — الطابور المحلي يحفظ الحركات"
          : "⇄ مزامنة تلقائية كل 15 ثانية عبر شبكة السنتر";
      }
      if (lanMasterStatus) {
        lanMasterStatus.textContent = isLanOfflineSim ? "● في انتظار عودة المحطات" : "● يستقبل ويؤكّد التحديثات";
        lanMasterStatus.className = isLanOfflineSim ? "val-gold" : "val-ok";
      }
      if (lanRecStatus) {
        lanRecStatus.textContent = isLanOfflineSim ? "تواصل التسجيل والتحصيل محلياً ✓" : "تسجيل وتحصيل متزامن";
      }
    });
  }

  // 4. Interactive Role Perspective Matrix
  const roleDetails = {
    owner: {
      code: "ROLE_01 · FULL_CONTROL",
      title: "صاحب ومدير السنتر: أمان مالي بلا تسرب",
      summary: "تتحكم في كل شاردة وواردة عبر 13 شاشة مترابطة من جهازك الرئيسي، وتدير حتى محطتي استقبال و5 مشرفين عبر شبكة السنتر الداخلية دون اتصال بالإنترنت.",
      allow: [
        "كشف لحظي للمقرّر والمدفوع والمتبقي لكل طالب.",
        "قفل تلقائي للشهور الماضية لا يُفتح إلا بكلمة سرك.",
        "تقارير مالية رسمية PDF مفصولة فيها الرسوم عن الاشتراكات."
      ],
      protect: [
        "لا يمكن لأي موظف حذف طالب أو سداد نهائياً.",
        "حجب تام لإجمالي إيرادات السنتر وصافي الأرباح عن فريق العمل.",
        "نسخ احتياطي يومي آلي + تصدير يدوي على فلاشة بضغطة زر."
      ]
    },
    staff: {
      code: "ROLE_02 · DATA_ENTRY & SUPERVISOR",
      title: "الاستقبال والمشرفون: سرعة يومية دون كشف أسرار السنتر",
      summary: "يعمل موظفو الاستقبال والمشرفون بكفاءة عالية في تسجيل الطلاب وتأكيد الحصص ورصد الدرجات، مع حدود صارمة مبرمجة في كل شاشة.",
      allow: [
        "تسجيل الطلاب وتحصيل الاشتراكات في ثوانٍ باسم الموظف.",
        "محطة المشرف (Pro): متابعة الحضور والامتحانات وعلامة (سدّد / لم يسدّد) فقط.",
        "مزامنة كل 15 ثانية مع مواصلة العمل لو انقطعت الشبكة."
      ],
      protect: [
        "لا يرى مدخل البيانات إجمالي خزينة السنتر ولا تقارير الأرباح.",
        "لا يرى المشرف أي رقم مالي نهائياً، ولا يستطيع تعديل مبالغ.",
        "أزرار الحذف النهائي مقفولة تماماً على مستوى الصلاحيات."
      ]
    },
    teacher: {
      code: "ROLE_03 · TEACHER_CLARITY",
      title: "الأستاذ والمحاضر: جدول منظم ومستحقات واضحة بلا جدال",
      summary: "بمجرد ربط الأستاذ بالمادة والفصل يتولد الجدول آلياً طوال الشهر، وتُحتسب مستحقاته بشفافية من الحصص المؤكدة وورش الاسبوتينغ.",
      allow: [
        "جدول حصص ثابت ومولَّد تلقائياً لكل مادة وصف.",
        "دعم أنظمة التعاقد الثلاثة: بالحصة، بنسبة، أو راتب شهري.",
        "كشف مستقل لتذاكر ونسبة أرباح كل ورشة اسبوتينغ."
      ],
      protect: [
        "لا تُحسب الحصص الملغاة أو غير المؤكدة في كشف الصرف.",
        "منع اختلاط حصص المراجعة والاسبوتينغ بالاشتراكات الشهرية.",
        "تقارير درجات وامتحانات منظمة لطلابه في كل حصة."
      ]
    },
    student: {
      code: "ROLE_04 · STUDENT_EXPERIENCE",
      title: "الطالب وولي الأمر: ملف منظم وتكريم يرفع قيمة السنتر",
      summary: "يحصل الطالب وولي الأمر على متابعة دقيقة في الامتحانات، وإشعارات درجات وشهادات تقدير رسمية بمقاس A4 باسم السنتر وشعاره.",
      allow: [
        "ملف طالب كامل محفوظة فيه بياناته ومستنداته ومواده.",
        "لوحة شرف آلية تبرز المتفوقين في كل امتحان وفترة.",
        "طباعة فورية لشهادات التقدير وإشعارات الدرجات A4."
      ],
      protect: [
        "بحث فوري باسم الطالب أو رقمه دون ضياع ملفات ورقية.",
        "توثيق دقيق لكل سداد يمنع اللبس بين المدفوع والمتبقي.",
        "سجل محفوظ محلياً لا يضيع ولا يتأثر بانقطاع الإنترنت."
      ]
    }
  };

  const roleTabs = document.querySelectorAll(".role-tab[data-role]");
  const rdCode = document.getElementById("rd-code");
  const rdTitle = document.getElementById("rd-title");
  const rdSummary = document.getElementById("rd-summary");
  const rdAllowList = document.getElementById("rd-allow-list");
  const rdProtectList = document.getElementById("rd-protect-list");

  function renderBullets(ulEl, items) {
    if (!ulEl) return;
    ulEl.innerHTML = items.map((text) => `<li>${text}</li>`).join("");
  }

  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const data = roleDetails[tab.getAttribute("data-role")];
      if (!data) return;
      roleTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", String(active));
      });
      if (rdCode) rdCode.textContent = data.code;
      if (rdTitle) rdTitle.textContent = data.title;
      if (rdSummary) rdSummary.textContent = data.summary;
      renderBullets(rdAllowList, data.allow);
      renderBullets(rdProtectList, data.protect);
    });
  });

  // 5. Inline Video Cinema Theater
  const theaterScreen = document.getElementById("theater-screen");
  const theaterPlayer = document.getElementById("theater-player");
  const theaterBadge = document.getElementById("theater-badge");
  const theaterTitle = document.getElementById("theater-title");
  const theaterDesc = document.getElementById("theater-desc");
  const theaterPlayBtn = document.getElementById("theater-play-btn");
  const playlistItems = document.querySelectorAll(".playlist-item[data-video-src]");

  playlistItems.forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.getAttribute("data-video-src");
      const poster = item.getAttribute("data-video-poster") || "";
      const aspect = item.getAttribute("data-video-aspect");
      const badge = item.getAttribute("data-badge") || "";
      const title = item.getAttribute("data-title") || "";
      const desc = item.getAttribute("data-desc") || "";

      playlistItems.forEach((p) => {
        const active = p === item;
        p.classList.toggle("active", active);
        p.setAttribute("aria-selected", String(active));
      });

      if (theaterScreen) {
        theaterScreen.classList.toggle("is-portrait", aspect === "portrait");
      }
      if (theaterBadge) theaterBadge.textContent = badge;
      if (theaterTitle) theaterTitle.textContent = title;
      if (theaterDesc) theaterDesc.textContent = desc;

      if (theaterPlayer && src) {
        theaterPlayer.pause();
        theaterPlayer.setAttribute("src", src);
        if (poster) {
          theaterPlayer.setAttribute("poster", poster);
        } else {
          theaterPlayer.removeAttribute("poster");
        }
        theaterPlayer.load();
        theaterPlayer.play().catch(() => {});
      }
    });
  });

  if (theaterPlayBtn && theaterPlayer) {
    theaterPlayBtn.addEventListener("click", () => {
      if (theaterPlayer.paused) {
        theaterPlayer.play().catch(() => {});
      } else {
        theaterPlayer.pause();
      }
    });
    theaterPlayer.addEventListener("play", () => {
      theaterPlayBtn.textContent = "⏸ إيقاف مؤقت";
    });
    theaterPlayer.addEventListener("pause", () => {
      theaterPlayBtn.textContent = "▶ تشغيل الآن";
    });
  }

  // 6. Multi-Region Pricing Switcher
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
      const data = pricingData[btn.getAttribute("data-currency")];
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
