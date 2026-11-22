# سجل التحديثات والتحسينات — موقع منصة تدبير (`TadbeerWebSite`)

التاريخ: **2026-11-22**  
الرابط المباشر: https://moayadfarooq9-ops.github.io/tadbeer-website/  
المستودع: `moayadfarooq9-ops/tadbeer-website` (الفرع `main`)

---

## 1. فصل تسمية العلامة الأم عن منتج السناتر الأوفلاين
- منع الخلط بين **«منصة تدبير»** (المظلّة التقنية التعليمية الأم التي تشمل مستقبلاً منصات للطلاب عبر الإنترنت) وبين أولى أدواتها **«برنامج إدارة السناتر التعليمية»** (`Pro 2.3.0 & Basic 1.2.0`) الذي يعمل أوفلاين `100%`.
- تعديل غلاف مقال [offline-lan-sync.png](assets/blog/offline-lan-sync.png) إلى **«برنامج إدارة السناتر — لماذا 100% أوفلاين؟»** ومواءمة أغلفة [intro.png](assets/posters/intro.png) و[demo-poster.png](assets/demo-poster.png) و[students.png](assets/posters/students.png) و[release-v2-3-0.png](assets/blog/release-v2-3-0.png)، ووصف الميتا والشريط العلوي في [index.html](index.html).
- تثبيت القاعدة في ملفات المهارات والأدلة الدائمة (`README-THUMBNAILS-GUIDE.md` و`.agents/skills/*/SKILL.md`) لمنع تكرار الخطأ.

## 2. بطاقات المعاينة عند مشاركة الروابط (`Open Graph & WhatsApp / Facebook`)
- إضافة مولّد البطاقات والأيقونات داخل [assets/thumbnail-studio/generate-thumbnails.py](assets/thumbnail-studio/generate-thumbnails.py) (مع دعم `--og-only` للتوليد السريع).
- تصميم بطاقة المشاركة الرئيسية [assets/brand/og-tadbeer-share.jpg](assets/brand/og-tadbeer-share.jpg) (`1200×630`، `66 KB`): خلفية كريمية هادئة مع شعار **«تدبير»** الكوفي الكحلي بحجم كبير وواضح وشعار **«وُضوحٌ. ثَباتٌ. تَدبير.»** دون أي ازدحام.
- تصميم بطاقة المدونة والمقالات [assets/brand/og-tadbeer-blog.jpg](assets/brand/og-tadbeer-blog.jpg) (`1200×630`، `71 KB`) وأيقونة اللمس [assets/brand/tadbeer-touch-icon.png](assets/brand/tadbeer-touch-icon.png) (`512×512`، `114 KB`).
- حقن وسوم `og:*` و`twitter:card="summary_large_image"` و`apple-touch-icon` في [index.html](index.html) و[blog.html](blog.html) و[article.html](article.html).

## 3. تحسين سرعة الخطوط العربية (`WOFF2 Compression`)
- تحويل جميع ملفات الخطوط في [assets/fonts](assets/fonts) (`13` ملفاً من `.ttf`/`.otf`) إلى صيغة `WOFF2` عبر `fontTools` + `brotli`:
  - تراجع الإجمالي من `2,825 KB` إلى **`935 KB`** (`-67%` توفير في الحجم).
  - تراجع وزن الخطوط السبعة المستخدمة في واجهة الموقع من `1,617 KB` إلى **`508 KB`**.
- تحديث قواعد `@font-face` في [styles.css](styles.css) لتُحمّل `.woff2` أولاً مع بقاء `.ttf` و`.otf` كخيار احتياطي (`fallback`) وكمرجع لسكربت توليد الصور، ورفع نسخة الكاش في صفحات HTML إلى `?v=31`.

## 4. ملفات الأرشفة لمحركات البحث (`SEO & Indexing`)
- إنشاء [robots.txt](robots.txt): يتيح لمحركات البحث أرشفة الصفحات الرسمية ويستثني مجلدات العمل الداخلية (`assets/thumbnail-studio/` و`versions/`).
- إنشاء [sitemap.xml](sitemap.xml): يفهرس الصفحة الرئيسية، صفحة المدونة [blog.html](blog.html)، وروابط المقالات الخمسة الرسمية بتواريخ نشرها الدقيقة، مع ربطه عبر `<link rel="sitemap">` في الصفحات.

## 5. النسخ الاحتياطي الخارجي للهوية البصرية (`Private GitHub Backup`)
- تهيئة مجلد الهوية البصرية الشقيق `TadbeerBrandIdentity` كمستودع Git مستقل، واستثناء `node_modules/` وملفات النظام المؤقتة عبر `.gitignore`.
- رفعه إلى مستودع GitHub **خاص (`Private`)**: `moayadfarooq9-ops/tadbeer-brand-identity`.

## 6. كيف تستفيد من هذا السجل لاحقاً؟
- عند إضافة مقال جديد في المدونة: أضف رابط المقال داخل `sitemap.xml`، وصمّم غلافه في `generate-thumbnails.py`.
- عند تعديل صورة المعاينة مستقبلاً: شغّل `python3 assets/thumbnail-studio/generate-thumbnails.py --og-only` ثم حدّث رقم `?v=` في وسوم `og:image`.
