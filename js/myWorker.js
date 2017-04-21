/**
 * Created by deeksha on 21/04/17.
 */

onmessage = function (message) {
    getThisTile(message.data.url);
    function getThisTile(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function (response) {
            if (request.readyState == XMLHttpRequest.DONE) {
                // var mySrc = 'data:image/svg+xml;base64,'+window.btoa(request.responseText);
                // var mySrc = 'data:image/svg+xml;base64,';
                var mySrc = {
                    svg : 'data:image/svg+xml;base64,',
                    responsetext : request.responseText
                }
                postMessage(mySrc);
                close();
            }
        };
        request.send();
    }
};

