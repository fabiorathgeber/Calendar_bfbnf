

import {Day} from './day.js'
import {CEvent} from './events.js'
import { getEventByOwner, getID, getFriendRequests, removeEvent } from './clientreq.js';


const currentDate = new Date();

const mainPanel = document.getElementById("mainPanel");

// async function getId() {
//     const result = await getID()
//     console.log(result)
// }
// await getId();c

const user_id = localStorage.getItem("user_id")
localStorage.clear();

const time1 = '10:25';
const time2 = '08:00';
console.log(time1>time2)



// import {Day} from './day.js';

// getEventByOwner(1).then((data) => {
//     currentEventsArray = data
// });

// console.log(currentEventsArray)



// add event to array whenever new one is made
// and then also save it (asynchronusly!!!!!!!)
// good thinking smart


let months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let distFromStartMonth = 0;

let priorMonth = currentMonth-1;
let priorYear = currentYear-1;
if(currentMonth==0) {
    priorMonth = 11;
}

let days = 0;

let monthTitle = document.getElementById("monthTitle");

const dayHeadings = document.getElementById('dayHeadings');

function changeMT() {
    monthTitle.textContent = months[currentMonth] +' '+currentYear;
}
changeMT();

for(let i=0; i<7; i++) {
    const dayHeader = document.createElement('div');
    dayHeadings.appendChild(dayHeader);
    dayHeader.textContent = dayArray[i];
    dayHeader.classList.add('dayHeader');
}

let dayList = [];

let dayClicked = undefined;

for(let i=0;i<=41; i++) {
    const day = new Day(i);
    day.object.addEventListener('click', () => {
        eventMaker.classList.add('active');
        dayClicked = day;
    })
    dayList.push(day);
}



// load all past events into array at the start
let currentEventsArray = await getEventByOwner(user_id);

currentEventsArray.forEach((cEvent, index) => {
    cEvent.object = document.createElement('div');
    // dayList[cEvent.index].object.appendChild(cEvent.object);
    cEvent.object.textContent = cEvent.title + ' ' + cEvent.startTime + '-' + cEvent.endTime;
    // cEvent.object.addEventListener('mouseenter', ()=> {
    //     console.log('hi')
    //     cEvent.object.style.textDecoration = 'line-through'
    // })
    // cEvent.object.addEventListener('mouseleave', ()=> {
    //     cEvent.object.style.textDecoration = ''
    // })
    // cEvent.object.addEventListener('click', ()=> {
    //     const result = removeEvent(cEvent.id);
    //     console.log(result)
    // })
});


function getDaysInMonth(month) {
    if (month==1) return 28;
    if (month==8 || month==3 || month==5 || month==10) return 30;
    return 31;
}

function getFillerDays(currentMonth) {
    const firstOfMonth = new Date(currentMonth+1 + " 1, "+currentYear);
    let firstOfMonthWeekDay = firstOfMonth.getDay();
    let startDay = getDaysInMonth(currentMonth-1)-firstOfMonthWeekDay+1;
    // let daysLeft = 42-getDaysInMonth(currentMonth)-firstOfMonthWeekDay;
    let numFillerDays = getDaysInMonth(currentMonth-1)-startDay;
    return numFillerDays;
    // return firstOfMonth, firstOfMonthWeekDay, startDay, daysLeft;
}

function decreaseMonth() {
    if(currentMonth==0) {
        currentMonth = 11;
        currentYear -=1;
        return;
    }
    currentMonth--;
}
function increaseMonth() {
    if(currentMonth==11) {
        currentMonth = 0;
        currentYear++;
        return;
    }
    currentMonth++;
}


let dayIndex = 0;

