var resultCanvas, resultContext;

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

function splitImage(image){
    image.onload = function () {
        resultCanvas = document.getElementById('result-canvas');
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

// For Testing if the split images can be displayed as mosaic
function drawTiles(allTiles){
    for(var i = 0; i < allTiles.length; i++){
        var image       = document.createElement('img');
        image.xdraw     = allTiles[i].x;
        image.ydraw     = allTiles[i].y;
        image.onload    = function () {
            resultContext.drawImage(this, this.xdraw, this.ydraw);
        };
        image.src       = allTiles[i].imageUrl;
    }
}


function createMosaic(allTiles) {
    for(var i = 0; i < allTiles.length; i++){
        // Get the color of the tile image
        var image       = document.createElement('img');
        image.xdraw     = allTiles[i].x;
        image.ydraw     = allTiles[i].y;
        image.onload    = function () {

            var tileCanvas = document.createElement('canvas');
            var context = tileCanvas.getContext('2d');
            context.drawImage(this, this.xdraw, this.ydraw);
            var data = context.getImageData(this.xdraw, this.ydraw, TILE_WIDTH, TILE_HEIGHT).data;
            var hex = (256 + data[0]).toString(16).substr(1) +((1 << 24) + (data[1] << 16) | (data[2] << 8) | data[3]).toString(16).substr(1);

            // Get the tile from Server
            var url = 'http://localhost:8765'+'/color/'+hex;
            var request = new XMLHttpRequest();
            request.open('GET', url, true);

            //Location to place the tile
            var tileImageX = this.xdraw;
            var tileImageY = this.ydraw;

            // Place the svg received from server to the canvas
            request.onload = function (response) {
                if (request.readyState == XMLHttpRequest.DONE) {
                    var mySrc = 'data:image/svg+xml;base64,'+window.btoa(request.responseText);
                    var source = new Image();
                    source.onload = function() {
                        resultContext.drawImage(source, tileImageX, tileImageY);
                    };
                    source.src = mySrc;
                }
            };
            request.send(null);
        };
        image.src = allTiles[i].imageUrl;
    }
}