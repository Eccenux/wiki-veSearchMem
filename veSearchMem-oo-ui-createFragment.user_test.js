// ==UserScript==
// @name         Wiki Search Mem
// @namespace    pl.enux.wiki
// @version      0.0.1
// @description  [0.0.1] Experimental. Use tpls + createFragment to manually create oo-ui elements.
// @author       Nux
// @match        https://pl.wikipedia.org/*
// @grant        none
// ==/UserScript==
/*
Just an exercise...

More standard would be to use `OO.ui.ButtonGroupWidget`:
https://www.mediawiki.org/wiki/OOUI/Elements/Groups

Buttons made with `OO.ui.ButtonWidget`.

Adding on-click example:
https://www.mediawiki.org/wiki/OOUI/Creating_interfaces_programmatically#Connecting_an_event_handler_to_a_widget

In any case the buttons seem a bit too big.
*/

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
const tpls = {
	container: (containerClass)=>`
		<div style='margin: 1em' class='edit-search-mem'>
			<span class="oo-ui-widget oo-ui-widget-enabled oo-ui-buttonGroupWidget ${containerClass}"></span>
		</div>
	`.trim(),
	button:	(labelClass)=>`
		<span class="oo-ui-widget oo-ui-buttonElement oo-ui-buttonElement-framed oo-ui-labelElement oo-ui-buttonWidget oo-ui-widget-enabled">
			<button class="oo-ui-buttonElement-button">
				<span class="oo-ui-labelElement-label ${labelClass}"></span>
			</button>
		</span>
	`.trim(),

	createFragment: function(htmlStr) {
		var frag = document.createDocumentFragment(),
			temp = document.createElement('div');
		temp.innerHTML = htmlStr;
		while (temp.firstChild) {
			frag.appendChild(temp.firstChild);
		}
		return frag;
	},
	append: function(element, html) {
		element.appendChild(this.createFragment(html));
	}
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
		const buttonContainer = tpls.createFragment(tpls.container('group-container'));
		const buttonGroupContainer = buttonContainer.querySelector('.group-container');

		for (let i = 0; i < sequences.length; i++) {
			const sequence = sequences[i];
			const butoonBlock = tpls.createFragment(tpls.button('label'));
			butoonBlock.querySelector('.label').textContent = sequence.r;
			const button = butoonBlock.querySelector('button');
			button.onclick = () => {
				//console.log('click:', sequence, this.textContent);
				this.insertSequence(sequence);
			};
			buttonGroupContainer.appendChild(butoonBlock);
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