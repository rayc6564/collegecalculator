window.addEventListener("DOMContentLoaded", () => {
  const gpaCalculator = document.getElementById("gpa-calculator");
  const gpaForm = document.getElementById("gpa-form");
  const formContainer = document.getElementById("form-container");

  const nameInput = document.getElementById("name-input");
  const creditHourInput = document.getElementById("credit-hour-input");
  const gpaInput = document.getElementById("gpa-input");

  const gpaCancelBtn = document.getElementById("gpa-cancel-btn");
  const confirmClose = document.getElementById("closing-tab-confirm");
  const gpaNoBtn = document.getElementById("gpa-no");
  const gpaYesBtn = document.getElementById("gpa-yes");
  const addUpdateBtn = document.getElementById("gpa-add-update-btn");
  const deleteAllBtn = document.getElementById("delete-all-btn");
  const addGpaClassBtn = document.getElementById("add-class-gpa");
  const backBtn = document.getElementById("back-btn");

  const params = new URLSearchParams(window.location.search);
  const groupId = params.get("groupId");

  const storageKeys = ["include", "exclude"].reduce((acc, cat) => {
    acc[cat] = {
      data: `${cat}Data_${groupId}`,
      credit: `${cat}CreditHours_${groupId}`,
      gpa: `${cat}Gpa_${groupId}`,
      qp: `${cat}Qp_${groupId}`,
    };
    return acc;
  }, {});

  // Single formData array for all classes
  let formData = JSON.parse(localStorage.getItem(storageKeys.include.data)) || [];

  const updateNumber = () => {
    let creditHourStorage = 0;
    let gpaStorage = 0;
    let qpStorage = 0;

    formData.forEach(({ creditHour, gpa }) => {
      creditHourStorage += parseFloat(creditHour);
      qpStorage += parseFloat(creditHour) * parseFloat(gpa);
    });

    gpaStorage = qpStorage / creditHourStorage || 0.0;

    // Save summary data to both include and exclude keys
    ["include", "exclude"].forEach((cat) => {
      localStorage.setItem(storageKeys[cat].credit, JSON.stringify(creditHourStorage));
      localStorage.setItem(storageKeys[cat].gpa, JSON.stringify(gpaStorage));
      localStorage.setItem(storageKeys[cat].qp, JSON.stringify(qpStorage));
    });
  };

  const updateFormContainer = () => {
    formContainer.innerHTML = "";

    formData.forEach(({ id, name, creditHour, gpa }) => {
      formContainer.innerHTML += `
        <div class="form-holder" id="${id}">
          <p><strong>Name: </strong>${name}</p>
          <p><strong>Credit Hour: </strong>${parseFloat(creditHour).toFixed(2)}</p>
          <p><strong>GPA: </strong>${parseFloat(gpa).toFixed(2)}</p>
          <button onclick="editForm(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteForm(this)" type="button" class="btn">Delete</button>
        </div>`;
    });
  };

  const reset = () => {
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

  const addOrUpdateForm = () => {
    const formObj = {
      id: `${nameInput.value.toLowerCase().split(" ").join("-")}`,
      name: nameInput.value,
      creditHour: creditHourInput.value,
      gpa: gpaInput.value,
    };

    const index = formData.findIndex((item) => item.id === formObj.id);
    if (index === -1) {
      formData.push({ ...formObj });
    } else {
      formData[index] = { ...formObj };
    }

    // Save same formData to both include and exclude keys
    ["include", "exclude"].forEach((cat) => {
      localStorage.setItem(storageKeys[cat].data, JSON.stringify(formData));
    });

    updateNumber();
    updateFormContainer();
    reset();
  };

  // Edit and Delete functions expect only the button (no category)
  window.editForm = (button) => {
    const id = button.parentElement.id;
    const target = formData.find((item) => item.id === id);
    if (!target) return;

    nameInput.value = target.name;
    creditHourInput.value = target.creditHour;
    gpaInput.value = target.gpa;

    addUpdateBtn.innerText = "Update";
    gpaForm.classList.toggle("hidden");
    addGpaClassBtn.classList.toggle("hidden");
    formContainer.classList.toggle("hidden");
    deleteAllBtn.classList.toggle("hidden");
    backBtn.classList.toggle("hidden");
  };

  window.deleteForm = (button) => {
    const id = button.parentElement.id;
    formData = formData.filter((item) => item.id !== id);

    // Save after deletion
    ["include", "exclude"].forEach((cat) => {
      localStorage.setItem(storageKeys[cat].data, JSON.stringify(formData));
    });

    updateNumber();
    updateFormContainer();
  };

  if (formData.length) {
    updateFormContainer();
  }

  updateNumber();

  backBtn.addEventListener("click", () => {
    window.location.href = "../group.html";
  });

  deleteAllBtn.addEventListener("click", () => {
    ["include", "exclude"].forEach((cat) => {
      localStorage.removeItem(storageKeys[cat].data);
      localStorage.removeItem(storageKeys[cat].credit);
      localStorage.removeItem(storageKeys[cat].gpa);
      localStorage.removeItem(storageKeys[cat].qp);
    });

    location.reload();
  });

  addGpaClassBtn.addEventListener("click", () => {
    gpaForm.classList.toggle("hidden");
    addGpaClassBtn.classList.toggle("hidden");
    formContainer.classList.toggle("hidden");
    deleteAllBtn.classList.toggle("hidden");
    backBtn.classList.toggle("hidden");
  });

  gpaCancelBtn.addEventListener("click", () => {
    const changed =
      nameInput.value !== "" || creditHourInput.value !== "" || gpaInput.value !== "";

    if (changed) {
      confirmClose.showModal();
    } else {
      reset();
    }
  });

  gpaNoBtn.addEventListener("click", () => confirmClose.close());
  gpaYesBtn.addEventListener("click", () => {
    confirmClose.close();
    reset();
  });

  gpaCalculator.addEventListener("submit", (e) => {
    e.preventDefault();
    addOrUpdateForm();
  });
});
