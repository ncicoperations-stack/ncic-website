const reference =
localStorage.getItem("referenceNumber");

const category =
localStorage.getItem("category");

const date =
localStorage.getItem("submissionDate");

document.getElementById(
"referenceNumber"
).textContent = reference;

document.getElementById(
"category"
).textContent = category;

document.getElementById(
"submissionDate"
).textContent = date;