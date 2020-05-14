# Boiled Page lazy images script

A super simple, observer-based JavaScript module for Boiled Page frontend framework to load images when they come into the viewport.

## Install

Place `lazy-images.js` to `/assets/js` directory and add its path to `scripts` variable in `gulpfile.js` to be combined with other scripts.

## Usage

To initialize lazy images, call `init()` method the following way:

```js
// Initialize lazy images
LazyImages.init(options);
```

## Methods

### Initialize lazy images

`init(options)` - Initialize observer for lazy images.

Parameter | Type | Required | Description
----------|------|----------|------------
`options` | Object | Yes | Options

Available properties for `options` object:

Option| Type | Default | Required | Description
------|------|---------|----------|------------
`sourceAttribute` | String | null | Yes | Name of the attribute that contains the source of final image.
`threshold` | Number | 0 | No | A number between 0 and 1 that indicates at what percentage of the images's visibility the final image should be loaded.
`isLoadingClass` | String | 'is-loading' | No | Class added when final image is loading.
`isLoadedClass` | String | 'is-loaded' | No | Class added after final image is loaded.

### Add new image

`add(wrapper)` - Add new image to observer.

Parameter | Type | Required | Description
----------|------|----------|------------
`wrapper` | Object | Yes | Wrapper element that contains image element with the source attribute given in options (it also works with picture element with multiple sources).

### Remove image

`remove(wrapper)` - Remove image from observer.

Parameter | Type | Required | Description
----------|------|----------|------------
`wrapper` | Object | Yes | Wrapper element that contains image element with the source attribute given in options (it also works with picture element with multiple sources).

## Add lazy images with HTML attributes

Place the following code inside `assets/js/app.js` to initialize lazy images:

```js
LazyImages.init({
  sourceAttribute: "data-lazy-image-src"
});
```

Place the following code after initialization to add images with `data-lazy-image` attribute.

```js
var lazyImageElems = document.querySelectorAll('[data-lazy-image]');
for (var i = 0; i < lazyImageElems.length; i++) {
  LazyImages.add(lazyImageElems[i])
}
```

Add image element with `data-lazy-image-src` attribute that contains the value of final image source. When image comes into the viewport, script will swap sources.

```html
<div class="image image--fit image--lazy" data-lazy-image>
  <img src="https://picsum.photos/40/30" data-lazy-image-src="https://picsum.photos/800/600" alt="Sample image" />
</div>
```

You will also need to add image component and lazy image extension idea to make it working properly.

- Image component: <https://www.github.com/abelbrencsan/boiled-page-image-component>

