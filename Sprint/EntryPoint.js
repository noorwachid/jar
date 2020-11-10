const setSceneL = document.getElementById('set-scene');
const runSceneL = document.getElementById('run-scene');

const wpmInputL = document.getElementById('wpm-input');
const goButtonL = document.getElementById('go-button');
const estimateButtonL = document.getElementById('estimate-button');
const displayL = document.getElementById('display');
const sourceL = document.getElementById('source');

const sliderL = document.getElementById('slider');
const displayDetailsL = document.getElementById('display-details');
const infoL = document.getElementById('info');
const playPauseButtonL = document.getElementById('play-pause-button');
const stopButtonL = document.getElementById('stop-button');

let words = [];
let index = 0;
let speedInMs = 0;
let timerId = 0;
let timerInfoId = 0;
let isRunning = false;
let isPaused = false;

function EntryPoint()
{
    setSceneL.style.display = 'block';
    runSceneL.style.display = 'none';

    goButtonL.addEventListener('click', GoHandler);

    estimateButtonL.addEventListener('mouseover', ev => {
        const wordLength = sourceL.value.length / 5;
        const readTime = wordLength / Number(wpmInputL.value);
        estimateButtonL.textContent = GetReadTime();
    });
    estimateButtonL.addEventListener('mouseout', ev => {
        estimateButtonL.textContent = 'Estimate';
    });

    sliderL.addEventListener('change', SliderHandler);
    playPauseButtonL.addEventListener('click', ToggleHandler);
    displayL.addEventListener('click', ToggleHandler);
    stopButtonL.addEventListener('click', StopHandler);
    
    addEventListener('resize', ev => {
        UpdateDisplay();
    });
    addEventListener('keydown', ev => {
        if (isRunning) {
            switch (ev.key) {
                case ' ':
                    ev.preventDefault();
                    ToggleHandler();
                    break;
                case 'Escape':
                    ev.preventDefault();
                    StopHandler();
                    break;
                case 'ArrowLeft':
                    ev.preventDefault();
                    index = Math.min(Math.max(index - 1, 0), words.length - 1);
                    UpdateDisplay();
                    break;
                case 'ArrowRight':
                    ev.preventDefault();
                    index = Math.min(Math.max(index + 1, 0), words.length - 1);
                    UpdateDisplay();
                    break;
                case 'ArrowDown':
                    ev.preventDefault();
                    sliderL.value = Math.min(Math.max(Number(sliderL.value) - 0.1, 0), 1);
                    index = Math.floor(Number(sliderL.value) * (words.length - 1));
                    UpdateDisplay();
                    break;
                case 'ArrowUp':
                    ev.preventDefault();
                    sliderL.value = Math.min(Math.max(Number(sliderL.value) + 0.1, 0), 1);
                    index = Math.floor(Number(sliderL.value) * (words.length - 1));
                    UpdateDisplay();
                    break;
            }
        }
    });
}

function SplitIntoWords(text)
{
    text += '\n';
        
    let list = [];
    let length = text.length;

    for (let i = 0, ix = 0, iz = 0; i < length; ++i)
    {
        let char = text[i];
        let isBlankSpace = () => (
            char === ' ' || 
            char === '\n' ||
            char === '\t' ||
            char === '\r'
        );

        if (isBlankSpace()) {
            while (isBlankSpace()) {
                ++i;
                char = text[i];
            }
            let size = iz - ix + 1;
            let word = text.substr(ix, size); 
            if (size > 15) {
                for (let j = 10, jx = 0; jx < size; j += 10) {
                    console.log(jx, j, size);
                    let part = word.substr(jx, j - jx);
                    if (j < size) part += '-';
                    list.push(part)
                    jx = j;
                } 
            } else list.push(word);
            ix = i;
        } else iz = i;
    }

    return list;
}

function GoHandler()
{
    sliderL.value = 0;
    setSceneL.style.display = 'none';
    runSceneL.style.display = 'flex';

    words = SplitIntoWords(sourceL.value);
    index = 0;

    let speed = Number(wpmInputL.value);
    if (speed < 1) {
        speed = 1;
    }
    speedInMs   = speed ? (1 / (speed / 60) * 1000) : 200;

    isRunning = true;
    isPaused  = true;

    UpdateDisplay();
    UpdateInfo();
}

function UpdateDisplay()
{
    if (words[index]) {
        FormatWord(words[index]);
    }

    const percentage = index / (words.length - 1);
    slider.value = percentage;

    if (index > words.length) 
    {
        PauseHandler();
        UpdateInfo(true);
    }
}
function UpdateInfo(isDone)
{
    const percentage = isDone ? '100.0%' : (index / words.length * 100).toFixed(1);
    infoL.textContent = `
        ${percentage}% 
        ${GetReadTime(true)} left
    `;
}

function FormatWord(word)
{
    const needleL = document.createElement('em');
    const wordL = document.createElement('span');
    const mid = Math.round(word.length / 4);

    needleL.textContent = word[mid];
    wordL.append(word.substr(0, mid));
    wordL.appendChild(needleL);
    wordL.append(word.substr(mid + 1));
    displayL.textContent = '';
    displayL.appendChild(wordL);

    const displayR = displayL.getBoundingClientRect();
    const wordR = wordL.getBoundingClientRect();
    const needleR = needleL.getBoundingClientRect();

    const distance = needleR.x - wordR.x;
    const localMid = displayR.width / 4;
    wordL.style.left = (localMid - distance) + 'px';
}

function PlayHandler()
{
    playPauseButtonL.className = 'icon-pause';
    isPaused = false;

    timerId = setInterval(() => {
        ++index;
        UpdateDisplay();
    }, speedInMs);
    timerInfoId = setInterval(UpdateInfo, 1000);
    UpdateDisplay();
}

function GetReadTime(isMoving)
{
    const totalWordLength = sourceL.value.length / 5;
    let speed = Number(wpmInputL.value);
    if (speed < 1) {
        speed = 1;
    }
    let readTime = totalWordLength / speed;
    if (isMoving) { 
        const wordReadLength = totalWordLength * Number(sliderL.value);
        readTime = (totalWordLength - wordReadLength) / speed;
    }
    return `${readTime % 1 === 0 ? readTime : readTime.toFixed(2)} minute${readTime > 1 ? 's' : ''}`;
}

function PauseHandler()
{
    playPauseButtonL.className = 'icon-play';
    isPaused = true;
    clearInterval(timerId);
    clearInterval(timerInfoId);
}

function ToggleHandler() 
{
    if (isPaused) {
        PlayHandler();
    } else {
        PauseHandler();
    }
    UpdateInfo();
}

function StopHandler()
{
    setSceneL.style.display = 'block';
    runSceneL.style.display = 'none';
    isRunning = false;

    UpdateInfo(true);
    clearInterval(timerId);
    clearInterval(timerInfoId);
}

function SliderHandler()
{
    index = Math.floor(Number(sliderL.value) * (words.length - 1));
    UpdateDisplay();
}
