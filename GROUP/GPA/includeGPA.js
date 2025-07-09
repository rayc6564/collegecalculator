
// gpa variables
const gpaCalculator = document.getElementById("gpa-calculator");
const gpaForm = document.getElementById("gpa-form");
const formContainer = document.getElementById("form-container");

// input variable
const nameInput = document.getElementById("name-input");
const creditHourInput = document.getElementById("credit-hour-input");
const gpaInput = document.getElementById("gpa-input");

// button variables
const gpaCancelBtn = document.getElementById("gpa-cancel-btn");
const confirmClose = document.getElementById("closing-tab-confirm");
const gpaNoBtn = document.getElementById("gpa-no");
const gpaYesBtn = document.getElementById("gpa-yes");
const addUpdateBtn = document.getElementById("gpa-add-update-btn");
const deleteAllBtn = document.getElementById("delete-all-btn");


// add class button
const addGpaClassBtn = document.getElementById("add-class-gpa");

const creditHourNumber = document.getElementById("credit-hour-number");
const gpaNumber = document.getElementById("gpa-number");
const qpNumber = document.getElementById("qp-number");

const backBtn = document.getElementById('back-btn');

// 1. Read groupId from URL
const params = new URLSearchParams(window.location.search);
const groupId = params.get("groupId");  // this is the group name
const include = params.get("include") === "true"; // string -> boolean

// 2. Define storage key per group
const storageKey = `${include ? "include" : "exclude"}Data_${groupId}`;

// retrieval of data from local storage or an empty array and use it as a string
const formData = JSON.parse(localStorage.getItem(storageKey)) || [];

let currentFormData = {};

backBtn.addEventListener('click', () => {
  window.location.href = '../group.html';
});

