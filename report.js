console.log("NCIC report system loaded");

// -----------------------------
// CORE STEP SYSTEM (ALL FORMS)
// -----------------------------

const steps = document.querySelectorAll(".step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const progress = document.getElementById("progress");
const stepText = document.getElementById("stepText");

let currentStep = 0;

function updateForm() {
    steps.forEach(step => step.classList.remove("active"));

    if (steps[currentStep]) {
        steps[currentStep].classList.add("active");
    }

    stepText.textContent = `Step ${currentStep + 1} of ${steps.length}`;
    progress.style.width = `${((currentStep + 1) / steps.length) * 100}%`;

    prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";

    nextBtn.textContent = currentStep === steps.length - 1 ? "Submit" : "Next";
}

function generateReferenceNumber() {
    const today = new Date();

    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");

    const rand = Math.floor(100000 + Math.random() * 900000);

    return `NCIC-${y}${m}${d}-${rand}`;
}

// -----------------------------
// COLLECT FORM DATA (UNIVERSAL)
// -----------------------------

function collectFormData() {
    const data = {};

    const form = document.getElementById("reportForm");
    const elements = form.querySelectorAll("input, select, textarea");

    elements.forEach(el => {
        if (!el.id) return;

        if (el.type === "checkbox") {
            data[el.id] = el.checked;
        } else {
            data[el.id] = el.value;
        }
    });

    return data;
}

// -----------------------------
// CATEGORY DETECTION
// -----------------------------

function detectCategory() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes("online-scam")) return "Online Scam";
    if (path.includes("identity-theft")) return "Identity Theft";
    if (path.includes("financial-fraud")) return "Financial Fraud";
    if (path.includes("cybercrime")) return "Cybercrime";
    if (path.includes("honeytrap")) return "Honeytrap";
    if (path.includes("child-exploitation")) return "Child Safety";
    return "Other Incident";
}

// -----------------------------
// BUTTON ACTIONS
// -----------------------------

nextBtn.addEventListener("click", async () => {

    if (currentStep < steps.length - 1) {
        currentStep++;
        updateForm();
        return;
    }

    // SUBMIT STEP

    const referenceNumber = generateReferenceNumber();
    const submissionDate = new Date().toISOString();

    const formData = collectFormData();

    const payload = {
        referenceNumber,
        submissionDate,
        category: detectCategory(),
        ...formData
    };

    try {
        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbzcaGxl6cz2QD-bhDTrJKC87weu_GmnVQ0dghMq7aU_6BizR4zNNRzMhINvMtkxherQJQ/exec",
            {
                method: "POST",
                body: JSON.stringify(payload)
            }
        );

        const result = await response.json();

        if (result.success) {
            localStorage.setItem("referenceNumber", referenceNumber);
            localStorage.setItem("category", payload.category);
            localStorage.setItem("submissionDate", submissionDate);

            window.location.href = "confirmation.html";
        } else {
            alert("Submission failed. Try again.");
        }

    } catch (error) {
        console.error(error);
        alert("Unable to submit report. Check connection.");
    }
});

prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
        currentStep--;
        updateForm();
    }
});

updateForm();
