import type { CaseStudy } from "./cases";

/** Author-provided narrative, compiled 6 November 2026. Metrics are reported, not independently audited. */
export const MISSION_CONTROL: Omit<CaseStudy, "figures"> = {
  "intro": {
    "ru": "Как спроектировать работу AI-агентов так, чтобы готовность определялась проверками реальных файлов, а человек управлял процессом.",
    "en": "Designing an AI-agent workflow where real files determine readiness and a person controls the process.",
    "he": "תכנון תהליך עבודה לסוכני AI שבו המוכנות נקבעת לפי הקבצים עצמם, והאדם מנהל את התהליך."
  },
  "role": {
    "ru": "Product Designer: концепция, процесс и интерфейс",
    "en": "Product Designer: concept, workflow and interface",
    "he": "מעצב מוצר: קונספט, תהליך וממשק"
  },
  "deliverable": {
    "ru": "Оркестрация AI-агентов и интерфейс контроля S0–S12",
    "en": "AI-agent orchestration and an S0–S12 control interface",
    "he": "תזמור סוכני AI וממשק בקרה לשלבים S0–S12"
  },
  "result": {
    "ru": "Спроектировал концепцию, процесс и интерфейс Mission Control: проверки качества по реальным файлам, автономное принятие этапов и возврат на доработку, контроль стоимости и оценку агентов. Этот проект определил направление моей работы: проектировать не только экраны, но и саму систему работы агентов, включая её ограничения и измерение.",
    "en": "I designed the concept, workflow and interface for Mission Control: quality checks against real files, autonomous stage acceptance and rework, cost controls and agent evaluation. The project shaped my focus on designing the system of agent work as well as its screens, including its limits and how it is measured.",
    "he": "תכננתי את הקונספט, תהליך העבודה והממשק של Mission Control: בדיקות איכות מול קבצים אמיתיים, קבלה והחזרה לתיקון של שלבים באופן אוטונומי, בקרת עלויות והערכת סוכנים. הפרויקט חידד את הכיוון שלי: לעצב גם את מערכת העבודה של הסוכנים, ולא רק את המסכים, כולל המגבלות שלה ואופן המדידה."
  },
  "sections": [
    {
      "title": {
        "ru": "Задача и мой вклад",
        "en": "The design problem and my role",
        "he": "האתגר והתרומה שלי"
      },
      "body": {
        "ru": "AI-агент может уверенно сообщить, что работа готова, хотя код не собирается или не соответствует брифу. В проекте 3TDream моя задача как Product Designer выходила за рамки экранов: я разработал концепцию, процесс и интерфейс системы, в которой результат агентов можно проверить, а человек управляет работой нескольких агентов, а не разбирает каждую их ошибку.",
        "en": "An AI agent can confidently report that work is ready even when the code does not build or meet the brief. As Product Designer on this 3TDream project, I designed the concept, workflow and interface for a system where agent output can be checked and a person can manage several agents rather than untangle each of their errors.",
        "he": "סוכן AI יכול לדווח בביטחון שהעבודה מוכנה, גם כשהקוד לא נבנה או אינו תואם לבריף. כמעצב המוצר בפרויקט של 3TDream, תכננתי את הקונספט, התהליך והממשק של מערכת שמאפשרת לבדוק את תוצרי הסוכנים ולנהל כמה סוכנים במקביל, במקום לפתור כל טעות שלהם בנפרד."
      }
    },
    {
      "title": {
        "ru": "Шесть гейтов из реальных дефектов",
        "en": "Six gates built from real defects",
        "he": "שש בדיקות סף שנולדו מתקלות אמיתיות"
      },
      "body": {
        "ru": "Первый принцип: мнение модели о собственном коде не является доказательством готовности. Автоматические проверки читают реальные файлы, а не отчёт агента. Между этапами стоят шесть гейтов; провал проверки блокирует релиз. Каждый гейт появился после конкретного дефекта. При этом успешное прохождение известных проверок не гарантирует корректность живого сайта: набор проверок тоже нужно развивать.",
        "en": "The first principle is that a model's opinion of its own code is not evidence of readiness. Automated checks read real files rather than the agent's report. Six gates sit between stages, and a failed check blocks release. Each gate was added after a specific defect. Passing the checks that exist does not guarantee a correct live site: the checks themselves must keep evolving.",
        "he": "העיקרון הראשון: חוות הדעת של המודל על הקוד שלו אינה הוכחה למוכנות. בדיקות אוטומטיות קוראות את הקבצים עצמם, ולא את דוח הסוכן. שש בדיקות סף מפרידות בין השלבים, וכישלון בבדיקה חוסם שחרור. כל בדיקה נוספה בעקבות תקלה מסוימת. מעבר של הבדיקות הקיימות אינו מבטיח שהאתר החי תקין: גם מערך הבדיקות דורש שיפור מתמשך."
      }
    },
    {
      "title": {
        "ru": "Невидимая форма: дефект стал правилом",
        "en": "The invisible form: a defect becomes a rule",
        "he": "הטופס הבלתי נראה: מתקלה לכלל"
      },
      "body": {
        "ru": "Один бриф, добавить форму заявок на живой сайт, прошёл через пайплайн семь раз. После сборок я менял систему, а не только её результат. Шестая сборка прошла все проверки и была опубликована, но поля формы оказались невидимыми: код использовал CSS-классы, которых не было в стилях. Дефект исправили вручную в тот же день. Я добавил проверку соответствия используемых классов стилям, и следующая сборка поймала тот же класс дефекта до релиза. Важным решением стало превращать найденную ошибку в проверяемое правило системы, сохраняя честный разбор того, что уже пропустили.",
        "en": "The same brief, adding a lead form to a live site, went through the pipeline seven times. After builds, I changed the system rather than only its output. The sixth build passed all checks and was published, but the form fields were invisible because the code used CSS classes absent from the styles. The defect was fixed manually that day. I added a check matching used classes against styles, and the next build caught the same class of defect before release. The design decision was to turn a discovered error into a testable system rule while being explicit about the failure that had already escaped.",
        "he": "אותו בריף, הוספת טופס פנייה לאתר חי, עבר בצנרת שבע פעמים. אחרי בניות שיניתי את המערכת, ולא רק את התוצר שלה. הבנייה השישית עברה את כל הבדיקות ופורסמה, אבל שדות הטופס לא נראו: הקוד השתמש במחלקות CSS שלא הוגדרו בסגנונות. התקלה תוקנה ידנית באותו יום. הוספתי בדיקה שמשווה את המחלקות שבשימוש לסגנונות, ובבנייה הבאה נתפס אותו סוג תקלה לפני השחרור. ההחלטה העיצובית הייתה להפוך טעות שהתגלתה לכלל מערכת שניתן לבדוק, בלי לטשטש את הכשל שכבר הגיע לאתר."
      }
    },
    {
      "title": {
        "ru": "Автономные этапы, запуск под контролем человека",
        "en": "Autonomous stages, human-controlled runs",
        "he": "שלבים אוטונומיים, הפעלות בשליטת אדם"
      },
      "body": {
        "ru": "После дорогостоящего июльского прогона я ввёл дневной лимит и потолок стоимости одного прогона. Каждый платный прогон запускает человек. При этом принятие результата этапа и возврат на доработку происходят автономно внутри процесса. Так я разделил финансовое решение о запуске и рутинные решения по ходу работы. Планирование и кодовая база переиспользуются между прогонами одного проекта.",
        "en": "After an expensive July run, I introduced a daily budget limit and a per-run cost ceiling. A person initiates every paid run, while stage acceptance and returns for rework happen autonomously within the workflow. This separates the financial decision to start a run from routine decisions during execution. Planning and the codebase are reused between runs of the same project.",
        "he": "אחרי הרצה יקרה ביולי, הגדרתי מגבלה תקציבית יומית ותקרת עלות לכל הרצה. אדם יוזם כל הרצה בתשלום, בעוד שקבלת תוצר של שלב והחזרתו לתיקון מתבצעות באופן אוטונומי בתוך התהליך. כך הפרדתי בין ההחלטה הכספית להתחיל הרצה לבין ההחלטות השגרתיות בזמן הביצוע. התכנון ובסיס הקוד משמשים מחדש בהרצות של אותו פרויקט."
      }
    },
    {
      "title": {
        "ru": "Интерфейс контроля S0–S12",
        "en": "The S0–S12 control interface",
        "he": "ממשק הבקרה S0–S12"
      },
      "body": {
        "ru": "Интерфейс отвечает на вопрос: как человеку следить за работой нескольких агентов одновременно? На главном экране показана цепочка этапов S0–S12. У каждого этапа есть агент, статус и оценка с разбивкой по критериям. Карточка выбранного этапа показывает, чем закончился шаг. Это делает состояние процесса обозримым без необходимости читать каждый отчёт агента.",
        "en": "The interface answers one question: how can a person follow several agents at once? The main view shows the S0–S12 stage chain. Each stage has an agent, a status and a score broken down by criteria. The selected stage's card shows how the step ended, making the workflow state visible without requiring every agent report to be read.",
        "he": "הממשק עונה על שאלה אחת: איך אדם יכול לעקוב אחר כמה סוכנים במקביל? המסך הראשי מציג את שרשרת השלבים S0–S12. לכל שלב יש סוכן, סטטוס וציון עם פירוט לפי קריטריונים. כרטיס השלב שנבחר מציג איך הצעד הסתיים, כך שמצב התהליך גלוי בלי לקרוא כל דוח של כל סוכן."
      }
    },
    {
      "title": {
        "ru": "«Академия»: дизайн самой оценки",
        "en": "Academy: designing the evaluation itself",
        "he": "האקדמיה: עיצוב מערכת ההערכה"
      },
      "body": {
        "ru": "Я также спроектировал «Академию» для оценки агентов. Порог выпуска задан как 96% успешных шагов за окно 30 дней; это правило оценки, а не заявленный результат всех агентов. Правила менялись итеративно: например, метрика засчитывала шаги, скопированные из прошлых прогонов, как новые успехи. Такой дефект измерения потребовал пересмотра правил. Систему оценки я не считаю законченной.",
        "en": "I also designed Academy to evaluate the agents. Its graduation threshold is 96% successful steps over a 30-day window; this is an evaluation rule, not a claim that all agents achieved it. The rules evolved iteratively. For example, the metric counted steps copied from earlier runs as new successes, so the measurement rules needed revision. I do not consider the evaluation system finished.",
        "he": "תכננתי גם את האקדמיה להערכת הסוכנים. סף הסיום הוגדר כ-96% צעדים מוצלחים בחלון של 30 יום; זהו כלל הערכה, ולא טענה שכל הסוכנים השיגו אותו. הכללים השתנו בהדרגה. למשל, המדד ספר צעדים שהועתקו מהרצות קודמות כהצלחות חדשות, ולכן נדרש תיקון של כללי המדידה. איני רואה את מערכת ההערכה כמושלמת."
      }
    }
  ],
  "measurements": {
    "title": {
      "ru": "Что показывают данные проекта",
      "en": "What the project data shows",
      "he": "מה מראים נתוני הפרויקט"
    },
    "intro": {
      "ru": "Это показатели процесса по данным автора проекта. Они приведены без независимой проверки и не подтверждают измеренный эффект для пользователей или клиентов.",
      "en": "These are process measurements reported by the project author. They are presented without independent verification and do not establish measured impact on users or customers.",
      "he": "אלה מדדי תהליך שדווחו על ידי יוצר הפרויקט. הם מוצגים ללא אימות עצמאי ואינם מעידים על השפעה שנמדדה על משתמשים או לקוחות."
    },
    "period": {
      "ru": "Заявленный период: март–ноябрь 2026, 7,5 месяцев. Материал собран 6 ноября 2026.",
      "en": "Reported period: March–November 2026, 7.5 months. Account compiled on 6 November 2026.",
      "he": "התקופה המדווחת: מרץ–נובמבר 2026, שבעה וחצי חודשים. התיאור נאסף ב-6 בנובמבר 2026."
    },
    "items": [
      {
        "label": {
          "ru": "Прогоны за период",
          "en": "Runs in the reported period",
          "he": "הרצות בתקופה המדווחת"
        },
        "value": "427",
        "note": {
          "ru": "Объём наблюдений из материалов проекта. Это число прогонов, не пользователей, клиентов или релизов.",
          "en": "Volume reported in the project material. This counts runs, not users, customers or releases.",
          "he": "היקף הפעילות לפי חומרי הפרויקט. זהו מספר הרצות, לא משתמשים, לקוחות או שחרורים."
        }
      },
      {
        "label": {
          "ru": "Доля упавших шагов агентов",
          "en": "Share of failed agent steps",
          "he": "שיעור צעדי הסוכנים שנכשלו"
        },
        "value": "13.3% → 0.2%",
        "note": {
          "ru": "Сообщённое изменение за период. Единица измерения здесь — шаг агента, а не весь прогон. Отдельные проверки и правила оценки в ходе проекта менялись.",
          "en": "Reported change over the period. The unit is an agent step, not a whole run. Individual checks and evaluation rules changed during the project.",
          "he": "השינוי המדווח לאורך התקופה. יחידת המדידה היא צעד של סוכן, ולא הרצה מלאה. הבדיקות וכללי ההערכה השתנו במהלך הפרויקט."
        }
      },
      {
        "label": {
          "ru": "Стоимость / время: повтор с переиспользованием",
          "en": "Cost / time: repeat with reuse",
          "he": "עלות / זמן: הרצה חוזרת עם שימוש חוזר"
        },
        "value": "−62% / −57%",
        "note": {
          "ru": "Отдельное сравнение повторного выполнения той же задачи с переиспользованием планирования и кода. Это не стоимость цикла отладки и не средняя экономия по всем 427 прогонам.",
          "en": "A separate comparison of repeating the same task while reusing planning and code. This is not the cost of a debugging cycle or an average saving across all 427 runs.",
          "he": "השוואה נפרדת של ביצוע חוזר של אותה משימה תוך שימוש חוזר בתכנון ובקוד. זו אינה עלות של מחזור ניפוי תקלות או חיסכון ממוצע בכל 427 ההרצות."
        }
      },
      {
        "label": {
          "ru": "Стоимость / время: серия к шестой сборке",
          "en": "Cost / time: the sixth-build series",
          "he": "עלות / זמן: הסדרה עד הבנייה השישית"
        },
        "value": "−47% / −63%",
        "note": {
          "ru": "Другая серия: один бриф по мере изменения пайплайна, к шестой сборке. Это та сборка, на которой поля формы остались невидимыми. Более низкая стоимость и меньшее время не означают корректный релиз.",
          "en": "A different series: the same brief as the pipeline evolved, reaching the sixth build. This was the build with the invisible form fields. Lower cost and shorter runtime did not mean a correct release.",
          "he": "סדרה אחרת: אותו בריף לאורך שינויים בצנרת, עד הבנייה השישית. זו הבנייה שבה שדות הטופס לא נראו. עלות נמוכה יותר וזמן קצר יותר לא העידו על שחרור תקין."
        }
      }
    ],
    "note": {
      "ru": "Эти две пары процентов относятся к разным сравнениям и не взаимозаменяемы. Переиспользование меняет условия повторного прогона, а в серии сборок менялась сама система. Подробные исходные выборки, условия сравнения моделей и правила учёта затрат здесь не приведены, поэтому это не контролируемый бенчмарк, не доказательство причинного эффекта дизайна и не обещание такой же экономии в другом проекте.",
      "en": "The two percentage pairs describe different comparisons and are not interchangeable. Reuse changes the repeat-run conditions, while the build series changed the system itself. Detailed underlying samples, model comparison conditions and cost-accounting rules are not provided here. These are not controlled benchmarks, proof of a causal design effect or a promise of the same savings on another project.",
      "he": "שני זוגות האחוזים מתארים השוואות שונות ואינם ניתנים להחלפה. שימוש חוזר משנה את תנאי ההרצה החוזרת, ובסדרת הבניות השתנתה המערכת עצמה. המדגמים המפורטים, תנאי ההשוואה בין המודלים וכללי חישוב העלויות אינם מוצגים כאן. אלה אינם מבחני ביצועים מבוקרים, הוכחה להשפעה סיבתית של העיצוב או הבטחה לחיסכון דומה בפרויקט אחר."
    }
  },
  "evidenceNote": {
    "ru": "Основа текста: мой рассказ о проекте, собранный 6 ноября 2026 по материалам Mission Control и отчёту «Академии». Количественные показатели приведены как данные проекта без независимой проверки. Существующие скриншоты показывают отдельные состояния системы и сами по себе не подтверждают метрики за весь период.",
    "en": "Text based on my project account compiled on 6 November 2026 from Mission Control material and the Academy report. Quantitative figures are presented as project-reported data without independent verification. The existing screenshots show individual system states and do not by themselves establish the period-wide measurements.",
    "he": "הטקסט מבוסס על תיאור הפרויקט שלי, שנאסף ב-6 בנובמבר 2026 מחומרי Mission Control ומדוח האקדמיה. הנתונים הכמותיים מוצגים כדיווח של הפרויקט ללא אימות עצמאי. צילומי המסך הקיימים מציגים מצבים נקודתיים של המערכת ואינם מאמתים לבדם את המדדים של התקופה כולה."
  }
};
