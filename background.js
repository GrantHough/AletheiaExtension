// Service worker
const checkURL = "https://aletheianode-ez7hynivba-uc.a.run.app"

function verifyText(raw_text, request_source, popup_response) { // Universal checking function
    console.log(raw_text);
    console.log(request_source);
    var response_text;
    fetch(checkURL + "/validate", {
        method: 'POST',
        body: JSON.stringify({
            text: raw_text, // Gather the text input from the DOM
        }),
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
    });
}