function makeCalendar() {

    let prevMonth = currentMonth-1;
    if(currentMonth==0) {
        prevMonth = 11;
    }

    let firstOfMonth = new Date(currentMonth+1 + " 1, "+currentYear);
    let firstOfMonthWeekDay = firstOfMonth.getDay();
    let startDay = getDaysInMonth(prevMonth)-firstOfMonthWeekDay+1;
    let daysLeft = 42-getDaysInMonth(currentMonth)-firstOfMonthWeekDay;


    if(firstOfMonthWeekDay>0) {

        let prevYear = currentYear;
        let prevMonth = currentMonth-1;
        if (currentMonth==0) {
            prevMonth = 11;
            prevYear-=1;
        }
        for (let i=startDay; i<=getDaysInMonth(prevMonth);i++) {
            const day = dayList[dayIndex];
            day.setAttributes(i, prevMonth, prevYear);
            day.object.style.opacity = 0.5;
            day.object.filler = true;
            day.object.first = true;


            dayIndex++;
        }
    }

    for(let i=1; i<=getDaysInMonth(currentMonth); i++) {

        const day = dayList[dayIndex];
        day.setAttributes(i, currentMonth, currentYear);
        day.object.style.opacity = 1;
        day.filler = false;
        day.first = false;


        dayIndex++;
    }
    let start = dayIndex;
    let end = dayIndex+daysLeft;


    let nextYear = currentYear;
    let nextMonth = currentMonth+1;
    if (currentMonth==11) {
        nextMonth = 0;
        nextYear+=1;
    }

    for(let i=1; i<=daysLeft; i++) {

        const day = dayList[dayIndex];
        day.setAttributes(i, nextMonth, nextYear);
        day.object.style.opacity = 0.5;
        day.filler = true;
        day.first = false;

        dayIndex++;
    }

}

makeCalendar();

const confirmButton = document.getElementById('confirmButton');
// const eventTitle = document.getElementById('eventTitle');
// const eventTime = document.getElementById('eventTime');

let dayToInsertEvent = 0;




// dayBoxes.forEach((day, index) => {
//     day.addEventListener('click', () => {
//         eventMaker.classList.add('active');
//         dayToInsertEvent = index;
//     })
// });
function getPriorMonth(month) {
    if(month>11) {
    month = 0;
    currentYear++;
}
}

const eventErrorMessageDiv = document.querySelector('#eventErrorMessageDiv')

confirmButton.addEventListener('click', () => {

    if(eventStartTime.value=='') {
        eventErrorMessageDiv.textContent = 'Please enter a start time'
        return;
    }
    if(eventEndTime.value=='') {
        eventErrorMessageDiv.textContent = 'Please enter an end time.'
        return;
    }
    if(eventStartTime.value>eventEndTime.value) {
        eventErrorMessageDiv.textContent = 'End time cannot be before start time.'
        return;
    }

    eventErrorMessageDiv.textContent = '';


    console.log(eventStartTime.value)
    console.log(eventEndTime.value)
    const cEvent = new CEvent(dayClicked.num, dayClicked.month, dayClicked.year, eventTitle.value, eventStartTime.value, eventEndTime.value, dayClicked.index, user_id);
    dayClicked.events.push(cEvent);
    eventTitle.value = '';
    eventMaker.classList.remove('active');
    currentEventsArray.push(cEvent);
});

function loadEvents() {
    dayList.forEach((day, index) => {
        currentEventsArray.forEach((cEvent, index) => {
            if((day.num == cEvent.day) && (day.month==cEvent.month) && (day.year == cEvent.year)) {
                day.object.appendChild(cEvent.object);
            }
        })
    })
}

function unloadEvents() {
    dayList.forEach((day, index) => {
        currentEventsArray.forEach((cEvent, index) => {
            if(day.month!=cEvent.month || day.year != cEvent.year) {
                cEvent.object.remove();
            }
        })
    })
}


const rb = document.getElementById("RB");
const lb = document.getElementById("LB");

rb.addEventListener("click", () => {
    currentMonth +=1;
    if(currentMonth>11) {
        currentMonth = 0;
        currentYear++;
    }
    dayIndex = 0;
    changeMT();
    makeCalendar();
    unloadEvents();
    loadEvents();


});
lb.addEventListener("click", () => {
    currentMonth-=1;
    if(currentMonth<0) {
        currentMonth = 11;
        currentYear--;
    }
    dayIndex = 0;

    changeMT();
    makeCalendar();

    unloadEvents();
    loadEvents();
});

loadEvents()

export {user_id, dayList, currentMonth, currentYear};