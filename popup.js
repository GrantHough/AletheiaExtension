/* This javascript file runs the popup generated when the chrome extension 
is clicked in the top right corner of the browser window.
See popup.css and popup.html*/

// Buttons
const verify_button = document.getElementById("verify_button");
const summary_button = document.getElementById("summary_button");
const bias_button = document.getElementById("bias_button");
const background_button = document.getElementById("background_button");
const settings_button = document.getElementById("settings_button");
const return_button = document.getElementById("return_button");
const requestVerifyButton = document.getElementById("request_button")

// Inputs / Outputs
const raw_text = document.getElementById("raw_text");
const loading_view = document.getElementById("loading_view");

// Scores
const wordCount = document.getElementById("word-count");
const readTime = document.getElementById("read-time");
const biasScore = document.getElementById("bias-score");
const trendingScore = document.getElementById("trending-score");
const depthScore = document.getElementById("depth-score");

// Blobs
const biasBlob = document.getElementById("bias-blob");
const trendingBlob = document.getElementById("trending-blob");
const depthBlob = document.getElementById("depth-blob");

// Containers
const scoreOuterContainer = document.getElementById("score-outer-container");
const textOuterContainer = document.getElementById("text-outer-container");
const functionOuterContainer = document.getElementById("function-outer-container");

const PLACEHOLDER = "<div class='loading-text'>Fact-checking passage...</div> <div class='loading-spinner'></div>";

document.addEventListener("DOMContentLoaded", function(event) { // Make sure that popup DOM is loaded to prevent possible strange bugs

    verify_button.addEventListener("click", statementWindow);
    return_button.addEventListener("click", return_function);
    summary_button.addEventListener("click", articleSummary);
    background_button.addEventListener("click", articleBackground);
    requestVerifyButton.addEventListener("click", verify_function);
    findArticleScores();        // Automatically when DOM loads

    function findArticleScores() {
        articleReport("scores");
    }
    function setArticleScores(scores) {
        wordCount.innerHTML = "" + scores.wordCount;
        readTime.innerHTML = "" + scores.readTime;
        biasScore.innerHTML = "" + scores.biasScore;
        trendingScore.innerHTML = "" + scores.trendingScore;
        depthScore.innerHTML = "" + scores.depthScore;
        biasBlob.style.background = hslToHex((100-biasScore), 100, 50); // Since bias score is opposite;
        trendingBlob.style.background = hslToHex(trendingScore, 100, 50);
        depthBlob.style.background = hslToHex(depthScore, 100, 50);
    }
    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
    function statementWindow() { // Manipulate UI to show place to paste text for statement validation.
        hide(scoreOuterContainer);
        hide(functionOuterContainer);
        show(textOuterContainer);
        show(raw_text);
        hide(loading_view);
        show(requestVerifyButton);
        show(return_button);
    }

    function verify_function() {
        loading_view.innerHTML = PLACEHOLDER;
        verify_button.removeEventListener("click", verify_function); // Prevent the button from being spammed by unbinding callback
        hideAll();
        show(textOuterContainer);
        show(loading_view);
        (async () => {
            const response = await chrome.runtime.sendMessage({action: "check", raw_text: raw_text.value});
            set_loading_view(response);
            console.log(response);
          })();
        verify_button.addEventListener("click", verify_function); // Rebind callback so the button can be clicked again
    }

    function return_function() {
        hide(textOuterContainer);
        show(scoreOuterContainer);
        show(functionOuterContainer);
        hide(raw_text);
    }

    function hideAll() {
        hide(scoreOuterContainer);
        hide(functionOuterContainer);
        hide(textOuterContainer);
        hide(return_button);
        hide(requestVerifyButton);
        hide(raw_text);
        hide(loading_view);
    }

    function set_loading_view(message) { // Utility function to improve readability
        loading_view.innerHTML = message;
        show(return_button);
        hide(raw_text);
        show(loading_view);
    }

    function show(element) { // Utility function to show given element
        element.style.display = "";
    }

    function hide (element) { // Utility function to hide given element
        element.style.display = "none";
    }/*
    function articleBias() {                    LEGACY FUNCTION
        loading_view.innerHTML = PLACEHOLDER;
        hide(raw_text);
        hide(summary_button);
        hide(bias_button);
        hide(verify_button);
        hide(background_button);
        show(loading_view);
        show(return_button);
        (async () => {
            const url = await chrome.tabs.query({ active: true, currentWindow: true})
            .then( tabs => {
                var url = tabs[0].url;
                set_loading_view("Analyzing Bias at URL: " + url)
                return url;
            });
            const response = await chrome.runtime.sendMessage({action: "articlebias", url: url});
            if (response === 'number') {
                set_loading_view(response.toFixed(2)*100 + "%");
            }
            else {
                set_loading_view(response);
            }
            console.log(response);
          })();
    }*/
    function articleSummary() {
        articleReport("summary");
    }
    function articleBackground() {
        articleReport("background");
    }
    function articleReport(reportType) {
        if (reportType != "scores") {
            loading_view.innerHTML = PLACEHOLDER;
            hideAll();
            show(textOuterContainer);
            show(loading_view);
        }
        (async () => {
            const url = await chrome.tabs.query({ active: true, currentWindow: true})
            .then( tabs => {
                var url = tabs[0].url;
                set_loading_view("<div class='loading-text'>Finding " + reportType + " of the article...</div> <div class='loading-spinner'></div>");
                // set_loading_view("Finding " + reportType + " of URL: " + url)
                return url;
            })
            const response = await chrome.runtime.sendMessage({action: reportType, url: url});
            if (reportType == "scores") {
                console.log("" + response)
                setArticleScores(response);
            }
            else {
                set_loading_view(response);
                console.log(response);
            }
          })();
    }
});