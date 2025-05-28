const addBtn = document.getElementById("add-btn");
const addAssignmentBtn = document.getElementById("add-assignment-btn");
const cancelBtn = document.getElementById("cancel-btn");
const knowGradeBtn = document.getElementById("know-grade-btn");
const knowGradeAdd = document.getElementById("know-grade-add");
const backBtn = document.getElementById("back-btn");
const yesBtn = document.getElementById("percentage-yes");
const noBtn = document.getElementById("percentage-no");

const assignmentText = document.getElementById("assignment-text");
const percentageCalculator = document.querySelector(".percentage-calculator");
const gradePointInput = document.querySelector(".grade-point-input");
const knowText = document.getElementById("know-text");

const knowGradeInput = document.getElementById("know-grade-input");

const nameInput = document.getElementById("name-input");
const gradeAMinNum = document.getElementById("grade-a-min-number");
const gradeAMaxNum = document.getElementById("grade-a-max-number");
const gradeBMinNum = document.getElementById("grade-b-min-number");
const gradeBMaxNum = document.getElementById("grade-b-max-number");
const gradeCMinNum = document.getElementById("grade-c-min-number");
const gradeCMaxNum = document.getElementById("grade-c-max-number");
const gradeDMinNum = document.getElementById("grade-d-min-number");
const gradeDMaxNum = document.getElementById("grade-d-max-number");
const gradeFMinNum = document.getElementById("grade-f-min-number");
const gradeFMaxNum = document.getElementById("grade-f-max-number");

const percentageFormData = JSON.parse(localStorage.getItem("cgData")) || [];

let editPercentageFormData = {};

knowGradeBtn.addEventListener("click", () => {
    gradePointInput.classList.add("hidden");
    addBtn.classList.add("hidden");
    addAssignmentBtn.classList.add("hidden");
    knowGradeBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    backBtn.classList.remove("hidden");
    knowGradeAdd.classList.remove("hidden");
    knowGradeAdd.classList.remove("hidden");
    knowText.classList.remove("hidden");
    knowGradeInput.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
    gradePointInput.classList.remove("hidden");
    addBtn.classList.remove("hidden");
    addAssignmentBtn.classList.remove("hidden");
    knowGradeBtn.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
    backBtn.classList.add("hidden");
    knowGradeAdd.classList.add("hidden");
    knowGradeAdd.classList.add("hidden");
    knowText.classList.add("hidden");
    knowGradeInput.classList.add("hidden");
});

knowGradeAdd.addEventListener("click", () =>{
    const isEmpty = nameInput.value === "" 
            || gradeAMaxNum.value === "" || gradeAMinNum.value === ""
            || gradeBMaxNum.value === "" || gradeBMinNum.value === ""
            || gradeCMaxNum.value === "" ||gradeCMinNum.value === ""
            || gradeDMaxNum.value === "" || gradeDMinNum.value === ""
            || gradeFMaxNum.value === "" || gradeFMinNum.value === "";
    if(isEmpty){
        alert("Please Fill Out Previous Page Values");
    };
});

noBtn.addEventListener("click", () =>{
    closingDialog.close();
});

yesBtn.addEventListener("click", () =>{
    location.href = "../CG/cg.html";
});

// cancelBtn fixed
cancelBtn.addEventListener("click", () => {
    const isEmpty = nameInput.value === "" 
        && gradeAMaxNum.value === "" && gradeAMinNum.value === ""
        && gradeBMaxNum.value === "" && gradeBMinNum.value === ""
        && gradeCMaxNum.value === "" && gradeCMinNum.value === "" 
        && gradeDMaxNum.value === "" && gradeDMinNum.value === ""
        && gradeFMaxNum.value === "" && gradeFMinNum.value === "";

    const didChange = nameInput.value !== editPercentageFormData.name
        || gradeAMaxNum.value !== editPercentageFormData.gradeAMaxNum || gradeAMinNum.value !== editPercentageFormData.gradeAMinNum
        || gradeBMaxNum.value !== editPercentageFormData.gradeBMaxNum || gradeBMinNum.value !== editPercentageFormData.gradeBMinNum
        || gradeCMaxNum.value !== editPercentageFormData.gradeCMaxNum || gradeCMinNum.value !== editPercentageFormData.gradeCMinNum
        || gradeDMaxNum.value !== editPercentageFormData.gradeDMaxNum || gradeDMinNum.value !== editPercentageFormData.gradeDMinNum
        || gradeFMaxNum.value !== editPercentageFormData.gradeFMaxNum || gradeFMinNum.value !== editPercentageFormData.gradeFMinNum;

    if (!isEmpty && didChange) {
        closingDialog.showModal();
    } else {
        location.href = "../CG/cg.html";
    }
});


