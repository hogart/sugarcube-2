/***********************************************************************************************************************

	lib/helpers.js

	Copyright © 2013–2019 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global L10n, Story, Wikifier */

var { // eslint-disable-line no-var
	/* eslint-disable no-unused-vars */
	clone,
	convertBreaks,
	safeActiveElement,
	setPageElement,
	throwError,
	toStringOrDefault
	/* eslint-enable no-unused-vars */
} = (() => {
	'use strict';

	/*
		Returns a deep copy of the given object.

		NOTE:
			1. `clone()` does not clone functions, however, since function definitions
			   are immutable, the only issues are with expando properties and scope.
			   The former really should not be done.  The latter is problematic either
			   way—damned if you do, damned if you don't.
			2. `clone()` does not maintain referential relationships—e.g. multiple
			   references to the same object will, post-cloning, refer to different
			   equivalent objects; i.e. each reference will receive its own clone
			   of the original object.
	*/
	function clone(orig) {
		/*
			Immediately return the primitives and functions.
		*/
		if (typeof orig !== 'object' || orig === null) {
			return orig;
		}

		/*
			Unbox instances of the primitive exemplar objects.
		*/
		if (orig instanceof String) {
			return String(orig);
		}
		if (orig instanceof Number) {
			return Number(orig);
		}
		if (orig instanceof Boolean) {
			return Boolean(orig);
		}

		/*
			Honor native clone methods.
		*/
		if (typeof orig.clone === 'function') {
			return orig.clone(true);
		}
		if (orig.nodeType && typeof orig.cloneNode === 'function') {
			return orig.cloneNode(true);
		}

		/*
			Create a copy of the original object.

			NOTE: Each non-generic object that we wish to support must be
			explicitly handled below.
		*/
		let copy;

		// Handle instances of the core supported object types.
		if (orig instanceof Array) {
			copy = new Array(orig.length);
		}
		else if (orig instanceof Date) {
			copy = new Date(orig.getTime());
		}
		else if (orig instanceof Map) {
			copy = new Map();
			orig.forEach((val, key) => copy.set(key, clone(val)));
		}
		else if (orig instanceof RegExp) {
			copy = new RegExp(orig);
		}
		else if (orig instanceof Set) {
			copy = new Set();
			orig.forEach(val => copy.add(clone(val)));
		}

		// Handle instances of unknown or generic objects.
		else {
			// We try to ensure that the returned copy has the same prototype as
			// the original, but this will probably produce less than satisfactory
			// results on non-generics.
			copy = Object.create(Object.getPrototypeOf(orig));
		}

		/*
			Duplicate the original object's own enumerable properties, which will
			include expando properties on non-generic objects.

			NOTE: This does not preserve ES5 property attributes.  Neither does
			the delta coding or serialization code, however, so it's not really
			an issue at the moment.
		*/
		Object.keys(orig).forEach(name => copy[name] = clone(orig[name]));

		return copy;
	}

	/*
		Converts <br> elements to <p> elements within the given node tree.
	*/
	function convertBreaks(source) {
		const output = document.createDocumentFragment();
		let para = document.createElement('p');
		let node;

		while ((node = source.firstChild) !== null) {
			if (node.nodeType === Node.ELEMENT_NODE) {
				const tagName = node.nodeName.toUpperCase();

				switch (tagName) {
				case 'BR':
					if (
						   node.nextSibling !== null
						&& node.nextSibling.nodeType === Node.ELEMENT_NODE
						&& node.nextSibling.nodeName.toUpperCase() === 'BR'
					) {
						source.removeChild(node.nextSibling);
						source.removeChild(node);
						output.appendChild(para);
						para = document.createElement('p');
						continue;
					}
					else if (!para.hasChildNodes()) {
						source.removeChild(node);
						continue;
					}
					break;

				case 'ADDRESS':
				case 'ARTICLE':
				case 'ASIDE':
				case 'BLOCKQUOTE':
				case 'CENTER':
				case 'DIV':
				case 'DL':
				case 'FIGURE':
				case 'FOOTER':
				case 'FORM':
				case 'H1':
				case 'H2':
				case 'H3':
				case 'H4':
				case 'H5':
				case 'H6':
				case 'HEADER':
				case 'HR':
				case 'MAIN':
				case 'NAV':
				case 'OL':
				case 'P':
				case 'PRE':
				case 'SECTION':
				case 'TABLE':
				case 'UL':
					if (para.hasChildNodes()) {
						output.appendChild(para);
						para = document.createElement('p');
					}

					output.appendChild(node);
					continue;
				}
			}

			para.appendChild(node);
		}

		if (para.hasChildNodes()) {
			output.appendChild(para);
		}

		source.appendChild(output);
	}

	/*
		Returns `document.activeElement` or `null`.
	*/
	function safeActiveElement() {
		/*
			IE9 contains a bug where trying to access the active element of an iframe's
			parent document (i.e. `window.parent.document.activeElement`) will throw an
			exception, so we must allow for an exception to be thrown.

			We could simply return `undefined` here, but since the API's default behavior
			should be to return `document.body` or `null` when there is no selection, we
			choose to return `null` in all non-element cases (i.e. whether it returns
			`null` or throws an exception).  Just a bit of normalization.
		*/
		try {
			return document.activeElement || null;
		}
		catch (ex) {
			return null;
		}
	}

	/*
		Wikifies a passage into a DOM element corresponding to the passed ID and returns the element.
	*/
	function setPageElement(idOrElement, titles, defaultText) {
		const el = typeof idOrElement === 'object'
			? idOrElement
			: document.getElementById(idOrElement);

		if (el == null) { // lazy equality for null
			return null;
		}

		const ids = Array.isArray(titles) ? titles : [titles];

		jQuery(el).empty();

		for (let i = 0, iend = ids.length; i < iend; ++i) {
			if (Story.has(ids[i])) {
				new Wikifier(el, Story.get(ids[i]).processText().trim());
				return el;
			}
		}

		if (defaultText != null) { // lazy equality for null
			const text = String(defaultText).trim();

			if (text !== '') {
				new Wikifier(el, text);
			}
		}

		return el;
	}

	/*
		Appends an error view to the passed DOM element.
	*/
	function throwError(place, message, source) {
		const $wrapper = jQuery(document.createElement('div'));
		const $toggle  = jQuery(document.createElement('button'));
		const $source  = jQuery(document.createElement('pre'));
		const mesg     = `${L10n.get('errorTitle')}: ${message || 'unknown error'}`;

		$toggle
			.addClass('error-toggle')
			.ariaClick({
				label : L10n.get('errorToggle')
			}, () => {
				if ($toggle.hasClass('enabled')) {
					$toggle.removeClass('enabled');
					$source.attr({
						'aria-hidden' : true,
						hidden        : 'hidden'
					});
				}
				else {
					$toggle.addClass('enabled');
					$source.removeAttr('aria-hidden hidden');
				}
			})
			.appendTo($wrapper);
		jQuery(document.createElement('span'))
			.addClass('error')
			.text(mesg)
			.appendTo($wrapper);
		jQuery(document.createElement('code'))
			.text(source)
			.appendTo($source);
		$source
			.addClass('error-source')
			.attr({
				'aria-hidden' : true,
				hidden        : 'hidden'
			})
			.appendTo($wrapper);
		$wrapper
			.addClass('error-view')
			.appendTo(place);

		console.warn(`${mesg}\n\t${source.replace(/\n/g, '\n\t')}`);

		return false;
	}

	/*
		Returns the simple string representation of the passed value or, if there is none,
		the passed default value.
	*/
	function toStringOrDefault(value, defValue) {
		const tSOD = toStringOrDefault;

		switch (typeof value) {
		case 'number':
			// TODO: Perhaps NaN should be printed instead?
			if (Number.isNaN(value)) {
				return defValue;
			}
			break;

		case 'object':
			if (value === null) {
				return defValue;
			}
			else if (Array.isArray(value)) {
				return value.map(val => tSOD(val, defValue)).join(', ');
			}
			else if (value instanceof Set) {
				return [...value].map(val => tSOD(val, defValue)).join(', ');
			}
			else if (value instanceof Map) {
				const result = [...value].map(([key, val]) => `${tSOD(key, defValue)} \u2192 ${tSOD(val, defValue)}`);
				return `{\u202F${result.join(', ')}\u202F}`;
			}
			else if (value instanceof Date) {
				return value.toLocaleString();
			}
			else if (typeof value.toString === 'function') {
				return value.toString();
			}
			return Object.prototype.toString.call(value);

		case 'function':
		case 'undefined':
			return defValue;
		}

		return String(value);
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze(Object.defineProperties({}, {
		clone             : { value : clone },
		convertBreaks     : { value : convertBreaks },
		safeActiveElement : { value : safeActiveElement },
		setPageElement    : { value : setPageElement },
		throwError        : { value : throwError },
		toStringOrDefault : { value : toStringOrDefault }
	}));
})();
