export function formatPatternInsights(rawPatternContext: string): string {
  if (!rawPatternContext || rawPatternContext.trim() === '') {
    return "No established behavioral patterns detected yet.";
  }
  return `Detected Behavioral Patterns:\n${rawPatternContext}`;
}
