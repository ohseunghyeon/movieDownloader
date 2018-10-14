function xhrGet(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () { if (this.readyState == 4) { callback(this) } };
    xhr.send()
}
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    console.log(request);
    var req = JSON.parse(request);
    if (req.queryWord) {
        var url = "http://localhost/?query=" + req.queryWord;
        xhrGet(url, function (xhr) {
            var obj = JSON.parse(xhr.responseText);
            sendResponse(obj)
        })
    } else sendResponse({})
});
