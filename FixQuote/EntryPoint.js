const differentiateL = document.getElementById('differentiate');
const equalizeL = document.getElementById('equalize');
const clearL = document.getElementById('clear');
const copyOutputL = document.getElementById('copy-output');
const inputL = document.getElementById('input');
const outputL = document.getElementById('output');

function EntryPoint() 
{
    differentiateL.addEventListener('click', ev => {
        outputL.value = Diffirentiate(inputL.value);
    });
    equalizeL.addEventListener('click', ev => {
        outputL.value = Equalize(inputL.value);
    });
    clearL.addEventListener('click', ev => {
        inputL.value = '';
        outputL.value = '';
    });
    copyOutputL.addEventListener('click', ev => {
        outputL.select();
        document.execCommand('copy');
    });
}

function Diffirentiate(text) 
{
    const length = text.length;
    let result = '';
    let previous = '\0';
    let previousUnicode = '';

    function DecideQuote(condition, left, right) 
    {
        if (previous === ' ' || 
            previous === '\t' || 
            previous === '\n' || 
            previous === '\0' || 
            condition)
        {
            result += left;
            previousUnicode = left;
            return;
        }
        result += right;
        previousUnicode = right;
        return;
    }

    for (let i = 0; i < length; ++i) 
    {
        const current = text[i];

        switch (current) 
        {
            case '\'':
            case '\u2018':
            case '\u2019':
                DecideQuote(previousUnicode === '\u201C', '\u2018', '\u2019');
                break;
            case '"':
            case '\u201C':
            case '\u201D':
                DecideQuote(previousUnicode === '\u2018', '\u201C', '\u201D');
                break;
            default:
                result += current;
                previousUnicode = '';
                break;
        }

        previous = current;
    }

    return result;
}

function Equalize(text) 
{
    const length = text.length;
    let result = '';

    for (let i = 0; i < length; ++i) 
    {
        const current = text[i];

        switch (current) 
        {
            case '\'':
            case '\u2018':
            case '\u2019':
                result += '\'';
                break;
            case '"':
            case '\u201C':
            case '\u201D':
                result += '"';
                break;
            default:
                result += current;
                break;
        }
    }

    return result;
}

EntryPoint();
