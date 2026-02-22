// Naver Maps JavaScript API Type Definitions
// Based on Naver Maps v3

declare global {
  namespace naver {
    namespace maps {
      // Core Classes
      class Map {
        constructor(mapDiv: string | HTMLElement, mapOptions: MapOptions);
        setCenter(center: LatLng | LatLngLiteral): void;
        getCenter(): LatLng;
        setZoom(zoom: number, animate?: boolean): void;
        getZoom(): number;
        setMapTypeId(mapTypeId: MapTypeId): void;
        getMapTypeId(): MapTypeId;
        setSize(size: Size | SizeLiteral): void;
        getSize(): Size;
        setBounds(bounds: LatLngBounds | LatLngBoundsLiteral, animate?: boolean): void;
        getBounds(): LatLngBounds;
        fitBounds(
          bounds: LatLngBounds | LatLngBoundsLiteral,
          margin?: number | Margin,
          animate?: boolean
        ): void;
        panBy(offset: Point | PointLiteral): void;
        panTo(latlng: LatLng | LatLngLiteral, animate?: boolean): void;
        addListener(eventName: string, listener: (...args: unknown[]) => void): MapEventListener;
        removeListener(listeners: MapEventListener | MapEventListener[]): void;
        trigger(eventName: string, ...eventObject: unknown[]): void;
        destroy(): void;
        setOptions(key: string, value: unknown): void;
        setOptions(options: Partial<MapOptions>): void;
        getOptions(key?: string): unknown;
        getProjection(): Projection;
        getPanes(): MapPanes;
      }

      class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
        equals(latlng: LatLng): boolean;
        toString(): string;
        toUrlValue(precision?: number): string;
        clone(): LatLng;
      }

      class LatLngBounds {
        constructor(sw: LatLng | LatLngLiteral, ne: LatLng | LatLngLiteral);
        getSouthWest(): LatLng;
        getNorthEast(): LatLng;
        getCenter(): LatLng;
        hasLatLng(latlng: LatLng): boolean;
        extend(latlng: LatLng): LatLngBounds;
        union(bounds: LatLngBounds): LatLngBounds;
        intersects(bounds: LatLngBounds): boolean;
        equals(bounds: LatLngBounds): boolean;
        toString(): string;
        clone(): LatLngBounds;
      }

      // Markers
      class Marker {
        constructor(options: MarkerOptions);
        setMap(map: Map | null): void;
        getMap(): Map | null;
        setPosition(position: LatLng | LatLngLiteral): void;
        getPosition(): LatLng;
        setTitle(title: string): void;
        getTitle(): string;
        setIcon(icon: string | MarkerImage | SymbolIcon | HtmlIcon): void;
        getIcon(): string | MarkerImage | SymbolIcon | HtmlIcon;
        setShape(shape: MarkerShape): void;
        getShape(): MarkerShape;
        setDraggable(draggable: boolean): void;
        getDraggable(): boolean;
        setVisible(visible: boolean): void;
        getVisible(): boolean;
        setZIndex(zIndex: number): void;
        getZIndex(): number;
        setAnimation(animation: Animation): void;
        getAnimation(): Animation;
        addListener(eventName: string, listener: (...args: unknown[]) => void): MapEventListener;
        removeListener(listeners: MapEventListener | MapEventListener[]): void;
      }

      class MarkerImage {
        constructor(imageSrc: string, size?: Size | SizeLiteral, options?: MarkerImageOptions);
      }

      // Overlays
      class InfoWindow {
        constructor(options: InfoWindowOptions);
        open(map: Map, anchor?: LatLng | Marker | LatLngLiteral): void;
        close(): void;
        getMap(): Map | null;
        setPosition(position: LatLng | LatLngLiteral): void;
        getPosition(): LatLng;
        setContent(content: string | HTMLElement): void;
        getContent(): string | HTMLElement;
        setZIndex(zIndex: number): void;
        getZIndex(): number;
        setOptions(key: string, value: unknown): void;
        setOptions(options: Partial<InfoWindowOptions>): void;
        getOptions(key?: string): unknown;
      }

      // Services
      class Service {
        static geocode(
          options: GeocodeOptions,
          callback: (status: ServiceStatus, response: GeocodeResponse) => void
        ): void;
        static reverseGeocode(
          options: ReverseGeocodeOptions,
          callback: (status: ServiceStatus, response: ReverseGeocodeResponse) => void
        ): void;
      }

      // Utility Classes
      class Size {
        constructor(width: number, height: number);
        width(): number;
        height(): number;
        equals(size: Size): boolean;
        toString(): string;
        clone(): Size;
      }

      class Point {
        constructor(x: number, y: number);
        x(): number;
        y(): number;
        equals(point: Point): boolean;
        toString(): string;
        clone(): Point;
      }

      // Enums and Constants
      enum MapTypeId {
        NORMAL = 'normal',
        TERRAIN = 'terrain',
        SATELLITE = 'satellite',
        HYBRID = 'hybrid',
      }

      enum Animation {
        BOUNCE = 1,
        DROP = 2,
      }

      enum ServiceStatus {
        OK = 200,
        ERROR = 500,
      }

      // Literal Types
      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      interface SizeLiteral {
        width: number;
        height: number;
      }

      interface PointLiteral {
        x: number;
        y: number;
      }

      interface Margin {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
      }

      // Options Interfaces
      interface MapOptions {
        center: LatLng | LatLngLiteral;
        zoom?: number;
        mapTypeId?: MapTypeId;
        size?: Size | SizeLiteral;
        background?: string;
        baseTileOpacity?: number;
        disableDoubleTapZoom?: boolean;
        disableDoubleClickZoom?: boolean;
        disableTwoFingerTapZoom?: boolean;
        draggable?: boolean;
        keyboardShortcuts?: boolean;
        logoControl?: boolean;
        logoControlOptions?: LogoControlOptions;
        mapDataControl?: boolean;
        mapDataControlOptions?: MapDataControlOptions;
        mapTypeControl?: boolean;
        mapTypeControlOptions?: MapTypeControlOptions;
        maxBounds?: LatLngBounds | LatLngBoundsLiteral;
        maxZoom?: number;
        minZoom?: number;
        padding?: Margin;
        pinchZoom?: boolean;
        resizeOrigin?: Position;
        scaleControl?: boolean;
        scaleControlOptions?: ScaleControlOptions;
        scrollWheel?: boolean;
        tileSpare?: number;
        tileTransition?: boolean;
        zoomControl?: boolean;
        zoomControlOptions?: ZoomControlOptions;
        zoomOrigin?: LatLng | LatLngLiteral;
      }

      interface MarkerOptions {
        position: LatLng | LatLngLiteral;
        map?: Map;
        icon?: string | MarkerImage | SymbolIcon | HtmlIcon;
        shape?: MarkerShape;
        title?: string;
        draggable?: boolean;
        visible?: boolean;
        zIndex?: number;
        animation?: Animation;
      }

      interface MarkerImageOptions {
        size?: Size | SizeLiteral;
        anchor?: Point | PointLiteral;
        origin?: Point | PointLiteral;
      }

      interface InfoWindowOptions {
        content: string | HTMLElement;
        position?: LatLng | LatLngLiteral;
        zIndex?: number;
        maxWidth?: number;
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
        anchorSize?: Size | SizeLiteral;
        anchorSkew?: boolean;
        pixelOffset?: Point | PointLiteral;
      }

      interface MarkerShape {
        coords: number[];
        type: string;
      }

      interface SymbolIcon {
        path: SymbolPath | string;
        style?: SymbolStyle;
        anchor?: Point | PointLiteral;
      }

      interface HtmlIcon {
        content: string | HTMLElement;
        size?: Size | SizeLiteral;
        anchor?: Point | PointLiteral;
      }

      interface SymbolStyle {
        fillColor?: string;
        fillOpacity?: number;
        strokeColor?: string;
        strokeOpacity?: number;
        strokeWeight?: number;
      }

      // Service Types
      interface GeocodeOptions {
        query: string;
        coordinate?: string;
        filter?: string;
        language?: string;
      }

      interface ReverseGeocodeOptions {
        coords: LatLng | LatLngLiteral;
        orders?: string;
        language?: string;
      }

      interface GeocodeResponse {
        result: {
          items: GeocodeResultItem[];
          total: number;
          userquery: string;
        };
      }

      interface ReverseGeocodeResponse {
        result: {
          items: ReverseGeocodeResultItem[];
          total: number;
        };
      }

      interface GeocodeResultItem {
        address: string;
        addrdetail: AddrDetail;
        isAdmAddress: boolean;
        isRoadAddress: boolean;
        point: Point;
      }

      interface ReverseGeocodeResultItem {
        address: string;
        addrdetail: AddrDetail;
        land: Land;
        point: Point;
      }

      interface AddrDetail {
        country: string;
        sido: string;
        sigugun: string;
        dongmyun: string;
        ri: string;
        rest: string;
      }

      interface Land {
        type: string;
        number1: string;
        number2: string;
        addition0: Addition;
        addition1: Addition;
        addition2: Addition;
        addition3: Addition;
        addition4: Addition;
        name: string;
      }

      interface Addition {
        type: string;
        value: string;
      }

      // Control Options
      interface LogoControlOptions {
        position: Position;
      }

      interface MapDataControlOptions {
        position: Position;
      }

      interface MapTypeControlOptions {
        position: Position;
        mapTypeIds?: MapTypeId[];
      }

      interface ScaleControlOptions {
        position: Position;
      }

      interface ZoomControlOptions {
        position: Position;
        style: ZoomControlStyle;
      }

      enum Position {
        TOP_LEFT = 0,
        TOP_CENTER = 1,
        TOP_RIGHT = 2,
        LEFT_CENTER = 3,
        CENTER = 4,
        RIGHT_CENTER = 5,
        BOTTOM_LEFT = 6,
        BOTTOM_CENTER = 7,
        BOTTOM_RIGHT = 8,
      }

      enum ZoomControlStyle {
        LARGE = 0,
        SMALL = 1,
      }

      enum SymbolPath {
        BACKWARD_CLOSED_ARROW = 1,
        BACKWARD_OPEN_ARROW = 2,
        CIRCLE = 3,
        FORWARD_CLOSED_ARROW = 4,
        FORWARD_OPEN_ARROW = 5,
      }

      // Event Types
      interface MapEventListener {
        eventName: string;
        listener: (...args: unknown[]) => void;
        listenerId: string;
      }

      // Projection and Panes
      interface Projection {
        fromCoordToPoint(coord: LatLng): Point;
        fromPointToCoord(point: Point): LatLng;
      }

      interface MapPanes {
        overlayLayer: HTMLElement;
        overlayImage: HTMLElement;
        overlayShadow: HTMLElement;
        floatPane: HTMLElement;
        markerLayer: HTMLElement;
        markerShadow: HTMLElement;
        infoWindow: HTMLElement;
      }
    }
  }

  interface Window {
    naver: typeof naver;
  }
}

export {};
