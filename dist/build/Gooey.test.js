import { Gooey } from './Gooey';
import { describe, expect, test } from 'vitest';
document.body.style.background = 'black';
localStorage.clear();
const page = document.createElement('div');
page.style.cssText = `
	position: relative;
	display: flex;
	flex-direction: column;
`;
document.body.append(page);
function addGooey(options = {}) {
    if (!options.container) {
        const container = document.createElement('div');
        container.style.cssText = `
		position: relative;
		height: 8rem;
		outline: 2px solid #222;
	`;
        page.append(container);
        options.container = container;
    }
    options.position ??= 'center';
    options.storage ??= false;
    return new Gooey(options);
}
describe('Gooey constructor', () => {
    let gooey;
    test('empty init', () => {
        gooey = new Gooey();
    });
    test('updating title and dispose', () => {
        gooey.title = 'testing 123';
        // gooey.folder.title = 'testing 123'
        expect(gooey.title).toBe('testing 123');
        setTimeout(() => {
            expect(gooey.folder.elements.header.innerText).toBe('testing 123');
            gooey.dispose();
            document.write('bruh');
        }, 100);
    });
    test('container', () => {
        addGooey();
    });
    test('title', () => {
        addGooey({ title: 'test' });
    });
    test('no storage', () => {
        addGooey({ title: 'no storage', storage: false });
    });
});
describe('position', () => {
    test('center', async () => {
        const gooey = addGooey({ position: 'center' });
        await new Promise(resolve => setTimeout(resolve, 100));
        const pos = gooey.window?.position;
        gooey.title = JSON.stringify(pos).replaceAll(/"|{|}|/g, '');
        console.log(gooey.window);
        // console.log(gooey.window!.draggableInstance!)
        expect(pos.x).not.toBe(0);
        expect(pos.y).not.toBe(0);
    });
    test('container: "body"', () => {
        const gooey = addGooey({ container: 'body' });
        expect(gooey.container).toBe(document.body);
        // console.error(gooey.container)
        setTimeout(gooey.dispose);
    });
});
