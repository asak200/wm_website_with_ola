const API_BASE = "lesser-remedy-territory-removing.trycloudflare.com";
// https://lesser-remedy-territory-removing.trycloudflare.com
// const API_BASE = `${location.hostname}:8000`;
// const API_BASE = "localhost:8000";
const WM_STATES_URL = `https://${API_BASE}/wm_states`;
const WM_TIME_URL = (id) => `https://${API_BASE}/wm_time/${id}`;

const machines = new Map();
let updateInterval = null;

async function fetchStates() {
  try {
    const response = await fetch(WM_STATES_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const states = await response.json();
    updateMachines(states);
  } catch (error) {
    console.error('Error fetching states:', error);
  }
}

async function fetchMachineTime(id) {
  try {
    const response = await fetch(WM_TIME_URL(id));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.remaining_time || 0;
  } catch (error) {
    console.error(`Error fetching time for machine ${id}:`, error);
    return 0;
  }
}

function updateMachines(states) {
  states.forEach((state) => {
    if (!machines.has(state.id)) {
      machines.set(state.id, { id: state.id, status: state.status, time: 0 });
    } else {
      const machine = machines.get(state.id);
      machine.status = state.status;
    }
  });
  renderMachines();
}

function renderMachines() {
  const container = document.getElementById('machines-container');
  container.innerHTML = '';

  const sortedMachines = Array.from(machines.values()).sort((a, b) => a.id - b.id);

  sortedMachines.forEach((machine) => {
    const card = document.createElement('div');
    card.className = `machine-card ${machine.status}`;

    /*
          
    */
    if (machine.status === 'busy') {
      card.innerHTML = `
        <div class="machine-status">
          <div class="status-icon">
            <svg class="spinner" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="3"></circle>
            </svg>
          </div>
          <div class="status-text">
            <span class="status-label">${machine.id}-Busy</span>
            <span class="time-remaining" id="time-${machine.id}">--:--</span>
          </div>
        </div>
      `;

      fetchMachineTime(machine.id).then((time) => {
        machine.time = time;
        updateTimeDisplay(machine.id, time);
      });
    } else {
      card.innerHTML = `
        <div class="machine-status">
          <div class="status-icon">
            <svg viewBox="0 0 50 50">
              <path d="M 15 25 L 22 32 L 35 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div class="status-text">
            <span class="status-label">${machine.id}-Available</span>
          </div>
        </div>
      `;
    }

    container.appendChild(card);
  });
}

function updateTimeDisplay(machineId, seconds) {
  const element = document.getElementById(`time-${machineId}`);
  if (!element) return;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    element.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    element.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

function startUpdateCycle() {
  fetchStates();

  updateInterval = setInterval(() => {
    machines.forEach((machine) => {
      if (machine.status === 'busy' && machine.time > 0) {
        machine.time -= 1;
        updateTimeDisplay(machine.id, machine.time);
      }
    });
  }, 1000);
}


document.addEventListener('DOMContentLoaded', () => {
  startUpdateCycle();

  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      console.log('click');
      // connectWS();
      fetchStates();
    });
  }

  // setInterval(() => {
  //   fetchStates();
  // }, 30000);
});

let reconnectDelay = 1000;
let socket = null;
let reconnectTimeout = null;

function connectWS() {
  // Clear any pending reconnection attempts
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  
  socket = new WebSocket(`ws://${API_BASE}/ws`);

  socket.onopen = () => {
    console.log("✅ Connected");
    reconnectDelay = 1000; // Reset delay on success
  };

  socket.onmessage = (event) => {
    fetchStates();
  };

  socket.onclose = (e) => {
    // Don't reconnect if it was a deliberate close
    if (e.wasClean) return;

    console.log(`❌ Disconnected. Retrying in ${reconnectDelay}ms...`);
    
    reconnectTimeout = setTimeout(() => {
      connectWS();
    }, reconnectDelay);
  };

  socket.onerror = (err) => {
    console.error("WebSocket Error:", err);
    socket.close(); 
  };
}
connectWS();

console.log("\n\nasak\n\n");