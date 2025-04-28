class MyTimer {
    constructor(timer, name) {
      if (!this.timersConfig.hasOwnProperty(name)) return;
      this.timer = timer;
      this.deadline = this.timersConfig[name].deadline;
      this.nextDeadline = this.timersConfig[name].nextDeadline ? this.getNextDate(this.timersConfig[name].nextDeadline) : false;
      this.period = Number(this.timersConfig[name].period) || 0;
      this.updateData();
  
      let continueCount = true;
  
      if (this.dif < 0) {
        continueCount = this.onZeroDif();
      }
  
      if (continueCount) {
        this.init();
      }
    }
  
    timersConfig = {
      ftw: {
        deadline: "2024-08-13 20:00",
        period: 168
      },
      sfn: {
        deadline: "2025-03-28 22:00",
        nextDeadline: "2025-04-30 22:00, 2025-05-30 22:00, 2025-06-30 22:00"
      },
      tb: {
        deadline: "2025-03-23 10:00",
        nextDeadline: "2025-04-20 10:00, 2025-05-25 10:00, 2025-06-22 10:00"
      },
      fts: {
        deadline: "2025-04-07 21:00",
        nextDeadline: "2025-05-09 21:00, 2025-06-09 21:00"
      },
      ld: {
        deadline: "2025-03-25 20:59:59",
        nextDeadline: "2025-05-25, 2025-06-22"
      },
      lm: {
        deadline: "2025-05-31 20:59:59"
      },
      mk: {
        deadline: "2025-03-09 21:59:59",
        nextDeadline: "2025-05-04, 2025-05-11, 2025-06-06, 2025-06-29"
      },
    };
  
    init() {
      this.findElements();
      this.count();
      setInterval(() => {
        this.countDown();
      }, 1000);
    }
  
    findElements() {
      if (this.timer.classList.contains("string") || this.timer.classList.contains("ld")) {
        this.timerType = "string";
        this.timerBody = this.timer.querySelector(".timer__body");
    } else {
        this.timerType = "normal";
        this.daysOutput = this.timer.querySelector(`.days`);
        this.hoursOutput = this.timer.querySelector(`.hours`);
        this.minutesOutput = this.timer.querySelector(`.minutes`);
      }
    }
  
    count() {
      this.days = String(Math.floor(this.dif / (1000 * 60 * 60 * 24))).padStart(
        2,
        "0"
      );
      this.hours = String(Math.floor(this.dif / (1000 * 60 * 60)) % 24).padStart(
        2,
        "0"
      );
      this.minutes = String(Math.round(this.dif / (1000 * 60)) % 60).padStart(
        2,
        "0"
      );
      this.fillInTimer();
    }
  
    countDown() {
      this.now = Date.parse(new Date());
      this.dif = this.dif - 1000;
      let continueCount = true;
      if (this.dif < 0) {
        continueCount = this.onZeroDif();
      }
  
      if (continueCount) {
        this.count();
      }
  
      return;
    }
  
    onZeroDif() {
      if (!this.period && !this.nextDeadline) {
        return false;
      }
      if (this.nextDeadline) {
        this.deadline = this.nextDeadline;
        this.updateData();
        return true;
      }
      if (this.period) {
        this.upToDateTimer().then(() => this.updateData());
        return true;
      }
      return false;
    }
  
    updateData() {
      this.now = Date.parse(new Date());
      this.stop = Date.parse(this.deadline);
      this.dif = this.stop - this.now;
    }
  
    fillInTimer() {
      requestAnimationFrame(() => {
        if (this.timerType && this.timerType !== "normal") {
          let separtor = this.timerType === "ld" ? "" : "|";
          this.timerBody.textContent = `${
            this.days > 0 ? this.days + "д. " + separtor + " " : ""
          }${this.hours} ч. ${separtor} ${this.minutes} м.`;
        } else if (this.daysOutput && this.hoursOutput && this.minutesOutput) {
          this.daysOutput.textContent = this.days;
          this.hoursOutput.textContent = this.hours;
          this.minutesOutput.textContent = this.minutes;
        }
      });
    }
  
    getNextDate(dates) {
      let i = 0;
      let dateArr = dates.split(/,\s+/gim);
      let now = Date.parse(new Date());
      let stop = Date.parse(dateArr[i]);
      let dif = stop - now;
  
      function checkNextDate() {
        do {
          stop = Date.parse(dateArr[i]);
          dif = stop - now;
          i++;
        } while (i < dateArr.length && dif < 0);
        if (dif <= 0) {
          return "no more dates, we are still < 0";
        } else {
          return stop;
        }
      }
      return new Date(checkNextDate());
    }
    upToDateTimer() {
      return new Promise((resolve) => {
        let step = Number(this.period) * 60 * 60 * 1000;
        do {
          this.stop += step;
          this.dif = this.stop - this.now;
        } while (this.dif < 0);
        if (this.dif > 0) {
          resolve();
        }
      });
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const timers = [...document.querySelectorAll("[data-timer-name]")];
    timers.forEach((timer) => {
      const timerClass = timer.dataset.timerName;
      new MyTimer(timer, timerClass);
    });
  });