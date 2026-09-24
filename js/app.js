/* ============================================================================
   DENDROLOGY QUIZ ENGINE (js/app.js)
   Full implementation: Keyboard shortcuts, draggable resizer, settings panels
============================================================================ */

let SPECIES = [];
let SPECIES_FAMILY = [];
let COMMON_TO_SCI = {};
let SCI_TO_COMMON = {};

const FAMILIES = [
  { num: 1, name: "Adoxaceae", count: 3 }, { num: 2, name: "Altingiaceae", count: 1 },
  { num: 3, name: "Anacardiaceae", count: 4 }, { num: 4, name: "Annonaceae", count: 1 },
  { num: 5, name: "Apocynaceae", count: 1 }, { num: 6, name: "Aquifoliaceae", count: 3 },
  { num: 7, name: "Araliaceae", count: 3 }, { num: 8, name: "Berberidaceae", count: 1 },
  { num: 9, name: "Betulaceae", count: 11 }, { num: 10, name: "Bignoniaceae", count: 1 },
  { num: 11, name: "Caesalpiniaceae", count: 3 }, { num: 12, name: "Cannabaceae", count: 1 },
  { num: 13, name: "Caprifoliaceae", count: 2 }, { num: 14, name: "Celastraceae", count: 2 },
  { num: 15, name: "Cornaceae", count: 5 }, { num: 16, name: "Cupressaceae", count: 4 },
  { num: 17, name: "Ebenaceae", count: 1 }, { num: 18, name: "Ericaceae", count: 9 },
  { num: 19, name: "Fabaceae", count: 5 }, { num: 20, name: "Fagaceae", count: 17 },
  { num: 21, name: "Ginkgoaceae", count: 1 }, { num: 22, name: "Hamamelidaceae", count: 1 },
  { num: 23, name: "Juglandaceae", count: 7 }, { num: 24, name: "Lauraceae", count: 2 },
  { num: 25, name: "Lythraceae", count: 1 }, { num: 26, name: "Magnoliaceae", count: 4 },
  { num: 27, name: "Mimosaceae", count: 1 }, { num: 28, name: "Moraceae", count: 2 },
  { num: 29, name: "Nyssaceae", count: 1 }, { num: 30, name: "Oleaceae", count: 3 },
  { num: 32, name: "Paulowniaceae", count: 1 }, { num: 33, name: "Pinaceae", count: 16 },
  { num: 34, name: "Platanaceae", count: 1 }, { num: 35, name: "Rosaceae", count: 14 },
  { num: 36, name: "Salicaceae", count: 7 }, { num: 37, name: "Sapindaceae", count: 10 },
  { num: 38, name: "Simaroubaceae", count: 1 }, { num: 39, name: "Taxaceae", count: 1 },
  { num: 40, name: "Tiliaceae", count: 2 }, { num: 41, name: "Ulmaceae", count: 3 },
  { num: 42, name: "Vitaceae", count: 2 }, { num: 43, name: "Grossulariaceae", count: 1 },
  { num: 44, name: "Myricaceae", count: 1 }, { num: 45, name: "Hydrangeaceae", count: 1 },
  { num: 46, name: "Smilacaceae", count: 1 }, { num: 47, name: "Staphyleaceae", count: 1 },
  { num: 48, name: "Thymelaeaceae", count: 1 }, { num: 49, name: "Elaeagnaceae", count: 1 },
  { num: 50, name: "Polygonaceae", count: 1 }
];

