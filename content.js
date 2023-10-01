// Content script to be injected in each webpage
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("Content script providing content body");
        //let body = document.getElementsByTagName("body");
        let body = document.body.innerHTML
        console.log(body);
        sendResponse(body);
});
console.log("Aletheia Content Script Running")