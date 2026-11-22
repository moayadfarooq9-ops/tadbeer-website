#!/usr/bin/env python3
"""
Tadbeer Branded Thumbnail & Editorial Blog Cover Generator (1920x1080)
--------------------------------------------------------------------
Reproducible Chromium/HTML/SVG generator for TadbeerWebSite:
  - 6 Video Demo Thumbnails -> assets/demo-poster.png + assets/posters/*.png
  - 5 Editorial Blog Covers -> assets/blog/*.png

Run from any directory:
  python3 generate-thumbnails.py
"""

from pathlib import Path
import subprocess
import sys

STUDIO_DIR = Path(__file__).resolve().parent
ASSETS_DIR = STUDIO_DIR.parent
SOURCES_DIR = STUDIO_DIR / "sources"
FONTS_DIR = ASSETS_DIR / "fonts"
BRAND_DIR = ASSETS_DIR / "brand"
BLOG_OUT_DIR = ASSETS_DIR / "blog"
POSTERS_OUT_DIR = ASSETS_DIR / "posters"

BRAVE_BIN = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"


SHARED_FONT_CSS = f"""
  @font-face {{ font-family: "Thmanyah Sans"; src: url("file://{FONTS_DIR}/thmanyahsans-Regular.otf"); font-weight: 400; }}
  @font-face {{ font-family: "Thmanyah Sans"; src: url("file://{FONTS_DIR}/thmanyahsans-Bold.otf"); font-weight: 700 900; }}
  @font-face {{ font-family: "IBM Plex Sans Arabic"; src: url("file://{FONTS_DIR}/IBMPlexSansArabic-Medium.ttf"); font-weight: 500; }}
  @font-face {{ font-family: "IBM Plex Sans Arabic"; src: url("file://{FONTS_DIR}/IBMPlexSansArabic-SemiBold.ttf"); font-weight: 600; }}
  @font-face {{ font-family: "IBM Plex Sans Arabic"; src: url("file://{FONTS_DIR}/IBMPlexSansArabic-Bold.ttf"); font-weight: 700; }}
"""