const QUIZ_TEST_1_SCI = ["asimina triloba","ilex opaca","robinia pseudoacacia","juglans nigra","sassafras albidum","lindera benzoin","liriodendron tulipifera","fraxinus americana","paulownia tomentosa","pinus strobus","tsuga canadensis","platanus occidentalis","acer saccharum","acer negundo","aesculus flava","parthenocissus quinquefolia","toxicodendron radicans","carpinus caroliniana","elaeagnus umbellate","Reynoutria japonica"];
const QUIZ_TEST_2_SCI = ["Cercis canadensis","Quercus alba","Quercus montana","Quercus coccinea","Quercus marilandica","Prunus serotina","Pyrus calleryana","Acer platanoides","Ailanthus altissima","Tilia americana"];
const QUIZ_TEST_3_SCI = ["Quercus rubra","Magnolia acuminata","Acer pensylvanicum","Cornus florida","Acer rubrum","Quercus velutina","Smilax spp.","Carya cordiformis","Berbis spp."];
const QUIZ_TEST_4_SCI = ["Nyssa sylvatica","Fagus grandifolia","Pinus rigida","Pinus virginiana","Oxydendrum arboreum","Quercus falcata","Juniperus virginiana","Albizia julibrissin","Quercus stellata","Diospyros virginiana"];
const QUIZ_TEST_5_SCI = ["Malus pumila","Pinus taeda","Quercus phellos","Hedera helix","Catalpa speciosa","Cornus kousa","Carya glabra var.glabra","Fraxinus pennsylvanica","Rubus phoenicolasius","Ulmus rubra","Rosa multiflora","Cupressocyparis leylandii","Acer saccharinum"];

// Keyboard shortcuts defaults
const KEYBIND_DEFAULTS = {
  submit: 'Enter', next: 'Enter', space: ' ', cancel: 'Escape',
  hint: 'h', left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown',
  restart: 'r', redoMissed: 'Tab', home: 'Enter'
};
let keybinds = Object.assign({}, KEYBIND_DEFAULTS);
let kbHighlight = -1;
let keybindListening = null;
let useHomeRowKeys = false;

// Quiz State
let TIME_LIMIT = 15;
let TOTAL = 10;
let preferredQuizLength = 10;
let NUM_CHOICES = 4;
let PIC_APPEAR_AT = 5;
let selectedSpecies = [];
let mode = 'sci-to-common';
let selectedModes = ['sci-to-common'];
let selectedStyles = ['quiz'];
let score = 0;
let streak = 0;
let qIndex = 0;
let currentCorrect = '';
let currentPair = null;
let questions = [];
let missed = [];
let isUltimate = false;
let isGuest = false;
let playerName = '';
let timerId = null;
let timeLeft = TIME_LIMIT;
let answered = false;
let hintUsedThisQ = false;
let noPictures = false;

// DOM Elements
let modeBtns, startScreen, quizScreen, endScreen, stats, promptEl, promptLabel;
let optionsEl, feedback, nextBtn, progressBar, timerBar, timerText, speciesImg;
let imgPlaceholder, imgLoading, imgCredit;

// Key Label Helper
function keyLabel(k) {
  if (!k) return '—';
  if (k === ' ') return 'Space';
  if (k === 'ArrowLeft') return '←';
  if (k === 'ArrowRight') return '→';
  if (k === 'ArrowUp') return '↑';
  if (k === 'ArrowDown') return '↓';
  return k.length === 1 ? k.toUpperCase() : k;
}

// Draggable Image Resizer
function initImageResizer() {
  const handle = document.getElementById('imgResizeHandle');
  const wrap = document.getElementById('imageWrap');
  if (!handle || !wrap) return;

  let startY, startH;
  function onPointerDown(e) {
    startY = e.clientY || e.touches[0].clientY;
    startH = wrap.offsetHeight;
    document.documentElement.addEventListener('pointermove', onPointerMove);
    document.documentElement.addEventListener('pointerup', onPointerUp);
    e.preventDefault();
  }
  function onPointerMove(e) {
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const newH = Math.max(50, Math.min(400, startH + (clientY - startY)));
    wrap.style.height = `${newH}px`;
    wrap.style.setProperty('--img-h', `${newH}px`);
  }
  function onPointerUp() {
    document.documentElement.removePointerremove?.('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerup', onPointerUp);
  }
  handle.addEventListener('pointerdown', onPointerDown);
}

// Multiple Choice Highlighting
function clearKbHighlight() {
  kbHighlight = -1;
  document.querySelectorAll('.option').forEach(o => o.classList.remove('kb-focus'));
}

