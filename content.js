// Function to fetch the correction data
async function fetchCorrectionData() {
  try {
    const response = await fetch(chrome.runtime.getURL("data.txt"));
    const data = await response.text();
    return data.split("\n").reduce((acc, line) => {
      const [misspelled, corrected] = line.split("|");
      if (misspelled && corrected) {
        acc[misspelled.trim()] = corrected.trim();
      }
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching correction data:", error);
    return {};
  }
}

// Correct text in all input fields
fetchCorrectionData().then(corrections => {
  document.querySelectorAll("input, textarea").forEach(element => {
    element.addEventListener("input", event => {
      const inputElement = event.target;
      if (inputElement.tagName === "INPUT" || inputElement.tagName === "TEXTAREA") {
        inputElement.value = inputElement.value.replace(/\b(\w+)\b/g, (match, word) => {
          return corrections[word.toLowerCase()] || match;
        });
      }
    });
  });
});
