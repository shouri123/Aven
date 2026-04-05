export function formatMemoryContext(userName: string, rawMemoryContext: string): string {
  if (!rawMemoryContext || rawMemoryContext.trim() === '') {
    return `${userName} is speaking to you for the first time. Welcome them.`;
  }
  return `Historical Memory for ${userName}:\n${rawMemoryContext}`;
}