function setKbHighlight(idx) {
  const opts = Array.from(document.querySelectorAll('.option:not([disabled])'));
  if (!opts.length) return;
  if (idx < 0) idx = opts.length - 1;
  if (idx >= opts.length) idx = 0;
  clearKbHighlight();
  kbHighlight = idx;
  opts[kbHighlight].classList.add('kb-focus');
}

// Data Loader Bootstrap
async function loadDataAndInit() {
  try {
    const res = await fetch('./data/species.json');
    const data = await res.json();
    
    SPECIES = [];
    SPECIES_FAMILY = [];
    COMMON_TO_SCI = {};
    SCI_TO_COMMON = {};

    data.forEach(item => {
      SPECIES.push([item.common, item.scientific]);
      SPECIES_FAMILY.push(item.familyNum);
      COMMON_TO_SCI[item.common] = item.scientific;
      SCI_TO_COMMON[item.scientific] = item.common;
    });

    initUISelectors();
    initFamilySelect();
    initSettingsAndPanels();
    initImageResizer();
    renderKeybindList();
    renderLeaderboard();
  } catch (err) {
    console.error("Failed loading species.json:", err);
  }
}

function initUISelectors() {
  modeBtns = document.querySelectorAll('#modeSelect .mode-btn');
  startScreen = document.getElementById('startScreen');
  quizScreen = document.getElementById('quizScreen');
  endScreen = document.getElementById('endScreen');
  stats = document.getElementById('stats');
  promptEl = document.getElementById('prompt');
  promptLabel = document.getElementById('promptLabel');
  optionsEl = document.getElementById('options');
  feedback = document.getElementById('feedback');
  nextBtn = document.getElementById('nextBtn');
  progressBar = document.getElementById('progressBar');
  timerBar = document.getElementById('timerBar');
  timerText = document.getElementById('timerText');
  speciesImg = document.getElementById('speciesImg');
  imgPlaceholder = document.getElementById('imgPlaceholder');
  imgLoading = document.getElementById('imgLoading');
  imgCredit = document.getElementById('imgCredit');
}

// Settings Sub-Panels
function initSettingsAndPanels() {
  // Settings toggle
  document.getElementById('settingsBtn')?.addEventListener('click', () => {
    document.getElementById('settingsPanel')?.classList.remove('hidden');
  });
  document.getElementById('closeSettingsBtn')?.addEventListener('click', () => {
    document.getElementById('settingsPanel')?.classList.add('hidden');
  });

  // Keybinds panel
  document.getElementById('openKeybindBtn')?.addEventListener('click', () => {
    document.getElementById('keybindPanel').style.display = 'block';
  });
  document.getElementById('keybindPanelDone')?.addEventListener('click', () => {
    document.getElementById('keybindPanel').style.display = 'none';
  });

  // Leaderboard sub-panel
  document.getElementById('openLeaderboardBtn')?.addEventListener('click', () => {
    document.getElementById('leaderboardPanel').style.display = 'block';
  });
  document.getElementById('leaderboardPanelDone')?.addEventListener('click', () => {
    document.getElementById('leaderboardPanel').style.display = 'none';
  });

  // Species panel
  document.getElementById('openSpeciesBtn')?.addEventListener('click', () => {
    document.getElementById('speciesPanel').style.display = 'block';
  });
  document.getElementById('speciesPanelDone')?.addEventListener('click', () => {
    document.getElementById('speciesPanel').style.display = 'none';
  });

  // Controls & Sliders
  document.getElementById('timeLimitSlider')?.addEventListener('input', (e) => {
    TIME_LIMIT = parseInt(e.target.value, 10);
    document.getElementById('timeLimitLabel').textContent = TIME_LIMIT + 's';
  });

  document.getElementById('btnSizeSlider')?.addEventListener('input', (e) => {
    const val = e.target.value;
    const sizes = { 1: '6px 8px', 2: '8px 10px', 3: '12px 12px', 4: '16px 14px', 5: '20px 16px' };
    document.documentElement.style.setProperty('--option-pad-y', sizes[val].split(' ')[0]);
    document.documentElement.style.setProperty('--option-pad-x', sizes[val].split(' ')[1]);
  });

  // Question counts
  document.querySelectorAll('#countSelect .count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#countSelect .count-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      TOTAL = parseInt(btn.dataset.count, 10);
      preferredQuizLength = TOTAL;
      updateStartButtonLabel();
    });
  });

  // Choices count
  document.querySelectorAll('#choicesSelect .choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#choicesSelect .choice-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      NUM_CHOICES = parseInt(btn.dataset.choices, 10);
    });
  });

  nextBtn?.addEventListener('click', nextQuestion);
  document.getElementById('startOverBtn')?.addEventListener('click', () => window.startQuiz(isUltimate ? 'ultimate' : isGuest));
  document.getElementById('homeBtn')?.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
  });
}

