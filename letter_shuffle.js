function shuffle(line, difficulty) {
    let shuffledLine
    if (line.includes(' ')) {
        let shuffledLineArr = []
        const phrase = line.split(' ')
        for (let word of phrase) { 
            shuffledLineArr.push(shuffleWord(word.toUpperCase(), difficulty))
        }
        shuffledLine = shuffledLineArr.join(' ')
    }
    else {
        const word = line
        shuffledLine = shuffleWord(word.toUpperCase(), difficulty)
    }
    return shuffledLine
}

function shuffleWord(word, difficulty) {
    const l = word.length
    let shuffledWord 
    let wordChunkLength // the number of characters that are allowed to reappeare in the same order as in the original word
    if (difficulty === 'easy') {
        wordChunkLength = l >= 3 ? l : 2 
        if (l <= 3) {
            shuffledWord = shuffleLetters(word)
        }
        else if (l <= 5) {
            shuffledWord = shuffleMiddleLetters(word) 
        }
        else if (l > 5) {
            const firstLetter = word[0]
            const lastLetter = word[(l - 1)]
            const middleLetters = word.slice(1, (l - 1))
            const shuffledMiddleLetters = shuffleLetterChunks(middleLetters, 3)
            shuffledWord = firstLetter + shuffledMiddleLetters + lastLetter
        }
    }
    else if (difficulty === 'medium') {
        wordChunkLength = l >= 3 ? 3 : 2
        if (l <= 5) {
            shuffledWord = shuffleLetters(word)
        }
        else if (l <= 8) {
            shuffledWord = shuffleLetterChunks(word, 2)
        }
        else if (l > 8) {
            shuffledWord = shuffleMiddleLetters(word)
        }
    }
    else if (difficulty === 'hard') {
        wordChunkLength = l >= 3 ? 3 : 2
        shuffledWord = shuffleLetters(word)
    }
    if (checkForWordChunks(word, shuffledWord, wordChunkLength) == "word Chunk found") {
        shuffledWord = shuffleWord(word, difficulty)
    }
    

    return shuffledWord
}

function shuffleLetters(word) {
    const arr = word.split('')          
    arr.sort(function() {
        return 0.5 - Math.random();
    })  
    const shuffledLetters = arr.join('');               
    return shuffledLetters;                        
}

function shuffleLetterChunks(word, chunkLength) {
    let wordList = word.split('')
    wordList.forEach((item, i, array) => { // insert a whitespace before every letter group of the length "chunkLength" 
        if (i % chunkLength === 0 && i !== 0) {
            array[i] = ' ' + item
        }
    })
    const newWord = wordList.join('')
    wordList = newWord.split(' ')
    wordList.sort(function() { // shuffle order of the letter groups list
        return 0.5 - Math.random();
    })
    const shuffledWord = wordList.join('')

    return shuffledWord
}

function shuffleMiddleLetters(word) {
    const firstLetter = word[0]
    const lastLetter = word[(word.length - 1)]
    const middleLetters = word.slice(1, (word.length - 1))
    const shuffledMiddleLetters = shuffleLetters(middleLetters)
    return firstLetter + shuffledMiddleLetters + lastLetter
}

function checkForWordChunks(word, shuffledWord, wordChunkLength) {
    let wordChunksArr = []
    let shuffledWordChunksArr = []
    for (let i = 0; i < (word.length - (wordChunkLength - 1)); i++) {
        const wordChunk = word.slice(i, i + wordChunkLength)
        wordChunksArr.push(wordChunk)
    }
    for (let j = 0; j < (shuffledWord.length - (wordChunkLength - 1)); j++) {
        const shuffledWordChunk = shuffledWord.slice(j, j + wordChunkLength)
        shuffledWordChunksArr.push(shuffledWordChunk)
    }
    for (let i = 0; i < wordChunksArr.length; i++) {
        for (let j = 0; j < shuffledWordChunksArr.length; j++) {
            if (wordChunksArr[i] === shuffledWordChunksArr[j]) {
                return "word Chunk found"
            }
        }
    }
}


const form = document.querySelector("form")
const fileInput = document.getElementById("fileinput")
const inputTextArea = document.getElementById("textinput")
const output = document.getElementById("output")

const defaultString = "Your shuffled words will be displayed here"
output.textContent = defaultString

fileInput.addEventListener("change", () => {
    const fr = new FileReader()
    fr.readAsText(fileInput.files[0])
    fr.onload = () => {
        const fileContent = fr.result
        inputTextArea.value = fileContent
    }
}
)

form.addEventListener("submit", (event) => {
    const formData = new FormData(form)
    const textInput = formData.get("textinput")
    const difficulty = formData.get("difficulty")
    let newContent = []
    const lines = textInput.split(/\r?\n/)
    for (const line of lines) {
        newContent.push(shuffle(line, difficulty))
    }
    output.textContent = newContent.join('\n')
    event.preventDefault()
}
)