function enableInlineEdit(editIcon, noteText, li) {
  editIcon.addEventListener("click", function () {
    if (li.querySelector(".edit-input")) return;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "edit-input";
    input.value = noteText.textContent;
    input.style.minWidth = "150px";

    noteText.style.display = "none";
    noteText.parentNode.insertBefore(input, noteText);

    input.focus();

    function saveEdit() {
      const val = input.value.trim();
      if (val !== "") {
        noteText.textContent = val;
      }
      input.remove();
      noteText.style.display = "";
      savetask();
    }

    input.addEventListener("blur", saveEdit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        input.blur();
      } else if (e.key === "Escape") {
        input.remove();
        noteText.style.display = "";
      }
    });
  });
}

function showPopup() {
  document.getElementById("popup-title").textContent = "New Note";
  document.getElementById("popup").style.display = "flex";
  document.getElementById("popup-input").value = "";
  document.getElementById("popup-input").focus();
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function updateLoadingImage() {
  const todoList = document.getElementById("todo-list");
  const input = document.getElementById("popup-input");
  const loadingImg = document.getElementById("loading-img");

  if (todoList.children.length === 0 && (!input || input.value.trim() === "")) {
    loadingImg.style.display = "block";
  } else {
    loadingImg.style.display = "none";
  }
}

function addTask() {
  const input = document.getElementById("popup-input");
  const task = input.value;
  if (task && task.trim() !== "") {
    const li = document.createElement("div");
    li.classList.add("new-notes");

    const uniqueId = `accept-${Date.now()}-${Math.random()}`;

    li.innerHTML = `
      <div class="note-row">
        <div class="note-left">
          <input type="checkbox" class="custom-checkbox" id="${uniqueId}" name="accept" value="yes">
          <label for="${uniqueId}"></label>
          <p class="note-text">${task.trim()}</p>
        </div>
        <div class="note-icons">
          <img src="Pen.svg" alt="Edit" class="edit-icon">
          <img src="Bin.svg" alt="Delete" class="delete-icon">
        </div>
      </div>
    `;

    document.getElementById("todo-list").appendChild(li);
    closePopup();
    updateLoadingImage();

    const checkbox = li.querySelector(".custom-checkbox");
    const noteText = li.querySelector(".note-text");

    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        noteText.style.textDecoration = "line-through";
        noteText.style.opacity = "0.5";
      } else {
        noteText.style.textDecoration = "none";
        noteText.style.opacity = "1";
      }
      if (filterSelect) filterSelect.dispatchEvent(new Event("change"));
      savetask();
    });

    const editIcon = li.querySelector(".edit-icon");

    enableInlineEdit(editIcon, noteText, li);

    const deleteIcon = li.querySelector(".delete-icon");
    deleteIcon.addEventListener("click", function () {
      li.remove();
      updateLoadingImage();
      savetask();
    });

    savetask();
  }
}

document
  .getElementById("popup-input")
  .addEventListener("input", updateLoadingImage);

const filterSelect =
  document.getElementById("filter-tasks") ||
  document.getElementById("Mydropbox");

