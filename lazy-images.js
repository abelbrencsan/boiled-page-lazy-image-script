/**
 * Lazy images - v1.1.1
 * Copyright 2021 Abel Brencsan
 * Released under the MIT License
 */

var LazyImages = (function(){

	'use strict';

	var observer;
	var isObserverSupported = false;
	var options = {
		sourceAttribute: null,
		threshold: 0,
		isLoadingClass: 'is-loading',
		isLoadedClass: 'is-loaded'
	};

	/**
	* Initialize observer for lazy images. (public)
	*/
	var init = function(givenOptions) {
		var observerOptions;
		if (typeof givenOptions !== 'object') throw 'Lazy images options must be an object';
		if (typeof givenOptions.sourceAttribute !== 'string') throw 'Lazy images "sourceAttribute" option must be a string';
		for (var key in options) {
			if (givenOptions.hasOwnProperty(key)) {
				options[key] = givenOptions[key];
			}
		}
		if ('IntersectionObserver' in window) {
			isObserverSupported = true;
			observerOptions = {
				threshold: options['threshold']
			};
			observer = new IntersectionObserver(lazyLoad, observerOptions);
		}
	};

	/**
	* Add new image to observer. (public)
	*/
	var add = function(wrapper) {
		var sources;
		if (isObserverSupported) {
			observer.observe(wrapper);
		}
		else {
			sources = wrapper.querySelectorAll('[' + options.sourceAttribute + ']');
			for (var i = 0; i < sources.length; i++) {
				changeSource(sources[i]);
			}
		}
	};

	/**
	* Remove image from observer. (public)
	*/
	var remove = function(wrapper) {
		if (isObserverSupported) {
			observer.unobserve(wrapper);
		}
	};

	/**
	* Load images which enter the document viewport. (private)
	*/
	var lazyLoad = function(entries) {
		var sources;
		if (navigator.onLine) {
			for (var i = 0; i < entries.length; i++) {
				if (entries[i].intersectionRatio >= options.threshold && entries[i].intersectionRatio > 0) {
					remove(entries[i].target);
					sources = entries[i].target.querySelectorAll('[' + options.sourceAttribute + ']');
					for (var j = 0; j < sources.length; j++) {
						changeSource(sources[j]);
					}
				}
			}
		}
	};

	/**
	* Change image source with the value given in the source attribute. (private)
	*/
	var changeSource = function(source) {
		if (source.hasAttribute('srcset')) {
			source.setAttribute('srcset', source.getAttribute(options.sourceAttribute));
		}
		else {
			source.setAttribute('src', source.getAttribute(options.sourceAttribute));
			source.classList.add(options.isLoadingClass);
			if (source.tagName == 'VIDEO') {
				source.addEventListener('canplaythrough', function(event) {
					event.target.classList.add(options.isLoadedClass);
				});
			}
			else {
				source.addEventListener('load', function(event) {
					event.target.classList.add(options.isLoadedClass);
				});
			}
		}
		source.removeAttribute(options.sourceAttribute);
	};

	return {
		init: init,
		add: add,
		remove: remove
	};

})();
