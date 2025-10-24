let eventMaker2 = document.querySelector("#eventMaker");
export class Day {

    constructor(index) {

        this.num = 0;
        this.month = 0;
        this.year = 0;
        this.events = [];
        this.index = index;

        this.object = document.createElement('div');
        this.object.classList.add("box");
        mainPanel.appendChild(this.object);

        this.numberHeader = document.createElement('div');
        this.numberHeader.id = 'numberHeader';
        this.object.appendChild(this.numberHeader);
    }

    setAttributes(num, month, year) {
        this.num = num;
        this.month = month;
        this.year = year;
        this.numberHeader.textContent = num;
    }
}