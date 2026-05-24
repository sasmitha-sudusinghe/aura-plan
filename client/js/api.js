// API Base configuration
const API_BASE = 'http://localhost:3000/api';

const API = {
  // EXAMS/MODULES ENDPOINTS
  async getExams() {
    const response = await fetch(`${API_BASE}/exams`);
    if (!response.ok) throw new Error('Failed to fetch modules');
    return response.json();
  },

  async addExam(examData) {
    const response = await fetch(`${API_BASE}/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(examData)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to add module');
    }
    return response.json();
  },

  async updateExam(id, examData) {
    const response = await fetch(`${API_BASE}/exams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(examData)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to update module');
    }
    return response.json();
  },

  async toggleExam(id, completed) {
    const response = await fetch(`${API_BASE}/exams/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to toggle module study status');
    }
    return response.json();
  },

  async togglePastPaper(id, year, completed) {
    const response = await fetch(`${API_BASE}/exams/${id}/pastpaper/${year}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to toggle past paper');
    }
    return response.json();
  },

  async deleteExam(id) {
    const response = await fetch(`${API_BASE}/exams/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete module');
    return response.json();
  },

  // GYM SESSIONS ENDPOINTS
  async getGymSessions() {
    const response = await fetch(`${API_BASE}/gym`);
    if (!response.ok) throw new Error('Failed to fetch gym sessions');
    return response.json();
  },

  async addGymSession(sessionData) {
    const response = await fetch(`${API_BASE}/gym`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to add gym session');
    }
    return response.json();
  },

  async updateGymSession(id, sessionData) {
    const response = await fetch(`${API_BASE}/gym/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to update gym session');
    }
    return response.json();
  },

  async toggleGymSession(id, completed) {
    const response = await fetch(`${API_BASE}/gym/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to toggle gym session');
    }
    return response.json();
  },

  async deleteGymSession(id) {
    const response = await fetch(`${API_BASE}/gym/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete gym session');
    return response.json();
  },

  // CALENDAR NOTES ENDPOINTS
  async getCalendarNotes() {
    const response = await fetch(`${API_BASE}/calendar-notes`);
    if (!response.ok) throw new Error('Failed to fetch calendar notes');
    return response.json();
  },

  async getCalendarNoteForDate(date) {
    const response = await fetch(`${API_BASE}/calendar-notes/${date}`);
    if (!response.ok) throw new Error('Failed to fetch daily calendar notes');
    return response.json();
  },

  async saveCalendarNote(date, notes) {
    const response = await fetch(`${API_BASE}/calendar-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, notes })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to save calendar notes');
    }
    return response.json();
  }
};
