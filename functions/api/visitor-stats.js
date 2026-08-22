import {
  getPerthWeekStart,
  jsonResponse,
  shiftDate,
} from "../../server/visitor-store.js";

export async function onRequestGet({ env }) {
  if (!env.VISITOR_DB) {
    return jsonResponse({ error: "Visitor counter unavailable." }, { status: 503 });
  }

  const currentWeekStart = getPerthWeekStart();
  const previousWeekStart = shiftDate(currentWeekStart, -7);
  const result = await env.VISITOR_DB.prepare(
    "SELECT week_start, COUNT(*) AS unique_visitors FROM weekly_visitors WHERE week_start IN (?, ?) GROUP BY week_start",
  )
    .bind(currentWeekStart, previousWeekStart)
    .all();

  const totals = new Map(
    result.results.map((row) => [row.week_start, Number(row.unique_visitors)]),
  );

  return jsonResponse({
    currentWeek: {
      start: currentWeekStart,
      end: shiftDate(currentWeekStart, 6),
      visitors: totals.get(currentWeekStart) ?? 0,
    },
    previousWeek: {
      start: previousWeekStart,
      end: shiftDate(previousWeekStart, 6),
      visitors: totals.get(previousWeekStart) ?? 0,
    },
    updatedAt: new Date().toISOString(),
  });
}

export function onRequest() {
  return jsonResponse({ error: "Method not allowed." }, { status: 405 });
}
