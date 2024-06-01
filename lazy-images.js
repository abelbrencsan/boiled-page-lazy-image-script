/**
 * Lazy images
 * Copyright 2024 Abel Brencsan
 * Released under the MIT License
 */
const LazyImages = (function(){

	'use strict';

	let observer;
	let isObserverSupported = false;
	let defaults = {
		sourceAttribute: null,
		threshold: 0,
		isLoadingClass: 'is-loading',
		isLoadedClass: 'is-loaded'
	};

	/**
	* Initialize observer for lazy images.
	* 
	* @param {object} options
	* @public
	*/
	let init = function(options) {
		if (typeof options !== 'object') {
			throw 'Lazy images "options" must be an object';
		}
		if (typeof options.sourceAttribute !== 'string') {
			throw 'Lazy images "sourceAttribute" must be a string';
		}
		for (let key in defaults) {
			if (options.hasOwnProperty(key)) {
				defaults[key] = options[key];
			}
		}
		if ('IntersectionObserver' in window) {
			isObserverSupported = true;
			let observerOptions = {
				threshold: defaults['threshold']
			};
			observer = new IntersectionObserver(lazyLoad, observerOptions);
		}
	};

	/**
	* Add new image to observer.
	* 
	* @param {HTMLElement} wrapper
	* @public
	*/
	let add = function(wrapper) {
		let sources;
		if (isObserverSupported) {
			observer.observe(wrapper);
		}
		else {
			sources = wrapper.querySelectorAll('[' + defaults.sourceAttribute + ']');
			for (let i = 0; i < sources.length; i++) {
				changeSource(sources[i]);
			}
		}
	};

	/**
	* Remove image from observer.
	* 
	* @param {HTMLElement} wrapper
	* @public
	*/
	let remove = function(wrapper) {
		if (isObserverSupported) {
			observer.unobserve(wrapper);
		}
	};

	/**
	* Load images which enter the document viewport.
	* 
	* @param {array[IntersectionObserverEntry]} entries
	* @private
	*/
	let lazyLoad = function(entries) {
		let sources;
		if (navigator.onLine) {
			for (let i = 0; i < entries.length; i++) {
				if (entries[i].intersectionRatio >= defaults.threshold && entries[i].intersectionRatio > 0) {
					remove(entries[i].target);
					sources = entries[i].target.querySelectorAll('[' + defaults.sourceAttribute + ']');
					for (let j = 0; j < sources.length; j++) {
						changeSource(sources[j]);
					}
				}
			}
		}
	};

	/**
	* Change image source with the value given in the source attribute.
	* 
	* @param {HTMLElement} source
	* @private
	*/
	let changeSource = function(source) {
		if (source.hasAttribute('srcset')) {
			source.setAttribute('srcset', source.getAttribute(defaults.sourceAttribute));
		}
		else {
			source.setAttribute('src', source.getAttribute(defaults.sourceAttribute));
			source.classList.add(defaults.isLoadingClass);
			if (source.tagName == 'VIDEO') {
				source.addEventListener('canplaythrough', function(event) {
					event.target.classList.add(defaults.isLoadedClass);
				});
			}
			else {
				source.addEventListener('load', function(event) {
					event.target.classList.add(defaults.isLoadedClass);
				});
			}
		}
		source.removeAttribute(defaults.sourceAttribute);
	};

	return {
		init: init,
		add: add,
		remove: remove
	};
})();
