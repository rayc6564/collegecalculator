const addClassBtn = document.getElementById("add-class-btn");
const chooseText = document.getElementById("choose-text")
const chooseGradingSystem = document.querySelector(".choose-grading-system");
const formContainer = document.getElementById("form-container");
const deleteAllBtn = document.getElementById("delete-all-btn");

const currentClassCalculator = document.querySelector(".current-class-calculator");
  
const getData = JSON.parse(localStorage.getItem("cgData")) || [];

let editFormData = {};

// const systemBtn = document.getElementById("percentage-system-btn");
// systemBtn.addEventListener("click", () => {
//     alert("Sorry Work In Process Not Ready");
// });

addClassBtn.addEventListener("click", () =>{
    chooseText.classList.remove("hidden");
    chooseGradingSystem.classList.remove("hidden");
    addClassBtn.classList.add("hidden");
    formContainer.classList.add("hidden");
    deleteAllBtn.classList.add("hidden");
});

deleteAllBtn.addEventListener("click", () => {
    localStorage.clear();
});

const updatePointFormContainer = () => {
    formContainer.innerHTML = "";

    getData.forEach(({id, name, gradeAMinNum, gradeAMaxNum, gradeBMinNum, gradeBMaxNum, gradeCMinNum, gradeCMaxNum, gradeDMinNum, gradeDMaxNum, gradeFMinNum, gradeFMaxNum, points }) => {
        const pointsTemplate = (grade, gradeMinNum, gradeMaxNum) => `
            <div class="form-holder" id="${id}">
                <p><strong>Name: </strong>${name}</p>
                <p><strong>${grade}-Max: </strong>${gradeMaxNum}</p>
                <p><strong>${grade}-Min: </strong>${gradeMinNum}</p>
                <p><strong id="score-text">Grade: </strong>${points.toFixed(2)}</p>
                <button onclick="editForm(this)" type="button" class="btn">Edit</button>
                <button onclick="deleteForm(this)" type="button" id="delete-btn" class="btn">Delete</button>
            </div>
        `;

        let template;
            
        if (points >= gradeAMinNum) {
            template = pointsTemplate('A', gradeAMinNum, gradeAMaxNum);
        }else if (points >= gradeBMinNum && points <= gradeBMaxNum) {
            template = pointsTemplate('B', gradeBMinNum, gradeBMaxNum);
        }else if (points >= gradeCMinNum && points <= gradeCMaxNum) {
            template = pointsTemplate('C', gradeCMinNum, gradeCMaxNum);
        }else if (points >= gradeDMinNum && points <= gradeDMaxNum) {
            template = pointsTemplate('D', gradeDMinNum, gradeDMaxNum);
        }else if(points <= gradeFMaxNum) {
            template = pointsTemplate('F', gradeFMinNum, gradeFMaxNum);
        }

        formContainer.innerHTML += template;

    });
};

const deleteForm = (button) => {
    const dataArrIndex = getData.findIndex(item => item.id === button.parentElement.id);
    button.parentElement.remove();

    // splice is for removing, replacing, or adding, while returning the removed elements
    // 3 argument: 
    // 1st is mandatory which is to start
    // 2nd is number of items to remove
    // 3rd is optional replacement element
    getData.splice(dataArrIndex, 1);

    localStorage.setItem("cgData", JSON.stringify(getData));
};

const editForm = (button) => {
    const dataArrIndex = getData.findIndex(item => item.id === button.parentElement.id);

    editFormData = getData[dataArrIndex];

    editFormData.id = button.parentElement.id;

    localStorage.setItem("editFormData", JSON.stringify(editFormData));

    if(editFormData.system === "points"){
        location.href = "../POINT/point.html";
    }else if(editFormData.system === "percentage"){
        location.href = "../PERCENTAGE/percentage.html";
    }

};

getData.forEach(function() {
    updatePointFormContainer();
})