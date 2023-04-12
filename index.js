"use strict";

// Variables
const STORAGE_KEY = "lastResultArray";
const MAX_STORED_RESULTS = 10;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const HOURS_IN_MILLISECONDS = 60 * 60 * 1000;
const MINUTES_IN_MILLISECONDS = 60 * 1000;
const SECONDS_IN_MILLISECONDS = 1 * 1000;

// DOM variables
const timeForm = document.querySelector(".time-form");

const startDateInput = document.querySelector(".startDate");
const endDateInput = document.querySelector(".endDate");
const presetWeek = document.querySelector(".preset__week");
const presetMonth = document.querySelector(".preset__month");

let daysOption = document.querySelector('input[name="days-option"]:checked').value;
const daysOptionRadioButtons = document.querySelectorAll('input[name="days-option"]');
let daysOptionLabel = document.querySelector(`label[for="${daysOption}"]`).textContent;

let timeUnit = document.querySelector('input[name="time-unit"]:checked').value;
const timeUnitRadioButtons = document.querySelectorAll('input[name="time-unit"]');
let timeUnitLabel = document.querySelector(`label[for="${timeUnit}"]`).textContent;

const calculateButton = document.querySelector(".time-form__calculate");
const clearFormButton = document.querySelector(".time-form__clear");
const resultMessage = document.querySelector(".result__message");
const lastResultsTable = document.querySelector(".lastresults-table");


// start+end days variables
let startDate = new Date(startDateInput.value);
let endDate = new Date(endDateInput.value);

// 'preset' function

presetWeek.addEventListener("click", (event) => {
    event.preventDefault();
    setEndDate("week");
});

presetMonth.addEventListener("click", (event) => {
    event.preventDefault();    
    setEndDate("month");
});

const setEndDate = function(preset) {      
  if (!startDateInput.value) {
    startDate = new Date();
  }
  else if (startDateInput.value) {
    startDate = new Date(startDateInput.value);
  }
  
  if (preset === "week") {
      endDate = new Date(startDate.getTime() + 7 * DAY_IN_MILLISECONDS);
    } else if (preset === "month") {
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
  } 
    endDateInput.value = endDate.toISOString().slice(0, 10);
    startDateInput.value = startDate.toISOString().slice(0, 10);
    return endDate;
}

// event listener for startDate

startDateInput.addEventListener('change', function() {
  startDate = new Date(startDateInput.value);
  endDateInput.setAttribute('min', startDate.toISOString().slice(0, 10));
  endDateInput.value = '';
});


// "days range" function

for (const radioButton of daysOptionRadioButtons) {
  radioButton.addEventListener("click", () => {
    daysOption = radioButton.value;
  });
}

const getDaysRange = function(daysOption) {
  let daysRange;
  const totalDays = Math.floor((endDate - startDate) / DAY_IN_MILLISECONDS) + 1;
  let weekdays = 0;
  let weekends = 0;

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate.getTime() + i * DAY_IN_MILLISECONDS);
    const currentDayOfWeek = currentDate.getDay();

    if (currentDayOfWeek >= 1 && currentDayOfWeek <= 5) {
      weekdays++;
    } else if (currentDayOfWeek === 0 || currentDayOfWeek === 6) {
      weekends++;
    }
    }
  switch (daysOption) {
    case "weekdays":
      daysRange = weekdays;
      break;
    case "weekends":
      daysRange = weekends;
      break;
    default:
      daysRange = totalDays;
      break;
  }
    return daysRange;
};


// "result" functions 

const getTimeDifference = function(timeUnit, daysOption) {
  let rawDifference = getDaysRange(daysOption) * DAY_IN_MILLISECONDS;
  let resultOfConvertation = 0; 
  
  switch (timeUnit) {
    case "hours":
      resultOfConvertation = rawDifference / HOURS_IN_MILLISECONDS;
      break;
    case "minutes":
      resultOfConvertation = rawDifference / MINUTES_IN_MILLISECONDS;
      break;
    case "seconds":
      resultOfConvertation = rawDifference / SECONDS_IN_MILLISECONDS;
      break;
    default:
      resultOfConvertation = rawDifference / DAY_IN_MILLISECONDS;
      break;
  }
  return `${resultOfConvertation} ${timeUnitLabel}`;  
}


