import { Gooey } from '../../Gooey';
export class GooeyTest {
    page;
    constructor() {
        document.body.style.background = 'black';
        localStorage.clear();
        this.page = document.createElement('div');
        this.page.style.cssText = `
	position: relative;
	display: flex;
	flex-direction: column;
`;
        document.body.append(this.page);
    }
    addGooey(options = {}) {
        if (!options.container) {
            const height = options.height ?? 10;
            const container = document.createElement('div');
            container.style.cssText = `
		position: relative;
		height: ${height}rem;
		outline: 2px solid #222;
	`;
            this.page.append(container);
            options.container = container;
        }
        options.position ??= 'center';
        options.storage ??= false;
        return new Gooey(options);
    }
}
