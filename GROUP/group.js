const addGroupBtn = document.getElementById("addGroupBtn");
const groupContainer = document.getElementById("groupContainer");
const newGroupContainer = document.getElementById("new-group-container");
const addBtn = document.getElementById("add-btn");
const groupNameInput = document.getElementById("group-name-input");
const includeCheckbox = document.getElementById("include-checkbox");
const excludeCheckbox = document.getElementById("exclude-checkbox");
const deleteAllBtn = document.getElementById("deleteAllBtn");

const modalOverlay = document.getElementById('modal-overlay');

let editingGroupIndex = null; // Used to track which group is being edited

addGroupBtn.addEventListener('click', () => {
  newGroupContainer.classList.remove('hidden');
  modalOverlay.classList.remove('hidden');
  reset();
  editingGroupIndex = null;
});

modalOverlay.addEventListener('click', () => {
  newGroupContainer.classList.add('hidden');
  modalOverlay.classList.add('hidden');
  reset();
});

window.addEventListener("DOMContentLoaded", () => {
  const savedGroups = JSON.parse(localStorage.getItem("groups")) || [];
  savedGroups.forEach(createGroupElement);
  updateSummaries();
  updateGroupContainerBorder();
});

addBtn.addEventListener("click", () => {
  const groupName = groupNameInput.value.trim();

  if (!groupName) return;

  const groups = JSON.parse(localStorage.getItem("groups")) || [];

  if (editingGroupIndex !== null) {
    // Editing mode: keep include/exclude as is, only update the name
    const oldGroup = groups[editingGroupIndex];
    const include = oldGroup.include;
    const exclude = oldGroup.exclude;

    // Check for duplicate new group name (excluding the current one)
    if (groups.some((g, i) => g.name === groupName && i !== editingGroupIndex)) {
      alert("Group name already exists.");
      return;
    }

    const newGroup = { name: groupName, include, exclude };

    // Replace in array
    groups[editingGroupIndex] = newGroup;
    localStorage.setItem("groups", JSON.stringify(groups));

    // Rename localStorage keys for GPA data (only keys that exist)
    ['include', 'exclude'].forEach(cat => {
      const prefix = `${cat}`;
      const oldKeys = [
        `${prefix}Data_${oldGroup.name}`,
        `${prefix}CreditHours_${oldGroup.name}`,
        `${prefix}Gpa_${oldGroup.name}`,
        `${prefix}Qp_${oldGroup.name}`
      ];
      const newKeys = [
        `${prefix}Data_${groupName}`,
        `${prefix}CreditHours_${groupName}`,
        `${prefix}Gpa_${groupName}`,
        `${prefix}Qp_${groupName}`
      ];

      oldKeys.forEach((key, i) => {
        if (localStorage.getItem(key)) {
          localStorage.setItem(newKeys[i], localStorage.getItem(key));
          localStorage.removeItem(key);
        }
      });
    });

    groupContainer.innerHTML = "";
    groups.forEach(createGroupElement);
  } else {
    // Creating new group: get include/exclude from checkboxes (enabled for new group)
    const include = includeCheckbox.checked;
    const exclude = excludeCheckbox.checked;

    if (!include && !exclude) {
      alert("Please select at least one checkbox.");
      return;
    }

    // Check for duplicate group name
    if (groups.some(g => g.name === groupName)) {
      alert("Group name already exists.");
      return;
    }

    const group = { name: groupName, include, exclude };
    groups.push(group);
    localStorage.setItem("groups", JSON.stringify(groups));
    createGroupElement(group);
  }

  updateSummaries();
  reset();
  newGroupContainer.classList.add("hidden");
  modalOverlay.classList.add("hidden");
  editingGroupIndex = null;
});

function updateSummaries() {
  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  let includeTotalCredits = 0, includeTotalQp = 0;
  let excludeTotalCredits = 0, excludeTotalQp = 0;

  groups.forEach(({ name, include, exclude }) => {
    if (include) {
      const credit = JSON.parse(localStorage.getItem(`includeCreditHours_${name}`));
      const qp = JSON.parse(localStorage.getItem(`includeQp_${name}`));
      if (!isNaN(credit) && !isNaN(qp)) {
        includeTotalCredits += credit;
        includeTotalQp += qp;
      }
    }
    if (exclude) {
      const credit = JSON.parse(localStorage.getItem(`excludeCreditHours_${name}`));
      const qp = JSON.parse(localStorage.getItem(`excludeQp_${name}`));
      if (!isNaN(credit) && !isNaN(qp)) {
        excludeTotalCredits += credit;
        excludeTotalQp += qp;
      }
    }
  });

  const includeGpa = includeTotalQp / includeTotalCredits || 0;
  const excludeGpa = excludeTotalQp / excludeTotalCredits || 0;

  document.getElementById("overall-credit").innerText = includeTotalCredits.toFixed(2);
  document.getElementById("overall-gpa").innerText = includeGpa.toFixed(2);
  document.getElementById("overall-qp").innerText = includeTotalQp.toFixed(2);

  document.getElementById("exclude-credit").innerText = excludeTotalCredits.toFixed(2);
  document.getElementById("exclude-gpa").innerText = excludeGpa.toFixed(2);
  document.getElementById("exclude-qp").innerText = excludeTotalQp.toFixed(2);
}

