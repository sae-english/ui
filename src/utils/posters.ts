/**
 * Mapping title -> poster path in assets
 */
import friendsPoster from '@/assets/posters/friends.webp'
import interstellarPoster from '@/assets/posters/interstellar.webp'

const posterMap: Record<string, string> = {
  friends: friendsPoster,
  interstellar: interstellarPoster,
}

/**
 * Normalize title name for poster lookup (lowercase, no special chars)
 */
function normalizeTitleName(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
}

/**
 * Return poster URL for title by name.
 * If not in mapping, returns friends as default.
 */
export function getPosterForTitle(name: string): string {
  const key = normalizeTitleName(name)
  const poster = posterMap[key]
  return poster ?? friendsPoster
}