VIDEO_THUMBNAILS = [
    {
        "out": ASSETS_DIR / "demo-poster.png",
        "source": "ui-dashboard.png",
        "frame_title": "برنامج إدارة السناتر التعليمية — لوحة المعلومات",
        "badge": "برنامج إدارة السناتر · Basic & Pro",
        "badge_mode": "gold",
        "line1": "أدر سنترك",
        "pre": "من ",
        "highlight": "شاشة واحدة",
        "bullets": ["المحصّل والأرباح لحظياً", "تسجيل السداد خلال ثوانٍ", "أوفلاين 100% · بلا إنترنت"],
        "footer_label": "لوحة المعلومات وبداية التشغيل",
        "duration": "44 ثانية",
    },
    {
        "out": POSTERS_OUT_DIR / "students.png",
        "source": "ui-students.png",
        "frame_title": "برنامج إدارة السناتر — الطلاب والتحصيل والمتأخرات",
        "badge": "Basic & Pro · التحصيل والطلاب",
        "badge_mode": "gold",
        "line1": "تابع المتأخرات",
        "pre": "بضغطة ",
        "highlight": "زر واحدة",
        "bullets": ["إضافة الطالب والفصل في ثوانٍ", "فلترة المدفوع والمتبقي آلياً", "تسجيل سداد نقدي أو بنكي"],
        "footer_label": "الطلاب والتحصيل والمتأخرات",
        "duration": "49 ثانية",
    },
    {
        "out": POSTERS_OUT_DIR / "sync.png",
        "source": "ui-sync.png",
        "frame_title": 'إدارة محطات العمل والمزامنة (<span dir="ltr">.centerlink</span>)',
        "badge": "حصري لـ Pro · المزامنة الشبكية",
        "badge_mode": "emerald",
        "line1": "اربط فريقك",
        "pre": "بمزامنة ",
        "highlight": "بلا إنترنت",
        "bullets": ["ربط ٢ استقبال + ٥ مشرفين", "تحديث تلقائي كل 15 ثانية", "البيانات لا تغادر أجهزتك"],
        "footer_label": "محطات العمل والمزامنة الشبكية",
        "duration": "72 ثانية",
    },
    {
        "out": POSTERS_OUT_DIR / "exams.png",
        "source": "ui-exams.png",
        "frame_title": "إدارة الامتحانات ولجان الكنترول والشهادات",
        "badge": "حصري لـ Pro · الكنترول والشهادات",
        "badge_mode": "emerald",
        "line1": "كنترول متكامل",
        "pre": "وشهادات ",
        "highlight": "بلا أخطاء",
        "bullets": ["إدارة اللجان وتكاليف التصحيح", "لوحة شرف تلقائية للأوائل", "طباعة شهادات A4 فورية"],
        "footer_label": "الامتحانات والكنترول والشهادات",
        "duration": "75 ثانية",
    },
    {
        "out": POSTERS_OUT_DIR / "spotting.png",
        "source": "ui-spotting.png",
        "frame_title": "إدارة ورش الاسبوتينغ والفعاليات والملازم",
        "badge": "حصري لـ Pro · الورش والملازم",
        "badge_mode": "emerald",
        "line1": "ورش الاسبوتينغ",
        "pre": "بأرباح ",
        "highlight": "مفصولة بدقة",
        "bullets": ["تذاكر الحضور والملازم والقاعة", "تصفية آلية لنسبة الأستاذ", "فصل تام عن الشهر المعتاد"],
        "footer_label": "الفعاليات وورش الاسبوتينغ",
        "duration": "89 ثانية",
    },
    {
        "out": POSTERS_OUT_DIR / "intro.png",
        "source": "ui-intro.png",
        "frame_title": "برنامج إدارة السناتر — Basic 1.2.0 & Pro 2.3.0",
        "badge": "برنامج إدارة السناتر · ريلز تعريفي",
        "badge_mode": "gold",
        "line1": "برنامج متكامل",
        "pre": "يرتّب ",
        "highlight": "أعمال سنترك",
        "bullets": ["طلاب ومالية وكنترول أوفلاين", "مناسب للسنتر الصغير والكبير", "دفعة واحدة مدى الحياة"],
        "footer_label": "الفيديو التعريفي المختصر",
        "duration": "65 ثانية",
    },
]


