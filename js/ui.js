// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const modulesList = document.getElementById('modules-list');
const gymList = document.getElementById('gym-list');
const gymWeeklyCount = document.getElementById('gym-weekly-count');
const totalCreditsCount = document.getElementById('total-credits-count');

// Modal Elements
const examModal = document.getElementById('exam-modal');
const gymModal = document.getElementById('gym-modal');
const calendarNoteModal = document.getElementById('calendar-note-modal');
const examForm = document.getElementById('exam-form');
const gymForm = document.getElementById('gym-form');
const calendarNoteForm = document.getElementById('calendar-note-form');

// Buttons
const btnAddExam = document.getElementById('btn-add-exam');
const btnAddGym = document.getElementById('btn-add-gym');
const btnResetGym = document.getElementById('btn-reset-gym');
const btnResetModules = document.getElementById('btn-reset-modules');
const closeExamModal = document.getElementById('close-exam-modal');
const closeGymModal = document.getElementById('close-gym-modal');
const closeCalendarNoteModal = document.getElementById('close-calendar-note-modal');
const btnCancelExam = document.getElementById('btn-cancel-exam');
const btnCancelGym = document.getElementById('btn-cancel-gym');
const btnCancelCalendarNote = document.getElementById('btn-cancel-calendar-note');

// Calendar Note Form Fields
const noteDateInput = document.getElementById('note-date');
const noteTextInput = document.getElementById('calendar-note-text');
const displayDateInput = document.getElementById('calendar-note-display-date');

