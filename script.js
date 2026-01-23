let words = [];
let visibleWords = [];

const grid = document.getElementById("grid");
const home = document.getElementById("home");
const detail = document.getElementById("detail");
const card = document.getElementById("card");
const searchInput = document.getElementById("search");

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  fetch("words.json")
    .then(res => res.json())
    .then(data => {
      // preprocess for search
      words = data.map(w => ({
        ...w,
        context: w.context || [],
        family: w.family || [],
        syn: w.syn || [],
        ant: w.ant || [],
        _search: (
          w.title + " " + w.meaning + " " +
          (w.context||[]).join(" ") + " " +
          (w.family||[]).join(" ") + " " +
          (w.syn||[]).join(" ") + " " +
          (w.ant||[]).join(" ")
        ).toLowerCase()
      }));

      visibleWords = [...words];
      renderWords();
    })
    .catch(err => console.error("Error loading words.json", err));
});

// Render words
function renderWords() {
  grid.innerHTML = "";
  visibleWords.forEach((w, i) => {
    const btn = document.createElement("div");
    btn.className = "word-btn";
    btn.innerText = w.title;
    btn.onclick = () => openWord(i);
    grid.appendChild(btn);
  });
}

// Search
searchInput.addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  visibleWords = words.filter(w => w._search.includes(query));
  renderWords();
});

// Open word detail
function openWord(i) {
  const w = visibleWords[i];
  card.innerHTML = `
    <div class="word">${w.title}</div>
    <div class="pron">${w.pron}</div>
    <div class="section"><span class="label">Meaning</span><br>${w.meaning}</div>
    <div class="section"><span class="label">Context</span><div class="chips">${w.context.map(c => `<span>${c}</span>`).join("")}</div></div>
    <div class="section"><span class="label">Example</span><div class="example">${w.example}</div></div>
    <div class="section"><span class="label">Word Family</span><div class="chips">${w.family.map(f => `<span>${f}</span>`).join("")}</div></div>
    <div class="section"><span class="label">Synonyms</span><div class="chips">${w.syn.map(s => `<span>${s}</span>`).join("")}</div></div>
    <div class="section"><span class="label">Antonyms</span><div class="chips">${w.ant.map(a => `<span>${a}</span>`).join("")}</div></div>
    <div class="section"><span class="label">Visualization</span><div class="visual">${w.visual}</div></div>
    <div class="back" onclick="goBack()">← Back to words</div>
  `;
  home.style.transform = "translateX(-100%)";
  detail.style.transform = "translateX(0)";
}

// Back button
function goBack() {
  home.style.transform = "translateX(0)";
  detail.style.transform = "translateX(100%)";
}
