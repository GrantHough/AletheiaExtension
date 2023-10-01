/* This javascript file runs the popup generated when the chrome extension 
is clicked in the top right corner of the browser window.
See popup.css and popup.html*/

// Buttons
const verify_button = document.getElementById("verify_button");
const settings_button = document.getElementById("settings_button");
const return_button = document.getElementById("return_button");

// Inputs / Outputs
const raw_text = document.getElementById("raw_text");
const return_text = document.getElementById("return_text");

document.addEventListener("DOMContentLoaded", function(event) { // Make sure that popup DOM is loaded to prevent possible strange bugs

    verify_button.addEventListener("click", verify_function);
    return_button.addEventListener("click", return_function);

    function verify_function() {
        verify_button.removeEventListener("click", verify_function); // Prevent the button from being spammed by unbinding callback
        hide(raw_text);
        show(return_text);
        (async () => {
            const response = await chrome.runtime.sendMessage({action: "check", raw_text: raw_text});
            set_return_text(response);
            console.log(response);
          })();
        verify_button.addEventListener("click", verify_function); // Rebind callback so the button can be clicked again
        hide(verify_button);
        show(return_button);
    }

    function return_function() {
        hide(return_text);
        hide(return_button);
        show(raw_text);
        show(verify_button);
    }

    function set_return_text(message) { // Utility function to improve readability
        return_text.innerHTML = message;
    }

    function show(element) { // Utility function to show given element
        element.style.display = "block";
    }

    function hide (element) { // Utility function to hide given element
        element.style.display = "none";
    }
});