const iconTypeMap = new Map([['swap', 'Swap']]);

export default function mapIconType(iconType: string | null) {
  if (!iconType) return undefined;
  return iconTypeMap.get(iconType);
}
