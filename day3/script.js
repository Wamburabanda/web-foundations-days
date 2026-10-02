// Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

/**
 * 1. searchNotes(word)
 * Returns an array of notes whose text contains word (case-insensitive).
 */
function searchNotes(word) {
  if (!word) return [];
  const query = word.toLowerCase();
  return notes.filter(note => note.text.toLowerCase().includes(query));
}

/**
 * 2. longestNote()
 * Returns the note object with the most characters, or null if notes is empty.
 */
function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, current) => 
    current.text.length > longest.text.length ? current : longest
  , notes[0]);
}

/**
 * 3. countByCategory()
 * Returns an object counting notes per category.
 */
function countByCategory() {
  return notes.reduce((counts, note) => {
    counts[note.category] = (counts[note.category] || 0) + 1;
    return counts;
  }, {});
}

/**
 * 4. getSummary()
 * Returns a sentence such as "5 notes: 2 personal, 1 work, 2 study."
 */
function getSummary() {
  const counts = countByCategory();
  const categoryParts = Object.entries(counts)
    .map(([cat, count]) => `${count} ${cat}`);
  
  return `${notes.length} notes: ${categoryParts.join(", ")}.`;
}

/**
 * 5. isDuplicate(text)
 * Returns true if a note with the same text already exists (ignoring case & extra spaces).
 */
function isDuplicate(text) {
  if (!text) return false;
  const normalizedNewText = text.trim().toLowerCase();
  return notes.some(note => note.text.trim().toLowerCase() === normalizedNewText);
}

/**
 * 6. addNote(text, category)
 * Adds a note only if valid length (1-200), not a duplicate, and valid category.
 */
function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];
  const trimmedText = text ? text.trim() : "";

  if (trimmedText.length < 1 || trimmedText.length > 200) {
    console.log("Failed to add note: Text must be between 1 and 200 characters.");
    return false;
  }

  if (!validCategories.includes(category)) {
    console.log(`Failed to add note: Invalid category "${category}". Must be personal, work, or study.`);
    return false;
  }

  if (isDuplicate(text)) {
    console.log("Failed to add note: Duplicate note text already exists.");
    return false;
  }

  const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
  notes.push({ id: newId, text: trimmedText, category });
  console.log("Note successfully added!");
  return true;
}

// ==========================================
// CONSOLE LOG TESTS
// ==========================================

console.log("--- 1. searchNotes ---");
console.log('searchNotes("day"):', searchNotes("day"));

console.log("\n--- 2. longestNote ---");
console.log("longestNote():", longestNote());

console.log("\n--- 3. countByCategory ---");
console.log("countByCategory():", countByCategory());

console.log("\n--- 4. getSummary ---");
console.log("getSummary():", getSummary());

console.log("\n--- 5. isDuplicate ---");
console.log('isDuplicate("  buy milk AND bread  "):', isDuplicate("  buy milk AND bread  ")); // true
console.log('isDuplicate("Read a book"):', isDuplicate("Read a book")); // false

console.log("\n--- 6. addNote ---");
console.log('addNote("Buy milk and bread", "personal"):'); // Duplicate test
addNote("Buy milk and bread", "personal");

console.log('addNote("Learn CSS Grid", "invalid_cat"):'); // Category test
addNote("Learn CSS Grid", "invalid_cat");

console.log('addNote("", "study"):'); // Length test
addNote("", "study");

console.log('addNote("Prepare presentation slides", "work"):'); // Valid add test
console.log("Result:", addNote("Prepare presentation slides", "work"));

console.log("\n--- Updated Summary & Notes Count ---");
console.log("getSummary():", getSummary());
console.log("Updated Notes Array:", notes);

