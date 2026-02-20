/**
 * Calculate estimated reading time for a given text.
 * Uses average reading speed of ~200 words per minute.
 */
export function getReadingTime(text: string): string {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
}
