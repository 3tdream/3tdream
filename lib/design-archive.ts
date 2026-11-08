import { L } from "./localized";

export const ARCHIVE_GROUPS = [
  { id: "product", label: L("Продукты и веб", "Product & web", "מוצרים ואתרים") },
  { id: "games", label: L("Игры", "Games", "משחקים") },
  { id: "motion", label: L("3D и моушн", "3D & motion", "תלת־ממד ומושן") },
  { id: "marketing", label: L("Маркетинг и упаковка", "Marketing & packaging", "שיווק ואריזות") },
  { id: "other", label: L("Другие работы", "More work", "עבודות נוספות") },
] as const;

export type ArchiveGroup = (typeof ARCHIVE_GROUPS)[number]["id"];
export type ArchiveProject = {
  title: string;
  url: string;
  group: ArchiveGroup;
  collaborative?: boolean;
};

/**
 * Titles and links verified on the public 3TDream Work profile, 8 November 2026.
 * Groups are editorial navigation based only on explicit title wording.
 * Ambiguous work stays under "More work". No role, date, outcome or client claims.
 * Source inventory and access limitations: docs/design-archive-sources.md.
 */
export const DESIGN_ARCHIVE: readonly ArchiveProject[] = [
  {
    "title": "Leauge of ODDS",
    "url": "https://www.behance.net/gallery/143765943/Leauge-of-ODDS",
    "group": "other"
  },
  {
    "title": "HOF Boulevard shop feature",
    "url": "https://www.behance.net/gallery/91308059/HOF-Boulevard-shop-feature",
    "group": "other"
  },
  {
    "title": "Hot-Scores VR",
    "url": "https://www.behance.net/gallery/70269517/Hot-Scores-VR",
    "group": "other"
  },
  {
    "title": "Music Trivia Master - App",
    "url": "https://www.behance.net/gallery/86819623/Music-Trivia-Master-App",
    "group": "product"
  },
  {
    "title": "Energy Center Desktop App",
    "url": "https://www.behance.net/gallery/61151971/Energy-Center-Desktop-App",
    "group": "product"
  },
  {
    "title": "UI/UX Design",
    "url": "https://www.behance.net/gallery/22637209/UIUX-Design",
    "group": "product"
  },
  {
    "title": "Web Design",
    "url": "https://www.behance.net/gallery/22656117/Web-Design",
    "group": "product"
  },
  {
    "title": "Majestic Slots Project",
    "url": "https://www.behance.net/gallery/26961759/Majestic-Slots-Project",
    "group": "games"
  },
  {
    "title": "pinka games",
    "url": "https://www.behance.net/gallery/43351687/pinka-games",
    "group": "games"
  },
  {
    "title": "Meegz Arena_GameProject",
    "url": "https://www.behance.net/gallery/20497553/Meegz-Arena_GameProject",
    "group": "games"
  },
  {
    "title": "Ae - After Effects",
    "url": "https://www.behance.net/gallery/83601323/Ae-After-Effects",
    "group": "motion"
  },
  {
    "title": "Frenzy Casino Video Banner",
    "url": "https://www.behance.net/gallery/49024457/Frenzy-Casino-Video-Banner",
    "group": "motion"
  },
  {
    "title": "3D DEMO Mattress",
    "url": "https://www.behance.net/gallery/21932233/3D-DEMO-Mattress",
    "group": "motion"
  },
  {
    "title": "Lowpoly",
    "url": "https://www.behance.net/gallery/31778259/Lowpoly",
    "group": "motion"
  },
  {
    "title": "Casino Marketing Design",
    "url": "https://www.behance.net/gallery/28896829/Casino-Marketing-Design",
    "group": "marketing"
  },
  {
    "title": "Package Design",
    "url": "https://www.behance.net/gallery/38724913/Package-Design",
    "group": "marketing"
  },
  {
    "title": "BB_CRDS_Pack",
    "url": "https://www.behance.net/gallery/221353919/BB_CRDS_Pack",
    "group": "other"
  },
  {
    "title": "VShapeJewelry",
    "url": "https://www.behance.net/gallery/97421149/VShapeJewelry",
    "group": "other",
    "collaborative": true
  },
  {
    "title": "WorkChallenge",
    "url": "https://www.behance.net/gallery/71283917/WorkChallenge",
    "group": "other"
  },
  {
    "title": "Leaderbord slide",
    "url": "https://www.behance.net/gallery/74100697/Leaderbord-slide",
    "group": "other"
  },
  {
    "title": "CyberMonday",
    "url": "https://www.behance.net/gallery/59008597/CyberMonday",
    "group": "other"
  },
  {
    "title": "Wheel of Fortune",
    "url": "https://www.behance.net/gallery/23445537/Wheel-of-Fortune",
    "group": "other"
  },
  {
    "title": "HYDRANTECH",
    "url": "https://www.behance.net/gallery/89831783/HYDRANTECH",
    "group": "other"
  },
  {
    "title": "The Cloud for Modern Business",
    "url": "https://www.behance.net/gallery/26744405/The-Cloud-for-Modern-Business",
    "group": "other"
  },
  {
    "title": "Level Cleared",
    "url": "https://www.behance.net/gallery/51890101/Level-Cleared",
    "group": "other"
  },
  {
    "title": "Coca-Cola MINI project",
    "url": "https://www.behance.net/gallery/17689803/Coca-Cola-MINI-project",
    "group": "other"
  },
  {
    "title": "Diamonds",
    "url": "https://www.behance.net/gallery/34581427/Diamonds",
    "group": "other"
  },
  {
    "title": "GIRAFFE_Project",
    "url": "https://www.behance.net/gallery/20271955/GIRAFFE_Project",
    "group": "other"
  },
  {
    "title": "Honda New Civic",
    "url": "https://www.behance.net/gallery/15147945/Honda-New-Civic",
    "group": "other"
  },
  {
    "title": "Indigo - Final Project 2011",
    "url": "https://www.behance.net/gallery/11885381/Indigo-Final-Project-2011",
    "group": "other"
  },
  {
    "title": "Covid-19 VS Humanity",
    "url": "https://www.behance.net/gallery/95247439/Covid-19-VS-Humanity",
    "group": "other"
  },
  {
    "title": "3Design",
    "url": "https://www.behance.net/gallery/11514231/3Design",
    "group": "other"
  },
  {
    "title": "Tadiran Group",
    "url": "https://www.behance.net/gallery/16154117/Tadiran-Group",
    "group": "other"
  },
  {
    "title": "Hand made",
    "url": "https://www.behance.net/gallery/11495031/Hand-made",
    "group": "other"
  }
];

