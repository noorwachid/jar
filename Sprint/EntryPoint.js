const setSceneL = document.getElementById('set-scene');
const runSceneL = document.getElementById('run-scene');

const wpmInputL = document.getElementById('wpm-input');
const goButtonL = document.getElementById('go-button');
const estimateButtonL = document.getElementById('estimate-button');
const displayL = document.getElementById('display');
const sourceL = document.getElementById('source');

const sliderL = document.getElementById('slider');
const infoL = document.getElementById('info');
const playPauseButtonL = document.getElementById('play-pause-button');
const stopButtonL = document.getElementById('stop-button');

let words = [];
let index = 0;
let speed = 0;
let timerId = 0;
let isRunning = false;
let isPaused = false;

function EntryPoint()
{
    setSceneL.hidden = false;
    runSceneL.hidden = true;

    goButtonL.addEventListener('click', GoHandler);

    estimateButtonL.addEventListener('mouseover', ev => {
        const wordLength = sourceL.value.length / 5;
        const readTime = wordLength / Number(wpmInputL.value);
        estimateButtonL.textContent = `${readTime % 1 === 0 ? readTime : readTime.toFixed(2)} minute${readTime > 1 ? 's' : ''}`;
    });
    estimateButtonL.addEventListener('mouseout', ev => {
        estimateButtonL.textContent = 'Estimate';
    });

    sliderL.addEventListener('change', SliderHandler);
    playPauseButtonL.addEventListener('click', ev => {
        if (isPaused) {
            StartHandler();
        } else {
            PauseHandler();
        }
    });
    stopButtonL.addEventListener('click', StopHandler);
    
    addEventListener('keydown', ev => {
        if (isRunning) {
            switch (ev.key) {
                case ' ':
                    ev.preventDefault();
                    if (isPaused) {
                        StartHandler();
                    } else {
                        PauseHandler();
                    }
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
    let previousI = 0;
    words = text.split(' ');
    return words;
}

function GoHandler()
{
    setSceneL.hidden = true;
    runSceneL.hidden = false;

    words = SplitIntoWords(sourceL.value);
    index = 0;
    speed = Number(wpmInputL.value);
    speed = speed ? (1 / (speed / 60) * 1000) : 200;

    isRunning = true;
    isPaused = true;

    UpdateDisplay();
}

function UpdateDisplay()
{
    displayL.textContent = words[index];
    const percentage = index / (words.length - 1);
    slider.value = percentage;

    if (index > words.length) 
    {
        PauseHandler();
    }
}

function StartHandler()
{
    playPauseButtonL.className = 'icon-pause';

    infoL.textContent = '';
    isPaused = false;
    timerId = setInterval(() => {
        ++index;
        UpdateDisplay();
    }, speed);
    UpdateDisplay();
}

function PauseHandler()
{
    playPauseButtonL.className = 'icon-play';

    const wordLength = sourceL.value.length / 5;
    const wordReadLength = wordLength * Number(sliderL.value);
    const readTime = (wordLength - wordReadLength) / Number(wpmInputL.value);
    infoL.textContent = `${readTime % 1 === 0 ? readTime : readTime.toFixed(2)} minute${readTime > 1 ? 's' : ''} left`;
    isPaused = true;
    clearInterval(timerId);
}

function StopHandler()
{
    setSceneL.hidden = false;
    runSceneL.hidden = true;
    displayL.textContent = '';
    isRunning = false;
    clearInterval(timerId);
}

function SliderHandler()
{
    index = Math.floor(Number(sliderL.value) * (words.length - 1));
    UpdateDisplay();
}
