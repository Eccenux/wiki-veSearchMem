// ==UserScript==
// @name         Wiki VE Search Mem
// @namespace    pl.enux.wiki
// @version      0.0.1
// @description  [0.0.1] Pomocnik do wyszukiwania wybranych fraz. Frazy są w `sequences`.
// @author       Nux
// @match        https://pl.wikipedia.org/*
// @grant        none
// @updateURL    https://github.com/Eccenux/wiki-veSearchMem/raw/master/veSearchMem.meta.js
// @downloadURL  https://github.com/Eccenux/wiki-veSearchMem/raw/master/veSearchMem.user.js
// ==/UserScript==

// sequences
const sequences = [];
sequences.push({
	s: ' - ',
	r: ' – ',
});
sequences.push({
	s: '"(.*?)"',
	r: '„$1”',
});

const options = {
	findQuery : '[placeholder="Znajdź"]',
	replaceQuery : '[placeholder="Zamień"]',
};

class SequenceMem {
	constructor() {
		this.findEl = null;
		this.replaceEl = null;
	}

	/**
	 * VE search&replace form fields.
	 */
	initFormFields() {
        // no cache -- this will be wrong when VE is closed
		//if (this.findEl && this.replaceEl) {
		//	return true;
		//}
		this.findEl = document.querySelector(options.findQuery);
		this.replaceEl = document.querySelector(options.replaceQuery);
		if (!this.findEl || !this.replaceEl) {
			return false;
		}
		return true;
	}

	insertSequence(s) {
		if (!this.initFormFields()) {
			return;
		}
		//console.log('insert: ', s, this.findEl);
		this.findEl.value = s.s;
		this.replaceEl.value = s.r;
	}

	/**
	 * Init buttons for inserting sequences.
	 */
	initButtons() {
		//const container = document.querySelector('#p-personal .vector-menu-content');
		const container = document.querySelector('.vector-user-links');
		const veEdit = document.querySelector('#ca-ve-edit')
		if (!container || !veEdit) { // skip non-editable
			return;
		}

		// add buttons
		const buttonContainer = document.createElement('div');
		buttonContainer.style.cssText = `margin: 1em;`;
		buttonContainer.className = 'edit-search-mem';

		for (let i = 0; i < sequences.length; i++) {
			const sequence = sequences[i];
			const button = document.createElement('button');
			button.textContent = sequence.r;
			button.onclick = () => {
				//console.log('click:', sequence, this.textContent);
				this.insertSequence(sequence);
			};
			buttonContainer.appendChild(button);
		}

		// add all
		//container.insertBefore(buttonContainer, container.firstChild);
		container.parentNode.insertBefore(buttonContainer, container);
	}

	/**
	 * Top init (run when page is ready).
	 */
	init() {
		this.initButtons();
	}
}//;

// exec
const sequenceMem = new SequenceMem();
sequenceMem.init();
//(new SequenceMem()).init()