// Toast Notification Helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '<i class="fa-solid fa-check-circle"></i>';
  if (type === 'error') {
    icon = '<i class="fa-solid fa-exclamation-circle"></i>';
  }
  
  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Format date helper
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Form pre-fill date helper
function formatDateForInput(dateString) {
  const d = new Date(dateString);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

// 1st of June Study Leave Countdown
function initCountdown() {
  const countdownEl = document.getElementById('study-leave-countdown');
  const studyLeaveDate = new Date('2026-06-01T00:00:00');
  
  function updateTimer() {
    const now = new Date();
    const diff = studyLeaveDate - now;
    
    if (diff <= 0) {
      countdownEl.innerText = 'Study Leave is active! 📚';
      countdownEl.style.color = 'var(--accent-green)';
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      countdownEl.innerText = `${days} Days and ${hours} Hours left!`;
    } else {
      countdownEl.innerText = `${hours} Hours left!`;
    }
  }
  
  updateTimer();
  setInterval(updateTimer, 60000);
}

// Calendar Setup & Logic
let currentYear = 2026;
let currentMonth = 5; // June (0-indexed: May=4, June=5)

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

async function refreshCalendar() {
  try {
    const modules = await API.getExams();
    const gym = await API.getGymSessions();
    const notes = await API.getCalendarNotes();
    renderCalendar(modules, gym, notes);
  } catch (err) {
    console.error('Failed to refresh calendar:', err);
  }
}

function renderCalendar(modules, gymSessions, calendarNotes) {
  const grid = document.getElementById('calendar-days-grid');
  const monthYearLabel = document.getElementById('calendar-month-year');
  if (!grid || !monthYearLabel) return;
  
  grid.innerHTML = '';
  monthYearLabel.innerText = `${monthNames[currentMonth]} ${currentYear}`;
  
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
  
  const daysOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Previous month buffer cells
  for (let x = firstDayIndex; x > 0; x--) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell prev-month-day';
    cell.innerHTML = `<span class="calendar-day-number">${prevLastDay - x + 1}</span>`;
    grid.appendChild(cell);
  }
  
  // Active month days
  for (let i = 1; i <= lastDay; i++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell';
    
    // Check if cell is June 1st (Study Leave Highlight)
    const isJuneFirst = (currentMonth === 5 && i === 1 && currentYear === 2026);
    if (isJuneFirst) {
      cell.classList.add('study-leave-day-highlight');
    }
    
    // Highlight actual today
    const today = new Date();
    const isToday = (today.getDate() === i && today.getMonth() === currentMonth && today.getFullYear() === currentYear);
    if (isToday) {
      cell.classList.add('current-day-marker');
    }
    
    const dayName = daysOfWeekNames[new Date(currentYear, currentMonth, i).getDay()];
    
    // YYYY-MM-DD format for key mapping
    const formattedDateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    
    // Check if this date has custom calendar notes
    const noteEntry = calendarNotes.find(n => n.date === formattedDateKey);
    const hasNote = noteEntry && noteEntry.notes && noteEntry.notes.trim().length > 0;
    
    let eventsHtml = '';
    
    // 1. Highlight study leave start
    if (isJuneFirst) {
      eventsHtml += `<div class="calendar-event event-study-leave"><i class="fa-solid fa-graduation-cap"></i> Leave Starts!</div>`;
    }
    
    // 2. Filter modules on this exact date
    const dayExams = modules.filter(m => {
      const examDate = new Date(m.date);
      return examDate.getDate() === i && examDate.getMonth() === currentMonth && examDate.getFullYear() === currentYear;
    });
    
    dayExams.forEach(m => {
      const completedClass = m.completed ? 'completed' : '';
      const checked = m.completed ? 'checked' : '';
      eventsHtml += `
        <div class="calendar-event event-exam ${completedClass}" title="Study Session: ${m.moduleName}">
          <input type="checkbox" class="cal-event-checkbox" ${checked} onchange="event.stopPropagation(); toggleModuleStudy('${m._id}', this.checked)">
          <i class="fa-solid fa-book"></i> ${m.moduleCode}
        </div>
      `;
    });
    
    // 3. Filter gym sessions on this day of the week
    const dayGym = gymSessions.filter(g => g.day === dayName);
    dayGym.forEach(g => {
      const completedClass = g.completed ? 'completed' : '';
      const checked = g.completed ? 'checked' : '';
      eventsHtml += `
        <div class="calendar-event event-gym ${completedClass}" title="Gym: ${g.activity}">
          <input type="checkbox" class="cal-event-checkbox" ${checked} onchange="event.stopPropagation(); toggleGymCheck('${g._id}', this.checked)">
          <i class="fa-solid fa-dumbbell"></i> ${g.time} ${g.activity}
        </div>
      `;
    });
    
    // Build cell structures
    const noteIcon = hasNote ? `<span class="calendar-note-indicator" title="Has daily logs"><i class="fa-solid fa-file-signature"></i></span>` : '';
    
    cell.innerHTML = `
      <div class="calendar-day-header-row">
        ${noteIcon}
        <span class="calendar-day-number">${i}</span>
      </div>
      <div class="calendar-events-container">
        ${eventsHtml}
      </div>
    `;
    
    // Click to edit calendar notes on active cells
    cell.addEventListener('click', (e) => {
      // Prevent editing dialog when clicking the checkboxes
      if (e.target.classList.contains('cal-event-checkbox') || e.target.closest('.cal-event-checkbox')) {
        return;
      }
      openCalendarNoteEditor(formattedDateKey);
    });
    
    grid.appendChild(cell);
  }
  
  // Next month buffer cells to pad grid to complete week
  const totalCells = grid.children.length;
  const nextMonthPadding = 42 - totalCells; // 6 rows standard
  for (let j = 1; j <= nextMonthPadding; j++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell next-month-day';
    cell.innerHTML = `<span class="calendar-day-number">${j}</span>`;
    grid.appendChild(cell);
  }
}