function renderKeybindList() {
  const container = document.getElementById('keybindList');
  if (!container) return;
  container.innerHTML = '';

  const meta = [
    { id: 'submit', label: 'Submit / confirm selection' },
    { id: 'next', label: 'Next question' },
    { id: 'hint', label: 'Reveal photo' },
    { id: 'left', label: 'Highlight left / prev' },
    { id: 'right', label: 'Highlight right / next' }
  ];

  meta.forEach(item => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06);';
    row.innerHTML = `<span style="font-size:0.85rem;">${item.label}</span>
      <button type="button" class="mode-btn" style="padding:4px 10px;min-width:60px;">${keyLabel(keybinds[item.id])}</button>`;
    
    const btn = row.querySelector('button');
    btn.addEventListener('click', () => {
      btn.textContent = '…';
      keybindListening = item.id;
    });
    container.appendChild(row);
  });
}

// Global Keydown Listener
document.addEventListener('keydown', (e) => {
  if (keybindListening) {
    e.preventDefault();
    if (e.key !== 'Escape') {
      keybinds[keybindListening] = e.key;
    }
    keybindListening = null;
    renderKeybindList();
    return;
  }

  if (quizScreen && !quizScreen.classList.contains('hidden')) {
    if (e.key === keybinds.hint && !hintUsedThisQ) {
      hintUsedThisQ = true;
      revealImage();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      setKbHighlight(kbHighlight - 1);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      setKbHighlight(kbHighlight + 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (answered) {
        nextQuestion();
      } else if (kbHighlight >= 0) {
        const opts = document.querySelectorAll('.option');
        if (opts[kbHighlight]) opts[kbHighlight].click();
      }
    }
  }
});

// Species Selector List
function initFamilySelect() {
  const list = document.getElementById('familyCheckList');
  const summary = document.getElementById('familySummary');
  if (!list) return;
  list.innerHTML = '';

  const indicesByFam = {};
  for (let i = 0; i < SPECIES.length; i++) {
    const n = SPECIES_FAMILY[i];
    if (!indicesByFam[n]) indicesByFam[n] = [];
    indicesByFam[n].push(i);
  }

  function updateSummary() {
    if (!summary) return;
    summary.textContent = !selectedSpecies.length
      ? `All species (${SPECIES.length})`
      : `${selectedSpecies.length} species selected`;
    updateStartButtonLabel();
  }

  function setSelected(indices) {
    selectedSpecies = indices.slice().sort((a, b) => a - b);
    const set = new Set(selectedSpecies);
    list.querySelectorAll('input.species-cb').forEach(cb => {
      cb.checked = set.has(parseInt(cb.dataset.idx, 10));
    });
    list.querySelectorAll('input.family-cb').forEach(cb => {
      const nums = indicesByFam[parseInt(cb.dataset.fam, 10)] || [];
      const on = nums.filter(i => set.has(i)).length;
      cb.checked = nums.length > 0 && on === nums.length;
      cb.indeterminate = on > 0 && on < nums.length;
    });
    updateSummary();
  }

  FAMILIES.forEach(f => {
    const idxs = indicesByFam[f.num] || [];
    const block = document.createElement('div');
    block.className = 'family-block';
    block.innerHTML = `
      <div class="family-block-head">
        <input type="checkbox" class="family-cb" data-fam="${f.num}">
        <span style="flex:1;cursor:pointer;">${f.num}. ${f.name} (${f.count})</span>
        <button type="button" class="family-expand">Species</button>
      </div>
      <div class="family-species-list"></div>
    `;

    const spList = block.querySelector('.family-species-list');
    idxs.forEach(si => {
      const pair = SPECIES[si];
      const lab = document.createElement('label');
      lab.className = 'species-check-item';
      lab.innerHTML = `<input type="checkbox" class="species-cb" data-idx="${si}">
                       <span>${pair[0]} — ${pair[1]}</span>`;
      spList.appendChild(lab);
    });

    const famCb = block.querySelector('.family-cb');
    famCb.addEventListener('change', () => {
      const set = new Set(selectedSpecies);
      idxs.forEach(i => famCb.checked ? set.add(i) : set.delete(i));
      setSelected([...set]);
    });

    block.querySelector('.family-expand').addEventListener('click', (e) => {
      spList.classList.toggle('open');
      e.target.textContent = spList.classList.contains('open') ? 'Hide' : 'Species';
    });

    spList.querySelectorAll('.species-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const idx = parseInt(cb.dataset.idx, 10);
        const set = new Set(selectedSpecies);
        cb.checked ? set.add(idx) : set.delete(idx);
        setSelected([...set]);
      });
    });

    list.appendChild(block);
  });

  document.getElementById('familyAllBtn')?.addEventListener('click', () => setSelected([]));

  // Presets wiring
  const presets = [
    { id: 'quizTest1Toggle', sci: QUIZ_TEST_1_SCI },
    { id: 'quizTest2Toggle', sci: QUIZ_TEST_2_SCI },
    { id: 'quizTest3Toggle', sci: QUIZ_TEST_3_SCI },
    { id: 'quizTest4Toggle', sci: QUIZ_TEST_4_SCI },
    { id: 'quizTest5Toggle', sci: QUIZ_TEST_5_SCI }
  ];

  presets.forEach(p => {
    document.getElementById(p.id)?.addEventListener('change', () => {
      const want = new Set();
      presets.forEach(pr => {
        if (document.getElementById(pr.id)?.checked) {
          pr.sci.forEach(s => want.add(s.toLowerCase().trim()));
        }
      });
      if (want.size > 0) {
        const matches = [];
        SPECIES.forEach((pair, idx) => {
          if (want.has(pair[1].toLowerCase().trim())) matches.push(idx);
        });
        setSelected(matches);
      }
    });
  });

  updateSummary();
}

