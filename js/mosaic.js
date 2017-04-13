// Constants shared between client and server.

var TILE_WIDTH = 16;
var TILE_HEIGHT = 16;

var exports = exports || null;
if (exports) {
  exports.TILE_WIDTH = TILE_WIDTH;
  exports.TILE_HEIGHT = TILE_HEIGHT;
}


// Flow;
/**
 * User select the image.
 * Load the image
 *    - How to load the image? What is meant by loading an image? How to access that image ?
 * Divide the image into slices.
 *      - How to divide the image into slices? Which file should contain this?
 *      - How to calculate the average color of a tile? Which file should contain this?
 *      - Should I call the javascript functions from mosaic.html file?
 *      - What is the use of client.js
 *
 *      How many tiles of size X x Y can be cut from an image of Size
 */