BLOG_COVERS = [
    {
        "out": BLOG_OUT_DIR / "monthly-lock-finance.png",
        "theme": "ivory",
        "category": "المالية والقفل الشهري",
        "read_time": "4 دقائق قراءة",
        "title_html": 'كيف يحسم <span class="accent">«القفل الشهري»</span> تسرّب التحصيل؟',
        "deck": "الفرق بين الدفتر الورقي ونظام يفصل مسار التسجيل ويقيس المقرّر والمدفوع والمتبقي.",
        "panel_html": """
          <div class="art-panel">
            <div class="panel-top">
              <div class="lock-badge">
                <div class="lock-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F3C169" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div class="lock-title">
                  <strong>القفل الشهري المالي</strong>
                  <span>حماية تلقائية لسجلات الشهر</span>
                </div>
              </div>
              <span class="status-chip green">✓ مقفول وموثّق</span>
            </div>
            <div class="kpi-triple">
              <div class="kpi-box"><small>المقرّر الشهري</small><strong>1,200,000</strong></div>
              <div class="kpi-box green"><small>المحصّل الفعلي</small><strong>965,000</strong></div>
              <div class="kpi-box amber"><small>المتبقي التلقائي</small><strong>235,000</strong></div>
            </div>
            <div class="split-track">
              <span class="track-pill">اشتراك الحصص الشهرية</span>
              <span class="track-sep">≠</span>
              <span class="track-pill gold">رسم التسجيل والملازم</span>
            </div>
          </div>
        """,
    },
    {
        "out": BLOG_OUT_DIR / "offline-lan-sync.png",
        "theme": "navy",
        "category": "أوفلاين ومزامنة LAN",
        "read_time": "5 دقائق قراءة",
        "title_html": 'برنامج إدارة السناتر<br/>لماذا <span class="accent"><span dir="ltr">100%</span> أوفلاين</span>؟',
        "deck": 'كيف يربط ملف <span dir="ltr">(.centerlink)</span> محطات الاستقبال والمشرفين كل 15 ثانية داخل شبكة السنتر.',
        "panel_html": """
          <div class="art-panel ivory-panel">
            <div class="panel-top light">
              <div class="lock-badge">
                <div class="lock-icon navy">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F2238" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <div class="lock-title dark">
                  <strong>برنامج إدارة السناتر — السيرفر المحلي</strong>
                  <span>مزامنة محلية بدون إنترنت · كل 15 ثانية</span>
                </div>
              </div>
              <span class="status-chip dark-green">LAN 100%</span>
            </div>
            <div class="kpi-triple">
              <div class="kpi-box light"><small>محطات الاستقبال</small><strong>2 أجهزة</strong></div>
              <div class="kpi-box light green-light"><small>أجهزة المشرفين</small><strong>5 محطات</strong></div>
              <div class="kpi-box light amber-light"><small>ملف الربط الفوري</small><strong dir="ltr">.centerlink</strong></div>
            </div>
            <div class="split-track light">
              <span class="track-pill dark">صلاحيات مفصولة للاستقبال والمشرف</span>
              <span class="track-pill green-solid">بياناتك محلية بالكامل</span>
            </div>
          </div>
        """,
    },
    {
        "out": BLOG_OUT_DIR / "teacher-payroll-modes.png",
        "theme": "ivory",
        "category": "الأساتذة والكنترول",
        "read_time": "4 دقائق قراءة",
        "title_html": 'مستحقات الأساتذة <span class="accent">بأرقام موثّقة</span>',
        "deck": "جدول حصص متولّد آلياً يصرف فقط عن الحصص المؤكدة، مع حساب مستقل لورش الاسبوتينغ.",
        "panel_html": """
          <div class="art-panel">
            <div class="panel-top">
              <div class="lock-badge">
                <div class="lock-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F3C169" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                </div>
                <div class="lock-title">
                  <strong>كشف مستحقات الأستاذ التلقائي</strong>
                  <span>توليد جدول الشهر + تأكيد الانعقاد</span>
                </div>
              </div>
              <span class="status-chip green">✓ 3 أنظمة تعاقد</span>
            </div>
            <div class="kpi-triple">
              <div class="kpi-box"><small>الأجر بالحصص</small><strong>حصة مؤكدة</strong></div>
              <div class="kpi-box green"><small>شراكة التحصيل</small><strong>نسبة مئوية</strong></div>
              <div class="kpi-box amber"><small>الكادر الدائم</small><strong>راتب شهري</strong></div>
            </div>
            <div class="split-track">
              <span class="track-pill">حصص المنهج الشهري</span>
              <span class="track-sep">+</span>
              <span class="track-pill gold">أرباح ورش الاسبوتينغ</span>
            </div>
          </div>
        """,
    },
    {
        "out": BLOG_OUT_DIR / "exams-and-certificates.png",
        "theme": "ivory",
        "category": "الأساتذة والكنترول",
        "read_time": "3 دقائق قراءة",
        "title_html": 'من رصد الدرجات إلى <span class="accent">شهادات A4</span>',
        "deck": "تحويل نتائج الامتحانات إلى لوحة شرف وإشعارات تفوّق باسم السنتر بضغطة زر.",
        "panel_html": """
          <div class="art-panel">
            <div class="panel-top">
              <div class="lock-badge">
                <div class="lock-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F3C169" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                </div>
                <div class="lock-title">
                  <strong>لوحة الشرف وشهادة التقدير</strong>
                  <span>دورة الامتحان الكاملة داخل Pro 2.3.0</span>
                </div>
              </div>
              <span class="status-chip green">طباعة A4</span>
            </div>
            <div class="kpi-triple">
              <div class="kpi-box amber"><small>المركز الأول</small><strong>96% ممتاز</strong></div>
              <div class="kpi-box green"><small>شيت الكنترول</small><strong>ترتيب آلي</strong></div>
              <div class="kpi-box"><small>صلاحية المشرف</small><strong>بلا أرقام مالية</strong></div>
            </div>
            <div class="split-track">
              <span class="track-pill">امتحان شهري · فترة · تجريبي</span>
              <span class="track-pill gold">توثيق باسم السنتر</span>
            </div>
          </div>
        """,
    },
    {
        "out": BLOG_OUT_DIR / "release-v2-3-0.png",
        "theme": "navy",
        "category": "تحديثات الإصدارات",
        "read_time": "3 دقائق قراءة",
        "title_html": 'مفكرة إدارة السناتر<br/><span class="accent" dir="ltr">Pro 2.3.0 &amp; Basic</span>',
        "deck": "13 شاشة مترابطة، معالج تثبيت Windows، تخصيص العملة، و216 اختباراً برمجياً آلياً.",
        "panel_html": """
          <div class="art-panel ivory-panel">
            <div class="panel-top light">
              <div class="lock-badge">
                <div class="lock-icon navy">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F2238" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <div class="lock-title dark">
                  <strong>حزمة برنامج إدارة السناتر</strong>
                  <span>تثبيت Windows + أدلة PDF شاملة</span>
                </div>
              </div>
              <span class="status-chip dark-green">✓ 216 اختباراً</span>
            </div>
            <div class="kpi-triple">
              <div class="kpi-box light"><small>معمارية النظام</small><strong>13 شاشة</strong></div>
              <div class="kpi-box light green-light"><small>الترخيص الدائم</small><strong>مدى الحياة</strong></div>
              <div class="kpi-box light amber-light"><small>العملة والهاتف</small><strong>تخصيص مرن</strong></div>
            </div>
            <div class="split-track light">
              <span class="track-pill dark">Basic $100 · Pro $200</span>
              <span class="track-pill green-solid">ترقية بفرق السعر فقط</span>
            </div>
          </div>
        """,
    },
]


