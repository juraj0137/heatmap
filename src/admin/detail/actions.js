export const HEATMAP_WIDTH = 'HEATMAP_WIDTH';
export const HEATMAP_HEIGHT = 'HEATMAP_HEIGHT';
export const VIEW_TYPE_MOVEMENTS = 'VIEW_TYPE_MOVEMENTS';
export const VIEW_TYPE_CLICKS = 'VIEW_TYPE_CLICKS';

export function setWidth(width) {
    return {
        type: HEATMAP_WIDTH,
        width: width
    };
}
export function setHeight(height) {
    return {
        type: HEATMAP_HEIGHT,
        height: height
    };
}

export function setViewTypeMovements() {
    return {
        type: VIEW_TYPE_MOVEMENTS
    };
}
export function setViewTypeClicks() {
    return {
        type: VIEW_TYPE_CLICKS
    };
}