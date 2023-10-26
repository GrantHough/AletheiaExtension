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
const return_text = document.getElementById("return_text");

// Scores
const wordCount = document.getElementById("word-count");
const readTime = document.getElementById("read-time");
const biasScore = document.getElementById("bias-score");
const trendingScore = document.getElementById("trending-score");
const depthScore = document.getElementById("depth-score");

// Containers
const scoreOuterContainer = document.getElementById("score-outer-container");
const textOuterContainer = document.getElementById("text-outer-container");
const functionOuterContainer = document.getElementById("function-outer-container");

const PLACEHOLDER = " Status Unknown ";

document.addEventListener("DOMContentLoaded", function(event) { // Make sure that popup DOM is loaded to prevent possible strange bugs

    verify_button.addEventListener("click", statementWindow);
    return_button.addEventListener("click", return_function);
    summary_button.addEventListener("click", articleSummary);
    background_button.addEventListener("click", articleBackground);
    requestVerifyButton.addEventListener("click", verify_function);
    findArticleScores();        // Automatically when DOM loads

    function findArticleScores() {
        (async () => {
            const response = await chrome.runtime.sendMessage({action:"scores"});
            setArticleScores(response);
        })
    }
    function setArticleScores(scores) {
        wordCount.innerHTML = scores.wordCount;
        readTime.innerHTML = scores.readTime;
        biasScore.innerHTML = scores.biasScore;
        trendingScore.innerHTML = scores.trendingScore;
        depthScore.innerHTML = scores.depthScore;
        return
    }

    function statementWindow() { // Manipulate UI to show place to paste text for statement validation.
        hide(scoreOuterContainer);
        hide(functionOuterContainer);
        show(textOuterContainer);
        show(raw_text);
        hide(return_text);
        show(requestVerifyButton);
        show(return_button);
    }

    function verify_function() {
        return_text.innerHTML = PLACEHOLDER;
        verify_button.removeEventListener("click", verify_function); // Prevent the button from being spammed by unbinding callback
        hideAll();
        show(textOuterContainer);
        show(return_text);
        (async () => {
            const response = await chrome.runtime.sendMessage({action: "check", raw_text: raw_text.value});
            set_return_text(response);
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
        hide(return_text);
    }

    function set_return_text(message) { // Utility function to improve readability
        return_text.innerHTML = message;
        show(return_button);
    }

    function show(element) { // Utility function to show given element
        element.style.display = "block";
    }

    function hide (element) { // Utility function to hide given element
        element.style.display = "none";
    }/*
    function articleBias() {                    LEGACY FUNCTION
        return_text.innerHTML = PLACEHOLDER;
        hide(raw_text);
        hide(summary_button);
        hide(bias_button);
        hide(verify_button);
        hide(background_button);
        show(return_text);
        show(return_button);
        (async () => {
            const url = await chrome.tabs.query({ active: true, currentWindow: true})
            .then( tabs => {
                var url = tabs[0].url;
                set_return_text("Analyzing Bias at URL: " + url)
                return url;
            });
            const response = await chrome.runtime.sendMessage({action: "articlebias", url: url});
            if (response === 'number') {
                set_return_text(response.toFixed(2)*100 + "%");
            }
            else {
                set_return_text(response);
            }
            console.log(response);
          })();
    }*/
    function articleSummary() {
        articleReport("summarize");
    }
    function articleBackground() {
        articleReport("background");
    }
    function articleReport(reportType) {
        return_text.innerHTML = PLACEHOLDER;
        hideAll();
        show(textOuterContainer);
        show(return_text);
        (async () => {
            const url = await chrome.tabs.query({ active: true, currentWindow: true})
            .then( tabs => {
                var url = tabs[0].url;
                set_return_text("Finding " + reportType + " of URL: " + url)
                return url;
            })
            const response = await chrome.runtime.sendMessage({action: reportType, url: url});
            set_return_text(response);
            console.log(response);
          })();
    }
});