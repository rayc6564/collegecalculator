// buttons
const addBtn = document.getElementById("add-btn");
const addPointsBtn = document.getElementById("add-points-btn");
const cancelBtn = document.getElementById("cancel-btn");
const knowGradeBtn = document.getElementById("know-points-btn");
const knowPointsAdd = document.getElementById("know-points-add");
const backBtn = document.getElementById("back-btn");
const yesBtn = document.getElementById("point-yes");
const noBtn = document.getElementById("point-no");

const pointText = document.getElementById("point-text");
const pointCalculator = document.querySelector(".points-calculator");
const gradePointInput = document.querySelector(".grade-point-input");
const knowText = document.getElementById("know-text");

const closingDialog = document.getElementById("closing-tab-confirm");

// point form input variables
const knowPointInput = document.getElementById("know-points-input");

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

const pointFormData = JSON.parse(localStorage.getItem("cgData")) || [];

let editPointFormData = {};

// Add the event listener for the "Add Points" button
addPointsBtn.addEventListener("click", () => {
    const createAssignmentDiv = document.createElement("div");
    createAssignmentDiv.className = "point-assignment";

    const createNameLabel = document.createElement("label");
    createNameLabel.textContent = "Name (Optional): ";
    const createNameInput = document.createElement("input");
    createNameInput.type = "text";
    createNameInput.className = "point-name-input";

    const createPointInput = document.createElement("input");
    createPointInput.type = "number";
    createPointInput.placeholder = "Enter Grade";
    createPointInput.min = 0;
    createPointInput.className = "point-input";

    createAssignmentDiv.appendChild(createNameLabel);
    createAssignmentDiv.appendChild(createNameInput);
    createAssignmentDiv.appendChild(createPointInput);

    const createDeleteBtn = document.createElement("button");
    createDeleteBtn.type = "button";
    createDeleteBtn.textContent = "Delete";
    createDeleteBtn.className = "delete-btn";

    // Insert the new assignment div after the the pointText
    pointText.insertAdjacentElement("beforeend", createAssignmentDiv);
    pointText.insertAdjacentElement("beforeend", createDeleteBtn);

    createDeleteBtn.addEventListener("click", () => {
        createAssignmentDiv.remove();
        createDeleteBtn.remove();
    })

});

knowGradeBtn.addEventListener("click", () => {
    gradePointInput.classList.add("hidden");
    addPointsBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    knowGradeBtn.classList.add("hidden");
    addBtn.classList.add("hidden");
    knowText.classList.remove("hidden");
    knowPointInput.classList.remove("hidden");
    knowPointsAdd.classList.remove("hidden");
    backBtn.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
    gradePointInput.classList.remove("hidden");
    addPointsBtn.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
    knowGradeBtn.classList.remove("hidden");
    addBtn.classList.remove("hidden");
    knowPointsAdd.classList.add("hidden");
    knowText.classList.add("hidden");
    knowPointInput.classList.add("hidden");
    backBtn.classList.add("hidden");
});

noBtn.addEventListener("click", () =>{
    closingDialog.close();
});

yesBtn.addEventListener("click", () =>{
    location.href = "cg.html";
});

cancelBtn.addEventListener("click", () => {
    const isEmpty = nameInput.value 
            || gradeAMaxNum.value || gradeAMinNum.value
            || gradeBMaxNum.value || gradeBMinNum.value
            || gradeCMaxNum.value ||gradeCMinNum.value 
            || gradeDMaxNum.value || gradeDMinNum.value
            || gradeFMaxNum.value || gradeFMinNum.value;

    const didChange = nameInput.value !== editPointFormData.name
            || gradeAMaxNum.value !== editPointFormData.gradeAMaxNum || gradeAMinNum.value !== editPointFormData.gradeAMinNum
            || gradeBMaxNum.value !== editPointFormData.gradeBMaxNum || gradeBMinNum.value !== editPointFormData.gradeBMinNum
            || gradeCMaxNum.value !== editPointFormData.gradeCMaxNum || gradeCMinNum.value !== editPointFormData.gradeCMinNum
            || gradeDMaxNum.value !== editPointFormData.gradeFMaxNum || gradeDMinNum.value !== editPointFormData.gradeDMinNum
            || gradeFMaxNum.value !== editPointFormData.gradeFMaxNum || gradeFMinNum.value !== editPointFormData.gradeFMinNum;

    if(isEmpty && didChange){
        closingDialog.showModal();
    }else{
        location.href = "cg.html";
    }
});

const addOrUpdatePointsForm = () => {

    let totalPoints = 0;

    const assignments = [];

    const pointAdd = document.querySelectorAll(".point-assignment");

    pointAdd.forEach(assignment => {
        const pointNameInput = assignment.querySelector(".point-name-input").value;
        const pointsInput = parseFloat(assignment.querySelector(".point-input").value);

        if (!isNaN(pointsInput)) {
            totalPoints += pointsInput;
            assignments.push({
                name: pointNameInput,
                points: pointsInput,
            });
        }
    });

    if (!isNaN(parseFloat(knowPointInput.value))) {
        totalPoints = parseFloat(knowPointInput.value);
    };

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
        points: totalPoints,
        assignments: assignments,
        system: "points",
    };

    const dataArrIndex = pointFormData.findIndex(item => item.id === cgFormObj.id);

    if (dataArrIndex === -1) {
        pointFormData.push(cgFormObj);
    } else {
        pointFormData[dataArrIndex] = cgFormObj;
    }

    localStorage.setItem("cgData", JSON.stringify(pointFormData));
    
    location.href="cg.html";


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

    editFormData.assignments.forEach(assignment => {
        const createAssignmentDiv = document.createElement("div");
        createAssignmentDiv.className = "point-assignment";

        const createNameLabel = document.createElement("label");
        createNameLabel.textContent = "Name (Optional): ";
        const createNameInput = document.createElement("input");
        createNameInput.type = "text";
        createNameInput.className = "point-name-input";
        createNameInput.value = assignment.name;

        const createPointInput = document.createElement("input");
        createPointInput.type = "number";
        createPointInput.placeholder = "Enter Grade";
        createPointInput.min = 0;
        createPointInput.className = "point-input";
        createPointInput.value = assignment.points;

        createAssignmentDiv.appendChild(createNameLabel);
        createAssignmentDiv.appendChild(createNameInput);
        createAssignmentDiv.appendChild(createPointInput);

        const createDeleteBtn = document.createElement("button");
        createDeleteBtn.type = "button";
        createDeleteBtn.textContent = "Delete";
        createDeleteBtn.className = "delete-btn";

        // Insert the new assignment div after the the pointText
        pointText.insertAdjacentElement("beforeend", createAssignmentDiv);
        pointText.insertAdjacentElement("beforeend", createDeleteBtn);

        createDeleteBtn.addEventListener("click", () => {
            createAssignmentDiv.remove();
            createDeleteBtn.remove();
        });
    });

    localStorage.removeItem("editFormData");

};

pointCalculator.addEventListener("submit", (e) => {
    e.preventDefault();

    addOrUpdatePointsForm();
});