// Open daily logs notes editor modal
async function openCalendarNoteEditor(dateKey) {
  try {
    noteDateInput.value = dateKey;
    
    // Formats a neat display header e.g. "June 12, 2026"
    const parsedDate = new Date(dateKey + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    displayDateInput.value = parsedDate.toLocaleDateString(undefined, options);
    
    // Fetch logs from backend
    const note = await API.getCalendarNoteForDate(dateKey);
    noteTextInput.value = note.notes || '';
    
    calendarNoteModal.classList.add('active');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Save Calendar daily notes form handler
calendarNoteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const dateKey = noteDateInput.value;
  const noteText = noteTextInput.value;
  
  try {
    await API.saveCalendarNote(dateKey, noteText);
    showToast('Daily calendar logs saved! ✍️');
    calendarNoteModal.classList.remove('active');
    refreshCalendar();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// Add calendar event navigators
document.getElementById('prev-month-btn').addEventListener('click', async () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  refreshCalendar();
});

document.getElementById('next-month-btn').addEventListener('click', async () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  refreshCalendar();
});

// Load and Render Academic Modules
async function loadModules() {
  try {
    const modules = await API.getExams();
    
    // Sort modules by date chronologically
    modules.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Update credit counter
    let totalCredits = 0;
    modules.forEach(m => totalCredits += (m.credits || 0));
    totalCreditsCount.innerText = totalCredits;
    
    if (modules.length === 0) {
      modulesList.innerHTML = `
        <div class="empty-row">
          No modules scheduled. Click "Reload Semester Subjects" to initialize standard preloaded courses.
        </div>
      `;
      return;
    }
    
    modulesList.innerHTML = modules.map(m => {
      // Badges classes
      const isHighCredit = m.credits >= 4;
      const creditBadgeClass = isHighCredit ? 'credit-badge credit-high' : 'credit-badge';
      
      let typeBadgeClass = 'type-theory';
      if (m.type === 'Practical Only') typeBadgeClass = 'type-practical';
      if (m.type === 'Theory & Practical') typeBadgeClass = 'type-both';
      
      // Determine credit indicator color stripe
      let creditColorClass = 'credits-2';
      if (m.credits === 4) creditColorClass = 'credits-4';
      if (m.credits === 3) creditColorClass = 'credits-3';
      if (m.credits === 1) creditColorClass = 'credits-1';
      
      // Module card study completion state
      const studyCompletedClass = m.completed ? 'study-completed' : '';
      const studyChecked = m.completed ? 'checked' : '';
      
      // Build past papers checklist — real labeled checkboxes
      const pastPapersHtml = (m.pastPapers || []).map(p => {
        const checkedAttr = p.completed ? 'checked' : '';
        const doneClass   = p.completed ? 'pp-done' : '';
        return `
          <label class="past-paper-checkbox ${doneClass}">
            <input type="checkbox" ${checkedAttr}
              onchange="togglePaper('${m._id}', '${p.year}', this.checked)">
            <span class="pp-year">${p.year}</span>
            <i class="fa-solid fa-check pp-tick"></i>
          </label>
        `;
      }).join('');

      // Fallback if pastPapers is still empty
      const papersBlock = pastPapersHtml.trim()
        ? pastPapersHtml
        : '<span style="color:rgba(255,255,255,.35);font-size:.78rem;">No past papers – reload semester subjects</span>';
      
      return `
        <div class="module-card ${creditColorClass} ${studyCompletedClass}">
          <!-- Absolute Study session completed checkbox -->
          <label class="study-check-container" title="Mark study session fully completed">
            <input type="checkbox" ${studyChecked} onchange="toggleModuleStudy('${m._id}', this.checked)">
            <span class="study-check-checkmark"><i class="fa-solid fa-check"></i></span>
          </label>

          <div class="module-header">
            <div class="module-title-section">
              <span class="module-code">${m.moduleCode}</span>
              <h3 class="module-name">${m.moduleName}</h3>
            </div>
          </div>
          
          <div class="module-badges">
            <span class="${creditBadgeClass}">${m.credits} Credits</span>
            <span class="type-badge ${typeBadgeClass}">${m.type}</span>
          </div>

          <div class="module-date">
            <i class="fa-regular fa-calendar-check"></i>
            <span>Exam: ${formatDate(m.date)}</span>
          </div>

          <!-- Past papers checkbox tracker -->
          <div class="past-papers-section">
            <span class="past-papers-title">Past Papers Check</span>
            <div class="past-papers-list">
              ${papersBlock}
            </div>
          </div>

          <!-- Daily study plans tracker -->
          <div class="daily-plan-section">
            <div class="daily-plan-header">
              <span class="daily-plan-title">Daily Study Plan</span>
              <button class="daily-plan-save-btn" onclick="saveDailyPlan('${m._id}')">Save Plan</button>
            </div>
            <textarea class="daily-plan-textarea" id="plan-${m._id}" placeholder="e.g. Day 1: Read slide 1-3. Day 2: Attempt lab exercises.">${m.dailyPlan || ''}</textarea>
          </div>

          <div class="module-actions-footer">
            <button class="action-icon-btn edit" onclick="editModule('${m._id}')">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="action-icon-btn delete" onclick="deleteModule('${m._id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
    
    // Refresh calendar views as well
    refreshCalendar();
  } catch (err) {
    showToast(err.message, 'error');
    modulesList.innerHTML = `<div class="loading-state" style="color: var(--accent-danger);">Error loading academic modules.</div>`;
  }
}

// Load and Render Gym sessions
async function loadGymSessions() {
  try {
    const sessions = await API.getGymSessions();
    
    // Day order for sorting
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    sessions.sort((a, b) => {
      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.time.localeCompare(b.time);
    });
    
    gymWeeklyCount.innerText = sessions.length;
    
    if (sessions.length === 0) {
      gymList.innerHTML = `
        <tr class="empty-row">
          <td colspan="6">No gym sessions scheduled. Click "Default Schedule" or "Add Session" to start.</td>
        </tr>
      `;
      return;
    }
    
    gymList.innerHTML = sessions.map(session => {
      const isEvening = session.time >= '17:00';
      const badge = isEvening ? '<span class="badge badge-gym">Evening</span> ' : '';
      
      const completedClass = session.completed ? 'completed-row' : '';
      const checkedState = session.completed ? 'checked' : '';
      
      return `
        <tr class="${completedClass}">
          <td style="text-align: center; vertical-align: middle;">
            <input type="checkbox" class="gym-row-checkbox" ${checkedState} onchange="toggleGymCheck('${session._id}', this.checked)" title="Mark completed">
          </td>
          <td style="font-weight: 600; color: white;">${session.day}</td>
          <td>${session.time}</td>
          <td>${badge}${session.activity}</td>
          <td>${session.notes || '-'}</td>
          <td class="actions-col">
            <div class="actions-cell">
              <button class="action-icon-btn edit" onclick="editGymSession('${session._id}')">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="action-icon-btn delete" onclick="deleteGymSession('${session._id}')">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
    
    // Refresh calendar views as well
    refreshCalendar();
  } catch (err) {
    showToast(err.message, 'error');
    gymList.innerHTML = `<tr><td colspan="6" style="color: var(--accent-danger);">Error loading gym sessions.</td></tr>`;
  }
}

// Tab Switching Setup
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    
    btn.classList.add('active');
    const panelId = `${btn.dataset.tab}-panel`;
    document.getElementById(panelId).classList.add('active');
    
    // Render calendar fresh if tab matches
    if (btn.dataset.tab === 'calendar') {
      refreshCalendar();
    }
  });
});