const createResultMessage = function (startDate, endDate, daysOptionLabel) {
  const timeDifference = getTimeDifference(timeUnit, daysOption);
  startDate = startDateInput.value;
  endDate = endDateInput.value;
  const resultMessage = `Різниця між ${startDate} та ${endDate} становить ${timeDifference}, якщо враховувати ${daysOptionLabel}.`;
  return resultMessage;
};

// "last results table" function

const createLastResultRow = function () {
  let timeDifference = getTimeDifference(timeUnit, daysOption);
  daysOptionLabel = document.querySelector(`label[for="${daysOption}"]`).textContent;
  const lastResultRow = document.createElement('tr');
  lastResultRow.innerHTML = `
    <td class="selected__startDate">${startDateInput.value}</td>
    <td class="selected__endDate">${endDateInput.value}</td>
    <td class="selected__day">${daysOptionLabel}</td>
    <td class="lastresults">${timeDifference}</td>
  `;  
  return lastResultRow;
};


// storage functions

let lastResultArray = [];

const storeResultsInLocalStorage = function () {
  const lastResultRow = createLastResultRow();
  const storedLastResultRow = lastResultRow.outerHTML;
  let storedLastResultArray = localStorage.getItem(STORAGE_KEY);
  
  
  if (storedLastResultArray) { 
    lastResultArray = JSON.parse(storedLastResultArray);
  };

  lastResultArray.unshift(storedLastResultRow); 
  if (lastResultArray.length > MAX_STORED_RESULTS) {
    lastResultArray.pop(); 
  };

  storedLastResultArray = JSON.stringify(lastResultArray);
  localStorage.setItem(STORAGE_KEY, storedLastResultArray);
};

const getResultsFromLocalStorage = function (lastResultsTable) {  
  let storedLastResultArray = localStorage.getItem(STORAGE_KEY);

  lastResultsTable.innerHTML = "";
  if (storedLastResultArray) {
    lastResultArray = JSON.parse(storedLastResultArray);
    for (let step = lastResultArray.length - 1; step >= 0; step--) {
      const lastResultRow = document.createElement('tr');
      lastResultRow.innerHTML = lastResultArray[step];
      lastResultsTable.insertBefore(lastResultRow, lastResultsTable.firstChild);
    }
  }
};

window.addEventListener('load', function() {
  getResultsFromLocalStorage(lastResultsTable);
});


// "submit" event listener for timeForm
timeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startDate = new Date(startDateInput.value);
  endDate = new Date(endDateInput.value);
    
  for (const radioButton of timeUnitRadioButtons) {
    if (radioButton.checked) {
      timeUnit = radioButton.value;      
      timeUnitLabel = document.querySelector(`label[for="${timeUnit}"]`).textContent;
      break;
    }
  }

  for (const radioButton of daysOptionRadioButtons) {
    if (radioButton.checked) {
      daysOption = radioButton.value;
      daysOptionLabel = document.querySelector(`label[for="${daysOption}"]`).textContent;
      break;
    }
  }

  resultMessage.textContent = createResultMessage(startDate, endDate, daysOptionLabel);
  timeForm.appendChild(resultMessage); 
  
  storeResultsInLocalStorage();
  getResultsFromLocalStorage(lastResultsTable);
});

// "clear form" event listener 
clearFormButton.addEventListener("click", function(event) {
  event.preventDefault();
  startDateInput.value = '';
  endDateInput.value = '';
  timeUnitRadioButtons.forEach(radio => radio.checked = false);
  daysOptionRadioButtons.forEach(radio => radio.checked = false);
  resultMessage.textContent = '';
});

    
