const timerL = document.getElementById('timer');
const inputL = document.getElementById('input');
const buttonL = document.getElementById('button');
const containerL = document.getElementById('container');

let timer = 60;
let timerId = 0;
let state = 'SET';

function EntryPoint() 
{
    containerL.addEventListener('click', OnClick);
    containerL.className = 'on-idle';
    buttonL.addEventListener('click', OnButtonClick);
}

function OnClick(ev)
{
    switch (state)
    {
        case 'SET':
            StartTimer();
            break;
        case 'RUN':
            PauseTimer();
            break;
        case 'REST':
            PlayTimer();
            break;
        case 'PANIC':
            StopTimer();
            break;
    }
}

function OnButtonClick(ev)
{
    switch (state)
    {
        case 'SET':
            StartTimer();
            break;
        case 'REST':
            StopTimer();
            break;
    }
}

function Panic()
{
    state = 'PANIC';

    clearInterval(timerId);
    containerL.className = 'on-panic';
}

function UpdateTimer()
{
    if (timer <= 0) {
        Panic();
    }
    timerL.textContent = FormatSeconds(timer);
    --timer;
}

function StartTimer()
{
    inputL.hidden = true;
    timerL.hidden = false;

    timer = ParseSeconds(inputL.value);
    PlayTimer();
}

function PlayTimer() 
{
    state = 'RUN';

    buttonL.hidden = true;
    timerId = setInterval(UpdateTimer, 1000);
    UpdateTimer();
    containerL.className = 'on-idle';
}

function PauseTimer()
{
    state = 'REST';

    buttonL.value = 'BACK';
    buttonL.hidden = false;
    containerL.className = 'on-pause';
    clearInterval(timerId);
}

function StopTimer() 
{
    inputL.hidden = false;
    timerL.hidden = true;
    buttonL.value = 'GO';
    buttonL.hidden = false;
    containerL.className = 'on-idle';

    state = 'SET';
}

function FormatSeconds(seconds) 
{
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

function ParseSeconds(text)
{
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
