const finalGradeCalculator = document.querySelector(".final-grade-calculator");

const calculateBtn = document.getElementById("calculator-btn");
const clearBtn = document.getElementById("clear-btn");
const okBtn = document.getElementById("ok-btn");

const neededGradeText = document.getElementById("needed-grade-text");
const finalGradeDialog = document.getElementById("final-grade");

calculateBtn.addEventListener("click", (event) => {
    event.preventDefault();  // Prevent form submission

    const currentGradeInput = parseFloat(document.getElementById("current-grade-input").value);
    const finalWorthInput = parseFloat(document.getElementById("final-worth-input").value / 100);
    const wantedGradeInput = parseFloat(document.getElementById("wanted-grade-input").value);

    if(isNaN(currentGradeInput) || isNaN(wantedGradeInput) || isNaN(finalWorthInput)){
        alert("Please enter valid grades.");
        return;
    }

    const calculateGrade = (wantedGradeInput - (currentGradeInput * (1 - finalWorthInput))) / finalWorthInput;
    neededGradeText.innerText = calculateGrade.toFixed(2) + "%";
    finalGradeDialog.showModal();
});

okBtn.addEventListener("click", () => {
    finalGradeDialog.close();
});

clearBtn.addEventListener("click", (e) => {
    document.getElementById("final-grade-calculator-form").reset();
    neededGradeText.innerText = "";
});

finalGradeCalculator.addEventListener("submit", (e) => {
    e.preventDefault();
});