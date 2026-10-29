import { L, type Localized } from "./localized";
import type { ValidationErrorKey } from "@/types/lead";

/* ------------------------------------------------------------------ */
/* LEAD FORM (MC-557) — trilingual lead-capture copy for /contact.     */
/* Options (role/industry/companySize/replyLang) live in                */
/* lib/lead-values.ts as the single source of truth; this file only     */
/* carries field labels, placeholders, and status copy.                 */
/* ------------------------------------------------------------------ */

export const LEAD_FORM = {
  title: L("Обсудим проект", "Let's talk about your project", "בואו נדבר על הפרויקט"),
  subtitle: L(
    "Коротко опишите задачу — отвечу на удобном вам языке.",
    "Describe your task briefly — I'll reply in your preferred language.",
    "תארו בקצרה את המשימה — אשיב בשפה שתבחרו."
  ),
  fields: {
    name: {
      label: L("Имя", "Name", "שם"),
      placeholder: L("Как к вам обращаться", "How should I address you", "איך לפנות אליכם"),
    },
    contact: {
      label: L("Контакт", "Contact", "פרטי קשר"),
      placeholder: L("Email, телефон или мессенджер", "Email, phone, or messenger", "אימייל, טלפון או מסנג'ר"),
    },
    role: {
      label: L("Роль", "Role", "תפקיד"),
      placeholder: L("Выберите роль", "Select a role", "בחרו תפקיד"),
    },
    industry: {
      label: L("Индустрия", "Industry", "תעשייה"),
      placeholder: L("Выберите индустрию", "Select an industry", "בחרו תעשייה"),
    },
    companySize: {
      label: L("Размер компании", "Company size", "גודל החברה"),
      placeholder: L("Выберите размер", "Select a size", "בחרו גודל"),
    },
    replyLang: {
      label: L("Язык ответа", "Reply language", "שפת המענה"),
    },
    brief: {
      label: L("Задача", "Brief", "תיאור המשימה"),
      placeholder: L(
        "Расскажите о проекте и сроках",
        "Tell me about the project and timeline",
        "ספרו על הפרויקט ועל לוחות הזמנים"
      ),
    },
  },
  submit: L("Отправить", "Send", "שליחה"),
  submitting: L("Отправка…", "Sending…", "שולח…"),
  success: L(
    "Спасибо! Сообщение отправлено, отвечу в ближайшее время.",
    "Thanks! Your message is on its way — I'll reply soon.",
    "תודה! ההודעה נשלחה, אחזור אליכם בהקדם."
  ),
  genericError: L(
    "Не удалось отправить. Попробуйте ещё раз.",
    "Couldn't send that. Please try again.",
    "השליחה נכשלה. נסו שוב."
  ),
} as const;

export function leadErrorMessage(key: ValidationErrorKey): Localized {
  switch (key) {
    case "name_required":
      return L("Укажите имя", "Please enter your name", "נא להזין שם");
    case "contact_required":
      return L("Укажите контакт для связи", "Please enter a contact", "נא להזין פרטי קשר");
    case "role_required":
      return L("Выберите роль", "Please select a role", "נא לבחור תפקיד");
    case "industry_required":
      return L("Выберите индустрию", "Please select an industry", "נא לבחור תעשייה");
    case "companySize_required":
      return L("Выберите размер компании", "Please select a company size", "נא לבחור גודל חברה");
    case "brief_required":
      return L("Опишите задачу", "Please describe your task", "נא לתאר את המשימה");
    case "brief_length":
      return L(
        "Описание слишком короткое или длинное",
        "Brief is too short or too long",
        "התיאור קצר מדי או ארוך מדי"
      );
    case "replyLang_required":
      return L("Выберите язык ответа", "Please select a reply language", "נא לבחור שפת מענה");
    case "formRenderedAt_invalid":
      return LEAD_FORM.genericError;
    default:
      return LEAD_FORM.genericError;
  }
}

/* ------------------------------------------------------------------ */
/* BRAND                                                               */
/* ------------------------------------------------------------------ */

export const BRAND = {
  name: "3TDream",
  expansion: L("Time To Team Dream", "Time To Team Dream", "Time To Team Dream"),
  tagline: L("Product Designer · AI Product Builder · Lecturer", "Product Designer · AI Product Builder · Lecturer", "Product Designer · AI Product Builder · Lecturer"),
  intro: L("Проектирую понятные цифровые продукты, создаю AI-инструменты и преподаю UX/UI. Соединяю продуктовую задачу, интерфейс и реализацию.", "I design clear digital products, build AI tools and teach UX/UI. I connect the product problem, the interface and its implementation.", "אני מעצב מוצרים דיגיטליים ברורים, בונה כלי AI ומלמד UX/UI. מחבר בין אתגר המוצר, הממשק והמימוש."),};

