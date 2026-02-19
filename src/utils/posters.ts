/**
 * Маппинг title -> путь к постеру в assets
 */
import friendsPoster from '@/assets/posters/friends.webp'
import interstellarPoster from '@/assets/posters/interstellar.webp'

const posterMap: Record<string, string> = {
  friends: friendsPoster,
  interstellar: interstellarPoster,
}

/**
 * Нормализует имя title для поиска постера (lowercase, без спецсимволов)
 */
function normalizeTitleName(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
}

/**
 * Возвращает URL постера для title по имени.
 * Если постера нет в маппинге — возвращает friends по умолчанию.
 */
export function getPosterForTitle(name: string): string {
  const key = normalizeTitleName(name)
  const poster = posterMap[key]
  return poster ?? friendsPoster
}
