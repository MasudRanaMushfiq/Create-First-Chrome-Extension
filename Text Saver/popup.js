const saveBtn = document.getElementById("save-btn");
const noteInput = document.getElementById("note-input");
const notesList = document.getElementById("notes-list");

function loadNotes() {
  chrome.storage.local.get(["notes"], (result) => {
    const notes = result.notes || [];
    notesList.innerHTML = "";
    notes.forEach((note, index) => {
      const li = document.createElement("li");
      li.textContent = note;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.className = "remove-btn";
      removeBtn.onclick = () => {
        notes.splice(index, 1);
        chrome.storage.local.set({ notes }, loadNotes);
      };

      li.appendChild(removeBtn);
      notesList.appendChild(li);
    });
  });
}

saveBtn.addEventListener("click", () => {
  const note = noteInput.value.trim();
  if (note) {
    chrome.storage.local.get(["notes"], (result) => {
      const notes = result.notes || [];
      notes.unshift(note);
      chrome.storage.local.set({ notes }, () => {
        noteInput.value = "";
        loadNotes();
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", loadNotes);
