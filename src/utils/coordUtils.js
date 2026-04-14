const EARTH_RADIUS = 6378137.0
const ORIGIN_SHIFT = Math.PI * EARTH_RADIUS

/**
 * WGS84 (经纬度) → Web Mercator (米)
 * @param {number} lon 经度
 * @param {number} lat 纬度
 * @returns {Object} {x, y}
 */
export function wgs84ToMercator(lon, lat) {
  const x = lon * ORIGIN_SHIFT / 180.0
  const y = Math.log(Math.tan((90 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0)
  const yMercator = y * ORIGIN_SHIFT / 180.0
  
  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(yMercator * 100) / 100
  }
}
/**
 * 批量转换坐标数组
 * @param {Array} coords [{x: lon, y: lat}, ...]
 * @returns {Array} [{x: mercatorX, y: mercatorY}, ...]
 */
export function batchWgs84ToMercator(coords) {
  return coords.map(c => wgs84ToMercator(c.x, c.y))
}