/* ------------------------------------------------------------------ */
/* PROFILE                                                             */
/* ------------------------------------------------------------------ */

export const PROFILE = {
  name: "Michael Shigrin Sokol",
  location: L("Хайфа, Израиль", "Haifa, Israel", "חיפה, ישראל"),
  // One-line positioning — the "designer → AI builder" arc that isn't stated
  // anywhere public yet. This is the site's chance to claim it explicitly.
  headline: L("Product Designer · AI Product Builder · Lecturer", "Product Designer · AI Product Builder · Lecturer", "Product Designer · AI Product Builder · Lecturer"),
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
{ period: "Nov 2025–Present", role: L("UX/UI & Game Product Lecturer", "UX/UI & Game Product Lecturer", "UX/UI & Game Product Lecturer"), org: L("Tiltan", "Tiltan", "Tiltan"), desc: L("Part-time", "Part-time", "Part-time"), kind: L("Part-time", "Part-time", "Part-time") },
{ period: "May 2023–May 2026", role: L("Product Designer / Product Manager", "Product Designer / Product Manager", "Product Designer / Product Manager"), org: L("AR Software", "AR Software", "AR Software"), desc: L("Product", "Product", "Product"), kind: L("Product", "Product", "Product") },
{ period: "Aug 2020–Jun 2022", role: L("Art Director & Product Manager", "Art Director & Product Manager", "Art Director & Product Manager"), org: L("BrainyOdds", "BrainyOdds", "BrainyOdds"), desc: L("Product", "Product", "Product"), kind: L("Product", "Product", "Product") },
{ period: "Dec 2017–Nov 2020", role: L("UX/UI & 3D Designer", "UX/UI & 3D Designer", "UX/UI & 3D Designer"), org: L("Freelance", "Freelance", "Freelance"), desc: L("Design", "Design", "Design"), kind: L("Design", "Design", "Design") }
];

/* ------------------------------------------------------------------ */
/* NAV                                                                 */
/* ------------------------------------------------------------------ */

export const NAV: { href: string; label: Localized; index: string }[] = [
  { href: "/", label: L("Главная", "Home", "בית"), index: "01" },
  { href: "/projects", label: L("Проекты", "Projects", "עבודות"), index: "02" },
  { href: "/courses", label: L("Курсы", "Courses", "קורסים"), index: "03" },
  { href: "/about", label: L("Обо мне", "About", "אודות"), index: "04" },
  { href: "/contact", label: L("Контакт", "Contact", "צור קשר"), index: "05" },
];

/* ------------------------------------------------------------------ */
/* STATS (hero)                                                        */
/* ------------------------------------------------------------------ */

