const form = document.getElementById('note-form');
const input = document.getElementById('note-input');
const select = document.getElementById('priority-select');
const list = document.getElementById('notes-list');
const toggleBtn = document.getElementById('toggle-completed');
let showCompleted = true;

let notes = JSON.parse(localStorage.getItem('notes')) || [];

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotes() {
  list.innerHTML = '';
  let filtered = showCompleted ? notes : notes.filter(note => !note.done);

  filtered.sort((a, b) => a.done - b.done);

  filtered.forEach((note, index) => {
    const li = document.createElement('li');
    li.className = `note ${note.priority} ${note.done ? 'done' : ''}`;
    li.setAttribute('data-id', index);

    li.innerHTML = `
      <span>${note.text}</span>
      <span class="options-btn">⋮</span>
      <div class="dropdown">
        ${note.done
          ? `<button class="undone">Make Undone</button>`
          : `<button class="done">Mark Done</button>
             <button class="priority">Update Priority</button>
             <button class="remove">Remove</button>`}
      </div>
      <div class="priority-popup">
        <button class="priority-high">High</button>
        <button class="priority-medium">Medium</button>
        <button class="priority-low">Low</button>
      </div>
    `;

    list.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  notes.push({
    text: input.value,
    priority: select.value,
    done: false
  });
  input.value = '';
  saveNotes();
  renderNotes();
});

list.addEventListener('click', (e) => {
  const noteEl = e.target.closest('.note');
  const id = noteEl?.dataset?.id;
  if (!noteEl || id === undefined) return;

  const dropdown = noteEl.querySelector('.dropdown');
  const priorityPopup = noteEl.querySelector('.priority-popup');

  if (e.target.classList.contains('options-btn')) {
    dropdown.classList.toggle('show');
    priorityPopup.classList.remove('show');
  } else if (e.target.classList.contains('done')) {
    notes[id].done = true;
    saveNotes();
    renderNotes();
  } else if (e.target.classList.contains('undone')) {
    notes[id].done = false;
    saveNotes();
    renderNotes();
  } else if (e.target.classList.contains('remove')) {
    notes.splice(id, 1);
    saveNotes();
    renderNotes();
  } else if (e.target.classList.contains('priority')) {
    priorityPopup.classList.toggle('show');
  } else if (e.target.classList.contains('priority-high')) {
    notes[id].priority = 'high';
    saveNotes();
    renderNotes();
  } else if (e.target.classList.contains('priority-medium')) {
    notes[id].priority = 'medium';
    saveNotes();
    renderNotes();
  } else if (e.target.classList.contains('priority-low')) {
    notes[id].priority = 'low';
    saveNotes();
    renderNotes();
  } else {
    dropdown.classList.remove('show');
    priorityPopup.classList.remove('show');
  }
});

toggleBtn.addEventListener('click', () => {
  showCompleted = !showCompleted;
  toggleBtn.textContent = showCompleted ? 'Show ALL' : 'Show Done';
  renderNotes();
});

new Sortable(list, {
  animation: 150,
  onEnd: (evt) => {
    const movedItem = notes.splice(evt.oldIndex, 1)[0];
    notes.splice(evt.newIndex, 0, movedItem);
    saveNotes();
    renderNotes();
  }
});

renderNotes();
