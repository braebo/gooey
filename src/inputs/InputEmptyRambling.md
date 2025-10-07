idea - InputEmpty

Making custom inputs that mix and match different types of inputs recursively is a pain.

Right now I'm just trying to combine a button and text input for a music player, and the hoops I'm jumping through to get it to look right are ridiculous and would be impossible for anyone other than me to know how to do. _(uncovered lots of bugs to fix too)_

Here's a snippet:

```typescript
private setupGooeyInterface() {
    this.gooey = new Gooey({
        id: 'mp3-player-controls',
        title: 'MP3 Player',
        position: 'top-left',
        margin: { x: 24, y: 24 },
        // hidden: true, //! TODO - this is broken (stuck hidden forever / wont show)
    })
    this.gooey.hide() //! TODO - hack for now

    window.addEventListener('keydown', (e) => {
        if (e.key === 'm') {
            console.log(e.key)
            this.gooey.toggleHidden()
        }
    })

    const analyserFolder = this.gooey.addFolder('analyser', { closed: true })

    analyserFolder.addButtonGrid('fftSize', [
        [
            {
                text: '128',
                onClick: () => (this.analyser.fftSize = 128),
            },
            {
                text: '256',
                onClick: () => (this.analyser.fftSize = 256),
            },
            {
                text: '512',
                onClick: () => (this.analyser.fftSize = 512),
            },
            {
                text: '1024',
                onClick: () => (this.analyser.fftSize = 1024),
            },
        ],
    ])

    analyserFolder.bindNumber(this.analyser, 'smoothingTimeConstant', {
        title: 'smoothing',
        description: 'The smoothing time constant',
    })

    const playerFolder = this.gooey.addFolder('player', { closed: false })

    this.inputs.load = playerFolder.addButton('mp3', this.loadAudio.bind(this), {
        description: 'Select an MP3 file to play',
        text: 'load',
    })
    // this.inputs.load.elements.content.style.width = 'auto'
    // this.inputs.load.elements.content.style.display = 'inline-flex'
    // this.inputs.load.elements.content.style.width = '6rem'
    // ^had to fish aimlessly as you can see... very frustrating
    this.inputs.load.elements.controllers.button.style.width = '3rem'
    this.inputs.load.elements.controllers.container.style.width = 'auto'
    this.inputs.load.elements.controllers.button.style.marginRight = '0.5rem'

    this.inputs.active = playerFolder.addText('active', 'none', {
        description: 'The currently loaded MP3 file',
        resettable: false,
        disabled: true, //! TODO - doesn't work...
        // hidden: true, //! TODO - this just _doesn't work_ lol... it should set display: none, no?
    })

    this.elements.activeText = this.inputs.active.elements.controllers.input
    // this.elements.activeText.style.flex = '1' // blind fishing
    this.elements.activeText.style.width = '100%'
    this.elements.activeText.disabled = true //! TODO - still doesn't work...
    this.elements.activeText.classList.add('disabled') // hack that does work...
    // more aimless fishing...
    // this.inputs.load.elements.container.appendChild(this.elements.activeText)
    this.inputs.load.elements.content.appendChild(this.elements.activeText)

    this.elements.activeText.addEventListener('change', (e) => {
        this.inputs.active.value = (e.target as HTMLInputElement).value
    })

    this.inputs.active.elements.container.style.display = 'none'

    this.inputs.play = playerFolder.addButton('playback', this.togglePlayPause.bind(this), {
        description: 'no file loaded',
        tooltipOptions: {
            text: () => {
                return this.inputs.active.value === 'none'
                    ? 'no file loaded'
                    : 'Play / Pause the current track'
            },
        },
        text: () => (this.isPlaying ? 'pause' : 'play'),
        disabled: () => this.inputs.active.value === 'none',
    })

    this.inputs.volume = playerFolder.addNumber('volume', 0.5, {
        min: 0,
        max: 1,
        step: 0.01,
        description: 'Adjust the volume',
    })

    if (this.autoload) {
        this.fetchAudio()
    }
}
// ...
```

So.. I'm thinking `InputEmpty` to try to make it easier to make custom inputs by combining controllers. So far, I've only copied the `InputText` file and renamed some stuff as a crude start before realizing how complex and unique `InputEmpty` will need to be.

So I know it should make it easy to combine controllers.

But should the controllers have reactive api's like inputs do? Are they just inputs without title fields and a recursive parent container?

This is finally forcing me to establish the line between inputs and controllers, the latter of which was never properly defined and fleshed out (and nearly phased out at one point).

A tough questions I keep coming back to:

Is this just recursive inputs?

Or is it just a kitchen sink `InputButtonGrid` that accepts more than just button options? _(In this case, the `buttons` would need to be `inputs` or `controllers` or something, with strong inference on the shape of the options and the generated inputs/controllers types.)_

Just spitballing ideas for the API... if we do recursive inputs

```typescript
const custom = gooey.addEmpty('music box', {
    // ... todo
    // this could be similar to addMany api
    controllers: {
        graphic: {
            type: 'empty',
            options: {
                //! TODO - These should be (or include) `CreateOptions` from the `create` function?
                // ...
            }
        }
        playback: {
            type: 'button',
            options: {
                text: 'play',
                onClick: () => {
                    // ...
                }
            }
        },
        fileName: {
            type: 'text',
            options: {
                value: 'none',
                disabled: true,
                onChange: (e) => {
                    // ...
                }
            }
        }
    }
})

custom.inputs.playback // => InputButton
custom.inputs.fileName // => InputText

custom.addBlank({})
```

Recursive inputs also means committing to the initial full idea of Controllers as the parts of inputs responsible only for a single input element or div and a single state, whether that state is coming
from another controller, a parent input, or is created and managed internally... and inputs are focused on things like labels, descriptions, reset buttons, other future stuff, and managing one or more controllers.
How undo history fits in also needs to be figured out.

Or option B, kitchen sink grid input based on the api of `InputButtonGrid` but where the buttons are controllers instead of actual buttons.

```typescript
const custom = gooey.addEmpty('music box', {
    // ... todo
    // this could be similar to ButtonGridArrays
    controllers: [
        [
            {
                type: 'button',
                // ButtonInputOptions ?
                options: {
                    text: 'play',
                    onClick: () => {
                        // ...
                    }
                }
            }
        ]
    ]
    // ...
})
custom.addButton({})
```

I'm open to suggestions though.
- We can have a `blank` controller thats just a div
- Would still need to flesh out controller types and make a bunch like `ControllerButton`, `ControllerText`, etc. that can just apply the right classes and reasonable layout styles
- Controller options could take a `style` object to easily customize them
- they could use the { elements: { container: HTMLDivElement, ... } } structure to add other controllers or inputs to them
- they could utilize smart inference like a lot of the folder and input types do

```typescript
custom.addText({})
custom.addButton({})
```

last minute thoughts:

This is a big change for Gooey, but I think it will be worth it, as Inputs have grown a lot and it makes less and less sense for them to always manage a single value.
On the other hand, systems like this really need stiff lines for structure... will they always feel like arbitrary limitations?
