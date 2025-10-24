import { saveEvent } from "./clientreq.js";

const eventMaker = document.getElementById('eventMaker');

// const confirmButton = document.getElementById('confirmButton');

const eventTitle = document.getElementById('eventTitle');
const eventTime = document.getElementById('eventTime');

let currentDay = 0;


export class CEvent {


    constructor(day, month, year, title, startTime, endTime, index, owner_id) {

        let dayBoxesArr = document.querySelectorAll('.box');

        this.day = day;
        this.month = month;
        this.year = year;
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.index = index;

        this.object = document.createElement('div');
        dayBoxesArr[this.index].appendChild(this.object);
        this.object.textContent = title + "    " + startTime + '-' + endTime;

        saveEvent(owner_id, day, month, year, title, index, startTime, endTime);
    }

    appendToBox() {
        dayBoxesArr[this.index].appendChild(this.object);
    }
    
    getMonth() {
        return this.month;
    }
    getYear() {
        return this.year;
    }
    getDay() {
        return this.day;
    }

}
console.log('hello')