export const STATS: { value: string; label: Localized }[] = [
{ value: "01", label: L("Продуктовый дизайн и управление", "Product Designer", "עיצוב וניהול מוצר") },
{ value: "02", label: L("Разработка AI-продуктов", "AI Product Builder", "פיתוח מוצרי AI") },
{ value: "03", label: L("Преподавание", "Lecturer", "הוראה") }
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
    tagline: L("Многоагентная работа с контролем человеком.", "Multi-agent work with human oversight.", "עבודה מרובת סוכנים עם בקרה אנושית."),
    description: L("Многоагентный процесс: планирование продукта, архитектура, реализация и проверки качества с контролем человеком.", "A multi-agent workflow connecting product planning, architecture, implementation and quality checks with human oversight.", "תהליך מרובה סוכנים לתכנון מוצר, ארכיטקטורה, פיתוח ובדיקות איכות עם בקרה אנושית."),

    role: L("Основатель · продукт и инженерия", "Founder · product & engineering", "מייסד · מוצר והנדסה"),
    tags: ["AI", "Multi-agent", "Next.js", "Pipeline"],
  },
  {
    slug: "cyberguard",
    title: "CyberGuard",
    year: "2026",
    statuses: ["live", "wip"],
    url: "https://cyberguard-mc.vercel.app",
    tagline: L(
      "Личная кибербезопасность: проверка цифрового следа и план по его защите.",
      "Personal cyber security: check your digital footprint, then close the gaps.",
      "אבטחת סייבר אישית: בדיקת הטביעה הדיגיטלית ותוכנית לסגירת הפערים."
    ),
    description: L(
      "Проверяем email и телефон по известным утечкам, собираем цифровой след и считаем Cyber Health Score — а дальше выдаём понятный план: пароли, 2FA, настройки приватности. Превенция, а не разбор последствий. Трёхъязычный интерфейс с RTL.",
      "Checks your email and phone against known breaches, maps your digital footprint and computes a Cyber Health Score — then hands you a plain plan: passwords, 2FA, privacy settings. Prevention, not damage control. Trilingual UI with RTL.",
      "בודק אימייל וטלפון מול דליפות ידועות, ממפה את הטביעה הדיגיטלית ומחשב Cyber Health Score — ואז נותן תוכנית ברורה: סיסמאות, 2FA, הגדרות פרטיות. מניעה, לא ניהול נזקים. ממשק תלת-לשוני עם RTL."
    ),
    role: L("Партнёр · продукт и инженерия", "Partner · product & engineering", "שותף · מוצר והנדסה"),
    tags: ["Security", "OSINT", "Trilingual", "Next.js"],
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
    tagline: L("Платформа обучения UX/UI.", "A UX/UI learning platform.", "פלטפורמת לימוד UX/UI."),
    description: L("Учебные материалы, задания, прототипирование и итоговый проект. Разбор структуры курса и существующих материалов.", "Learning material, assignments, prototyping and a final project. A closer look at the course structure and existing material.", "חומרי לימוד, משימות, יצירת אב טיפוס ופרויקט גמר. מבט על מבנה הקורס והחומרים הקיימים."),
    role: L("Платформа и контент-движок", "Platform & content engine", "פלטפורמה ומנוע תוכן"),
    tags: ["EdTech", "Course platform", "Video"],
  },
  {
    slug: "cv-creator",
    title: "CV Creator",
    year: "2025",
    statuses: ["wip"],
    url: "https://cv-creator-one-woad.vercel.app/",
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
  /** An internal route ("/courses/...") is rendered as a Link; anything else
   *  opens in a new tab. The bridge-agent course lives on this site. */
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
  {
    slug: "bridge-agent",
    title: "Build a Bridge Agent",
    level: L("Для инженеров · практикум", "For engineers · hands-on", "למהנדסים · פרקטי"),
    tagline: L(
      "Снять числа с экрана программы, к которой нет API — и довести их до своего эндпоинта.",
      "Read numbers off a desktop application nobody will give you an API for — and get them to your own endpoint.",
      "לקרוא מספרים ממסך של תוכנה שאין לה API — ולהעביר אותם ל-endpoint שלכם."
    ),
    description: L(
      "Восемь модулей на английском, собранных из системы, которая работает в проде: снимает экран раз в сутки и пережила четырнадцатичасовой обрыв связи, не потеряв ни одного показания. Каждый модуль заканчивается проверкой, которую вы запускаете, а не абзацем «должно работать». Семь модулей из восьми ничего не стоят — платит только чтение экрана, на вашем ключе.",
      "Eight modules, assembled from a system that runs in production: it reads a screen once a day and survived a fourteen-hour network outage without losing a reading. Every module ends with a check you run, not a paragraph saying it should work. Seven of the eight cost nothing — only reading the screen spends, on your own key.",
      "שמונה מודולים, מתוך מערכת שרצה בפרודקשן: קוראת מסך פעם ביום ושרדה ניתוק רשת של ארבע-עשרה שעות בלי לאבד קריאה. כל מודול נגמר בבדיקה שאתם מריצים. שבעה מתוך שמונה לא עולים דבר."
    ),
    meta: [
      L("8 модулей + вступление", "8 modules + an opening", "8 מודולים + פתיחה"),
      L("Песочница с готовыми ответами", "A sandbox with the answers written down", "סביבת תרגול עם התשובות"),
      L("Проверка в конце каждого модуля", "A check at the end of each module", "בדיקה בסוף כל מודול"),
      L("~$0.02 за чтение, на своём ключе", "~$0.02 a reading, on your own key", "~$0.02 לקריאה, במפתח שלכם"),
    ],
    audience: L(
      "Для тех, кто пишет код и упёрся в программу без API: Windows, PowerShell, Node.",
      "For people who write code and have hit an application with no API: Windows, PowerShell, Node.",
      "למי שכותב קוד ונתקל בתוכנה בלי API: Windows, PowerShell, Node."
    ),
    url: "/courses/bridge-agent",
    cta: L("Читать курс", "Read the course", "לקריאת הקורס"),
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
