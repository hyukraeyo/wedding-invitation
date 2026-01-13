// Kakao Maps JavaScript API Type Definitions
// Based on Kakao Maps SDK v1.0+

declare global {
    namespace kakao {
        namespace maps {
            // Core Classes
            class Map {
                constructor(container: HTMLElement, options: MapOptions);
                setCenter(latlng: LatLng): void;
                getCenter(): LatLng;
                setLevel(level: number): void;
                getLevel(): number;
                setMapTypeId(mapTypeId: MapTypeId): void;
                addControl(control: MapTypeControl | ZoomControl, position: ControlPosition): void;
                setDraggable(draggable: boolean): void;
                setZoomable(zoomable: boolean): void;
                panBy(dx: number, dy: number): void;
                panTo(latlng: LatLng): void;
                relayout(): void;
                addOverlayMapTypeId(mapTypeId: MapTypeId): void;
                removeOverlayMapTypeId(mapTypeId: MapTypeId): void;
                setBounds(bounds: LatLngBounds): void;
                getBounds(): LatLngBounds;
            }

            class LatLng {
                constructor(lat: number, lng: number);
                getLat(): number;
                getLng(): number;
                equals(latlng: LatLng): boolean;
                toString(): string;
            }

            class LatLngBounds {
                constructor(sw: LatLng, ne: LatLng);
                contain(latlng: LatLng): boolean;
                extend(latlng: LatLng): void;
                getSouthWest(): LatLng;
                getNorthEast(): LatLng;
                toString(): string;
            }

            // Markers
            class Marker {
                constructor(options: MarkerOptions);
                setMap(map: Map | null): void;
                getPosition(): LatLng;
                setPosition(position: LatLng): void;
                setTitle(title: string): void;
                getTitle(): string;
                setImage(image: MarkerImage): void;
                setZIndex(zIndex: number): void;
                setVisible(visible: boolean): void;
                getVisible(): boolean;
            }

            class MarkerImage {
                constructor(src: string, size: Size, options?: MarkerImageOptions);
            }

            // Controls
            class MapTypeControl { }
            class ZoomControl { }

            // Enums and Constants
            enum MapTypeId {
                ROADMAP = 1,
                SKYVIEW = 2,
                HYBRID = 3,
                ROADVIEW = 4,
                OVERLAY = 5,
                TRAFFIC = 6,
                TERRAIN = 7,
                BICYCLE = 8,
                BICYCLE_HYBRID = 9,
                USE_DISTRICT = 10
            }

            enum ControlPosition {
                TOPLEFT = 0,
                TOP = 1,
                TOPRIGHT = 2,
                LEFT = 3,
                CENTER = 4,
                RIGHT = 5,
                BOTTOMLEFT = 6,
                BOTTOM = 7,
                BOTTOMRIGHT = 8
            }

            // Options Interfaces
            interface MapOptions {
                center: LatLng;
                level?: number;
                mapTypeId?: MapTypeId;
                draggable?: boolean;
                scrollwheel?: boolean;
                disableDoubleClick?: boolean;
                disableDoubleClickZoom?: boolean;
                projectionId?: string;
                tileAnimation?: boolean;
                keyboardShortcuts?: boolean;
            }

            interface MarkerOptions {
                map?: Map;
                position: LatLng;
                image?: MarkerImage;
                title?: string;
                draggable?: boolean;
                clickable?: boolean;
                zIndex?: number;
                opacity?: number;
                altitude?: number;
                range?: number;
            }

            interface MarkerImageOptions {
                alt?: string;
                coords?: string;
                offset?: Point;
                shape?: string;
                spriteOrigin?: Point;
                spriteSize?: Size;
            }

            // Utility Classes
            class Size {
                constructor(width: number, height: number);
                equals(size: Size): boolean;
                toString(): string;
            }

            class Point {
                constructor(x: number, y: number);
                equals(point: Point): boolean;
                toString(): string;
            }

            // Services
            class services {
                static Geocoder: typeof Geocoder;
                static Places: typeof Places;
                static Status: {
                    OK: GeocoderStatus.OK;
                    ZERO_RESULT: GeocoderStatus.ZERO_RESULT;
                    ERROR: GeocoderStatus.ERROR;
                };
            }

            class Geocoder {
                addressSearch(
                    address: string,
                    callback: (result: GeocoderResult[], status: GeocoderStatus) => void,
                    options?: GeocoderOptions
                ): void;
                coord2Address(
                    coords: LatLng,
                    callback: (result: GeocoderResult[], status: GeocoderStatus) => void,
                    options?: GeocoderOptions
                ): void;
            }

            class Places {
                keywordSearch(
                    keyword: string,
                    callback: (result: PlacesSearchResult[], status: PlacesSearchStatus, pagination: Pagination) => void,
                    options?: PlacesSearchOptions
                ): void;
            }

            // Service Types
            interface GeocoderResult {
                address: Address;
                address_name: string;
                address_type: string;
                road_address: RoadAddress | null;
                x: string;
                y: string;
            }

            interface Address {
                address_name: string;
                region_1depth_name: string;
                region_2depth_name: string;
                region_3depth_name: string;
                mountain_yn: string;
                main_address_no: string;
                sub_address_no: string;
                zip_code: string;
            }

            interface RoadAddress {
                address_name: string;
                region_1depth_name: string;
                region_2depth_name: string;
                region_3depth_name: string;
                road_name: string;
                underground_yn: string;
                main_building_no: string;
                sub_building_no: string;
                building_name: string;
                zone_no: string;
            }

            interface PlacesSearchResult {
                id: string;
                place_name: string;
                category_name: string;
                category_group_code: string;
                category_group_name: string;
                phone: string;
                address_name: string;
                road_address_name: string;
                x: string;
                y: string;
                place_url: string;
                distance: string;
            }

            interface Pagination {
                totalCount: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
                current: number;
                first: number;
                last: number;
                gotoFirst: () => void;
                gotoLast: () => void;
                gotoPage: (page: number) => void;
                nextPage: () => void;
                prevPage: () => void;
            }

            // Options
            interface GeocoderOptions {
                page?: number;
                size?: number;
            }

            interface PlacesSearchOptions {
                category_group_code?: string;
                x?: number;
                y?: number;
                radius?: number;
                rect?: string;
                page?: number;
                size?: number;
                sort?: string;
            }

            // Status Enums
            enum GeocoderStatus {
                OK = "OK",
                ZERO_RESULT = "ZERO_RESULT",
                ERROR = "ERROR"
            }

            enum PlacesSearchStatus {
                OK = "OK",
                ZERO_RESULT = "ZERO_RESULT",
                ERROR = "ERROR"
            }
        }
    }

    interface Window {
        kakao: typeof kakao;
        // Kakao SDK types - using unknown for the SDK to satisfy strict type checking
        Kakao: {
            init: (key: string) => void;
            isInitialized: () => boolean;
            Share?: {
                sendDefault: (options: KakaoShareOptions) => void;
            };
            Link?: {
                sendDefault: (options: KakaoShareOptions) => void;
            };
        };
    }

    interface KakaoShareOptions {
        objectType: 'feed' | 'list' | 'location' | 'commerce' | 'text';
        content: {
            title: string;
            description?: string;
            imageUrl?: string;
            link: {
                mobileWebUrl?: string;
                webUrl?: string;
            };
        };
        buttons?: Array<{
            title: string;
            link: {
                mobileWebUrl?: string;
                webUrl?: string;
            };
        }>;
    }
}

export { };
