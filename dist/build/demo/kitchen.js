import { Gooey } from '..';
export const kitchen = (opts) => {
    const g = new Gooey(opts);
    const text = g.add('text', 'foo');
    const number = g.add('number', 5);
    const boolean = g.add('boolean', true);
    const select = g.add('select', ['foo', 'bar', 'baz']);
    const color = g.add('color', '#000000');
    const button = g.add('button', () => alert('thanks'));
    // g.add('empty') // todo
    const f = g.addFolder('Folder');
    f.add('button grid', [
        [
            { text: 'foo', onClick: () => alert('foo') },
            { text: 'bar', onClick: () => alert('bar') },
        ],
        [
            { text: 'baz', onClick: () => alert('baz') },
            { text: 'qux', onClick: () => alert('qux') },
        ],
    ]);
    return {
        gooey: g,
        inputs: {
            text,
            number,
            boolean,
            select,
            color,
            button,
        },
        folders: {
            Folder: f,
        },
    };
};
