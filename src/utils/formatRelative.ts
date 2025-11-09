import { DateTime } from "luxon";

export const formatRelative = (timestamp: number) => {
  return DateTime.fromMillis(timestamp).toRelative({ base: DateTime.now() }) ?? "just now";
};