def build_video_html(cfg: dict) -> str:
    src_path = SOURCES_DIR / cfg["source"]
    bullets_html = "\n".join(
        f'        <div class="b-item"><span class="b-dot"></span><span>{b}</span></div>'
        for b in cfg["bullets"]
    )
    pill_cls = "ed-pill is-pro" if cfg["badge_mode"] == "emerald" else "ed-pill"
    is_intro = cfg["source"] == "ui-intro.png"
    frame_extra_cls = "win-frame win-intro" if is_intro else "win-frame"

    return f"""<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<style>
  {SHARED_FONT_CSS}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{
    width: 1920px; height: 1080px; overflow: hidden;
    font-family: "IBM Plex Sans Arabic", sans-serif;
    background: #0B1726; color: #F5F0DA;
    -webkit-font-smoothing: antialiased;
  }}
  .stage {{
    position: relative; width: 1920px; height: 1080px;
    padding: 78px 92px;
    background:
      radial-gradient(ellipse 68% 72% at 24% 48%, rgba(194, 125, 22, 0.16), transparent 62%),
      radial-gradient(ellipse 58% 65% at 86% 24%, rgba(28, 60, 102, 0.48), transparent 65%),
      linear-gradient(150deg, #10243D 0%, #0B192C 58%, #07111E 100%);
    display: grid; grid-template-columns: 790px 1fr; gap: 54px; align-items: center;
  }}
  .rings {{ position: absolute; inset: 0; pointer-events: none; overflow: hidden; }}
  .rings::before, .rings::after {{
    content: ""; position: absolute; border-radius: 50%;
    border: 1px solid rgba(245, 240, 218, 0.06);
  }}
  .rings::before {{ width: 1120px; height: 1120px; left: -240px; top: -40px; }}
  .rings::after  {{ width: 780px; height: 780px; left: -70px; top: 130px; border-color: rgba(232, 179, 84, 0.08); }}
  .top-hairline {{
    position: absolute; top: 0; left: 0; right: 0; height: 6px;
    background: linear-gradient(90deg, transparent 0%, #C27D16 45%, #E8B354 75%, #0F2238 100%);
  }}
  .copy-col {{
    position: relative; z-index: 2;
    display: flex; flex-direction: column; align-items: flex-start; gap: 30px;
    padding-bottom: 58px; /* Keeps bottom-right corner clear for RTL video play badge */
  }}
  .brand-row {{ display: flex; align-items: center; gap: 22px; }}
  .brand-row img.logo {{ height: 48px; width: auto; display: block; }}
  .divider {{ width: 2px; height: 34px; background: rgba(232, 179, 84, 0.45); }}
  .ed-pill {{
    font-size: 24px; font-weight: 700; padding: 9px 22px; border-radius: 999px;
    background: rgba(232, 179, 84, 0.14); border: 1.5px solid rgba(232, 179, 84, 0.48);
    color: #F3C169; letter-spacing: 0;
  }}
  .ed-pill.is-pro {{
    background: rgba(23, 163, 107, 0.16); border-color: rgba(74, 222, 128, 0.44); color: #6EE7B7;
  }}
  .headline {{
    font-family: "Thmanyah Sans", sans-serif; font-weight: 800;
    font-size: 90px; line-height: 1.24; color: #FAF6EB; letter-spacing: 0;
  }}
  .gold-word {{ color: #F3C169; position: relative; display: inline-block; }}
  .gold-word svg.curve {{
    position: absolute; left: -2%; right: -2%; bottom: -14px; width: 104%; height: 22px;
  }}
  .bullets {{ display: flex; flex-direction: column; gap: 18px; margin-top: 4px; }}
  .b-item {{ display: flex; align-items: center; gap: 16px; font-size: 31px; font-weight: 600; color: rgba(245, 240, 218, 0.92); }}
  .b-dot {{
    width: 16px; height: 16px; border-radius: 50%; background: #17A36B;
    box-shadow: 0 0 0 6px rgba(23, 163, 107, 0.22); flex-shrink: 0;
  }}
  .meta-strip {{
    display: inline-flex; align-items: center; gap: 18px; padding: 13px 26px; border-radius: 16px;
    background: rgba(255, 255, 255, 0.06); border: 1.5px solid rgba(245, 240, 218, 0.16);
    font-size: 25px; font-weight: 600; color: #EFE9DC;
  }}
  .meta-strip .tag-gold {{ color: #F3C169; font-weight: 700; }}
  .screen-col {{
    position: relative; z-index: 2; perspective: 1900px;
    display: flex; align-items: center; justify-content: center;
  }}
  .win-frame {{
    width: 100%; border-radius: 22px; overflow: hidden; background: #0E1B2C;
    border: 2px solid rgba(232, 179, 84, 0.38);
    box-shadow: -34px 42px 84px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08);
    transform: rotateY(7deg) rotateX(1.5deg);
  }}
  .win-frame.win-intro {{
    width: 88%; background: #112237;
  }}
  .win-chrome {{
    height: 44px; background: #112237; border-bottom: 1px solid rgba(245, 240, 218, 0.12);
    padding: 0 22px; display: flex; align-items: center; justify-content: space-between;
  }}
  .win-dots {{ display: flex; gap: 9px; }}
  .win-dots span {{ width: 12px; height: 12px; border-radius: 50%; background: rgba(245, 240, 218, 0.28); }}
  .win-dots span:first-child {{ background: #E8B354; }}
  .win-label {{ font-size: 18px; font-weight: 600; color: rgba(245, 240, 218, 0.78); }}
  .win-frame img {{ width: 100%; height: auto; display: block; }}
</style>
</head>
<body>
  <div class="stage">
    <div class="top-hairline"></div>
    <div class="rings"></div>
    <div class="copy-col">
      <div class="brand-row">
        <img class="logo" src="file://{BRAND_DIR}/tadbeer-ar-light.svg" alt="تدبير" />
        <div class="divider"></div>
        <span class="{pill_cls}">{cfg["badge"]}</span>
      </div>
      <h1 class="headline">
        {cfg["line1"]}<br/>
        {cfg["pre"]}<span class="gold-word">{cfg["highlight"]}<svg class="curve" viewBox="0 0 260 20" fill="none"><path d="M4 14C78 4 182 3 256 11" stroke="#E8B354" stroke-width="5" stroke-linecap="round"/></svg></span>
      </h1>
      <div class="bullets">
{bullets_html}
      </div>
      <div class="meta-strip">
        <span>{cfg["footer_label"]}</span>
        <span>·</span>
        <span class="tag-gold">{cfg["duration"]}</span>
      </div>
    </div>
    <div class="screen-col">
      <div class="{frame_extra_cls}">
        <div class="win-chrome">
          <span class="win-label">{cfg["frame_title"]}</span>
          <div class="win-dots"><span></span><span></span><span></span></div>
        </div>
        <img src="file://{src_path}" alt="" />
      </div>
    </div>
  </div>
</body>
</html>"""


