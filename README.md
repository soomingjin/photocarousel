# photocarousel

This side project is a way for me to test and develop some of my web dev skills.

The website should have a container to display a cat image and there should be buttons by its left and right that can cycle the images in it.

# Demo
[Link here to demo](https://soomingjin.github.io/photocarousel/)


# Dependencies
* jQuery 3.2.1
* Bootstrap 3

# Learning Points
* Code Documentation

This is essential as it helps me to make the code more readable
Use `data-*` attributes to store global variables in the DOM to prevent memory leaks
Prefix `'$'` to jQuery variables
Learning to write in ES6


* CSS3

I learned how to use different properties and understood a few concepts about formatting elements
Absolute positioned elements are essentially taken out of the flow of the markup. Since the images were absolutely positioned and the image-container only contains the height of its elements, there was no height to the image-container. In order to fix this issue, A div with attribute visibility set to hidden was placed in the image-container to "take up space", allowing image-container to show the elements.

* Button Event

```javascript
event.target
```
and
```javascript
event.currentTarget
```
are very different, `currentTarget` was used I needed to find the exact button that was pressed.

*