// Modals Trigger Handlers
btnAddExam.addEventListener('click', () => {
  document.getElementById('exam-modal-title').innerText = 'Add Academic Module';
  examForm.reset();
  document.getElementById('exam-id').value = '';
  examModal.classList.add('active');
});

btnAddGym.addEventListener('click', () => {
  document.getElementById('gym-modal-title').innerText = 'Add Gym Session';
  gymForm.reset();
  document.getElementById('gym-id').value = '';
  document.getElementById('gym-time').value = '18:00'; // Default to evening
  gymModal.classList.add('active');
});

// Default preloaded Semester Subjects
btnResetModules.addEventListener('click', async () => {
  if (confirm('Do you want to reload your semester courses? This will replace current module lists.')) {
    try {
      const existing = await API.getExams();
      for (const m of existing) {
        await API.deleteExam(m._id);
      }
      
      // Last 3 past paper years auto-seeded for every module
      const defaultPastPapers = [
        { year: '2023', completed: false },
        { year: '2024', completed: false },
        { year: '2025', completed: false },
      ];

      const defaults = [
        {
          moduleCode: 'IT2244(T)',
          moduleName: 'Operating Systems (Theory)',
          credits: 2,
          type: 'Theory Only',
          date: '2026-06-10',
          description: 'CPU schedulers, process synchronization, and virtual memory systems.',
          dailyPlan: 'Day 1: Study Round-Robin, FCFS and SJF scheduling.\nDay 2: Mutex, Semaphores and Deadlock models.',
          completed: false,
          pastPapers: [...defaultPastPapers.map(p => ({...p}))]
        },
        {
          moduleCode: 'IT2244(P)',
          moduleName: 'Operating Systems (Practical)',
          credits: 2,
          type: 'Practical Only',
          date: '2026-06-11',
          description: 'OS Practical labs, bash scripting, process forks.',
          dailyPlan: 'Day 1: Practice fork(), exec(), wait() code blocks.\nDay 2: Write bash scripts for system diagnostics.',
          completed: false,
          pastPapers: [...defaultPastPapers.map(p => ({...p}))]
        },
        {
          moduleCode: 'IT2234(T)',
          moduleName: 'Web Services & Server Tech (Theory)',
          credits: 2,
          type: 'Theory Only',
          date: '2026-06-17',
          description: 'SOA architectures, Web Services Standards, REST, SOAP protocols.',
          dailyPlan: 'Day 1: SOAP vs REST architecture patterns.\nDay 2: HTTP status codes and middleware structures.',
          completed: false,
          pastPapers: [...defaultPastPapers.map(p => ({...p}))]
        },
        {
          moduleCode: 'IT2234(P)',
          moduleName: 'Web Services & Server Tech (Practical)',
          credits: 2,
          type: 'Practical Only',
          date: '2026-06-18',
          description: 'Backend Node.js programming, JSON validation, API endpoints.',
          dailyPlan: 'Day 1: Set up Express server with routes.\nDay 2: Integrate MongoDB using Mongoose schemas.',
          completed: false,
          pastPapers: [...defaultPastPapers.map(p => ({...p}))]
        },
        {
          moduleCode: 'IT2223(T)',
          moduleName: 'Design & Analysis of Algorithms (Theory)',
          credits: 2,
          type: 'Theory Only',
          date: '2026-06-24',
          description: 'Divide & Conquer, Dynamic Programming, Greedy Algorithms complexity proofs.',
          dailyPlan: 'Day 1: Big O, Omega, Theta notations and math limits.\nDay 2: Knapsack problem and coin change solutions.',
          completed: false,
          pastPapers: [...defaultPastPapers.map(p => ({...p}))]
        },
        {
          moduleCode: 'IT2223(P)',
          moduleName: 'Design & Analysis of Algorithms (Practical)',
          credits: 1,
          type: 'Practical Only',
          date: '2026-06-25',
          description: 'Algorithmic sorting programs, graph traversals simulations.',
          dailyPlan: 'Day 1: Code QuickSort and MergeSort programs.\nDay 2: Code BFS and DFS graph search paths.',
          completed: false,
          pastPapers: [...defaultPastPapers.map(p => ({...p}))]
        },
        {
          moduleCode: 'IT2252',
          moduleName: 'Social & Professional Issues in IT',
          credits: 2,
          type: 'Theory Only',
          date: '2026-06-14',
          description: 'Ethics, licensing, computer laws, professional standards.',
          dailyPlan: 'Day 1: Read computer crime laws and data privacy bills.\nDay 2: Study professional codes of ethics.',
          completed: false,
          pastPapers: [...defaultPastPapers.map(p => ({...p}))]
        },
        {
          moduleCode: 'IT2212',
          moduleName: 'Management Information Systems',
          credits: 2,
          type: 'Theory Only',
          date: '2026-06-21',
          description: 'ERP systems, enterprise databases, decision intelligence models.',
          dailyPlan: 'Day 1: Study CRM, SCM, and ERP architectures.\nDay 2: Read about transaction processing systems.',
          completed: false,
          pastPapers: [...defaultPastPapers.map(p => ({...p}))]
        }
      ];
      
      for (const item of defaults) {
        await API.addExam(item);
      }
      
      showToast('Preloaded separated core semester subjects successfully! 📚');
      loadModules();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }
});

// Reset / Default Gym presets creator (Tailored for Rugby Performance!)
btnResetGym.addEventListener('click', async () => {
  if (confirm('Do you want to set your gym routine to the specialized Rugby Strength & Conditioning program?')) {
    try {
      const existing = await API.getGymSessions();
      for (const sess of existing) {
        await API.deleteGymSession(sess._id);
      }
      
      const defaults = [
        { 
          day: 'Monday', 
          time: '18:00', 
          activity: 'Rugby Strength & Power', 
          notes: 'Heavy squats (3x5), Power cleans (4x3), Bench press (3x5), Weighted core. Targeted for tackle impact.',
          completed: false 
        },
        { 
          day: 'Wednesday', 
          time: '18:00', 
          activity: 'Rugby Speed & Conditioning', 
          notes: 'Sled pushes (4x20m), Box jumps (3x8), Shuttle runs (5x50m), Medicine ball throws. Builds line speed.',
          completed: false 
        },
        { 
          day: 'Friday', 
          time: '18:00', 
          activity: 'Rugby Mass & Injury Prevention', 
          notes: 'Deadlifts (3x5), Pull-ups (4xMax), Neck/shoulder accessory work, Rotator cuff care. Protects joint joints.',
          completed: false 
        }
      ];
      
      for (const item of defaults) {
        await API.addGymSession(item);
      }
      
      showToast('Loaded your 3-day evening Rugby Strength & Conditioning program! 🏉💪');
      loadGymSessions();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }
});

// Close modals
[closeExamModal, btnCancelExam].forEach(el => {
  el.addEventListener('click', () => examModal.classList.remove('active'));
});

[closeGymModal, btnCancelGym].forEach(el => {
  el.addEventListener('click', () => gymModal.classList.remove('active'));
});

[closeCalendarNoteModal, btnCancelCalendarNote].forEach(el => {
  el.addEventListener('click', () => calendarNoteModal.classList.remove('active'));
});

// Save Exam Form
examForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('exam-id').value;
  const examData = {
    moduleCode: document.getElementById('exam-moduleCode').value,
    moduleName: document.getElementById('exam-moduleName').value,
    credits: parseInt(document.getElementById('exam-credits').value, 10),
    type: document.getElementById('exam-type').value,
    date: document.getElementById('exam-date').value,
    description: document.getElementById('exam-description').value,
    dailyPlan: document.getElementById('exam-dailyPlan').value
  };
  
  try {
    if (id) {
      await API.updateExam(id, examData);
      showToast('Subject updated successfully! 📚');
    } else {
      // Auto-seed last 3 years of past papers for new modules
      examData.pastPapers = [
        { year: '2023', completed: false },
        { year: '2024', completed: false },
        { year: '2025', completed: false },
      ];
      await API.addExam(examData);
      showToast('Subject scheduled successfully! 📚');
    }
    examModal.classList.remove('active');
    loadModules();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// Save Gym Form
gymForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('gym-id').value;
  const gymData = {
    day: document.getElementById('gym-day').value,
    time: document.getElementById('gym-time').value,
    activity: document.getElementById('gym-activity').value,
    notes: document.getElementById('gym-notes').value
  };
  
  try {
    if (id) {
      await API.updateGymSession(id, gymData);
      showToast('Gym session updated successfully! 💪');
    } else {
      await API.addGymSession(gymData);
      showToast('Gym session scheduled successfully! 💪');
    }
    gymModal.classList.remove('active');
    loadGymSessions();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// Past Paper toggling action
window.togglePaper = async function(id, year, completed) {
  try {
    await API.togglePastPaper(id, year, completed);
    showToast(`Past Paper ${year} state updated!`);
    loadModules();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

// Toggle Module Study checklist status
window.toggleModuleStudy = async function(id, completed) {
  try {
    await API.toggleExam(id, completed);
    if (completed) {
      showToast('Marked module study session completed! 🎉');
    } else {
      showToast('Module study session unchecked.');
    }
    loadModules();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

// Toggle Gym session completed status
window.toggleGymCheck = async function(id, completed) {
  try {
    await API.toggleGymSession(id, completed);
    if (completed) {
      showToast('Marked gym session completed! 🏋️‍♀️');
    } else {
      showToast('Gym session unchecked.');
    }
    loadGymSessions();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

// Daily Plan save button on card
window.saveDailyPlan = async function(id) {
  const planText = document.getElementById(`plan-${id}`).value;
  try {
    await API.updateExam(id, { dailyPlan: planText });
    showToast('Daily study plan saved successfully! ✍️');
    loadModules();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

// Global functions for inline Edit & Delete triggers
window.editModule = async function(id) {
  try {
    const modules = await API.getExams();
    const m = modules.find(item => item._id === id);
    if (!m) return;
    
    document.getElementById('exam-modal-title').innerText = 'Edit Academic Module';
    document.getElementById('exam-id').value = m._id;
    document.getElementById('exam-moduleCode').value = m.moduleCode || '';
    document.getElementById('exam-moduleName').value = m.moduleName;
    document.getElementById('exam-credits').value = m.credits || 2;
    document.getElementById('exam-type').value = m.type || 'Theory Only';
    document.getElementById('exam-date').value = formatDateForInput(m.date);
    document.getElementById('exam-description').value = m.description || '';
    document.getElementById('exam-dailyPlan').value = m.dailyPlan || '';
    
    examModal.classList.add('active');
  } catch (err) {
    showToast(err.message, 'error');
  }
};

window.deleteModule = async function(id) {
  if (confirm('Are you sure you want to delete this module subject?')) {
    try {
      await API.deleteExam(id);
      showToast('Module deleted.');
      loadModules();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }
};

window.editGymSession = async function(id) {
  try {
    const sessions = await API.getGymSessions();
    const session = sessions.find(s => s._id === id);
    if (!session) return;
    
    document.getElementById('gym-modal-title').innerText = 'Edit Gym Session';
    document.getElementById('gym-id').value = session._id;
    document.getElementById('gym-day').value = session.day;
    document.getElementById('gym-time').value = session.time;
    document.getElementById('gym-activity').value = session.activity;
    document.getElementById('gym-notes').value = session.notes || '';
    
    gymModal.classList.add('active');
  } catch (err) {
    showToast(err.message, 'error');
  }
};

window.deleteGymSession = async function(id) {
  if (confirm('Are you sure you want to delete this gym session?')) {
    try {
      await API.deleteGymSession(id);
      showToast('Gym session removed.');
      loadGymSessions();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }
};

// Initial database seeding if empty
async function bootstrapInitialData() {
  try {
    const modules = await API.getExams();
    if (modules.length === 0) {
      // Trigger click to automatically seed the separated subjects
      btnResetModules.click();
    }
    
    const gym = await API.getGymSessions();
    if (gym.length === 0) {
      // Auto seed gym schedule with Rugby defaults
      btnResetGym.click();
    }
  } catch (err) {
    console.error('Bootstrapping error:', err);
  }
}

// Run Startup
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  loadModules();
  loadGymSessions();
  
  // Seed basic initial values if empty
  setTimeout(bootstrapInitialData, 1200);
});
