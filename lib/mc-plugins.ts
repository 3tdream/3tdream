import { L } from "./localized";
import type { CaseStudy } from "./cases";

/**
 * Facts as of 13 November 2026: marketplace 3tdream-mc, plugin mc-marketing 0.1.1, private repo 3tdream/mc-plugins.
 * Install commands checked against code.claude.com/docs/en/setup and the GitHub CLI install docs the same day.
 */
export const MC_PLUGINS: CaseStudy = {
  intro: L(
    "Правила и навыки, по которым работает Mission Control, упакованные в плагин Claude Code. Ниже — пошаговая установка, опыт программирования не нужен.",
    "The rules and skills Mission Control works by, packaged as a Claude Code plugin. Step-by-step install below — no programming experience needed.",
    "הכללים והמיומנויות ש-Mission Control עובד לפיהם, ארוזים כתוסף ל-Claude Code. למטה — התקנה צעד אחר צעד, בלי צורך בניסיון בתכנות."
  ),
  role: L("Автор: состав, правила и упаковка", "Author: contents, rules and packaging", "יוצר: תוכן, כללים ואריזה"),
  deliverable: L(
    "Приватный маркетплейс 3tdream-mc и плагин mc-marketing 0.1.1",
    "Private marketplace 3tdream-mc and the mc-marketing 0.1.1 plugin",
    "מרקטפלייס פרטי 3tdream-mc והתוסף mc-marketing 0.1.1"
  ),
  result: L(
    "Плагин собран, проверен валидатором Claude Code и установлен с GitHub на рабочую машину; навыки вызываются под префиксом mc-marketing:. Доступ к репозиторию — по приглашению.",
    "The plugin is built, passes the Claude Code validator and installs from GitHub on a working machine; skills are called under the mc-marketing: prefix. Repository access is by invitation.",
    "התוסף נבנה, עובר את הבודק של Claude Code ומותקן מ-GitHub על מחשב עבודה; המיומנויות נקראות עם הקידומת mc-marketing:. הגישה למאגר בהזמנה."
  ),
  sections: [
    {
      title: L("Зачем и как это работает", "Why, and how it works", "למה ואיך זה עובד"),
      body: L(
        "Внутри Mission Control эти правила уже работают. Плагин переносит их туда, где Mission Control нет: к маркетологу команды, в другие проекты и к клиентам. Один источник правил; обновление приходит, только когда выходит новая версия.",
        "Inside Mission Control these rules already apply. The plugin carries them where Mission Control is absent: to the team's marketer, other projects and clients. One source of rules; an update arrives only when a new version is released.",
        "בתוך Mission Control הכללים האלה כבר פועלים. התוסף מביא אותם למקומות שבהם אין Mission Control: לאנשי השיווק בצוות, לפרויקטים אחרים וללקוחות. מקור אחד לכללים; עדכון מגיע רק כשיוצאת גרסה חדשה."
      ),
      flow: {
        stages: [
          {
            title: L("Mission Control", "Mission Control", "Mission Control"),
            text: L("Правила и навыки складываются и проверяются в работе агентов.", "Rules and skills take shape and get tested in the agents' daily work.", "הכללים והמיומנויות נבנים ונבדקים בעבודה היומית של הסוכנים."),
          },
          {
            title: L("Плагин mc-marketing", "The mc-marketing plugin", "התוסף mc-marketing"),
            text: L("Отобранные навыки упаковываются в плагин с номером версии.", "Selected skills are packaged into a plugin with a version number.", "מיומנויות נבחרות נארזות בתוסף עם מספר גרסה."),
          },
          {
            title: L("Каталог на GitHub", "Catalogue on GitHub", "קטלוג ב-GitHub"),
            text: L("Плагин публикуется в приватном каталоге 3tdream/mc-plugins.", "The plugin is published to the private 3tdream/mc-plugins catalogue.", "התוסף מתפרסם בקטלוג הפרטי 3tdream/mc-plugins."),
          },
          {
            title: L("Ваш Claude Code", "Your Claude Code", "ה-Claude Code שלכם"),
            text: L("Вы ставите его одной командой — доступ по приглашению.", "You install it with one command — access by invitation.", "מתקינים אותו בפקודה אחת — הגישה בהזמנה."),
          },
          {
            title: L("Работа", "Work", "עבודה"),
            text: L("Вызываете навык, например /mc-marketing:market-scan, — правила 3TDream уже внутри.", "Call a skill such as /mc-marketing:market-scan — 3TDream's rules are built in.", "קוראים למיומנות, למשל /mc-marketing:market-scan — הכללים של 3TDream כבר בפנים."),
          },
        ],
        loop: L(
          "Новая версия → одна команда обновления → у всех снова одинаковые правила",
          "New version → one update command → everyone works by the same rules again",
          "גרסה חדשה ← פקודת עדכון אחת ← כולם שוב עובדים לפי אותם כללים"
        ),
      },
    },
    {
      title: L("Что внутри mc-marketing", "What is in mc-marketing", "מה יש ב-mc-marketing"),
      body: L(
        "Шесть навыков. Каждый вызывается командой /mc-marketing:<название>, например /mc-marketing:market-scan. Сторонние навыки в плагин не входят.",
        "Six skills. Each is called as /mc-marketing:<name>, for example /mc-marketing:market-scan. Third-party skills are not included.",
        "שש מיומנויות. כל אחת נקראת בפקודה /mc-marketing:<שם>, למשל /mc-marketing:market-scan. מיומנויות של צד שלישי לא נכללות."
      ),
      bullets: [
        {
          name: "house-rules",
          text: L(
            "правила 3TDream для любой маркетинговой работы: тексты для клиентов на английском, только проверенные факты и цифры, всё как черновик, без секретов, фирменные цвета. Остальные навыки опираются на него.",
            "3TDream's rules for any marketing work: customer-facing copy in English, verified facts and numbers only, everything as a draft, no secrets, brand colours. The other skills rely on it.",
            "הכללים של 3TDream לכל עבודת שיווק: טקסטים ללקוחות באנגלית, רק עובדות ומספרים מאומתים, הכל כטיוטה, בלי סודות, צבעי המותג. שאר המיומנויות נשענות עליה."
          ),
        },
        {
          name: "market-scan",
          text: L(
            "быстрый обзор рынка по теме: тренды, ключевые игроки, размер рынка, возможности.",
            "a quick market scan for a topic: trends, key players, market size, opportunities.",
            "סקירת שוק מהירה לנושא: מגמות, שחקנים מרכזיים, גודל שוק, הזדמנויות."
          ),
        },
        {
          name: "competitor-dive",
          text: L(
            "глубокий разбор одного конкурента: функции, цены, интерфейс, технологии, сильные и слабые стороны.",
            "a deep look at one competitor: features, pricing, UI/UX, tech stack, strengths and weaknesses.",
            "ניתוח מעמיק של מתחרה אחד: פיצ׳רים, מחירים, ממשק, טכנולוגיה, חוזקות וחולשות."
          ),
        },
        {
          name: "research",
          text: L(
            "полный исследовательский отчёт: персоны, матрица конкурентов, оценка рынка, главные выводы. Для быстрого обзора — market-scan.",
            "a full discovery report: personas, competitive matrix, market sizing, key insights. For a quick look, use market-scan.",
            "דוח מחקר מלא: פרסונות, מטריצת מתחרים, הערכת גודל שוק, תובנות מרכזיות. לסקירה מהירה — market-scan."
          ),
        },
        {
          name: "user-interviews",
          text: L(
            "вопросы для интервью с пользователями: на этапе поиска идеи, проверки удобства и подтверждения гипотез.",
            "user interview questions for discovery, usability testing and validation.",
            "שאלות לראיונות משתמשים: לשלב הגילוי, לבדיקת שימושיות ולאימות השערות."
          ),
        },
        {
          name: "brand-guidelines",
          text: L(
            "бренд-гайд: «create» — собрать новый, «audit» — проверить материалы на нарушения бренда.",
            "a brand guide: \"create\" builds a new one, \"audit\" checks material for brand violations.",
            "מדריך מותג: \"create\" בונה מדריך חדש, \"audit\" בודק חומרים מול כללי המותג."
          ),
        },
      ],
    },
    {
      title: L("Установка шаг за шагом", "Install step by step", "התקנה צעד אחר צעד"),
      body: L(
        "Около 15 минут, один раз. Команды ниже копируйте кнопкой «Копировать», вставляйте в окно терминала (Ctrl+V на Windows, Cmd+V на Mac) и нажимайте Enter.",
        "About 15 minutes, once. Copy each command below with its Copy button, paste it into the terminal window (Ctrl+V on Windows, Cmd+V on Mac) and press Enter.",
        "כ-15 דקות, פעם אחת. העתיקו כל פקודה בכפתור \"העתק\", הדביקו בחלון הטרמינל (Ctrl+V ב-Windows, Cmd+V ב-Mac) ולחצו Enter."
      ),
      steps: [
        {
          text: L(
            "Что понадобится. Платный тариф Claude — Pro, Max, Team или Enterprise (в бесплатном Claude Code нет). И бесплатный аккаунт GitHub: зарегистрируйтесь на github.com/signup и пришлите свой логин GitHub через страницу «Контакты».",
            "What you need. A paid Claude plan — Pro, Max, Team or Enterprise (the free plan does not include Claude Code). And a free GitHub account: sign up at github.com/signup and send your GitHub username through the Contact page.",
            "מה צריך. מנוי Claude בתשלום — Pro, Max, Team או Enterprise (במנוי החינמי אין Claude Code). וחשבון GitHub חינמי: הירשמו ב-github.com/signup ושלחו את שם המשתמש שלכם ב-GitHub דרך עמוד יצירת קשר."
          ),
        },
        {
          text: L(
            "Примите приглашение. GitHub пришлёт письмо «invited you to 3tdream/mc-plugins». Откройте его, нажмите View invitation, затем Accept invitation.",
            "Accept the invitation. GitHub sends an e-mail \"invited you to 3tdream/mc-plugins\". Open it, click View invitation, then Accept invitation.",
            "אשרו את ההזמנה. GitHub ישלח מייל \"invited you to 3tdream/mc-plugins\". פתחו אותו, לחצו View invitation ואז Accept invitation."
          ),
        },
        {
          text: L(
            "Откройте терминал. Windows: меню Пуск → наберите PowerShell → откройте Windows PowerShell. Mac: Cmd+Пробел → наберите Terminal → Enter.",
            "Open a terminal. Windows: Start menu → type PowerShell → open Windows PowerShell. Mac: Cmd+Space → type Terminal → Enter.",
            "פתחו טרמינל. Windows: תפריט התחל → הקלידו PowerShell → פתחו את Windows PowerShell. Mac: Cmd+רווח → הקלידו Terminal → Enter."
          ),
        },
        {
          text: L(
            "Установите Claude Code — выберите команду для своей системы. Установка идёт молча, без индикатора; дождитесь, пока снова появится строка для ввода. Потом закройте окно терминала и откройте новое.",
            "Install Claude Code — pick the command for your system. It installs silently, without a progress bar; wait until the input line comes back. Then close the terminal window and open a new one.",
            "התקינו את Claude Code — בחרו את הפקודה למערכת שלכם. ההתקנה שקטה, בלי פס התקדמות; חכו שתחזור שורת ההקלדה. אחר כך סגרו את חלון הטרמינל ופתחו חדש."
          ),
          commands: [
            { label: "Windows", code: "irm https://claude.ai/install.ps1 | iex" },
            { label: "Mac", code: "curl -fsSL https://claude.ai/install.sh | bash" },
          ],
        },
        {
          text: L(
            "Войдите в Claude. Запустите команду — откроется браузер, войдите своим аккаунтом Claude. Вернитесь в терминал и наберите /exit, чтобы выйти.",
            "Sign in to Claude. Run the command — a browser opens; sign in with your Claude account. Back in the terminal, type /exit to leave.",
            "התחברו ל-Claude. הריצו את הפקודה — ייפתח דפדפן; התחברו עם חשבון Claude שלכם. חזרו לטרמינל והקלידו /exit כדי לצאת."
          ),
          commands: [{ code: "claude" }],
        },
        {
          text: L(
            "Установите GitHub CLI. Windows — команда ниже. Mac — скачайте установщик на cli.github.com и запустите его (если macOS предупредит, нажмите на файл правой кнопкой → Открыть). Потом закройте терминал и откройте новый.",
            "Install GitHub CLI. Windows — the command below. Mac — download the installer from cli.github.com and run it (if macOS warns you, right-click the file → Open). Then close the terminal and open a new one.",
            "התקינו את GitHub CLI. ב-Windows — הפקודה למטה. ב-Mac — הורידו את תוכנת ההתקנה מ-cli.github.com והריצו אותה (אם macOS מזהיר, לחצו על הקובץ בכפתור הימני → Open). אחר כך סגרו את הטרמינל ופתחו חדש."
          ),
          commands: [{ label: "Windows", code: "winget install --id GitHub.cli --source winget" }],
        },
        {
          text: L(
            "Подключите GitHub. На вопросы отвечайте стрелками и Enter: GitHub.com → HTTPS → Yes → Login with a web browser. Терминал покажет код из 8 символов — скопируйте его, нажмите Enter, вставьте код в открывшемся браузере и нажмите Authorize.",
            "Connect GitHub. Answer the questions with the arrow keys and Enter: GitHub.com → HTTPS → Yes → Login with a web browser. The terminal shows an 8-character code — copy it, press Enter, paste the code in the browser that opens and click Authorize.",
            "חברו את GitHub. ענו על השאלות עם החיצים ו-Enter: GitHub.com → HTTPS → Yes → Login with a web browser. הטרמינל יציג קוד בן 8 תווים — העתיקו אותו, לחצו Enter, הדביקו את הקוד בדפדפן שנפתח ולחצו Authorize."
          ),
          commands: [{ code: "gh auth login" }, { code: "gh auth setup-git" }],
        },
        {
          text: L(
            "Подключите наш каталог плагинов. Ожидаемый ответ: «Successfully added marketplace: 3tdream-mc».",
            "Add our plugin catalogue. Expected reply: \"Successfully added marketplace: 3tdream-mc\".",
            "הוסיפו את קטלוג התוספים שלנו. התשובה הצפויה: \"Successfully added marketplace: 3tdream-mc\"."
          ),
          commands: [{ code: "claude plugin marketplace add 3tdream/mc-plugins" }],
        },
        {
          text: L(
            "Установите плагин. Ожидаемый ответ: «Successfully installed plugin: mc-marketing@3tdream-mc».",
            "Install the plugin. Expected reply: \"Successfully installed plugin: mc-marketing@3tdream-mc\".",
            "התקינו את התוסף. התשובה הצפויה: \"Successfully installed plugin: mc-marketing@3tdream-mc\"."
          ),
          commands: [{ code: "claude plugin install mc-marketing@3tdream-mc" }],
        },
        {
          text: L(
            "Попробуйте. Запустите claude и напишите в нём, например: /mc-marketing:market-scan кофейни в Тель-Авиве. Все навыки начинаются с /mc-marketing:.",
            "Try it. Start claude and type, for example: /mc-marketing:market-scan coffee shops in Tel Aviv. All skills start with /mc-marketing:.",
            "נסו. הפעילו claude והקלידו, למשל: /mc-marketing:market-scan בתי קפה בתל אביב. כל המיומנויות מתחילות ב-/mc-marketing:."
          ),
          commands: [{ code: "claude" }],
        },
        {
          text: L(
            "Если на шаге 8 появилась ошибка «Permission denied (publickey)» или «unable to get password», у вашего компьютера нет доступа к каталогу: проверьте, что приглашение принято (шаг 2), и повторите шаг 7.",
            "If step 8 fails with \"Permission denied (publickey)\" or \"unable to get password\", your computer has no access to the catalogue: check that the invitation is accepted (step 2) and repeat step 7.",
            "אם בשלב 8 מופיעה השגיאה \"Permission denied (publickey)\" או \"unable to get password\", למחשב אין גישה לקטלוג: ודאו שההזמנה אושרה (שלב 2) וחזרו על שלב 7."
          ),
        },
      ],
    },
    {
      title: L("Без GitHub или в claude.ai", "Without GitHub, or in claude.ai", "בלי GitHub או ב-claude.ai"),
      body: L(
        "По запросу пришлём плагин одним zip-файлом — тогда шаги 2, 6–9 не нужны. Обновления по этим путям сами не приходят: для новой версии нужен новый zip.",
        "On request we send the plugin as one zip file — then steps 2 and 6–9 are not needed. Updates do not arrive by themselves on these routes: a new version needs a new zip.",
        "לפי בקשה נשלח את התוסף כקובץ zip אחד — ואז שלבים 2 ו-6–9 לא נחוצים. במסלולים האלה עדכונים לא מגיעים לבד: לגרסה חדשה צריך zip חדש."
      ),
      steps: [
        {
          text: L(
            "В Claude Code: положите zip в папку, откройте в ней терминал и запустите команду — плагин работает в этой сессии, без установки. Её нужно запускать каждый раз.",
            "In Claude Code: put the zip in a folder, open a terminal there and run the command — the plugin works in that session without installing. Run it each time.",
            "ב-Claude Code: שימו את ה-zip בתיקייה, פתחו בה טרמינל והריצו את הפקודה — התוסף פועל באותו סשן בלי התקנה. יש להריץ אותה בכל פעם."
          ),
          commands: [{ code: "claude --plugin-dir mc-marketing-0.1.1.zip" }],
        },
        {
          text: L(
            "В claude.ai (по документации Anthropic, нами не проверено): Customize → Plugins → Add → Upload plugin и выберите zip.",
            "In claude.ai (per Anthropic's docs, not tested by us): Customize → Plugins → Add → Upload plugin and choose the zip.",
            "ב-claude.ai (לפי התיעוד של Anthropic, לא נבדק על ידינו): Customize → Plugins → Add → Upload plugin ובחרו את ה-zip."
          ),
        },
      ],
    },
    {
      title: L("Обновления", "Updates", "עדכונים"),
      body: L(
        "Когда выйдет новая версия, выполните две команды и откройте новую сессию claude.",
        "When a new version is out, run two commands and open a new claude session.",
        "כשיוצאת גרסה חדשה, הריצו שתי פקודות ופתחו סשן claude חדש."
      ),
      steps: [
        {
          text: L("Обновите каталог и плагин.", "Refresh the catalogue and the plugin.", "רעננו את הקטלוג ואת התוסף."),
          commands: [{ code: "claude plugin marketplace update" }, { code: "claude plugin update mc-marketing@3tdream-mc" }],
        },
      ],
    },
  ],
  figures: [],
  evidenceNote: L(
    "Основание: репозиторий 3tdream/mc-plugins, проверка claude plugin validate --strict, установка с GitHub 5 ноября 2026 и повторный прогон шагов 8–9 и обновления 13 ноября 2026. Загрузка в claude.ai описана по документации и нами не проверялась.",
    "Evidence: the 3tdream/mc-plugins repository, claude plugin validate --strict, an install from GitHub on 5 November 2026 and a re-run of steps 8–9 and the update on 13 November 2026. The claude.ai upload follows the docs and has not been tested by us.",
    "מקורות: המאגר 3tdream/mc-plugins, בדיקת claude plugin validate --strict, התקנה מ-GitHub ב-5 בנובמבר 2026 והרצה חוזרת של שלבים 8–9 והעדכון ב-13 בנובמבר 2026. ההעלאה ל-claude.ai מתוארת לפי התיעוד ולא נבדקה על ידינו."
  ),
};
