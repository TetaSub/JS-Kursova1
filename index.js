"use strict";

// Variables
const STORAGE_KEY = "results";
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
let timeUnit = document.querySelector('input[name="time-unit"]:checked').value;
const timeUnitRadioButtons = document.querySelectorAll('input[name="time-unit"]');
const calculateButton = document.querySelector(".calculate-result");
const result = document.querySelector(".result");

// start+end day variable
let startDate = new Date(startDateInput.value);
let endDate = new Date(endDateInput.value);

/* storage variable
const selectedStartDate = document.querySelector(".selected__startDate");
const selectedEndDate = document.querySelector(".selected__endDate");
const selectedDaysOption = document.querySelector(".selected__day");
const lastResults = document.querySelector(".lastresults");
*/


  
// "storage" functions



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
    if (preset === "week") {
        endDate = new Date(startDate.getTime() + 7 * DAY_IN_MILLISECONDS);
    } else if (preset === "month") {
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
    } 
    endDateInput.value = endDate.toISOString().slice(0, 10);
    startDateInput.value = startDate.toISOString().slice(0, 10);
    return endDate;
}


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


// "result" function 

const getTimeDifference = function(timeUnit, daysOption) {
    let rawDifference = getDaysRange(daysOption) * DAY_IN_MILLISECONDS;
    let resultOfConvertation = 0;    
    const timeUnitLabel = document.querySelector(`label[for="${timeUnit}"]`).textContent;

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

// "submit" event listener for timeForm
timeForm.addEventListener("submit", (event) => {
    event.preventDefault();

  startDate = new Date(startDateInput.value);
  endDate = new Date(endDateInput.value);
  if (endDate < startDate) {
    result.textContent = "Кінцева дата не може бути меншою за початкову";
    return;
  }
    
  for (const radioButton of timeUnitRadioButtons) {
    if (radioButton.checked) {
      timeUnit = radioButton.value;
      break;
    }
  }

  result.textContent = getTimeDifference(timeUnit, daysOption);
  document.body.appendChild(result); 
});

  
//temp

// console.log(startDateInput.value = "2023-04-01");
// console.log(endDateInput.value = "2023-04-08");
// console.log(getDaysRange("alldays"));
// console.log(getDaysRange("weekdays"));
// console.log(getDaysRange("weekends")); 
// console.log(getTimeDifference("seconds"));

