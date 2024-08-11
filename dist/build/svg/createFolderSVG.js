import { defer } from '../shared/defer.js';
import { nanoid } from '../shared/nanoid.js';

// import { create } from '../shared/create'
function createFolderSvg(folder) {
    const strokeWidth = 1;
    const x = 12;
    const y = 12;
    const r = 4;
    const fill = 'var(--gooey-theme-a)';
    const theme = 'var(--gooey-theme-a)';
    const icon = document.createElement('div');
    icon.classList.add('gooey-folder-icon-container');
    const count = folder.allChildren.length + folder.inputs.size;
    icon.style.setProperty('filter', `hue-rotate(${folder.hue}deg)`);
    const circs = [
        { id: 1, cx: 16.43, cy: 11.93, r: 1.1103 },
        { id: 2, cx: 15.13, cy: 15.44, r: 0.8081 },
        { id: 3, cx: 15.13, cy: 8.423, r: 0.8081 },
        { id: 4, cx: 12.49, cy: 16.05, r: 0.4788 },
        { id: 5, cx: 12.42, cy: 7.876, r: 0.545 },
        { id: 6, cx: 10.43, cy: 15.43, r: 0.2577 },
        { id: 7, cx: 10.43, cy: 8.506, r: 0.2769 },
        { id: 8, cx: 17.85, cy: 14.59, r: 0.5635 },
        { id: 9, cx: 17.85, cy: 9.295, r: 0.5635 },
        { id: 10, cx: 19.19, cy: 12.95, r: 0.5635 },
        { id: 11, cx: 19.19, cy: 10.9, r: 0.5635 },
        { id: 12, cx: 20.38, cy: 11.96, r: 0.2661 },
        { id: 13, cx: 19.74, cy: 14.07, r: 0.2661 },
        { id: 14, cx: 19.74, cy: 9.78, r: 0.2661 },
        { id: 15, cx: 20.7, cy: 12.96, r: 0.2661 },
        { id: 16, cx: 20.7, cy: 10.9, r: 0.2661 },
        { id: 17, cx: 21.38, cy: 11.96, r: 0.2661 },
    ];
    function circ(c) {
        return /*html*/ `<circle
				class="alt c${c.id}"
				cx="${c.cx * 1.1}"
				cy="${c.cy}"
				r="${c.r}"
				style="transition-delay: ${c.id * 0.05}s;"
			/>`;
    }
    function toCircs(ids) {
        return ids.map(id => circ(circs[id - 1])).join('\n');
    }
    const circMap = {
        0: [],
        1: [1],
        2: [2, 3],
        3: [1, 2, 3],
        4: [2, 3, 4, 5],
        5: [1, 2, 3, 4, 5],
        6: [2, 3, 4, 5, 6, 7],
        7: [1, 2, 3, 4, 5, 6, 7],
        8: [1, 2, 3, 4, 5, 6, 7, 8],
        9: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        10: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        11: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        12: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        13: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        14: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        15: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        16: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        17: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    };
    const circles = toCircs(circMap[Math.min(count, circs.length)]);
    const bounce = 'cubic-bezier(0.36, 0, 0.66, -0.56)';
    const ease = 'cubic-bezier(0.23, 1, 0.320, 1)';
    const css = /*css*/ `
			.gooey-folder-icon {
				overflow: visible;
				backface-visibility: hidden;
			}

			.gooey-folder-icon circle, .gooey-folder-icon line {
				transform-origin: center;

				transition-duration: 0.25s;
				transition-timing-function: ${ease};
				backface-visibility: hidden;
			}

			/*  Circle A  */
			.closed .gooey-folder-icon circle.a {
				transform: scale(1);

				stroke: transparent;
				fill: ${fill};

				transition: all .5s ${bounce}, stroke 2s ${bounce}, fill .2s ${bounce} 0s;
			}
			.gooey-folder-icon circle.a {
				transform: scale(0.66);

				stroke: ${fill};
				fill: ${theme};

				transition: all .33s ${bounce}, stroke 2s ${bounce}, fill .2s ease-in 0.25s;
			}

			/*  Circle Alt  */
			.closed .gooey-folder-icon circle.alt {
				transform: translate(-3px, 0) scale(1.8);

				transition-duration: 0.5s;
				transition-timing-function: ${ease};
			}
			 .gooey-folder-icon circle.alt {
				transform: translate(0, 0) scale(0);

				stroke: none;
				fill: ${theme};

				transition-duration: 0.75s;
				transition-timing-function: ${ease};
			}
		`.trim();
    icon.innerHTML = /*html*/ `
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox="0 0 24 24"
			fill="none"
			stroke-width="${strokeWidth}"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="gooey-folder-icon"
			overflow="visible"
		>
			<circle class="a" cx="${x}" cy="${y}" r="${r}" stroke="${theme}" fill="${fill}" />

			${circles}

			<style lang="css">
				${css}
			</style>
		</svg>`.trim();
    return icon;
}
function createFolderConnector(folder, icon) {
    const container = folder.element;
    const width = 20;
    const height = folder.scrollHeight;
    const stroke = 1;
    const hash = nanoid();
    //? SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'gooey-connector-svg');
    svg.setAttribute('width', `${width}`);
    svg.setAttribute('stroke-width', `${stroke}`);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('backface-visibility', 'hidden');
    svg.setAttribute('preserveAspectRatio', 'xMinYMin slice');
    svg.style.setProperty('filter', `hue-rotate(${folder.hue}deg)`);
    //? Path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'var(--gooey-theme-a)');
    path.setAttribute('stroke-width', `${stroke}`);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('d', `M10,0 Q0,0 0,10 L0,${height}`);
    //? Path Gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    linearGradient.setAttribute('id', `gradient-${hash}`);
    linearGradient.setAttribute('x1', '0%');
    linearGradient.setAttribute('y1', '0%');
    linearGradient.setAttribute('x2', '0%');
    linearGradient.setAttribute('y2', '100%');
    function stop(offset, opacity, color = 'var(--gooey-theme-a)') {
        const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop.setAttribute('offset', `${offset}%`);
        stop.setAttribute('style', `stop-color: ${color}; stop-opacity: ${opacity}`);
        linearGradient.appendChild(stop);
        return stop;
    }
    stop(0, 0.5);
    stop(1, 0.5);
    stop(5, 0.4);
    stop(20, 0.3);
    stop(40, 0.2);
    stop(100, 0.2);
    path.setAttribute('stroke', `url(#gradient-${hash})`);
    //? Appending
    defs.appendChild(linearGradient);
    svg.insertBefore(defs, svg.firstChild);
    svg.appendChild(path);
    container.appendChild(svg);
    //- This is cursed..
    const svgRect = svg.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();
    const connectorTop = svgRect.top;
    const iconTop = iconRect.top;
    const iconOffset = connectorTop - iconTop - stroke + 'px';
    svg.style.top = iconOffset;
    const iconCenter = icon.scrollHeight / 2 + stroke + 2;
    svg.style.top = iconCenter + 'px';
    const update = (height = folder.scrollHeight) => {
        svg.style.setProperty('height', `${height}px`);
        svg.style.setProperty('filter', `hue-rotate(${folder.hue}deg)`);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        path.setAttribute('d', `M10,0 Q0,0 0,10 L0,${height}`);
        const length = path.getTotalLength();
        path.style.setProperty('strokeDashoffset', `${length}`);
        path.style.setProperty('strokeDasharray', `${length * 1.2}`);
        return { length };
    };
    defer(() => update());
    return { container, svg, path, update };
}
function animateConnector(folder, action) {
    if (!folder.graphics?.connector)
        return Promise.resolve();
    folder.graphics.connector.update();
    const length = folder.scrollHeight;
    const config = action === 'open'
        ? {
            duration: 800,
            delay: 0,
            easing: 'cubic-bezier(.29,.1,.03,.94)',
            offset: {
                from: length,
                to: 0,
            },
            array: {
                from: length,
                to: length * 1.2,
            },
        }
        : {
            duration: 250,
            delay: 0,
            easing: 'cubic-bezier(.15,.84,.19,.98)',
            offset: {
                from: 0,
                to: length,
            },
            array: {
                from: length * 1.2,
                to: length,
            },
        };
    const keyframes = [
        { strokeDashoffset: config.offset.from, strokeDasharray: config.array.from },
        { strokeDashoffset: config.offset.to, strokeDasharray: config.array.to },
    ];
    const timing = {
        duration: config.duration,
        delay: config.delay,
        easing: config.easing,
        fill: 'forwards',
    };
    return folder.graphics.connector.path.animate(keyframes, timing).finished;
}

export { animateConnector, createFolderConnector, createFolderSvg };
//# sourceMappingURL=createFolderSVG.js.map
