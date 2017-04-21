onmessage = function (message) {
    getThisTile(message.data.url);
    function getThisTile(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function (response) {
            if (request.readyState == XMLHttpRequest.DONE) {
                postMessage(request.responseText);
                close();
            }
        };
        request.send();
    }
};