addAssignmentBtn.addEventListener("click", () => {
    const percentageDiv = document.createElement("div");
    percentageDiv.className = "percentage-assignment";

    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Name (Optional): ";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "percentage-name-input";

    const percentageInput = document.createElement("input");
    percentageInput.type = "number";
    percentageInput.placeholder = "Assignment %";
    percentageInput.min = 0;
    percentageInput.className = "percentage-input";
    percentageInput.step = "0.01";

    const percentageSymbol = document.createElement("label");
    percentageSymbol.textContent = "%";

    const assignmentAddBtn = document.createElement("button");
    assignmentAddBtn.textContent = "Add Grade";
    assignmentAddBtn.type = "button";
    assignmentAddBtn.className = "add-grades";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";

    percentageDiv.appendChild(nameLabel);
    percentageDiv.appendChild(nameInput);
    percentageDiv.appendChild(percentageInput);
    percentageDiv.appendChild(percentageSymbol);

    // Insert the new assignment div after the assignmentText
    assignmentText.insertAdjacentElement("beforeend", percentageDiv);
    assignmentText.insertAdjacentElement("beforeend", assignmentAddBtn);
    assignmentText.insertAdjacentElement("beforeend", deleteBtn);

    assignmentAddBtn.addEventListener("click", function() {
        const assignmentGradeDiv = document.createElement("div");
        assignmentGradeDiv.className = "assignment-grade";

        const gradeNameLabel = document.createElement("label");
        gradeNameLabel.textContent = "Name (Optional): ";
        const gradeNameInput = document.createElement("input");
        gradeNameInput.type = "text";
        gradeNameInput.className = "assignment-grade-name";

        const assignmentInput = document.createElement("input");
        assignmentInput.type = "number";
        assignmentInput.placeholder = "Enter Grade";
        assignmentInput.min = 0;
        assignmentInput.className = "assignment-grade-input";
        assignmentInput.step = "0.01";

        const subDeleteBtn = document.createElement("button");
        subDeleteBtn.textContent = "Delete";
        subDeleteBtn.type = "button";
        subDeleteBtn.className = "sub-delete-btn";

        assignmentGradeDiv.appendChild(gradeNameLabel);
        assignmentGradeDiv.appendChild(gradeNameInput);
        assignmentGradeDiv.appendChild(assignmentInput);
        assignmentGradeDiv.appendChild(subDeleteBtn);

        // Insert the new assignment grade div before the clicked "Add Grade" button
        this.insertAdjacentElement("beforebegin", assignmentGradeDiv);

        subDeleteBtn.addEventListener("click", function() {
            assignmentGradeDiv.remove();
        });

        deleteBtn.addEventListener("click", function() {
            percentageDiv.remove();
            assignmentAddBtn.remove();
            this.remove();
            
            assignmentGradeDiv.remove();
            subDeleteBtn.remove();
        });
    });
});