def build_blog_html(cfg: dict) -> str:
    is_navy = cfg["theme"] == "navy"
    logo_file = "tadbeer-ar-light.svg" if is_navy else "tadbeer-ar-dark.svg"
    canvas_cls = "canvas is-navy" if is_navy else "canvas"

    return f"""<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<style>
  {SHARED_FONT_CSS}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{
    width: 1920px; height: 1080px; overflow: hidden;
    font-family: "IBM Plex Sans Arabic", sans-serif;
    background: #EFE9DC; color: #0B1C30;
    -webkit-font-smoothing: antialiased;
  }}
  .canvas {{
    position: relative; width: 1920px; height: 1080px;
    padding: 96px 112px;
    background:
      radial-gradient(ellipse 64% 68% at 20% 24%, rgba(194, 125, 22, 0.11), transparent 60%),
      radial-gradient(ellipse 55% 60% at 88% 82%, rgba(15, 34, 56, 0.06), transparent 60%),
      linear-gradient(145deg, #F4EFE3 0%, #EFE9DC 55%, #E5DEC9 100%);
    display: grid; grid-template-columns: 1.04fr 0.96fr; gap: 64px; align-items: center;
  }}
  .canvas.is-navy {{
    color: #F5F0DA;
    background:
      radial-gradient(ellipse 64% 68% at 20% 24%, rgba(194, 125, 22, 0.16), transparent 60%),
      radial-gradient(ellipse 58% 65% at 86% 24%, rgba(28, 60, 102, 0.45), transparent 65%),
      linear-gradient(150deg, #10243D 0%, #0B192C 58%, #07111E 100%);
  }}
  .grid-rings {{ position: absolute; inset: 0; pointer-events: none; overflow: hidden; }}
  .grid-rings::before, .grid-rings::after {{
    content: ""; position: absolute; border-radius: 50%;
    border: 1.5px solid rgba(15, 34, 56, 0.06);
  }}
  .canvas.is-navy .grid-rings::before {{ border-color: rgba(245, 240, 218, 0.06); }}
  .grid-rings::before {{ width: 1200px; height: 1200px; left: -320px; top: -80px; }}
  .grid-rings::after  {{ width: 820px; height: 820px; left: -130px; top: 110px; border-color: rgba(154, 91, 6, 0.12); }}

  .top-rule {{
    position: absolute; top: 0; left: 0; right: 0; height: 8px;
    background: linear-gradient(90deg, #9A5B06 0%, #C27D16 40%, #0F2238 40%, #0F2238 100%);
  }}
  .canvas.is-navy .top-rule {{
    background: linear-gradient(90deg, #E8B354 0%, #C27D16 42%, #1D3B60 42%, #1D3B60 100%);
  }}

  .ed-col {{
    position: relative; z-index: 2;
    display: flex; flex-direction: column; align-items: flex-start; gap: 28px;
  }}
  .ed-head {{ display: flex; align-items: center; gap: 20px; }}
  .ed-head img {{ height: 42px; width: auto; display: block; }}
  .ed-sep {{ width: 2px; height: 32px; background: rgba(15, 34, 56, 0.22); }}
  .canvas.is-navy .ed-sep {{ background: rgba(245, 240, 218, 0.28); }}
  .cat-pill {{
    font-size: 24px; font-weight: 700; padding: 9px 22px; border-radius: 999px;
    background: rgba(180, 108, 8, 0.14); border: 1.5px solid rgba(154, 91, 6, 0.36);
    color: #9A5B06; letter-spacing: 0;
  }}
  .canvas.is-navy .cat-pill {{
    background: rgba(232, 179, 84, 0.16); border-color: rgba(232, 179, 84, 0.45); color: #F3C169;
  }}

  .ed-title {{
    font-family: "Thmanyah Sans", sans-serif; font-weight: 800;
    font-size: 82px; line-height: 1.26; color: #0B1C30; letter-spacing: 0;
  }}
  .canvas.is-navy .ed-title {{ color: #FAF6EB; }}
  .ed-title .accent {{ color: #9A5B06; display: inline; }}
  .canvas.is-navy .ed-title .accent {{ color: #F3C169; }}

  .ed-deck {{ font-size: 31px; font-weight: 500; line-height: 1.6; color: #2F3945; max-width: 28ch; }}
  .canvas.is-navy .ed-deck {{ color: rgba(245, 240, 218, 0.86); }}

  .ed-foot {{
    display: flex; align-items: center; gap: 18px; padding-top: 20px;
    border-top: 2px solid rgba(15, 34, 56, 0.16);
    font-size: 24px; font-weight: 700; color: #0F2238;
  }}
  .canvas.is-navy .ed-foot {{ border-top-color: rgba(245, 240, 218, 0.2); color: #EFE9DC; }}
  .ed-foot .dot {{ width: 10px; height: 10px; border-radius: 50%; background: #9A5B06; }}
  .canvas.is-navy .ed-foot .dot {{ background: #F3C169; }}

  /* Diagram Panels */
  .art-panel {{
    position: relative; z-index: 2;
    background: linear-gradient(160deg, #102642 0%, #0B1829 100%);
    color: #F5F0DA; border-radius: 28px;
    border: 2px solid rgba(224, 164, 67, 0.42);
    padding: 38px 36px;
    box-shadow: 0 26px 56px -14px rgba(15, 34, 56, 0.34), 0 10px 24px rgba(15, 34, 56, 0.22);
    display: flex; flex-direction: column; gap: 24px;
  }}
  .art-panel.ivory-panel {{
    background: linear-gradient(155deg, #FAF6EE 0%, #EFE9DC 100%);
    color: #0B1C30; border-color: rgba(232, 179, 84, 0.55);
    box-shadow: 0 28px 60px -12px rgba(0, 0, 0, 0.52);
  }}
  .panel-top {{
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 20px; border-bottom: 1.5px solid rgba(245, 240, 218, 0.14);
  }}
  .panel-top.light {{ border-bottom-color: rgba(15, 34, 56, 0.16); }}
  .lock-badge {{ display: flex; align-items: center; gap: 14px; }}
  .lock-icon {{
    width: 54px; height: 54px; border-radius: 14px;
    background: rgba(232, 179, 84, 0.16); border: 1.5px solid rgba(232, 179, 84, 0.48);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }}
  .lock-icon.navy {{
    background: rgba(15, 34, 56, 0.1); border-color: rgba(15, 34, 56, 0.28);
  }}
  .lock-title strong {{ display: block; font-family: "Thmanyah Sans", sans-serif; font-size: 26px; color: #FAF6EB; }}
  .lock-title.dark strong {{ color: #0B1C30; }}
  .lock-title span {{ font-size: 19px; color: #F3C169; font-weight: 600; }}
  .lock-title.dark span {{ color: #9A5B06; }}

  .status-chip {{
    font-size: 19px; font-weight: 700; padding: 8px 16px; border-radius: 999px; white-space: nowrap;
  }}
  .status-chip.green {{
    background: rgba(23, 163, 107, 0.18); border: 1.5px solid rgba(74, 222, 128, 0.38); color: #6EE7B7;
  }}
  .status-chip.dark-green {{
    background: rgba(12, 120, 71, 0.14); border: 1.5px solid rgba(8, 105, 61, 0.36); color: #08693D;
  }}

  .kpi-triple {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }}
  .kpi-box {{
    background: rgba(255, 255, 255, 0.05); border: 1.5px solid rgba(245, 240, 218, 0.14);
    border-radius: 18px; padding: 20px 14px; display: flex; flex-direction: column; gap: 8px;
  }}
  .kpi-box.green {{ border-color: rgba(74, 222, 128, 0.35); background: rgba(12, 120, 71, 0.18); }}
  .kpi-box.amber {{ border-color: rgba(232, 179, 84, 0.44); background: rgba(194, 125, 22, 0.16); }}
  .kpi-box small {{ font-size: 18px; color: rgba(245, 240, 218, 0.78); font-weight: 600; }}
  .kpi-box strong {{ font-family: "Thmanyah Sans", sans-serif; font-size: 29px; color: #FAF6EB; }}
  .kpi-box.green strong {{ color: #6EE7B7; }}
  .kpi-box.amber strong {{ color: #F3C169; }}

  .kpi-box.light {{ background: #FFFFFF; border-color: rgba(15, 34, 56, 0.18); }}
  .kpi-box.light small {{ color: #4E535B; }}
  .kpi-box.light strong {{ color: #0B1C30; }}
  .kpi-box.light.green-light {{ background: rgba(12, 120, 71, 0.1); border-color: rgba(8, 105, 61, 0.32); }}
  .kpi-box.light.green-light strong {{ color: #08693D; }}
  .kpi-box.light.amber-light {{ background: rgba(180, 108, 8, 0.12); border-color: rgba(154, 91, 6, 0.36); }}
  .kpi-box.light.amber-light strong {{ color: #9A5B06; }}

  .split-track {{
    background: rgba(255, 255, 255, 0.04); border: 1.5px dashed rgba(232, 179, 84, 0.38);
    border-radius: 16px; padding: 18px 20px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }}
  .split-track.light {{ background: #E5DEC9; border-color: rgba(15, 34, 56, 0.28); }}
  .track-pill {{
    font-size: 20px; font-weight: 700; padding: 8px 16px; border-radius: 12px;
    background: #1B314E; color: #F5F0DA;
  }}
  .track-sep {{ font-size: 24px; font-weight: 800; color: #E8B354; }}
  .track-pill.gold {{
    background: rgba(232, 179, 84, 0.18); color: #F3C169; border: 1px solid rgba(232, 179, 84, 0.38);
  }}
  .track-pill.dark {{ background: #0F2238; color: #F5F0DA; }}
  .track-pill.green-solid {{ background: #08693D; color: #FFFFFF; }}
</style>
</head>
<body>
  <div class="{canvas_cls}">
    <div class="top-rule"></div>
    <div class="grid-rings"></div>
    <div class="ed-col">
      <div class="ed-head">
        <img src="file://{BRAND_DIR}/{logo_file}" alt="تدبير" />
        <div class="ed-sep"></div>
        <span class="cat-pill">{cfg["category"]}</span>
      </div>
      <h1 class="ed-title">{cfg["title_html"]}</h1>
      <p class="ed-deck">{cfg["deck"]}</p>
      <div class="ed-foot">
        <span>مدونة تدبير</span>
        <span class="dot"></span>
        <span>{cfg["read_time"]}</span>
      </div>
    </div>
    {cfg["panel_html"]}
  </div>
</body>
</html>"""


def render_html_to_png(html_text: str, out_png: Path, tmp_html: Path) -> None:
    out_png.parent.mkdir(parents=True, exist_ok=True)
    tmp_html.write_text(html_text, encoding="utf-8")
    cmd = [
        BRAVE_BIN,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=1920,1080",
        f"--screenshot={out_png}",
        f"file://{tmp_html}",
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if res.returncode != 0 or not out_png.exists():
        print(f"FAILED: {out_png}\n{res.stdout}", file=sys.stderr)
        sys.exit(1)
    tmp_html.unlink(missing_ok=True)
    print(f"Rendered: {out_png.relative_to(ASSETS_DIR)} ({out_png.stat().st_size // 1024} KB)")


def main() -> None:
    tmp_file = STUDIO_DIR / "_tmp_render.html"
    for cfg in VIDEO_THUMBNAILS:
        render_html_to_png(build_video_html(cfg), cfg["out"], tmp_file)
    for cfg in BLOG_COVERS:
        render_html_to_png(build_blog_html(cfg), cfg["out"], tmp_file)
    print(f"All {len(VIDEO_THUMBNAILS) + len(BLOG_COVERS)} thumbnails generated cleanly.")


if __name__ == "__main__":
    main()
