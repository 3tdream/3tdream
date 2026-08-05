import { L, type Localized } from "./i18n";

/* ------------------------------------------------------------------ */
/* BRAND                                                               */
/* ------------------------------------------------------------------ */

export const BRAND = {
  name: "3TDream",
  expansion: L("Time To Team Dream", "Time To Team Dream", "Time To Team Dream"),
  tagline: L(
    "Цифровые продукты — от брифа до продакшена.",
    "Digital products — from brief to production.",
    "מוצרים דיגיטליים — מבריף ועד פרודקשן."
  ),
  intro: L(
    "Я проектирую и собираю веб-приложения, AI-агентов и боты записи. Беру заказ целиком: продукт, дизайн, код, деплой.",
    "I design and ship web apps, AI agents and booking bots. I take the whole thing: product, design, code, deploy.",
    "אני מתכנן ובונה אפליקציות web, סוכני AI ובוטים לתורים. לוקח את הכל: מוצר, עיצוב, קוד, דיפלוי."
  ),
};

/* ------------------------------------------------------------------ */
/* PROFILE                                                             */
/* ------------------------------------------------------------------ */

export const PROFILE = {
  name: "Michael Shigrin Sokol",
  location: L("Хайфа, Израиль", "Haifa, Israel", "חיפה, ישראל"),
  // One-line positioning — the "designer → AI builder" arc that isn't stated
  // anywhere public yet. This is the site's chance to claim it explicitly.
  headline: L(
    "Продуктовый дизайнер, который строит AI-продукты",
    "A product designer who ships AI products",
    "מעצב מוצר שבונה מוצרי AI"
  ),
  bio: L(
    "Я прошёл путь от графического дизайна в рекламе до продуктового UX/UI, а теперь собираю AI-продукты целиком — от идеи и интерфейса до кода и деплоя. Дизайнерский глаз плюс инженерия: один человек закрывает весь цикл.",
    "I went from graphic design in advertising to product UX/UI, and now I build AI products end to end — from idea and interface to code and deploy. A designer's eye plus engineering: one person covering the whole cycle.",
    "עברתי מעיצוב גרפי בפרסום ל-UX/UI מוצרי, והיום אני בונה מוצרי AI מקצה לקצה — מרעיון וממשק ועד קוד ודיפלוי. עין של מעצב יחד עם הנדסה: אדם אחד שסוגר את כל המחזור."
  ),
};

/* ------------------------------------------------------------------ */
/* TIMELINE  — growth stages.                                          */
/* ⚠️ `period` values are APPROXIMATE — Mike to confirm exact years.   */
/* Anchors used: Behance "member since 2013", GitHub since 2017,       */
/* LinkedIn "7+ yrs", AI-product work 2024–2026.                       */
/* ------------------------------------------------------------------ */

export type TimelineEntry = {
  period: string; // editable; "~" = approximate
  role: Localized;
  org: Localized;
  desc: Localized;
  kind: Localized; // short tag for the era
};