const addOrUpdatePercentageForm = () => {
    let totalWeightedPoints = 0;
    let totalPossibleWeight = 0;

    const assignmentGrades = [];

    const percentageInputDiv = document.querySelectorAll(".percentage-assignment");

    percentageInputDiv.forEach(assignment => {
        const percentageNameInput = assignment.querySelector(".percentage-name-input").value;
        const percentageInput = parseFloat(assignment.querySelector(".percentage-input").value);

        if (isNaN(percentageInput)) return; // Skip if percentage isn't a number

        const weight = percentageInput / 100; // Convert percentage to decimal (e.g., 20% → 0.20)

        // Find all .assignment-grade elements that are siblings after this assignment
        let nextSibling = assignment.nextElementSibling;
        const gradeElements = [];
        while (nextSibling) {
            if (nextSibling.classList.contains("assignment-grade")) {
                gradeElements.push(nextSibling);
            } else if (nextSibling.classList.contains("add-grades") || 
                      nextSibling.classList.contains("delete-btn")) {
                // Stop when we hit buttons for this assignment
                break;
            }
            nextSibling = nextSibling.nextElementSibling;
        }

        let totalAssignmentPoints = 0;
        let totalAssignmentGrades = 0;
        const assignmentContainer = [];

        gradeElements.forEach(gradeElement => {
            const gradeInput = parseFloat(gradeElement.querySelector(".assignment-grade-input").value);
            const gradeNameInput = gradeElement.querySelector(".assignment-grade-name").value;
            
            if (!isNaN(gradeInput)) {
                totalAssignmentPoints += gradeInput; // This is already in percentage form (e.g., 85 for 85%)
                totalAssignmentGrades++;
                assignmentContainer.push({
                    name: gradeNameInput,
                    grade: gradeInput,
                });
            }
        });

        if (totalAssignmentGrades > 0) {
            const averageGrade = totalAssignmentPoints / totalAssignmentGrades;
            // Multiply by weight (which is already in decimal form)
            const weightedPoints = (averageGrade * weight);
            
            totalWeightedPoints += weightedPoints;
            totalPossibleWeight += weight;

            assignmentGrades.push({
                percentageName: percentageNameInput,
                percentage: percentageInput,
                assignment: assignmentContainer,
            });
        }
    });

    // Calculate final grade based on completed assignments only
    let finalGrade = 0;
    if (totalPossibleWeight > 0) {
        // We don't need to multiply by 100 here because we kept everything in percentage scale
        finalGrade = (totalWeightedPoints / totalPossibleWeight);
        // Round to exactly 2 decimal places
        finalGrade = Math.round(finalGrade * 100) / 100;
        // Ensure exactly 2 decimal places (e.g., 62.5 becomes 62.50)
        finalGrade = finalGrade.toFixed(2);
    }

    // If user entered a known grade, use that instead (with proper formatting)
    const knownGradeValue = parseFloat(knowGradeInput.value);
    if (!isNaN(knownGradeValue) && knowGradeInput.value !== "") {
        finalGrade = parseFloat(knownGradeValue).toFixed(2);
    }

    const cgFormObj = {
        id: editFormData ? editFormData.id : `${nameInput.value.toLowerCase().split(" ").join("-")}`,
        name: nameInput.value,
        gradeAMinNum: gradeAMinNum.value,
        gradeAMaxNum: gradeAMaxNum.value,
        gradeBMinNum: gradeBMinNum.value,
        gradeBMaxNum: gradeBMaxNum.value,
        gradeCMinNum: gradeCMinNum.value,
        gradeCMaxNum: gradeCMaxNum.value,
        gradeDMinNum: gradeDMinNum.value,
        gradeDMaxNum: gradeDMaxNum.value,
        gradeFMinNum: gradeFMinNum.value,
        gradeFMaxNum: gradeFMaxNum.value,
        points: finalGrade,
        assignments: assignmentGrades,
        system: "percentage",
    };

    const dataArrIndex = percentageFormData.findIndex(item => item.id === cgFormObj.id);

    if (dataArrIndex === -1) {
        percentageFormData.push(cgFormObj);
    } else {
        percentageFormData[dataArrIndex] = cgFormObj;
    }

    localStorage.setItem("cgData", JSON.stringify(percentageFormData));
    location.href = "../CG/cg.html";
};

const editFormData = JSON.parse(localStorage.getItem("editFormData")) || 0;