export const ARCHIVE_COPY = {
  all: L("Все работы", "All work", "כל העבודות"),
  search: L("Поиск по названию", "Search by title", "חיפוש לפי שם"),
  placeholder: L("Например, Energy Center или Lowpoly", "Try Energy Center or Lowpoly", "למשל Energy Center או Lowpoly"),
  filters: L("Фильтр по теме", "Filter by subject", "סינון לפי נושא"),
  shown: L("Показано", "Showing", "מוצגות"),
  reset: L("Сбросить фильтры", "Reset filters", "איפוס סינון"),
  empty: L("Работ с таким названием не найдено. Измените запрос или сбросьте фильтры.", "No matching projects. Try another title or reset the filters.", "לא נמצאו פרויקטים תואמים. נסו שם אחר או אפסו את הסינון."),
  collaborative: L("Совместный проект", "Collaborative project", "פרויקט משותף"),
  profile: L("Все работы на Behance", "All work on Behance", "כל העבודות ב-Behance"),
};

export function filterArchive(query: string, group: ArchiveGroup | "all" = "all") {
  const search = query.trim().toLocaleLowerCase();
  return DESIGN_ARCHIVE.filter(project =>
    (group === "all" || project.group === group) &&
    project.title.toLocaleLowerCase().includes(search)
  );
}
