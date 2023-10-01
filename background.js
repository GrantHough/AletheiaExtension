// Service worker
const checkURL = "https://aletheianode-ez7hynivba-uc.a.run.app"
 
//let activeURL;

chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
     id: "1",
     title: "Check with Aletheia",
     contexts:["selection"],  // ContextType
     type: "normal"
    }); })

chrome.contextMenus.onClicked.addListener(verifyHelper); // Listener for right-click context menu
//chrome.tabs.onUpdated.addListener(getActiveUrl);

chrome.runtime.onMessage.addListener( // Listener for popup in top right
    function(request, sender, sendResponse) {

        if (request.action == "check") {
            const response = verifyText(request.raw_text, "popup", sendResponse); // Call verify function, add sendResponse as function parameter
        }
        if (request.action == "articlebias") {
            console.log("URL to be bias analyzed: " + request.url);
            const response = articleBias(request.url, sendResponse);
        }
        if (request.action == "summarize") {
            console.log("URL to be summarized: " + request.url);
            const response = articleSummary(request.url, sendResponse);
        }
        if (request.action == "background") {
            console.log("URL to be background checked: " + request.url);
            const response = articleBackground(request.url, sendResponse);
        }
        return true;
    }
  );

function verifyHelper(info) { // Unwraps the selected text from right-click context menu
    verifyText(info.selectionText, "contextMenu");
}

function verifyText(raw_text, request_source, popup_response) { // Universal checking function
    console.log("The raw text prompt is:" + raw_text);
    console.log(request_source);
    var response_text;
    fetch(checkURL + "/validate", {
        method: 'POST',
        body: JSON.stringify({
            text: raw_text // Gather the text input from the DOM
        }),
        mode: 'cors',
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    })
    .then(response => {
        if (response.ok) { // Only decode message if status ok, otherwise throw error
            return response.json()
        }
        else {
            throw new Error("Error contacting the server: Error Code " + response.status);
        }
    })
    .then(data => {
        console.log(data.message)
        response_text = data.message;
        return response_text
    })
    .catch((error) => {
        console.error(error);
        response_text = error.message;
        console.log("response_text:" + response_text)
        return response_text
    })
    .then(response_text => {
                popup_response(response_text);
                console.log("Response sent to popup")

    });
}

function articleBias(url, sendResponse) {
    console.log("Attempting bias check");
    console.log("URL" + url);
    fetch(checkURL + "/articlebias", {
        method: 'POST',
        body: JSON.stringify({
            url: url
        }),
        mode: 'cors',
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    })
    .then(response => {
        if (response.ok) { // Only decode message if status ok, otherwise throw error
            return response.json()
        }
        else {
            throw new Error("Error contacting the server: Error Code " + response.status);
        }
    })
    .then(data => {
        console.log(data.opinion);
        response_text = data.opinion;
        return response_text
    })
    .catch((error) => {
        console.error(error);
        response_text = error.opinion;
        console.log("response_text:" + response_text);
        return response_text
    })
    .then(response_text => {
                sendResponse(response_text);
                console.log("Response sent to popup")

    });
}

function articleSummary(url, sendResponse) {
    console.log("Attempting summary")
    console.log("URL" + url);
    fetch(checkURL + "/summarize", {
        method: 'POST',
        body: JSON.stringify({
            url: url
        }),
        mode: 'cors',
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    })
    .then(response => {
        if (response.ok) { // Only decode message if status ok, otherwise throw error
            return response.json();
        }
        else {
            throw new Error("Error contacting the server: Error Code " + response.status);
        }
    })
    .then(data => {
        console.log(data.summary)
        response_text = data.summary;
        return response_text
    })
    .catch((error) => {
        console.error(error);
        response_text = error.summary;
        console.log("response_text:" + response_text)
        return response_text
    })
    .then(response_text => {
                sendResponse(response_text);
                console.log("Response sent to popup")

    });
}

function articleBackground(url, sendResponse) {
    console.log("Attempting summary")
    console.log("URL" + url);
    fetch(checkURL + "/providerbackground", {
        method: 'POST',
        body: JSON.stringify({
            url: url
        }),
        mode: 'cors',
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    })
    .then(response => {
        if (response.ok) { // Only decode message if status ok, otherwise throw error
            return response.json();
        }
        else {
            throw new Error("Error contacting the server: Error Code " + response.status);
        }
    })
    .then(data => {
        console.log(data.background)
        response_text = data.background;
        return response_text
    })
    .catch((error) => {
        console.error(error);
        response_text = error.background;
        console.log("response_text:" + response_text)
        return response_text
    })
    .then(response_text => {
                sendResponse(response_text);
                console.log("Response sent to popup")
    });
}