window.onload = () => {
  updateLoadingImage();

  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    const themeIcon = document.querySelector(".switch-moon-img");
    if (themeIcon) {
      themeIcon.src = "sun.svg";
      themeIcon.alt = "Light mode icon";
    }
  }

  const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  savedTasks.forEach(({ text, completed }) => {
    const li = document.createElement("div");
    li.classList.add("new-notes");

    const uniqueId = `accept-${Date.now()}-${Math.random()}`;

    li.innerHTML = `
      <div class="note-row">
        <div class="note-left">
          <input type="checkbox" class="custom-checkbox" id="${uniqueId}" name="accept" value="yes" ${
      completed ? "checked" : ""
    }>
          <label for="${uniqueId}"></label>
          <p class="note-text">${text}</p>
        </div>
        <div class="note-icons">
          <img src="Pen.svg" alt="Edit" class="edit-icon">
          <img src="Bin.svg" alt="Delete" class="delete-icon">
        </div>
      </div>
    `;

    document.getElementById("todo-list").appendChild(li);
    updateLoadingImage();

    const checkbox = li.querySelector(".custom-checkbox");
    const noteText = li.querySelector(".note-text");
    const editIcon = li.querySelector(".edit-icon");
    const deleteIcon = li.querySelector(".delete-icon");

    if (completed) {
      noteText.style.textDecoration = "line-through";
      noteText.style.opacity = "0.5";
    }

    checkbox.addEventListener("change", function () {
      noteText.style.textDecoration = checkbox.checked
        ? "line-through"
        : "none";
      noteText.style.opacity = checkbox.checked ? "0.5" : "1";

      if (filterSelect) filterSelect.dispatchEvent(new Event("change"));
      savetask();
    });

    enableInlineEdit(editIcon, noteText, li);

    deleteIcon.addEventListener("click", function () {
      li.remove();
      updateLoadingImage();
      savetask();
    });
  });

  if (filterSelect) {
    filterSelect.addEventListener("change", () => {
      const filterValue = filterSelect.value.toLowerCase();
      const todoList = document.getElementById("todo-list");
      const tasks = todoList.querySelectorAll(".new-notes");

      tasks.forEach((task) => {
        const checkbox = task.querySelector(".custom-checkbox");
        if (!checkbox) return;

        if (filterValue === "all" || filterValue === "option1") {
          task.style.display = "";
        } else if (filterValue === "complete" || filterValue === "option2") {
          task.style.display = checkbox.checked ? "" : "none";
        } else if (filterValue === "incomplete" || filterValue === "option3") {
          task.style.display = !checkbox.checked ? "" : "none";
        }
      });
    });
  }

  const moonToggle = document.querySelector(".moon");
  const themeIcon = document.querySelector(".switch-moon-img");

  if (moonToggle && themeIcon) {
    moonToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");

      themeIcon.src = isDark ? "sun.svg" : "moon.svg";
      themeIcon.alt = isDark ? "Light mode icon" : "Dark mode icon";

      localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
    });
  }
};

function savetask() {
  const todoList = document.getElementById("todo-list");
  const tasks = todoList.querySelectorAll(".new-notes");
  const taskData = [];

  tasks.forEach((task) => {
    const checkbox = task.querySelector(".custom-checkbox");
    const noteText = task.querySelector(".note-text").textContent;
    taskData.push({
      text: noteText,
      completed: checkbox.checked,
    });
  });

  localStorage.setItem("tasks", JSON.stringify(taskData));
}

function enableInlineEdit(editIcon, noteText, li) {
  editIcon.addEventListener("click", function () {
    showEditPopup(noteText);
  });
}
const editPopup = document.getElementById("edit-popup");
const editPopupInput = document.getElementById("edit-popup-input");
const editCancelBtn = document.getElementById("edit-cancel-btn");
const editSaveBtn = document.getElementById("edit-save-btn");

let currentEditingNote = null;

function showEditPopup(noteTextElem) {
  currentEditingNote = noteTextElem;
  editPopupInput.value = noteTextElem.textContent;
  editPopup.style.display = "flex";
  editPopupInput.focus();
}

function closeEditPopup() {
  editPopup.style.display = "none";
  currentEditingNote = null;
  editPopupInput.value = "";
}

function saveEditPopup() {
  if (!currentEditingNote) return;
  const newVal = editPopupInput.value.trim();
  if (newVal !== "") {
    currentEditingNote.textContent = newVal;
    savetask();
  }
  closeEditPopup();
}

editCancelBtn.addEventListener("click", closeEditPopup);
editSaveBtn.addEventListener("click", saveEditPopup);

editPopup.addEventListener("click", (e) => {
  if (e.target === editPopup) closeEditPopup();
});
