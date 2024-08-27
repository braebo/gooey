import { GooeyTest } from './tests/Gooey/GooeyTest';
import { describe, expect, test } from 'vitest';
import { Gooey } from './Gooey';
const G = new GooeyTest();
describe('Gooey constructor', () => {
    let gooey;
    test('empty init', () => {
        gooey = new Gooey();
    });
    test('updating title and dispose', () => {
        gooey.title = 'testing 123';
        expect(gooey.title).toBe('testing 123');
        setTimeout(() => {
            expect(gooey.folder.elements.header.innerText).toBe('testing 123');
            console.log(gooey.folder.elements.header.innerText);
            gooey.dispose();
        }, 500);
    });
    test('container', () => {
        G.addGooey();
    });
    test('title', () => {
        G.addGooey({ title: 'test' });
    });
    test('no storage', () => {
        G.addGooey({ title: 'no storage', storage: false });
    });
});
describe('position', () => {
    test('center', async () => {
        const gooey = G.addGooey();
        await new Promise(resolve => setTimeout(resolve, 100));
        const pos = gooey.window?.position;
        gooey.title = JSON.stringify(pos).replaceAll(/"|{|}|/g, '');
        expect(pos.x).not.toBe(0);
        expect(pos.y).not.toBe(0);
    });
    test('container: "body"', () => {
        const gooey = G.addGooey({ container: 'body' });
        expect(gooey.container).toBe(document.body);
        setTimeout(gooey.dispose);
    });
});
describe('width', () => {
    test('width is respected', async () => {
        const gooey = G.addGooey({ title: 'width', width: 345 });
        expect(gooey.element.clientWidth).toBe(345);
    });
    test('100px', async () => {
        const gooey = G.addGooey({ title: '100px', width: 100 });
        expect(gooey.element.clientWidth).toBe(100);
    });
});