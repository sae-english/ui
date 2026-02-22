/** Series from backend. Backend: GET /api/series/titles?limit=N */
export interface SeriesDto {
  /** Backend may return id or titleId; used for /titles/:titleId/episodes */
  titleId: number
  name: string
  director: string
  year: number
}
