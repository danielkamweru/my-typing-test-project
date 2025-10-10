const button = document.getElementById("button");
const text = document.getElementById("text");
const results = document.getElementById("results");

// Variables to store time
let startTime;
let isTesting = false; // false = not started, true = running

button.addEventListener("click", function () {
    if (!isTesting) {
        // --------- Start the test ----------
        text.value = "";            // clear any old text
        text.focus();               // put cursor inside input
        startTime = Date.now();     // record start time
        button.textContent = "Finish Test"; // change button text
        results.textContent = "Start typing...";
        isTesting = true;           // mark test as running
    } else {
        // --------- End the test ----------
        let endTime = Date.now();              // record end time
        let totalTime = (endTime - startTime) / 1000; // time in seconds

        // Count words typed (split by spaces)
        let words = text.value.trim().split(/\s+/).filter(word => word !== "").length;

        // Calculate words per minute
        let wpm = Math.round((words / totalTime) * 60);

        // Show results
        results.textContent = `You typed ${words} words in ${Math.round(totalTime)} seconds. Speed: ${wpm} WPM`;

        // Reset button and state
        button.textContent = "Start Test";
        isTesting = false;
    }
});







  