function updateStartButtonLabel() {
  const btn = document.getElementById('startBtn');
  if (btn) btn.textContent = `Start ${TOTAL}-question quiz`;
}

// Quiz Loop Functions
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions() {
  const pool = selectedSpecies.length ? selectedSpecies.map(i => SPECIES[i]) : SPECIES.slice();
  const out = [];
  let bag = shuffle(pool);
  while (out.length < TOTAL && bag.length) out.push(bag.pop());
  while (out.length < TOTAL) {
    if (!bag.length) bag = shuffle(pool);
    out.push(bag.pop());
  }
  return out;
}

window.startQuiz = function(guestOrUltimate) {
  isGuest = guestOrUltimate === true;
  isUltimate = guestOrUltimate === 'ultimate';
  playerName = document.getElementById('playerName')?.value.trim() || 'Guest';

  questions = pickQuestions();
  TOTAL = questions.length;
  qIndex = 0;
  score = 0;
  streak = 0;
  missed = [];

  startScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  stats.classList.remove('hidden');
  document.body.classList.add('in-quiz');

  showQuestion();
};

function showQuestion() {
  feedback.classList.add('hidden');
  nextBtn.classList.add('hidden');
  optionsEl.innerHTML = '';
  answered = false;
  hintUsedThisQ = false;
  clearKbHighlight();

  const pair = questions[qIndex];
  currentPair = pair;
  const isSciToCommon = mode === 'sci-to-common';
  currentCorrect = isSciToCommon ? pair[0] : pair[1];

  promptLabel.textContent = isSciToCommon ? 'Scientific name' : 'Common name';
  promptEl.textContent = isSciToCommon ? pair[1] : pair[0];

  document.getElementById('qNum').textContent = qIndex + 1;
  document.getElementById('totalQ').textContent = TOTAL;
  progressBar.style.width = ((qIndex / TOTAL) * 100) + '%';

  const choices = [currentCorrect];
  const pool = SPECIES.map(p => isSciToCommon ? p[0] : p[1]).filter(n => n !== currentCorrect);
  shuffle(pool).slice(0, NUM_CHOICES - 1).forEach(c => choices.push(c));
  
  shuffle(choices).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(btn, opt));
    optionsEl.appendChild(btn);
  });

  loadPhoto(pair[1]);
  startTimer();
}

