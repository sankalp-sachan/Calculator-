const switchBtn = document.getElementById('switchBtn');
const timeCalculator = document.getElementById('timeCalculator');
const weightCalculator = document.getElementById('weightCalculator');
const addTimeBtn = document.getElementById('addTime');
const deleteTimeBtn = document.getElementById('deleteTime');
const addWeightBtn = document.getElementById('addWeight');
const deleteWeightBtn = document.getElementById('deleteWeight');
const timeEntriesUl = document.getElementById('timeEntries');
const weightEntriesUl = document.getElementById('weightEntries');
const timeTotalDiv = document.getElementById('timeTotal');
const weightTotalDiv = document.getElementById('weightTotal');

// Load data from localStorage
let timeEntries = JSON.parse(localStorage.getItem('timeEntries')) || [];
let weightEntries = JSON.parse(localStorage.getItem('weightEntries')) || [];
let currentCalculator = localStorage.getItem('currentCalculator') || 'time';

// Save all data
function saveAll() {
  localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
  localStorage.setItem('weightEntries', JSON.stringify(weightEntries));
  localStorage.setItem('currentCalculator', currentCalculator);
}

// Calculations
function calculateTimeTotal() {
  const totalMinutes = timeEntries.reduce((sum, entry) => sum + entry.totalMinutes, 0);
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60
  };
}

function calculateWeightTotal() {
  const totalGrams = weightEntries.reduce((sum, entry) => sum + entry.totalGrams, 0);
  return {
    kg: Math.floor(totalGrams / 1000),
    grams: totalGrams % 1000
  };
}

// Display functions
function displayTimeEntries() {
  timeEntriesUl.innerHTML = '';
  timeEntries.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `Entry ${index + 1}: ${entry.hours}h ${entry.minutes}m → Total ${entry.totalMinutes} mins`;
    timeEntriesUl.appendChild(li);
  });
  const total = calculateTimeTotal();
  timeTotalDiv.textContent = `Total Time: ${total.hours} hours, ${total.minutes} minutes`;
}

function displayWeightEntries() {
  weightEntriesUl.innerHTML = '';
  weightEntries.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `Entry ${index + 1}: ${entry.kg}kg ${entry.grams}g → Total ${entry.totalGrams} grams`;
    weightEntriesUl.appendChild(li);
  });
  const total = calculateWeightTotal();
  weightTotalDiv.textContent = `Total Weight: ${total.kg} kg, ${total.grams} grams`;
}

// Show calculator
function showCalculator(calc) {
  timeCalculator.classList.remove('active');
  weightCalculator.classList.remove('active');
  if (calc === 'time') {
    timeCalculator.classList.add('active');
    switchBtn.textContent = 'Switch to Weight Calculator';
  } else {
    weightCalculator.classList.add('active');
    switchBtn.textContent = 'Switch to Time Calculator';
  }
  currentCalculator = calc;
  saveAll();
}

// Add entries
function addTimeEntry() {
  const hours = parseInt(document.getElementById('hours').value) || 0;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const totalMinutes = hours * 60 + minutes;
  if (totalMinutes <= 0) return alert("Please enter valid time!");
  timeEntries.push({ hours, minutes, totalMinutes });
  saveAll();
  displayTimeEntries();
  document.getElementById('hours').value = '';
  document.getElementById('minutes').value = '';
}

function addWeightEntry() {
  const kg = parseInt(document.getElementById('kg').value) || 0;
  const grams = parseInt(document.getElementById('grams').value) || 0;
  const totalGrams = kg * 1000 + grams;
  if (totalGrams <= 0) return alert("Please enter valid weight!");
  weightEntries.push({ kg, grams, totalGrams });
  saveAll();
  displayWeightEntries();
  document.getElementById('kg').value = '';
  document.getElementById('grams').value = '';
}

// Delete all entries
deleteTimeBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all time data?')) {
    timeEntries = [];
    saveAll();
    displayTimeEntries();
  }
});

deleteWeightBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all weight data?')) {
    weightEntries = [];
    saveAll();
    displayWeightEntries();
  }
});

// Event listeners
addTimeBtn.addEventListener('click', addTimeEntry);
addWeightBtn.addEventListener('click', addWeightEntry);
switchBtn.addEventListener('click', () => showCalculator(currentCalculator === 'time' ? 'weight' : 'time'));

// On load
displayTimeEntries();
displayWeightEntries();
showCalculator(currentCalculator);

/* ============================
   PWA: service worker + install
   ============================ */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .catch(err => console.error('SW registration failed:', err));
  });
}

let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) {
    installBtn.hidden = false;
  }
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    deferredPrompt = null;
    installBtn.hidden = true;
  });
}
