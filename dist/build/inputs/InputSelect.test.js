import { GooeyTest } from '../tests/Gooey/GooeyTest';
import { test, expect, describe } from 'vitest';
const g = new GooeyTest();
const options = [
    { label: 'foo', value: 'foo' },
    { label: 'bar', value: 'bar' },
];
test('InputSelect', () => {
    expect('todo').toBe('todo');
});
describe('addSelect', () => {
    const gui = g.addGooey();
    test('correctly adds the title', () => {
        const select = gui.addSelect('testing 123', options);
        expect(select.title).toBe('testing 123');
    });
    test('options with initialValue', () => {
        const select = gui.addSelect('foobar', ['foo', 'bar'], { initialValue: 'bar' });
        expect(select.options).toStrictEqual(options);
        expect(select.state.value).toStrictEqual(options[1]);
    });
    test('options without initialValue', () => {
        const select = gui.addSelect('select', ['foo', 'bar']);
        expect(select.options).toStrictEqual([
            { label: 'foo', value: 'foo' },
            { label: 'bar', value: 'bar' },
        ]);
        expect(select.state.value, 'Incorrect fallback - expected the option at index 0\n').toStrictEqual(options[0]);
    });
    test('all options', () => {
        const select = gui.addSelect('select', options, {
            initialValue: options[1],
        });
        expect(select.options).toStrictEqual(options);
        expect(select.state.value).toStrictEqual(options[1]);
    });
});
describe('add', () => {
    const gui = g.addGooey();
    test('from labeled option', () => {
        const input = gui.add('title', 'foo', { options: ['foo', 'bar', 'baz'] });
        expect(input.__type).toStrictEqual('InputSelect');
    });
    test('from unlabeled string array', () => {
        const input = gui.add('title', ['foo', 'bar', 'baz']);
        expect(input.__type).toStrictEqual('InputSelect');
    });
});
describe('addMany', () => {
    const gui = g.addGooey();
    test('from labeled option', () => {
        gui.addMany({
            foo: {
                label: 'foo',
                value: 'foo',
            },
        }, {
            foo: {
                __type: 'SelectInputOptions',
                options: [
                    { label: 'foo', value: 'foo' },
                    { label: 'bar', value: 'bar' },
                    { label: 'baz', value: 'baz' },
                ],
            },
        });
        const input = gui.inputs.get('foo');
        expect(input.value).toMatchObject({ label: 'foo', value: 'foo' });
    });
    test('from unlabeled string array', () => {
        gui.addMany({ foo: ['foo', 'bar', 'baz'] });
        const input = gui.inputs.get('foo');
        expect(input.value).toMatchObject({ label: 'foo', value: 'foo' });
    });
});
