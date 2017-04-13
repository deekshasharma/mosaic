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
                // drawTiles(tiles);
                getColorForTile(tiles);
            }
        }
    }
}

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

function getColorForTile(allTiles) {
    for(var i = 0; i < allTiles.length; i++){
        var image       = document.createElement('img');
        image.xdraw     = allTiles[i].x;
        image.ydraw     = allTiles[i].y;
        image.onload    = function () {
            resultContext.drawImage(this, this.xdraw, this.ydraw);
        };
        image.src       = allTiles[i].imageUrl;

        console.log(resultContext.getImageData(this.xdraw, this.ydraw, TILE_WIDTH, TILE_HEIGHT));
    }

    
}


