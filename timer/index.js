const timerNode = document.getElementById('timer');
const inputNode = document.getElementById('input');
const goButtonNode = document.getElementById('go-button');
const containerNode = document.getElementById('container');

let timer = 60;
let timerId = 0;
let timerBegin = 0;
let state = 'SET';

function main() {
    containerNode.addEventListener('click', onClick);
    containerNode.className = 'on-idle';
    goButtonNode.addEventListener('click', onButtonClick);

    const data = parseURL(location.hash);
    if (data) {
        const now = getTS();
        const diff = now - data.offset;
        timer = Math.max(0, data.limit - diff);

        startTimer(true);
    }
}

function onClick(ev) {
    switch (state) {
        case 'SET':
            // do nothing
            break;
        case 'RUN':
            // pauseTimer();
            break;
        case 'REST':
            // playTimer();
            break;
        case 'PANIC':
            // stopTimer();
            break;
    }
}

function onButtonClick(ev) {
    // don't allow the parent know
    ev.stopPropagation();

    switch (state) {
        case 'SET':
            startTimer();
            state = 'RUN';
            break;
        case 'REST':
            // stopTimer();
            break;
        case 'PANIC':
            stopTimer();
            break;
    }
}

function panic() {
    state = 'PANIC';

    clearInterval(timerId);
    containerNode.className = 'on-panic';

    goButtonNode.innerHTML = 'Time\'s Up!';
    goButtonNode.hidden = false;
}

function updateTimer() {
    if (timer <= 0) {
        panic();
    }
    timerNode.textContent = formatSeconds(timer);
    --timer;
}

function startTimer(directlyFromTimer = false) {
    inputNode.hidden = true;
    timerNode.hidden = false;

    if (!directlyFromTimer) {
        timer = parseSeconds(inputNode.value);
        timerBegin = getTS();
        location.hash = composeURL(timerBegin, timer);
    }

    playTimer();
}

function playTimer() {
    state = 'RUN';

    goButtonNode.hidden = true;
    containerNode.className = 'on-idle';
    timerId = setInterval(updateTimer, 1000);
    updateTimer();
}

function pauseTimer() {
    state = 'REST';

    goButtonNode.value = 'RESET';
    goButtonNode.hidden = false;
    containerNode.className = 'on-pause';
    clearInterval(timerId);
}

function stopTimer() {
    inputNode.hidden = false;
    timerNode.hidden = true;
    goButtonNode.innerHTML = 'Go';
    goButtonNode.hidden = false;
    containerNode.className = 'on-idle';

    location.hash = '#/';

    state = 'SET';
}

function formatSeconds(seconds) {
    const hours   = Math.floor(seconds / 3600);
          seconds = seconds % 3600;
    const minutes = Math.floor(seconds / 60);
          seconds = seconds % 60;

    let str = '';
    if (hours > 0) {
        if (hours < 10) {
            str += '0';
        }
        str += hours;
        str += ':';
    }
    if (hours > 0 || minutes > 0) {
        if (minutes < 10) {
            str += '0';
        }
        str += minutes;
        str += ':';
    }
    if (seconds < 10) {
        str += '0';
    }
    str += seconds;

    return str;
}

function parseSeconds(text) {
    const values = [ 1, 60, 3600, 86400 ];
    const hands = text.
        split(':').
        filter(hand => /^[0-9]+$/.test(hand)).
        map(hand => parseInt(hand)).
        reverse();

    if (hands.length > 4) {
        hands.length = 4;
    }

    let seconds = 0;
    for (let i = 0; i < hands.length; ++i) {
        seconds += hands[i] * values[i];
    }
    
    return seconds;
}

function parseURL(url) {
    const segments = url.split('/');
    
    if (segments.length != 3) {
        return null;
    }

    return {
        offset: parseInt(segments[1] || 'a', 36),
        limit: parseInt(segments[2] || '1o', 36)
    }
}

function composeURL(offset, limit) {
    const hexOffset = Number(offset).toString(36);
    const hexLimit = Number(limit).toString(36);

    return `#/${hexOffset}/${hexLimit}`;
}

function getTS() {
    return Math.floor(Date.now() * 0.001);
}