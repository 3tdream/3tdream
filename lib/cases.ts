import { L, type Localized } from "./localized";
import { MISSION_CONTROL } from "./mission-control";
export type CaseFigure = { src: string; width: number; height: number; caption: Localized };
export type CaseMeasurements = {
  title: Localized; intro: Localized; period: Localized; note: Localized;
  items: { label: Localized; value: string; note: Localized }[];
};
export type CaseStudy = {
  intro: Localized; role: Localized; deliverable: Localized; result: Localized;
  sections: { title: Localized; body: Localized }[];
  figures: CaseFigure[]; evidenceNote: Localized; measurements?: CaseMeasurements;
};
export const CASES: Record<string, CaseStudy> = {
  "mission-control": {
    ...MISSION_CONTROL,
    figures: [
      {src:"/projects/mission-control-dashboard.webp",width:2000,height:1237,caption:L("Главный экран Mission Control: флот агентов, идущий прогон и живая лента событий. Снимок рабочего состояния системы.", "The Mission Control home screen: the agent fleet, a run in progress and the live event feed. A capture of the system at work.", "מסך הבית של Mission Control: צי הסוכנים, הרצה מתבצעת ופיד האירועים החי. צילום של המערכת בעבודה.")},
      {src:"/projects/mission-control-architecture.png",width:941,height:919,caption:L("Карта Architecture. Сохранённый экран проекта; числа относятся к моменту снимка.", "Architecture map. Saved project screen; counts refer to the captured state.", "מפת Architecture. צילום מסך שמור; המספרים מתייחסים למועד הצילום.")},
      {src:"/projects/mission-control-knowledge.png",width:870,height:919,caption:L("Карта Knowledge. Связи сохранённых знаний проекта.", "Knowledge map. Relationships in stored project knowledge.", "מפת Knowledge. קשרים בידע הפרויקט שנשמר.")}
    ],
  },
  "uxi-course": {
    intro:L("От разрозненных тем UX/UI к последовательному пути обучения и итоговому проекту.", "From individual UX/UI topics to a structured learning path and a final project.", "מנושאי UX/UI נפרדים למסלול לימוד מובנה ולפרויקט גמר."),
    role:L("Платформа, содержание и преподавание", "Platform, content & teaching", "פלטפורמה, תוכן והוראה"),
    deliverable:L("Учебная платформа и программа вводного курса", "Learning platform & introductory curriculum", "פלטפורמת למידה ותוכנית מבוא"),
    result:L("Создана платформа с каталогом занятий и учебными материалами. Публичная страница показывает порядок тем и длительность встреч; переход к занятиям требует входа.", "Built a platform with a lesson catalog and learning material. The public page shows topic order and meeting duration; opening lessons requires sign-in.", "נבנתה פלטפורמה עם קטלוג שיעורים וחומרי לימוד. העמוד הציבורי מציג את סדר הנושאים ומשך המפגשים; פתיחת שיעורים דורשת כניסה."),
    sections:[
      {title:L("Задача","The problem","האתגר"),body:L("Начинающему дизайнеру нужен маршрут от принципов интерфейса к практике. Задача UXI — связать темы, упражнения и итоговую презентацию так, чтобы каждый этап имел понятное место в программе.", "A beginning designer needs a route from interface principles to practice. UXI connects topics, exercises and a final presentation so each stage has a clear place in the curriculum.", "מעצבים מתחילים זקוקים למסלול מעקרונות הממשק לתרגול. UXI מחבר נושאים, תרגילים והצגת גמר כך שלכל שלב יש מקום ברור בתוכנית.")},
      {title:L("Моя роль","My role","התפקיד שלי"),body:L("Разработал платформу и содержание курса. Программа соединяет визуальные основы, wireframing, прототипирование, handoff и методы UX-исследований. Преподавание и работа с проектами студентов — часть моего профессионального направления.", "Developed the course platform and content. The curriculum connects visual fundamentals, wireframing, prototyping, handoff and UX research methods. Teaching and guiding student projects are part of my professional practice.", "פיתחתי את פלטפורמת הקורס ואת התוכן. התוכנית מחברת יסודות חזותיים, wireframing, יצירת אב טיפוס, handoff ושיטות מחקר UX. הוראה וליווי פרויקטים של תלמידים הם חלק מהעבודה המקצועית שלי.")},
      {title:L("Решение: понятный порядок","Decision: a clear sequence","החלטה: רצף ברור"),body:L("Каталог выстраивает темы в учебном порядке: введение, цвет и типографика, визуальная иерархия, проектирование и исследования. Карточки показывают название, краткое содержание и длительность. В исходниках порядок занятий задан отдельно от их постоянных идентификаторов.", "The catalog puts topics in teaching order: introduction, color and typography, visual hierarchy, design and research. Cards show the title, a short description and duration. In the source, teaching order is separate from permanent lesson IDs.", "הקטלוג מסדר את הנושאים לפי רצף לימודי: מבוא, צבע וטיפוגרפיה, היררכיה חזותית, עיצוב ומחקר. הכרטיסים מציגים כותרת, תיאור קצר ומשך. בקוד, סדר הלימוד נפרד ממזהי השיעורים הקבועים.")},
      {title:L("Решение: теория ведёт к проекту","Decision: theory leads to a project","החלטה: התאוריה מובילה לפרויקט"),body:L("Подтверждённый формат вводного курса — 13 встреч по 90 минут и 14-я встреча для презентации проекта. Курс рассчитан на русский, иврит и английский. Материалы организованы по встречам, частям и модулям; это структура обучения, а не свидетельство проведённых исследований или измеренного прогресса студентов.", "The confirmed introductory format is 13 meetings of 90 minutes, followed by a 14th meeting for project presentations. The course is offered in Russian, Hebrew and English. Material is organized by meetings, parts and modules; this is the teaching structure, not evidence of completed research or measured student progress.", "המתכונת המאושרת לקורס המבוא היא 13 מפגשים של 90 דקות ומפגש 14 להצגת הפרויקט. הקורס מוצע ברוסית, בעברית ובאנגלית. החומרים מאורגנים במפגשים, חלקים ומודולים; זהו מבנה הלימוד, ולא עדות למחקר שבוצע או להתקדמות תלמידים שנמדדה.")}
    ],
    figures:[{src:"/projects/uxi-course-overview.png",width:1440,height:1000,caption:L("Публичный каталог UXI, снято 18 октября 2026. Подписи на платформе отражают её текущую версию.", "Public UXI catalog, captured 18 October 2026. Labels reflect the current platform version.", "קטלוג UXI הציבורי, צולם ב-18 באוקטובר 2026. הכיתובים משקפים את הגרסה הנוכחית של הפלטפורמה.")}],
    evidenceNote:L("Основание: публичная платформа, исходники курса и подтверждённый формат. Данные о завершении курса и результатах студентов пока не представлены.", "Evidence: the public platform, course source and confirmed format. Course completion and student outcome data have not been supplied.", "מקורות: הפלטפורמה הציבורית, קוד הקורס והמתכונת המאושרת. נתוני השלמה ותוצאות תלמידים טרם נמסרו.")
  }
};