deleteAllBtn.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${include ? "include" : "exclude"}CreditHours_${groupId}`);
    localStorage.removeItem(`${include ? "include" : "exclude"}Gpa_${groupId}`);
    localStorage.removeItem(`${include ? "include" : "exclude"}Qp_${groupId}`);
    location.reload();
});

// this is just for organization and reliability
const addOrUpdateForm = () => {
    const dataArrIndex = formData.findIndex(item => item.id === currentFormData.id);

    const formObj = {
        // split does this - "WALK DOG" -> "walk-dog"
        // the ${} turns the whole expression into strings
        id: `${nameInput.value.toLowerCase().split(" ").join("-")}`,
        name: nameInput.value,
        creditHour: creditHourInput.value,
        gpa: gpaInput.value,
    };

    
    if(dataArrIndex === -1){
        // "unshift" adds the parameter to the beginning of the array
        // but i want to put it at back instead of front using "push"
        formData.push(formObj);
    }else{
        // allows the edited input to be changed when submit
        formData[dataArrIndex] = formObj;
    };

    localStorage.setItem(storageKey, JSON.stringify(formData));

    updateFormContainer();

    updateNumber();

    reset();

};

const updateNumber = () => {
    let creditHourStorage = 0;
    let gpaStorage = 0;
    let qpStorage = 0;

    // the reason for not putting gpa in this is because
    // we would be calculating each class gpa and not the overall gpa
    formData.forEach(({ creditHour, gpa }) => {
        creditHourStorage += parseFloat(creditHour);
        qpStorage += parseFloat(creditHour) * parseFloat(gpa);
    });

    gpaStorage = qpStorage / creditHourStorage || 0.00;

    // just in case of null in the javascript 
    creditHourStorage = creditHourStorage || 0;
    qpStorage = qpStorage || 0;

    creditHourNumber.innerText = creditHourStorage.toFixed(2);
    gpaNumber.innerText = gpaStorage.toFixed(2);
    qpNumber.innerText = qpStorage.toFixed(2);

    // Store the updated values in localStorage
    localStorage.setItem(`${include ? "include" : "exclude"}CreditHours_${groupId}`, JSON.stringify(creditHourStorage));
    localStorage.setItem(`${include ? "include" : "exclude"}Gpa_${groupId}`, JSON.stringify(gpaStorage));
    localStorage.setItem(`${include ? "include" : "exclude"}Qp_${groupId}`, JSON.stringify(qpStorage));
};

const updateFormContainer = () => {

    // to avoid duplication when adding more task
    formContainer.innerHTML = "";

    formData.forEach(({id, name, creditHour, gpa}) => {
        formContainer.innerHTML += `
            <div class="form-holder" id="${id}">
                <p><strong>Name: </strong>${name}</p>
                <p><strong>Credit Hour: </strong>${parseFloat(creditHour).toFixed(2)}</p>
                <p><strong>GPA: </strong>${parseFloat(gpa).toFixed(2)}</p>
                <button onclick="editForm(this)" type="button" class="btn">Edit</button>
                <button onclick="deleteForm(this)" type="button" class="btn">Delete</button>
            </div>
        `
    });
};

const deleteForm = (button) => {
    const dataArrIndex = formData.findIndex(item => item.id === button.parentElement.id);
    button.parentElement.remove();

    // splice is for removing, replacing, or adding, while returning the removed elements
    // 3 argument: 
    // 1st is mandatory which is to start
    // 2nd is number of items to remove
    // 3rd is optional replacement element
    formData.splice(dataArrIndex, 1);

    localStorage.setItem(storageKey, JSON.stringify(formData));

    updateNumber();
};

const editForm = (button) => {
    const dataArrIndex = formData.findIndex(item => item.id === button.parentElement.id);

    // to keep track of what is being edit
    currentFormData = formData[dataArrIndex];

    // put in the input from that form
    nameInput.value = currentFormData.name;
    creditHourInput.value = currentFormData.creditHour;
    gpaInput.value = currentFormData.gpa;
    
    // replace the button text
    addUpdateBtn.innerText = "Update";

    // show the form
    gpaForm.classList.toggle("hidden");

    addGpaClassBtn.classList.toggle("hidden");

    formContainer.classList.toggle("hidden");

    deleteAllBtn.classList.toggle("hidden");

    backBtn.classList.toggle("hidden");

};

// to reset everything when add class button is pressed after user input
const reset = () => {
    // make sure the text of the button is correct since when we edit the text "Update Form will stay like that forever"
    addUpdateBtn.innerText = "Add";

    nameInput.value = "";
    creditHourInput.value = "";
    gpaInput.value = "";
    gpaForm.classList.toggle("hidden");
    addGpaClassBtn.classList.toggle("hidden");
    formContainer.classList.toggle("hidden");
    deleteAllBtn.classList.toggle("hidden");
    backBtn.classList.toggle("hidden");

};

if(formData.length){
    updateFormContainer();
};

// calling the function to update the numbers when page is loaded
updateNumber();

// add button tab
addGpaClassBtn.addEventListener("click", () => {
    gpaForm.classList.toggle("hidden");
    addGpaClassBtn.classList.toggle("hidden");
    formContainer.classList.toggle("hidden");
    deleteAllBtn.classList.toggle("hidden");
    backBtn.classList.toggle("hidden");
});

gpaCancelBtn.addEventListener("click", () => {

    // if user makes no change, the dialog message does not need to show up
    const isInputChange = nameInput.value != currentFormData.name || creditHourInput.value != currentFormData.creditHour || gpaInput.value != currentFormData.gpa;
    const isValue = nameInput.value || creditHourInput.value || gpaInput.value;
    if(isValue && isInputChange){
        confirmClose.showModal();
    }else{
        reset();
    }

});

gpaNoBtn.addEventListener("click", () => {
    confirmClose.close();
});

gpaYesBtn.addEventListener("click", () => {
    confirmClose.close();
    reset();
});

// stop the browser from refreshing the page after submitting the form
gpaCalculator.addEventListener("submit", (e) =>{
    e.preventDefault();

    addOrUpdateForm();
    
});