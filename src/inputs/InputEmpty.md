We can ignore the InputEmpty idea for now and focus on bugs.

I found a lot of bugs in the codebase while trying to hack on this modified button input:

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