function createGroupElement({ name, include, exclude }) {
  const groupDiv = document.createElement("div");
  groupDiv.className = "group";

  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  const index = groups.findIndex(g => g.name === name && g.include === include && g.exclude === exclude);

  let label = "";
  if (include && exclude) label = `${name} (Include & Exclude)`;
  else if (include) label = `${name} (Include)`;
  else if (exclude) label = `${name} (Exclude)`;
  else label = `${name} (No category)`;

  const textSpan = document.createElement("span");
  textSpan.textContent = label;
  textSpan.style.fontWeight = "bold";
  textSpan.style.fontSize = "1.1rem";
  textSpan.style.display = "block";
  textSpan.style.marginBottom = "8px";

  let summaryPrefix = include ? "include" : exclude ? "exclude" : null;
  const creditHours = summaryPrefix ? JSON.parse(localStorage.getItem(`${summaryPrefix}CreditHours_${name}`)) : null;
  const gpa = summaryPrefix ? JSON.parse(localStorage.getItem(`${summaryPrefix}Gpa_${name}`)) : null;

  let summary = null;
  if (creditHours !== null && gpa !== null) {
    summary = document.createElement("div");
    summary.className = "group-summary";
    summary.style.display = "flex";
    summary.style.justifyContent = "space-around";
    summary.style.marginBottom = "10px";
    summary.innerHTML = `
      <div style="text-align: center;">
        <p style="margin: 0; font-weight: 600;">Credit Hours</p>
        <p style="margin: 0;">${creditHours.toFixed(2)}</p>
      </div>
      <div style="text-align: center;">
        <p style="margin: 0; font-weight: 600;">GPA</p>
        <p style="margin: 0;">${gpa.toFixed(2)}</p>
      </div>
    `;
  }

  const openBtn = document.createElement("button");
  openBtn.textContent = "Open";
  openBtn.className = "open-btn";
  openBtn.addEventListener("click", () => {
    if (include && exclude) {
      window.location.href = `GPA/bothGPA.html?groupId=${encodeURIComponent(name)}`;
    } else if (include) {
      window.location.href = `GPA/includeGPA.html?groupId=${encodeURIComponent(name)}&include=true`;
    } else if (exclude) {
      window.location.href = `GPA/excludeGPA.html?groupId=${encodeURIComponent(name)}&exclude=true`;
    } else {
      alert("Select a box");
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => {
    groupDiv.remove();
    let groups = JSON.parse(localStorage.getItem("groups")) || [];
    groups = groups.filter(g => !(g.name === name && g.include === include && g.exclude === exclude));
    localStorage.setItem("groups", JSON.stringify(groups));

    ['include', 'exclude'].forEach(cat => {
      localStorage.removeItem(`${cat}Data_${name}`);
      localStorage.removeItem(`${cat}CreditHours_${name}`);
      localStorage.removeItem(`${cat}Gpa_${name}`);
      localStorage.removeItem(`${cat}Qp_${name}`);
    });

    updateSummaries();
    updateGroupContainerBorder();
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  editBtn.addEventListener("click", () => {
    groupNameInput.value = name;
    includeCheckbox.checked = include;
    includeCheckbox.disabled = true;
    excludeCheckbox.checked = exclude;
    excludeCheckbox.disabled = true;
    editingGroupIndex = index;

    newGroupContainer.classList.remove("hidden");
    modalOverlay.classList.remove("hidden");
  });

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "button-group";
  buttonGroup.style.display = "flex";
  buttonGroup.style.justifyContent = "center";
  buttonGroup.style.gap = "10px";
  buttonGroup.appendChild(openBtn);
  buttonGroup.appendChild(editBtn);
  buttonGroup.appendChild(deleteBtn);

  groupDiv.appendChild(textSpan);
  if (summary) groupDiv.appendChild(summary);
  groupDiv.appendChild(buttonGroup);
  groupContainer.appendChild(groupDiv);

  updateGroupContainerBorder();
}

deleteAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all groups?")) {
    groupContainer.innerHTML = "";
    localStorage.removeItem("groups");

    Object.keys(localStorage).forEach(key => {
      if (
        key.startsWith('includeData_') || key.startsWith('includeCreditHours_') ||
        key.startsWith('includeGpa_') || key.startsWith('includeQp_') ||
        key.startsWith('excludeData_') || key.startsWith('excludeCreditHours_') ||
        key.startsWith('excludeGpa_') || key.startsWith('excludeQp_')
      ) {
        localStorage.removeItem(key);
      }
    });

    updateSummaries();
    updateGroupContainerBorder();
  }
});

function reset() {
  groupNameInput.value = "";
  includeCheckbox.checked = false;
  excludeCheckbox.checked = false;
  includeCheckbox.disabled = false
  excludeCheckbox.disabled = false;
  editingGroupIndex = null;
}

function updateGroupContainerBorder() {
  if (groupContainer.children.length === 0) {
    groupContainer.classList.add("hidden");
  } else {
    groupContainer.classList.remove("hidden");
  }
}
