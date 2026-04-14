import { onUnmounted } from 'vue'
import * as Cesium from 'cesium'

export function useCesiumClick(viewer, callback) {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  
  handler.setInputAction((click) => {
    const cartesian = viewer.camera.pickEllipsoid(
      click.position, 
      viewer.scene.globe.ellipsoid
    )
    
    if (cartesian && callback) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      callback({
        lon: Cesium.Math.toDegrees(cartographic.longitude),
        lat: Cesium.Math.toDegrees(cartographic.latitude),
        cartesian: cartesian
      })
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  
  // 清理
  onUnmounted(() => {
    handler.destroy()
  })
  
  return handler
}