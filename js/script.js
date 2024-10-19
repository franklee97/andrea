// CSV URL for the sheet data
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5K9c8CgZpvo1pwR46JFBk6cjEHqfr8uyfENrfVcrfBRe469gSqbWe8D5fWVSTtAvZgnykFRrEKcD7/pub?output=csv";

// Select the message element and button
const messageElement = document.querySelector(".message");
const button = document.getElementById("showReason");

let reasons = [];
let displayedReasons = JSON.parse(localStorage.getItem('displayedReasons')) || [];

// Fetch the reasons from the Google Sheet in CSV format
fetch(sheetURL)
  .then(response => response.text())  // Get the response as text
  .then(data => {
    // Split the CSV data into rows
    const rows = data.split('\n');

    // Loop through the rows and extract reasons
    for (let i = 1; i < rows.length; i++) {  // Start at 1 to skip the header
      const columns = rows[i].split(',');
      if (columns.length > 0) {
        reasons.push(columns[0]); // Assuming the reasons are in the first column
      }
    }

    // If reasons are loaded and some have already been shown, reset if needed
    if (displayedReasons.length === reasons.length) {
      displayedReasons = [];
    }
  })
  .catch(error => {
    console.error("Error fetching data from Google Sheets:", error);
    messageElement.textContent = "Error loading reasons. Please try again.";
  });

button.addEventListener("click", () => {
  if (reasons.length === 0) {
    messageElement.textContent = "Loading reasons, please wait...";
    return;
  }

  if (displayedReasons.length === reasons.length) {
    // Reset the list when all reasons have been shown
    displayedReasons = [];
  }

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * reasons.length);
  } while (displayedReasons.includes(randomIndex));

  // Show the new random reason
  displayedReasons.push(randomIndex);
  messageElement.textContent = reasons[randomIndex];

  // Update localStorage to save the shown reasons
  localStorage.setItem('displayedReasons', JSON.stringify(displayedReasons));
});