function selectAnswer(btn, chosen) {
  if (answered) return;
  answered = true;
  stopTimer();

  optionsEl.querySelectorAll('.option').forEach(o => o.disabled = true);
  const correct = chosen === currentCorrect;

  if (correct) {
    btn.classList.add('correct');
    score++;
    streak++;
    feedback.textContent = '✓ Correct!';
    feedback.className = 'feedback correct';
  } else {
    btn.classList.add('wrong');
    streak = 0;
    missed.push(currentPair);
    if (isUltimate) questions.push(currentPair);
    optionsEl.querySelectorAll('.option').forEach(o => {
      if (o.textContent === currentCorrect) o.classList.add('correct');
    });
    feedback.textContent = `✗ Wrong — Correct: ${currentCorrect}`;
    feedback.className = 'feedback wrong';
  }

  feedback.classList.remove('hidden');
  revealImage();
  nextBtn.classList.remove('hidden');
  document.getElementById('score').textContent = score;
  document.getElementById('streak').textContent = streak;
}

function nextQuestion() {
  qIndex++;
  if (qIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  stopTimer();
  quizScreen.classList.add('hidden');
  stats.classList.add('hidden');
  endScreen.classList.remove('hidden');
  document.body.classList.remove('in-quiz');
  document.getElementById('endMsg').textContent = `Final Score: ${score}/${TOTAL} (${Math.round((score / TOTAL) * 100)}%)`;
}

// Timer
function updateTimerDisplay() {
  if (!timerText || !timerBar) return;
  timerText.textContent = timeLeft;
  timerBar.style.width = (timeLeft / TIME_LIMIT * 100) + '%';
}

function stopTimer() {
  if (timerId) { clearInterval(timerId); timerId = null; }
}

function startTimer() {
  stopTimer();
  timeLeft = TIME_LIMIT;
  updateTimerDisplay();
  timerId = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      stopTimer();
      if (!answered) selectAnswer(document.createElement('div'), '');
    }
  }, 1000);
}

// Photos
async function loadPhoto(sciName) {
  speciesImg.classList.remove('revealed');
  speciesImg.removeAttribute('src');
  try {
    const res = await fetch(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(sciName)}&per_page=1`);
    const data = await res.json();
    const taxon = data.results?.[0];
    if (taxon?.default_photo?.medium_url) {
      speciesImg.src = taxon.default_photo.medium_url;
      if (hintUsedThisQ) revealImage();
    }
  } catch (e) {}
}

function revealImage() {
  speciesImg?.classList.add('revealed');
  if (imgPlaceholder) imgPlaceholder.style.opacity = '0';
}

function renderLeaderboard() {
  const box = document.getElementById('leaderboardList');
  if (box) box.innerHTML = '<span class="lb-empty">Ready for scores!</span>';
}

document.addEventListener('DOMContentLoaded', loadDataAndInit);
