// ============================================================
//  AuraPlan – localStorage-backed API layer
//  Drop-in replacement for the original fetch-based api.js.
//  The public surface (function names + return shapes) is
//  identical to the MongoDB version so ui.js needs zero changes.
// ============================================================

// --- Utility helpers -----------------------------------------

/** Generate a MongoDB-style 24-char hex id */
function _genId() {
  return Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

/** Simulate async (keeps await chains in ui.js working) */
function _resolve(value) {
  return Promise.resolve(value);
}

// Storage keys
const KEYS = {
  exams: 'aura_exams',
  gym:   'aura_gym',
  notes: 'aura_calendar_notes',
};

function _load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function _save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ============================================================
//  Public API object — same surface as the original fetch API
// ============================================================
const API = {

  // ----------------------------------------------------------
  // EXAMS / MODULES
  // ----------------------------------------------------------

  async getExams() {
    return _resolve(_load(KEYS.exams));
  },

  async addExam(examData) {
    const exams = _load(KEYS.exams);
    const newExam = {
      _id: _genId(),
      moduleCode:  examData.moduleCode  || '',
      moduleName:  examData.moduleName  || '',
      credits:     examData.credits     ?? 2,
      type:        examData.type        || 'Theory Only',
      date:        examData.date        || '',
      description: examData.description || '',
      dailyPlan:   examData.dailyPlan   || '',
      completed:   examData.completed   ?? false,
      pastPapers:  examData.pastPapers  || [],
    };
    exams.push(newExam);
    _save(KEYS.exams, exams);
    return _resolve(newExam);
  },

  async updateExam(id, examData) {
    const exams = _load(KEYS.exams);
    const idx = exams.findIndex(e => e._id === id);
    if (idx === -1) throw new Error('Module not found');
    // Merge: only overwrite provided fields
    exams[idx] = { ...exams[idx], ...examData };
    _save(KEYS.exams, exams);
    return _resolve(exams[idx]);
  },

  async toggleExam(id, completed) {
    return API.updateExam(id, { completed });
  },

  async togglePastPaper(id, year, completed) {
    const exams = _load(KEYS.exams);
    const exam = exams.find(e => e._id === id);
    if (!exam) throw new Error('Module not found');

    const paper = (exam.pastPapers || []).find(p => p.year === year);
    if (paper) {
      paper.completed = completed;
    } else {
      exam.pastPapers = exam.pastPapers || [];
      exam.pastPapers.push({ year, completed });
    }
    _save(KEYS.exams, exams);
    return _resolve(exam);
  },

  async deleteExam(id) {
    const exams = _load(KEYS.exams).filter(e => e._id !== id);
    _save(KEYS.exams, exams);
    return _resolve({ message: 'Module deleted' });
  },

  // ----------------------------------------------------------
  // GYM SESSIONS
  // ----------------------------------------------------------

  async getGymSessions() {
    return _resolve(_load(KEYS.gym));
  },

  async addGymSession(sessionData) {
    const sessions = _load(KEYS.gym);
    const newSession = {
      _id:       _genId(),
      day:       sessionData.day       || 'Monday',
      time:      sessionData.time      || '18:00',
      activity:  sessionData.activity  || '',
      notes:     sessionData.notes     || '',
      completed: sessionData.completed ?? false,
    };
    sessions.push(newSession);
    _save(KEYS.gym, sessions);
    return _resolve(newSession);
  },

  async updateGymSession(id, sessionData) {
    const sessions = _load(KEYS.gym);
    const idx = sessions.findIndex(s => s._id === id);
    if (idx === -1) throw new Error('Session not found');
    sessions[idx] = { ...sessions[idx], ...sessionData };
    _save(KEYS.gym, sessions);
    return _resolve(sessions[idx]);
  },

  async toggleGymSession(id, completed) {
    return API.updateGymSession(id, { completed });
  },

  async deleteGymSession(id) {
    const sessions = _load(KEYS.gym).filter(s => s._id !== id);
    _save(KEYS.gym, sessions);
    return _resolve({ message: 'Session deleted' });
  },

  // ----------------------------------------------------------
  // CALENDAR NOTES
  // ----------------------------------------------------------

  async getCalendarNotes() {
    return _resolve(_load(KEYS.notes));
  },

  async getCalendarNoteForDate(date) {
    const notes = _load(KEYS.notes);
    const found = notes.find(n => n.date === date);
    return _resolve(found || { date, notes: '' });
  },

  async saveCalendarNote(date, notes) {
    const all = _load(KEYS.notes);
    const idx = all.findIndex(n => n.date === date);
    const entry = { date, notes };
    if (idx >= 0) {
      all[idx] = entry;
    } else {
      all.push(entry);
    }
    _save(KEYS.notes, all);
    return _resolve(entry);
  },
};
