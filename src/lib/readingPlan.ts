import { BIBLE_BOOKS_ORDER, CHAPTERS_PER_BOOK } from './bibleBooks';

export type ChapterRef = { livro: string; capitulo: number };
export type DailyReading = { dayIndex: number; chapters: ChapterRef[] };

const TOTAL_DAYS = 365;

function buildAllChapters(): ChapterRef[] {
  const arr: ChapterRef[] = [];
  for (const book of BIBLE_BOOKS_ORDER) {
    const total = CHAPTERS_PER_BOOK[book] || 0;
    for (let c = 1; c <= total; c++) arr.push({ livro: book, capitulo: c });
  }
  return arr;
}

export function generateYearPlan(startDateIso?: string): DailyReading[] {
  const all = buildAllChapters(); // 1189 caps
  const totalCaps = all.length;
  const basePerDay = Math.floor(totalCaps / TOTAL_DAYS); // 3
  const extras = totalCaps - basePerDay * TOTAL_DAYS;   // 1189 - 3*365 = 94

  const plan: DailyReading[] = [];
  let cursor = 0;
  for (let day = 0; day < TOTAL_DAYS; day++) {
    const needsExtra = day < extras; // distribui extras do início ao fim
    const qty = basePerDay + (needsExtra ? 1 : 0);
    const chapters = all.slice(cursor, cursor + qty);
    plan.push({ dayIndex: day, chapters });
    cursor += qty;
  }
  return plan;
}

export function dayIndexFromStart(startIso: string, at: Date = new Date()): number {
  const [y, m, d] = startIso.split('-').map(Number);
  const start = new Date(y!, (m! - 1), d!, 0, 0, 0, 0);
  const diff = at.getTime() - start.getTime();
  return Math.max(0, Math.min(TOTAL_DAYS - 1, Math.floor(diff / (1000 * 60 * 60 * 24))));
}

export function getTodayKey(startIso: string): string {
  return String(dayIndexFromStart(startIso));
}
