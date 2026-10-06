import { marked } from 'marked';

/**
 * Strips markdown symbols for plain text contexts (clipboard, map search, search filters).
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Renders inline markdown (bold, italic, links, code) to safe HTML.
 */
export function renderInlineMarkdown(text: string): string {
  if (!text) return '';
  try {
    const rawHtml = marked.parseInline(text, {
      gfm: true,
      breaks: true,
    }) as string;

    // Ensure links open in new tab and don't navigate away
    return rawHtml.replace(/<a\s+(?!.*?target=)/g, '<a target="_blank" rel="noopener noreferrer" class="text-orange-600 underline hover:text-orange-700" ');
  } catch {
    return text;
  }
}