if (editFormData) {
    addBtn.innerText = "Update";

    nameInput.value = editFormData.name;
    gradeAMinNum.value = editFormData.gradeAMinNum;
    gradeAMaxNum.value = editFormData.gradeAMaxNum;
    gradeBMinNum.value = editFormData.gradeBMinNum;
    gradeBMaxNum.value = editFormData.gradeBMaxNum;
    gradeCMinNum.value = editFormData.gradeCMinNum;
    gradeCMaxNum.value = editFormData.gradeCMaxNum;
    gradeDMinNum.value = editFormData.gradeDMinNum;
    gradeDMaxNum.value = editFormData.gradeDMaxNum;
    gradeFMinNum.value = editFormData.gradeFMinNum;
    gradeFMaxNum.value = editFormData.gradeFMaxNum;

    // Populate basic form fields
    nameInput.value = editFormData.name;
    gradeAMinNum.value = editFormData.gradeAMinNum;
    gradeAMaxNum.value = editFormData.gradeAMaxNum;
    // ... (other grade range inputs)

    editFormData.assignments.forEach(assignment => {
        // Create the assignment group container
        const assignmentGroup = document.createElement("div");
        assignmentGroup.className = "assignment-group";
        
        const percentageDiv = document.createElement("div");
        percentageDiv.className = "percentage-assignment";

        // Create and populate assignment inputs
        const nameLabel = document.createElement("label");
        nameLabel.textContent = "Name (Optional): ";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.className = "percentage-name-input";
        nameInput.value = assignment.percentageName;

        const percentageInput = document.createElement("input");
        percentageInput.type = "number";
        percentageInput.placeholder = "Assignment %";
        percentageInput.min = 0;
        percentageInput.className = "percentage-input";
        percentageInput.step = "0.01";
        percentageInput.value = assignment.percentage;

        const percentageSymbol = document.createElement("label");
        percentageSymbol.textContent = "%";

        percentageDiv.appendChild(nameLabel);
        percentageDiv.appendChild(nameInput);
        percentageDiv.appendChild(percentageInput);
        percentageDiv.appendChild(percentageSymbol);

        // Create buttons
        const assignmentAddBtn = document.createElement("button");
        assignmentAddBtn.textContent = "Add Grade";
        assignmentAddBtn.type = "button";
        assignmentAddBtn.className = "add-grades";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";

        // Add assignment group to DOM
        assignmentGroup.appendChild(percentageDiv);
        
        // Add existing grades to this group
        assignment.assignment.forEach(assignmentGrade => {
            const assignmentGradeDiv = document.createElement("div");
            assignmentGradeDiv.className = "assignment-grade";

            const subNameLabel = document.createElement("label");
            subNameLabel.textContent = "Name (Optional): ";
            const subNameInput = document.createElement("input");
            subNameInput.type = "text";
            subNameInput.className = "assignment-grade-name";
            subNameInput.value = assignmentGrade.name;

            const assignmentInput = document.createElement("input");
            assignmentInput.type = "number";
            assignmentInput.placeholder = "Enter Grade";
            assignmentInput.min = 0;
            assignmentInput.className = "assignment-grade-input";
            assignmentInput.step = "0.01";
            assignmentInput.value = assignmentGrade.grade;

            const subDeleteBtn = document.createElement("button");
            subDeleteBtn.textContent = "Delete";
            subDeleteBtn.className = "sub-delete-btn";
            subDeleteBtn.type = "button";

            assignmentGradeDiv.appendChild(subNameLabel);
            assignmentGradeDiv.appendChild(subNameInput);
            assignmentGradeDiv.appendChild(assignmentInput);
            assignmentGradeDiv.appendChild(subDeleteBtn);

            assignmentGroup.appendChild(assignmentGradeDiv);

            subDeleteBtn.addEventListener("click", function() {
                assignmentGradeDiv.remove();
            });
        });

        // Add buttons to the group
        assignmentGroup.appendChild(assignmentAddBtn);
        assignmentGroup.appendChild(deleteBtn);
        
        // Add the complete group to the container
        assignmentText.appendChild(assignmentGroup);

        // Set up event listeners for this group
        assignmentAddBtn.addEventListener("click", function() {
            const assignmentGradeDiv = document.createElement("div");
            assignmentGradeDiv.className = "assignment-grade";

            const gradeNameLabel = document.createElement("label");
            gradeNameLabel.textContent = "Name (Optional): ";
            const gradeNameInput = document.createElement("input");
            gradeNameInput.type = "text";
            gradeNameInput.className = "assignment-grade-name";

            const assignmentInput = document.createElement("input");
            assignmentInput.type = "number";
            assignmentInput.placeholder = "Enter Grade";
            assignmentInput.min = 0;
            assignmentInput.className = "assignment-grade-input";
            assignmentInput.step = "0.01";

            const subDeleteBtn = document.createElement("button");
            subDeleteBtn.textContent = "Delete";
            subDeleteBtn.type = "button";
            subDeleteBtn.className = "sub-delete-btn";

            assignmentGradeDiv.appendChild(gradeNameLabel);
            assignmentGradeDiv.appendChild(gradeNameInput);
            assignmentGradeDiv.appendChild(assignmentInput);
            assignmentGradeDiv.appendChild(subDeleteBtn);

            // Insert before the Add Grade button
            this.insertAdjacentElement("beforebegin", assignmentGradeDiv);

            subDeleteBtn.addEventListener("click", function() {
                assignmentGradeDiv.remove();
            });
        });

        deleteBtn.addEventListener("click", function() {
            assignmentGroup.remove();
        });
    });

    localStorage.removeItem("editFormData");
}

percentageCalculator.addEventListener("submit", (e) => {
    e.preventDefault();

    addOrUpdatePercentageForm();

});