export const TIMELINE: TimelineEntry[] = [
  {
    period: "~2011–2013",
    kind: L("Образование", "Foundations", "לימודים"),
    role: L("Дизайн и анимация", "Design & animation", "עיצוב ואנימציה"),
    org: L(
      "Tiltan · School of Design + IAC · Israel Animation College",
      "Tiltan · School of Design + IAC · Israel Animation College",
      "טלתן · בית ספר לעיצוב + IAC · המכללה לאנימציה"
    ),
    desc: L(
      "База: визуальная коммуникация, графический дизайн и 3D-анимация в Хайфе.",
      "The base: visual communication, graphic design and 3D animation in Haifa.",
      "הבסיס: תקשורת חזותית, עיצוב גרפי ואנימציית תלת-ממד בחיפה."
    ),
  },
  {
    period: "~2013–2016",
    kind: L("Реклама", "Advertising", "פרסום"),
    role: L("Графический дизайнер", "Graphic Designer", "מעצב גרפי"),
    org: L("McCann Erickson · Тель-Авив", "McCann Erickson · Tel Aviv", "מקאן אריקסון · תל אביב"),
    desc: L(
      "Бренд- и рекламная графика для крупных кампаний — школа большого бренд-мышления.",
      "Brand and advertising graphics for major campaigns — a school of big-brand thinking.",
      "גרפיקת מותג ופרסום לקמפיינים גדולים — בית ספר לחשיבת מותג."
    ),
  },
  {
    period: "~2016–2019",
    kind: L("Студия", "Studio", "סטודיו"),
    role: L("Графический дизайнер", "Graphic Designer", "מעצב גרפי"),
    org: L("FIRMA · Тель-Авив", "FIRMA · Tel Aviv", "FIRMA · תל אביב"),
    desc: L(
      "Дизайн-студия: айдентика, media-дизайн и работа с разными индустриями.",
      "A design studio: identity, media design and work across industries.",
      "סטודיו עיצוב: זהות, עיצוב מדיה ועבודה על תעשיות שונות."
    ),
  },
  {
    period: "~2019–2023",
    kind: L("Продукт", "Product", "מוצר"),
    role: L("Продуктовый / UX-UI дизайнер", "Product / UX-UI Designer", "מעצב מוצר / UX-UI"),
    org: L("3TDream · фриланс и продукт", "3TDream · freelance & product", "3TDream · פרילנס ומוצר"),
    desc: L(
      "Переход в продукт: интерфейсы, прототипы в Figma, работа на стыке цифрового и физического (CAD, 3D-печать).",
      "Into product: interfaces, Figma prototypes, work on the digital–physical edge (CAD, 3D printing).",
      "מעבר למוצר: ממשקים, אבות-טיפוס ב-Figma, עבודה על קו התפר הדיגיטלי-פיזי (CAD, הדפסת תלת-ממד)."
    ),
  },
  {
    period: "2024 →",
    kind: L("AI-builder", "AI builder", "בונה AI"),
    role: L("Строю AI-продукты целиком", "Building AI products end to end", "בונה מוצרי AI מקצה לקצה"),
    org: L("3TDream", "3TDream", "3TDream"),
    desc: L(
      "От брифа до продакшена: UX/UI курс, AI-сайты с записью и чатом, и Mission Control — конвейер агентов, превращающий одну фразу в готовый PR.",
      "From brief to production: a UX/UI course, AI sites with booking & chat, and Mission Control — an agent pipeline that turns one sentence into a merged PR.",
      "מבריף לפרודקשן: קורס UX/UI, אתרי AI עם תורים וצ׳אט, ו-Mission Control — פייפליין סוכנים שהופך משפט אחד ל-PR מוכן."
    ),
  },
];

/* ------------------------------------------------------------------ */
/* NAV                                                                 */
/* ------------------------------------------------------------------ */

export const NAV: { href: string; label: Localized; index: string }[] = [
  { href: "/", label: L("Главная", "Home", "בית"), index: "01" },
  { href: "/projects", label: L("Проекты", "Work", "עבודות"), index: "02" },
  { href: "/courses", label: L("Курсы", "Courses", "קורסים"), index: "03" },
  { href: "/about", label: L("Обо мне", "About", "אודות"), index: "04" },
  { href: "/contact", label: L("Контакт", "Contact", "צור קשר"), index: "05" },
];

/* ------------------------------------------------------------------ */
/* STATS (hero)                                                        */
/* ------------------------------------------------------------------ */

export const STATS: { value: string; label: Localized }[] = [
  { value: "10+", label: L("продуктов собрано", "products shipped", "מוצרים נבנו") },
  { value: "16", label: L("AI-агентов в работе", "AI agents in the loop", "סוכני AI בעבודה") },
  { value: "3", label: L("языка интерфейса", "interface languages", "שפות ממשק") },
  { value: "1", label: L("человек — весь стек", "person — full stack", "אדם — כל הסטאק") },
];

/* ------------------------------------------------------------------ */
/* SERVICES                                                            */
/* ------------------------------------------------------------------ */

export type Service = {
  id: string;
  title: Localized;
  desc: Localized;
};

export const SERVICES: Service[] = [
  {
    id: "product",
    title: L("Продукт в продакшене", "Production-ready product", "מוצר מוכן לפרודקשן"),
    desc: L(
      "Веб-приложение от идеи до живого деплоя на Vercel: продукт, архитектура, код, запуск.",
      "A web app from idea to a live Vercel deploy: product, architecture, code, launch.",
      "אפליקציית web מרעיון ועד דיפלוי חי ב-Vercel: מוצר, ארכיטקטורה, קוד, השקה."
    ),
  },
  {
    id: "ai",
    title: L("AI-агенты и автоматизация", "AI agents & automation", "סוכני AI ואוטומציה"),
    desc: L(
      "Пайплайны на LLM, мульти-агентные системы, чат-ассистенты, автоматизация рутины.",
      "LLM pipelines, multi-agent systems, chat assistants, automating the boring parts.",
      "פייפליינים מבוססי LLM, מערכות מרובות-סוכנים, צ׳אט-בוטים, אוטומציה."
    ),
  },
  {
    id: "bots",
    title: L("Боты записи и чат", "Booking & chat bots", "בוטים לתורים וצ׳אט"),
    desc: L(
      "Запись клиентов через чат, Telegram, синхронизация с Google Calendar, админка.",
      "Client booking via chat & Telegram, Google Calendar sync, an admin dashboard.",
      "קביעת תורים בצ׳אט וטלגרם, סנכרון Google Calendar, פאנל ניהול."
    ),
  },
  {
    id: "web",
    title: L("Сайты и лендинги", "Sites & landing pages", "אתרים ודפי נחיתה"),
    desc: L(
      "Быстрые отзывчивые сайты с чистой типографикой и осмысленной конверсией.",
      "Fast, responsive sites with clean typography and conversion that makes sense.",
      "אתרים מהירים ורספונסיביים, טיפוגרפיה נקייה והמרה הגיונית."
    ),
  },
];

