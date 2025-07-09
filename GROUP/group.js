const addGroupBtn = document.getElementById("addGroupBtn");
const groupContainer = document.getElementById("groupContainer");
const newGroupContainer = document.getElementById("new-group-container");
const addBtn = document.getElementById("add-btn");
const groupNameInput = document.getElementById("group-name-input");
const includeCheckbox = document.getElementById("include-checkbox");
const excludeCheckbox = document.getElementById("exclude-checkbox");
const deleteAllBtn = document.getElementById("deleteAllBtn");

const modalOverlay = document.getElementById('modal-overlay');

addGroupBtn.addEventListener('click', () => {
  newGroupContainer.classList.remove('hidden');
  modalOverlay.classList.remove('hidden');
});

function updateGroupContainerBorder() {
  if (groupContainer.children.length === 0) {
    groupContainer.classList.toggle("hidden");
  } else {
    groupContainer.classList.remove("hidden");
  }
}

// Optionally hide modal when overlay is clicked
modalOverlay.addEventListener('click', () => {
  newGroupContainer.classList.add('hidden');
  modalOverlay.classList.add('hidden');
});

// Load groups on page load
window.addEventListener("DOMContentLoaded", () => {
    const savedGroups = JSON.parse(localStorage.getItem("groups")) || [];
    savedGroups.forEach(createGroupElement);
    updateSummaries();
    updateGroupContainerBorder();
});

addBtn.addEventListener("click", () => {
    const groupName = groupNameInput.value.trim();
    const include = includeCheckbox.checked;
    const exclude = excludeCheckbox.checked;

    if (!groupName) {
        return;
    }

    if (!include && !exclude) {
      alert("Please select at least one checkbox.");
      return;
    }

    const group = { name: groupName, include, exclude };

    // Save to localStorage
    const groups = JSON.parse(localStorage.getItem("groups")) || [];
    groups.push(group);
    localStorage.setItem("groups", JSON.stringify(groups));

    // Add to DOM
    createGroupElement(group);
    updateSummaries();

    reset();
    newGroupContainer.classList.add("hidden");
    modalOverlay.classList.add("hidden");
});

function updateSummaries() {
    const groups = JSON.parse(localStorage.getItem("groups")) || [];

    let includeTotalCredits = 0;
    let includeTotalQp = 0;

    let excludeTotalCredits = 0;
    let excludeTotalQp = 0;

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

    // Update Include summary
    document.getElementById("overall-credit").innerText = includeTotalCredits.toFixed(2);
    document.getElementById("overall-gpa").innerText = includeGpa.toFixed(2);
    document.getElementById("overall-qp").innerText = includeTotalQp.toFixed(2);

    // Update Exclude summary
    document.getElementById("exclude-credit").innerText = excludeTotalCredits.toFixed(2);
    document.getElementById("exclude-gpa").innerText = excludeGpa.toFixed(2);
    document.getElementById("exclude-qp").innerText = excludeTotalQp.toFixed(2);
}

const createGroupElement = ({ name, include, exclude }) => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "group";

    // Label text for group
    let label = "";
    if (include && exclude) {
        label = `${name} (Include & Exclude)`;
    } else if (include) {
        label = `${name} (Include)`;
    } else if (exclude) {
        label = `${name} (Exclude)`;
    } else {
        label = `${name} (No category)`;
    }

    const textSpan = document.createElement("span");
    textSpan.textContent = label;
    textSpan.style.fontWeight = "bold";
    textSpan.style.fontSize = "1.1rem";
    textSpan.style.marginBottom = "8px";
    textSpan.style.display = "block";

    let summaryPrefix = null;
    if (include) {
        summaryPrefix = "include";
    } else if (exclude) {
        summaryPrefix = "exclude";
    }

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

    // Open button
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

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
        groupDiv.remove();

        // Remove the group from the groups list
        let groups = JSON.parse(localStorage.getItem("groups")) || [];
        groups = groups.filter(g => !(g.name === name && g.include === include && g.exclude === exclude));
        localStorage.setItem("groups", JSON.stringify(groups));

        // Delete all associated GPA localStorage data for this group
        ['include', 'exclude'].forEach(cat => {
            localStorage.removeItem(`${cat}Data_${name}`);
            localStorage.removeItem(`${cat}CreditHours_${name}`);
            localStorage.removeItem(`${cat}Gpa_${name}`);
            localStorage.removeItem(`${cat}Qp_${name}`);
        });

        updateSummaries();
        updateGroupContainerBorder();
    });


    // Buttons container
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";
    buttonGroup.style.display = "flex";
    buttonGroup.style.justifyContent = "center";
    buttonGroup.style.gap = "10px";
    buttonGroup.appendChild(openBtn);
    buttonGroup.appendChild(deleteBtn);

    groupDiv.appendChild(textSpan);
    if (summary) groupDiv.appendChild(summary);
    groupDiv.appendChild(buttonGroup);

    groupContainer.appendChild(groupDiv);

    updateGroupContainerBorder();
};

deleteAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all groups?")) {
        groupContainer.innerHTML = "";
        localStorage.removeItem("groups");

        // Remove all include/exclude GPA related localStorage items
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


const reset = () => {
    groupNameInput.value = "";
    includeCheckbox.checked = false;
    excludeCheckbox.checked = false;
};
