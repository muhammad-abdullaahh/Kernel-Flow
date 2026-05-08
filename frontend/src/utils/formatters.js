/**
 * Format a time value (ms or unit) for display.
 */
export const formatTime = (value, unit = "ms") =>
  `${Number(value).toFixed(2)} ${unit}`;

/**
 * Format a percentage value.
 */
export const formatPercent = (value) =>
  `${Number(value).toFixed(1)}%`;

/**
 * Format throughput (processes/unit time).
 */
export const formatThroughput = (value) =>
  `${Number(value).toFixed(4)} proc/ms`;

/**
 * Map algorithm ID to a human-readable label.
 */
export const algoLabel = (id) => ({
  fcfs:        "First Come First Served",
  sjf:         "Shortest Job First",
  srtf:        "Shortest Remaining Time First",
  rr:          "Round Robin",
  priority_p:  "Priority (Preemptive)",
  priority_np: "Priority (Non-Preemptive)",
}[id] ?? id.toUpperCase());

/**
 * Return a Tailwind colour class based on process state.
 */
export const stateColor = (state) => ({
  new:        "text-blue-400",
  ready:      "text-yellow-400",
  running:    "text-green-400",
  waiting:    "text-orange-400",
  terminated: "text-gray-500",
}[state] ?? "text-gray-400");