/* ------------------------------------------------------------------ */
/* PROJECTS                                                            */
/* ------------------------------------------------------------------ */

export type ProjectStatus = "live" | "wip";

export type Project = {
  slug: string;
  title: string;
  year: string;
  statuses: ProjectStatus[]; // one or both of "live" / "wip"
  tagline: Localized;
  description: Localized;
  role: Localized;
  tags: string[];
  url?: string;
  accent?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "mission-control",
    title: "Mission Control",
    year: "2026",
    statuses: ["live", "wip"],
    accent: true,
    url: "https://mc-landing-swart.vercel.app",
    tagline: L(
      "Команда AI-агентов, которая превращает бриф в задеплоенный код.",
      "A team of AI agents that turns a brief into shipped code.",
      "צוות סוכני AI שהופך בריף לקוד מוכן לפרודקשן."
    ),
    description: L(
      "Платформа-конвейер: бриф на входе → 12 AI-агентов (PM, архитектор, разработчик, QA, безопасность) проходят quality-gates → на выходе репозиторий на GitHub и превью на Vercel. Флагманский продукт.",
      "A pipeline platform: a brief goes in → 12 AI agents (PM, architect, dev, QA, security) pass quality gates → out comes a GitHub repo and a Vercel preview. The flagship product.",
      "פלטפורמת פייפליין: בריף נכנס → 12 סוכני AI (PM, ארכיטקט, מפתח, QA, אבטחה) עוברים בקרות איכות → בפלט ריפו ב-GitHub ותצוגה ב-Vercel. מוצר הדגל."
    ),
    role: L("Основатель · продукт и инженерия", "Founder · product & engineering", "מייסד · מוצר והנדסה"),
    tags: ["AI", "Multi-agent", "Next.js", "Pipeline"],
  },
  {
    slug: "master-daily",
    title: "Master Daily",
    year: "2026",
    statuses: ["live", "wip"],
    url: "https://master-daily.vercel.app",
    tagline: L(
      "Система записи для салона в Израиле — чат, Telegram, Google Calendar.",
      "A booking system for a salon in Israel — chat, Telegram, Google Calendar.",
      "מערכת תורים לסלון בישראל — צ׳אט, טלגרם, Google Calendar."
    ),
    description: L(
      "Клиенты записываются через чат-бота, мастера видят расписание в админке и Telegram, всё синхронизируется с Google Calendar в обе стороны. Умное распределение слотов и интерливинг услуг.",
      "Clients book through a chat bot, stylists see the schedule in an admin panel and Telegram, everything syncs two-way with Google Calendar. Smart slot allocation and service interleaving.",
      "לקוחות קובעים תור דרך בוט צ׳אט, הספרים רואים לוח בפאנל ובטלגרם, הכל מסונכרן דו-כיווני עם Google Calendar. הקצאת תורים חכמה."
    ),
    role: L("Полный цикл — продукт и код", "Full cycle — product & code", "מחזור מלא — מוצר וקוד"),
    tags: ["Booking", "Telegram", "Google Calendar", "Next.js"],
  },
  {
    slug: "remi",
    title: "Remi",
    year: "2026",
    statuses: ["wip"],
    tagline: L(
      "Голосовой компаньон для людей 65+ в Израиле.",
      "A voice companion for people 65+ in Israel.",
      "מלווה קולי לאנשים בגיל 65+ בישראל."
    ),
    description: L(
      "Двуязычное приложение-компаньон: голосовой секретарь, редактируемое расписание, забота о самочувствии и экстренный вызов MDA-101. PWA, доступность в приоритете, RU/EN/HE.",
      "A bilingual companion app: a voice secretary, an editable schedule, wellness check-ins and an MDA-101 emergency call. PWA, accessibility-first, RU/EN/HE.",
      "אפליקציית מלווה דו-לשונית: מזכיר קולי, לוח זמנים נערך, מעקב רווחה וחיוג חירום מד״א-101. PWA, נגישות בראש, RU/EN/HE."
    ),
    role: L("Продукт, дизайн, код", "Product, design, code", "מוצר, עיצוב, קוד"),
    tags: ["Voice AI", "PWA", "Accessibility", "Trilingual"],
    url: "https://remi-pi-lac.vercel.app",
  },
  {
    slug: "zdorovdv",
    title: "ZdorovDV",
    year: "2025",
    statuses: ["live", "wip"],
    url: "https://zdorovdv.vercel.app",
    tagline: L(
      "Сайт медицинской клиники с записью и AI-чатом.",
      "A medical clinic site with booking and an AI chat.",
      "אתר מרפאה רפואית עם תורים וצ׳אט AI."
    ),
    description: L(
      "27 услуг, пошаговый мастер записи и AI-ассистент, который отвечает на вопросы пациентов и ведёт к записи. Чистый, доверительный интерфейс для здравоохранения.",
      "27 services, a step-by-step booking wizard and an AI assistant that answers patient questions and guides them to book. A clean, trustworthy healthcare interface.",
      "27 שירותים, אשף תורים שלב-אחר-שלב ועוזר AI שעונה לשאלות מטופלים ומוביל לקביעת תור. ממשק נקי ואמין לתחום הבריאות."
    ),
    role: L("Сайт, мастер записи, AI-чат", "Site, booking wizard, AI chat", "אתר, אשף תורים, צ׳אט AI"),
    tags: ["Healthcare", "AI chat", "Booking"],
  },
  {
    slug: "uxi-course",
    title: "UXI Course",
    year: "2025",
    statuses: ["live", "wip"],
    url: "https://uxi-entry-course.vercel.app",
    tagline: L(
      "Платформа живого курса по UX/UI — 13 встреч.",
      "A live UX/UI course platform — 13 meetings.",
      "פלטפורמת קורס חי ל-UX/UI — 13 מפגשים."
    ),
    description: L(
      "Учебная платформа для авторского курса: программа на 13 встреч, видео-уроки, домашние задания и геймификация прогресса. Авто-деплой через Vercel.",
      "A learning platform for an author-led course: a 13-meeting curriculum, video lessons, homework and gamified progress. Auto-deployed via Vercel.",
      "פלטפורמת לימוד לקורס אישי: תכנית ל-13 מפגשים, שיעורי וידאו, שיעורי בית והתקדמות עם גיימיפיקציה. דיפלוי אוטומטי ב-Vercel."
    ),
    role: L("Платформа и контент-движок", "Platform & content engine", "פלטפורמה ומנוע תוכן"),
    tags: ["EdTech", "Course platform", "Video"],
  },
  {
    slug: "cv-creator",
    title: "CV Creator",
    year: "2025",
    statuses: ["wip"],
    url: "https://cv-creator.vercel.app",
    tagline: L(
      "AI-конструктор резюме с публикацией на хостинге.",
      "An AI résumé builder that publishes to a hosted page.",
      "בונה קורות חיים מבוסס AI שמפרסם לעמוד מתארח."
    ),
    description: L(
      "Пользователь описывает опыт — AI собирает структурированное резюме и публикует его как отдельную страницу. Часть экосистемы Mission Control.",
      "The user describes their experience — AI assembles a structured résumé and publishes it as its own page. Part of the Mission Control ecosystem.",
      "המשתמש מתאר ניסיון — AI מרכיב קורות חיים מובנים ומפרסם כעמוד נפרד. חלק מהאקוסיסטם של Mission Control."
    ),
    role: L("Продукт и интеграция", "Product & integration", "מוצר ואינטגרציה"),
    tags: ["AI", "Generator", "Next.js"],
  },
];

