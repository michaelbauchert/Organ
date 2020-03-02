
	const midiInputTemplate = document.createElement('template');
midiInputTemplate.innerHTML = `
  <style>
  </style>

  <select>
    <option value="keyboard">Keyboard</option>
    <option disabled>Web MIDI Disabled</option>
  </select>
`;


class MidiInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(midiInputTemplate.content.cloneNode(true));
  }//end constructor

  connectedCallback() {

    const keyboard = {
        65: 60,
        87: 61,
        83: 62,
        69: 63,
        68: 64,
        70: 65,
        84: 66,
        71: 67,
        89: 68,
        72: 69,
        85: 70,
        74: 71,
        75: 72,
        79: 73,
        76: 74,
        80: 75,
        186: 76,
        222: 77
    };

    let octaveModifier = 0;
    let heldNotes = [];
		let count = 0;

		const flush = new CustomEvent('flush',
		{
			bubbles: true,
			detail: {
								pitch: 0,
								velocity: 0,
								heldNotes: heldNotes
							}
		});

    document.addEventListener("keydown", event => {
      const velocity = 127;

      if(!event.repeat) {
        let pitch = keyboard[event.keyCode.toString()] + octaveModifier;

        if(!isNaN(pitch)) {
          this.dispatchEvent(new CustomEvent('noteon',
          {
            bubbles: true,
            detail: {
                      pitch: pitch,
                      velocity: velocity,
                      heldNotes: heldNotes
                    }
          }));
        }

				if (!heldNotes.includes(pitch))
					heldNotes.push(pitch);

				//trigger FIRST ON event if the first note was pressed down
				if(heldNotes.length === 1) {
					this.dispatchEvent(new CustomEvent('firston',
          {
            bubbles: true
          }));
				}
      }
    });//end key down

    document.addEventListener("keyup", event => {
      //press Z for octave down
      if(event.keyCode === 90 && octaveModifier > -60) {
        octaveModifier -= 12;
				this.dispatchEvent(flush);
				heldNotes = [];
      //press X for octave up
      } else if (event.keyCode === 88 && octaveModifier < 60) {
        octaveModifier += 12;
				this.dispatchEvent(flush);
				heldNotes = [];
      } else if (heldNotes.length > 0) {
        let pitch = keyboard[event.keyCode.toString()] + octaveModifier;

        if(!isNaN(pitch) && heldNotes.includes(pitch)) {
          heldNotes.splice(heldNotes.indexOf(pitch), 1);
          this.dispatchEvent(new CustomEvent('noteoff',
          {
            bubbles: true,
            detail: {
                      pitch: pitch,
                      velocity: 0,
                      heldNotes: heldNotes
                    }
          }));
        }

				//trigger LAST OFF event if the last note was let off
				if(heldNotes.length === 0) {
					this.dispatchEvent(new CustomEvent('lastoff',
          {
            bubbles: true
          }));
				}
      }
    });//end key up

    document.addEventListener("visibilitychange", function() {
				heldNotes = [];
    });

		//BEGIN WEB MIDI
		navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

		function onMIDISuccess(midiAccess) {
		    console.log(midiAccess);

		    var inputs = midiAccess.inputs;
		    var outputs = midiAccess.outputs;
		}

		function onMIDIFailure() {
		    console.log('Could not access your MIDI devices.');
		}


  }//end connectedCallback
}//end MidiInput

customElements.define('midi-input', MidiInput);
