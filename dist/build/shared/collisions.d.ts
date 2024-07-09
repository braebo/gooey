/**
 * Represents a dom element's bounding rectangle.
 */
export type VirtualRect = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};
/**
 * Checks for collision with {@link obstacleEls obstacles} to determine the maximum distance
 * the draggable can move in the x direction.
 *
 * @returns The maximum distance the draggable can move in the x direction (`deltaX`) before
 * colliding with an obstacle.  If no collision is detected, the full distance (`targetX`)
 * is returned.  If the draggable is already colliding with an obstacle, `0` is returned.
 */
export declare const collisionClampX: (deltaX: number, nodeRect: VirtualRect, obstacles: Array<HTMLElement>) => number;
export declare const collisionClampY: (deltaY: number, nodeRect: VirtualRect, obstacles: Array<HTMLElement>) => number;