/* ------------------------------------------------------------------ */
/* COURSES                                                             */
/* ------------------------------------------------------------------ */

export type Course = {
  slug: string;
  title: string;
  level: Localized;
  tagline: Localized;
  description: Localized;
  meta: Localized[]; // short bullets (format, length, language…)
  audience: Localized;
  url: string;
  cta: Localized;
};

export const COURSES: Course[] = [
  {
    slug: "uxi",
    title: "UXI — UX/UI",
    level: L("С нуля · для начинающих", "From scratch · beginners", "מאפס · למתחילים"),
    tagline: L(
      "Живой курс UX/UI дизайна — от первого экрана до готового кейса.",
      "A live UX/UI design course — from your first screen to a finished case.",
      "קורס עיצוב UX/UI חי — מהמסך הראשון ועד קייס מוגמר."
    ),
    description: L(
      "Авторский курс, где я веду с нуля к профессии дизайнера: теория маленькими порциями, практика в Figma на каждой встрече и живой разбор работ. К концу — реальный проект в портфолио.",
      "An author-led course where I take you from zero to designer: theory in small doses, hands-on Figma every session, and live critique of your work. You finish with a real portfolio project.",
      "קורס אישי שבו אני מלווה מאפס למקצוע: תיאוריה במנות קטנות, תרגול ב-Figma בכל מפגש וביקורת חיה על העבודות. בסוף — פרויקט אמיתי לתיק."
    ),
    meta: [
      L("13 живых встреч", "13 live meetings", "13 מפגשים חיים"),
      L("Практика в Figma", "Hands-on Figma", "תרגול ב-Figma"),
      L("Разбор домашних заданий", "Homework critique", "בדיקת שיעורי בית"),
      L("Кейс в портфолио", "A portfolio case", "קייס לתיק עבודות"),
    ],
    audience: L(
      "Для тех, кто начинает в дизайне с нуля или переходит в UX/UI.",
      "For anyone starting design from scratch or switching into UX/UI.",
      "למי שמתחיל בעיצוב מאפס או עובר ל-UX/UI."
    ),
    url: "https://uxi-entry-course.vercel.app/",
    cta: L("Открыть курс", "Open the course", "לפתיחת הקורס"),
  },
];

