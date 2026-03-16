declare namespace AMap {
  class Map {
    constructor(container: string | HTMLElement, opts?: object)
    on(event: string, handler: (e: unknown) => void): void
    setCenter(center: [number, number]): void
    remove(obj: unknown): void
    destroy(): void
  }
  class Marker {
    constructor(opts: { position: [number, number]; map: Map })
  }
  class PlaceSearch {
    constructor(opts: object)
    search(keyword: string, callback: (status: string, result: unknown) => void): void
    on(event: string, handler: (e: unknown) => void): void
  }
  class Geocoder {
    getAddress(lnglat: [number, number]): Promise<{
      regeocode?: {
        formattedAddress?: string
        addressComponent?: { streetNumber?: { street?: string } }
      }
    }>
  }
  interface LngLat {
    lng: number
    lat: number
  }
}
