// /**
//  * Represents a dom element's bounding rectangle.
//  */
// export type VirtualRect = {
// 	left: number
// 	top: number
// 	right: number
// 	bottom: number
// }

// /**
//  * Checks for collision with {@link obstacleEls obstacles} to determine the maximum distance
//  * the draggable can move in the x direction.
//  *
//  * @returns The maximum distance the draggable can move in the x direction (`deltaX`) before
//  * colliding with an obstacle.  If no collision is detected, the full distance (`targetX`)
//  * is returned.  If the draggable is already colliding with an obstacle, `0` is returned.
//  */
// export const collisionClampX = (
// 	deltaX: number,
// 	nodeRect: VirtualRect,
// 	obstacles: Array<HTMLElement>,
// ) => {
// 	const { top, bottom, left, right } = nodeRect
// 	// Moving right.
// 	if (deltaX > 0) {
// 		for (let i = 0; i < obstacles.length; i++) {
// 			const o = obstacles[i].getBoundingClientRect()

// 			// too high || too low || already passed || unreachable with delta
// 			if (top > o.bottom || bottom < o.top || right > o.left) continue

// 			deltaX = Math.min(deltaX, o.left - right)
// 		}
// 	} else {
// 		for (let i = 0; i < obstacles.length; i++) {
// 			const o = obstacles[i].getBoundingClientRect()

// 			// too high || too low || already passed || unreachable with delta
// 			if (top > o.bottom || bottom < o.top || left < o.right) continue

// 			deltaX = Math.max(deltaX, o.right - left)
// 		}
// 	}
// 	return deltaX
// }

// export const collisionClampY = (
// 	deltaY: number,
// 	nodeRect: VirtualRect,
// 	obstacles: Array<HTMLElement>,
// ) => {
// 	const { top, bottom, left, right } = nodeRect

// 	if (deltaY > 0) {
// 		// Moving down.
// 		for (let i = 0; i < obstacles.length; i++) {
// 			const o = obstacles[i].getBoundingClientRect()

// 			// too far left || too far right || already passed || unreachable with delta
// 			if (left > o.right || right < o.left || bottom > o.top) continue

// 			deltaY = Math.min(deltaY, o.top - bottom)
// 		}
// 	} else {
// 		// Moving up.
// 		for (let i = 0; i < obstacles.length; i++) {
// 			const o = obstacles[i].getBoundingClientRect()
// 			// too far left || too far right || already passed || unreachable with delta
// 			if (left > o.right || right < o.left || top < o.bottom) continue
// 			deltaY = Math.max(deltaY, o.bottom - top)
// 		}
// 	}
// 	return deltaY
// }