/* ------------------------------------------------------------------ */
/* CONTACT  — замените хендлы на свои реальные                         */
/* ------------------------------------------------------------------ */

export type ContactLink = {
  id: string;
  label: string;
  handle: string;
  href: string;
};

export const CONTACTS: ContactLink[] = [
  { id: "telegram", label: "Telegram", handle: "@MichaelShS", href: "https://t.me/MichaelShS" },
  { id: "whatsapp", label: "WhatsApp", handle: "+972 50 844 5938", href: "https://wa.me/972508445938" },
  { id: "email", label: "Email", handle: "3tdream@gmail.com", href: "mailto:3tdream@gmail.com" },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "/in/michael-shigrin-sokol",
    href: "https://www.linkedin.com/in/michael-shigrin-sokol-59aa8533/",
  },
  { id: "github", label: "GitHub", handle: "github.com/3tdream", href: "https://github.com/3tdream" },
  { id: "behance", label: "Behance", handle: "behance.net/3TDream", href: "https://www.behance.net/3TDream" },
];

export const CONTACT_CTA = L(
  "Есть проект? Расскажите в двух словах — отвечу быстро.",
  "Got a project? Tell me in two lines — I reply fast.",
  "יש פרויקט? ספרו בשתי שורות — אני עונה מהר."
);

/* ------------------------------------------------------------------ */
/* DESIGN  — the craft side (links out to the full Behance gallery)    */
/* ------------------------------------------------------------------ */

export type Discipline = {
  id: string;
  title: Localized;
  credit: string; // where it was honed
  desc: Localized;
  tags: string[];
};

export const DESIGN = {
  behance: "https://www.behance.net/3TDream",
  creatives: "https://creatives.co.il/3tdream/",
  disciplines: [
    {
      id: "brand",
      title: L("Бренд и реклама", "Brand & advertising", "מיתוג ופרסום"),
      credit: "McCann Erickson · FIRMA",
      desc: L(
        "Айдентика и рекламная графика для крупных кампаний.",
        "Identity and advertising graphics for major campaigns.",
        "זהות וגרפיקת פרסום לקמפיינים גדולים."
      ),
      tags: ["Brand", "Identity", "Advertising"],
    },
    {
      id: "product",
      title: L("Продуктовый UX/UI", "Product UX/UI", "UX/UI מוצרי"),
      credit: "Figma · 3TDream",
      desc: L(
        "Интерфейсы, прототипы и дизайн-системы для веб-продуктов.",
        "Interfaces, prototypes and design systems for web products.",
        "ממשקים, אבות-טיפוס ומערכות עיצוב למוצרי web."
      ),
      tags: ["UX", "UI", "Figma", "Design systems"],
    },
    {
      id: "motion",
      title: L("3D и моушн", "3D & motion", "תלת-ממד ומושן"),
      credit: "IAC · After Effects · Three.js",
      desc: L(
        "Анимация, 3D и движение — от рекламных роликов до вебовых сцен.",
        "Animation, 3D and motion — from ad spots to web scenes.",
        "אנימציה, תלת-ממד ותנועה — מפרסומות ועד סצנות web."
      ),
      tags: ["3D", "Motion", "Animation"],
    },
  ] as Discipline[],
};
