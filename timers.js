const myTimer = (timer, isString) => {
    const postfix = timer.dataset.postfix;
    const deadline = timer.dataset.deadline;
    const period = Number(timer.dataset.period) || 0;
    const now = Date.parse(new Date());
    let stop = Date.parse(deadline);
    let dif = stop - now;

// если дедлайн прошел и период не указан, отображаться будут нули из разметки
// если таймер строчный, то будет отображаться строка с нулями
if (dif < 0 && !period) {
    if (isString) {
        timer.querySelector('.timer__body').textContent = `00 c. | 00 м.`;
    }
    return;
// если дедлайн прошел, но указан период обновления, то он будет добавляться до тех пор, пока не будет назначен на будущее
    } else if (dif < 0 && period) {
        do {
            stop = new Date(stop);
            stop = stop.setDate(stop.getDate() + period);
            dif = stop - now;
        } while (dif < 0);
    }
// рассчет
    const days = String(Math.floor(dif / (1000 * 60 * 60 * 24))).padStart(2, "0");
    const hours = String(Math.floor(dif / (1000 * 60 * 60)) % 24).padStart(2, "0");
    const minutes = String(Math.round(dif / (1000 * 60)) % 60).padStart(2, "0");
// отображение для строковых таймеров
    if (isString) {
        if (days > 0) {
            timer.querySelector('.timer__body').textContent = `${days} д. | ${hours} ч. | ${minutes} м.`;
        } else {
            timer.querySelector('.timer__body').textContent = `${hours} ч. | ${minutes} м.`;
        }
    } else {
// поиск элементов внутри таймера для вывода
        const daysElement = timer.querySelector(`.days-${postfix}`);
        const hoursElement = timer.querySelector(`.hours-${postfix}`);
        const minutesElement = timer.querySelector(`.minutes-${postfix}`);
// вывод в нестроковый таймер
        if (daysElement && hoursElement && minutesElement) {
            daysElement.textContent = days;
            hoursElement.textContent = hours;
            minutesElement.textContent = minutes;
        }
    }

}

// объект с настройками - дедлайн и период обновления. 
// Для таймеров, у которых нет одной даты, которые обновляются раз в какой-то период, все равно нужно указать первую дату, от которой и пойдет отсчет
// ftw - 4/20, sfn - 6/49, tb - телебинго,     fts - 5/36

const timersSettings = {
    ftw: {
        deadline: "2024-04-16 20:00",
        period: "7",
    },
    sfn: {
        deadline: "2024-05-31 21:45",
    },
    tb: {
        deadline: "2024-05-12 10:00",
    },
    fts: {
        deadline: "2024-04-16 21:00",
        period: "7",
    }
};

//  регулярное выражение для поиска класса, который определяет название файла с настройками
const re = /\bjs-[a-zA-Z0-9]+\b/;
document.addEventListener('DOMContentLoaded', () => {
    const timers = [...document.querySelectorAll('[data-timer="true"]')];
    timers.forEach((timer) => {
        const timerClass = [...timer.classList].filter((item) => item.match(re)).join().slice(3);

        // если соответствующий класс есть, то таймеру присваиваются атрибуты дедлайна и, если есть, периода обновления
        if (timerClass) {
            timer.setAttribute("data-deadline", `${timersSettings[timerClass].deadline}`);
            if (timersSettings[timerClass].period) {
                timer.setAttribute("data-period", `${timersSettings[timerClass]?.period}`);
            }
        }

        // если таймер имеет идентификатор строчного таймера, то его заполнение происходит через строку
        const isStringTimer = /string-timer/.test(timer.classList);
        if (isStringTimer) {
            myTimer(timer, isStringTimer)
        } else {
            myTimer(timer, false);
        }
        setInterval(() => { myTimer(timer) }, 10000);
    });
})

// если нужно заменить время в таймере в неудобное время, то ему нужно присвоить соответствующий класс и он поменяется автоматически

// document.addEventListener('DOMContentLoaded', () => {
//     const newDeadline = "2024-05-31 21:45";
//     const checkNow = new Date();
//     const timers = [...document.querySelectorAll('.js-change-deadline')];
//     timers.forEach((item) => {
//         const currentDedline = new Date(item.dataset.deadline);
//         if (checkNow.getTime() >= currentDedline.getTime()) {
//             item.dataset.deadline = newDeadline;
//         }
//     })
// })