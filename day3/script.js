// Starting Data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. searchNotes(word)
function searchNotes(word) {
  const query = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(query));
}

// 2. longestNote()
function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, current) => {
    return current.text.length > longest.text.length ? current : longest;
  }, notes[0]);
}

// 3. countByCategory()
function countByCategory() {
  return notes.reduce((acc, note) => {
    acc[note.category] = (acc[note.category] || 0) + 1;
    return acc;
  }, {});
}

// 4. getSummary()
function getSummary() {
  const total = notes.length;
  const word = total === 1 ? "note" : "notes"; // Fix: dynamically select singular or plural
  const counts = countByCategory();

  const details = Object.entries(counts)
    .map(([cat, count]) => `${count} ${cat}`)
    .join(", ");

  return `${total} ${word}: ${details}.`;
}

// 5. isDuplicate(text)
function isDuplicate(text) {
  const normalizedNewText = text.trim().toLowerCase();
  return notes.some(
    (note) => note.text.trim().toLowerCase() === normalizedNewText
  );
}

// 6. addNote(text, category)
function addNote(text, category) {
  const allowedCategories = ["personal", "work", "study"];

  if (!text || text.length < 1 || text.length > 200) {
    console.log("Failed to add note: Text length must be between 1 and 200 characters.");
    return false;
  }

  if (!allowedCategories.includes(category)) {
    console.log(`Failed to add note: Invalid category "${category}".`);
    return false;
  }

  if (isDuplicate(text)) {
    console.log("Failed to add note: Duplicate note text already exists.");
    return false;
  }

  const newId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
  notes.push({ id: newId, text: text, category: category });
  return true;
}

// ==========================================
// TEST CASES (2 per function with expected output comments)
// ==========================================

// 1. searchNotes Tests
console.log(searchNotes("day")); 
// Expected: [{ id: 2, text: "Finish the Day 3 assignment", category: "study" }]
console.log(searchNotes("python")); 
// Expected: [] (Edge case: word does not exist)

// 2. longestNote Tests
console.log(longestNote()); 
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }
const tempNotes = notes;
notes = [];
console.log(longestNote()); 
// Expected: null (Edge case: empty array)
notes = tempNotes; // Restore array

// 3. countByCategory Tests
console.log(countByCategory()); 
// Expected: { personal: 2, study: 2, work: 1 }
const backupNotes = notes;
notes = [{ id: 1, text: "Solo task", category: "work" }];
console.log(countByCategory()); 
// Expected: { work: 1 } (Edge case: single category)
notes = backupNotes; // Restore array

// 4. getSummary Tests
console.log(getSummary()); 
// Expected: "5 notes: 2 personal, 2 study, 1 work."
const singleNoteBackup = notes;
notes = [{ id: 1, text: "Only one note", category: "personal" }];
console.log(getSummary()); 
// Expected: "1 note: 1 personal." (Edge case: exactly 1 note singular check)
notes = singleNoteBackup; // Restore array

// 5. isDuplicate Tests
console.log(isDuplicate("  buy milk AND bread  ")); 
// Expected: true (Case and space insensitive match)
console.log(isDuplicate("Read a book")); 
// Expected: false (Edge case: new unique note)

// 6. addNote Tests
console.log(addNote("Prepare presentation slides", "work")); 
// Expected log: Note added; returns true
console.log(addNote("Buy milk and bread", "personal")); 
// Expected log: "Failed to add note: Duplicate note text already exists."; returns false (Edge case: duplicate check)
