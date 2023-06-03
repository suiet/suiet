import { Gray_400, tailwindMap } from '@/styles/colors';
import type { TailwindColor } from '@/styles/colors';

export function getColorClassName(color: string | null | undefined) {
  if (!color) return 'text-gray-400';
  if (color.startsWith('text-') || color.startsWith('bg-')) return color;
  return `text-${color}-500`;
}

export function resolveColor(color: string | null | undefined) {
  return tailwindMap[getColorClassName(color) as TailwindColor] || Gray_400;
}
