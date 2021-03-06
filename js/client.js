var resultContext;

/**
 * Loads given image on the screen
 * @param imageFile
 */
function loadFile(imageFile){
    var fileReader = new FileReader();
    if(imageFile){
        fileReader.readAsDataURL(imageFile)
    }
    fileReader.addEventListener("load", function () {
        var image = document.getElementById("view");
        image.src = fileReader.result;
        splitImage(image);
    });
    if(fileReader.error){
        console.log('Error loading the file')
    }
}

/**
 * Given the image element, split into tiles of specific dimension.
 * @param image
 */
function splitImage(image){
    image.onload = function () {
        var resultCanvas = document.getElementById('result-canvas');
        resultCanvas.width = image.width;
        resultCanvas.height = image.height;
        resultContext = resultCanvas.getContext('2d');

        const numRows       = Math.round(image.height/TILE_HEIGHT);
        const numTilePerRow = Math.round(image.width/TILE_WIDTH);
        for(var row = 0; row < numRows; ++row){
            var tiles = [];
            for(var col = 0; col < numTilePerRow; ++col){
                var canvas = document.createElement('canvas');
                canvas.width = TILE_WIDTH;
                canvas.height = TILE_HEIGHT;
                var context = canvas.getContext('2d');
                context.drawImage(image, col * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, 0, 0, TILE_WIDTH, TILE_HEIGHT);
                tiles.push({
                    imageUrl   : canvas.toDataURL(),
                    x          : col * TILE_WIDTH,
                    y          : row * TILE_HEIGHT
                });
            }
            if(tiles.length > 0){
                createMosaic(tiles);
            }
        }
    }
}


/**
 * Creates a mosaic for the images tiles.
 * @param allTiles
 */
function createMosaic(allTiles) {

    for(var i = 0; i < allTiles.length; i++){
        // Get the color of the tile image, though this is not the average color
        var image       = document.createElement('img');
        image.xdraw     = allTiles[i].x;
        image.ydraw     = allTiles[i].y;
        image.onload    = function () {

            var tileCanvas = document.createElement('canvas');
            var context = tileCanvas.getContext('2d');
            context.drawImage(this, this.xdraw, this.ydraw);
            var data = context.getImageData(this.xdraw, this.ydraw, TILE_WIDTH, TILE_HEIGHT).data;
            var hex = getAvgHexColor(data);

            var tileImageX = this.xdraw;
            var tileImageY = this.ydraw;
            var tileImage = new Image();


            if(!!window.Worker) {
                var worker = new Worker('js/myWorker.js');
                var message = {
                    url : 'http://localhost:8765'+'/color/'+hex
                };
                worker.postMessage(message);
                worker.onmessage = function (event) {
                    var svg =  'data:image/svg+xml;base64,'+window.btoa(event.data);
                    tileImage.onload = function () {
                        resultContext.drawImage(tileImage, tileImageX, tileImageY);
                        worker.terminate();
                    };
                    tileImage.src = svg;
                };
                worker.onerror = function (error) {
                    console.log("Worker indicates error: ", error.message);
                }
            }
        };
        image.src = allTiles[i].imageUrl;
    }
}


/**
 * Calculates the average color from the given imageData
 * @param imageData
 * @returns {string}
 */
function getAvgHexColor(imageData) {
    //Each pixel will have 4 colors.
    var red     = 0,
        green   = 0,
        blue    = 0

    //Total pixels in imageData = TILE_HEIGHT x TILE_WIDTH x 4colors
    for(var i = 0; i < imageData.length; i += 4){
        red     += imageData[i];
        green   += imageData[i+1];
        blue    += imageData[i+2];
    }

    var totalPixelPerColor = imageData.length/4;

    var avgRed      = Math.round(red/totalPixelPerColor),
        avgGreen    = Math.round(green/totalPixelPerColor),
        avgBlue     = Math.round(blue/totalPixelPerColor);
    return (256 + avgRed).toString(16).substr(1) +((1 << 24) + (avgGreen << 16) | (avgBlue << 8)).toString(16).substr(1);
}