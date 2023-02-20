function shuffle(line) {
    let shuffledLine
    if (line.includes(' ')) {
        let shuffledLineArr = []
        const phrase = line.split(' ')
        for (let word of phrase) { 
            shuffledLineArr.push(shuffleWord(word.toUpperCase()))
        }
        shuffledLine = shuffledLineArr.join(' ')
    }
    else {
        const word = line
        shuffledLine = shuffleWord(word.toUpperCase())
    }
    return shuffledLine
}

function shuffleWord(word) {
    const l = word.length
    let shuffledWord 
    if (l <= 5) {
        shuffledWord = shuffleLetters(word)
    }
    else if (l <= 8) {
        shuffledWord = shuffleLetterPairs(word)
    }
    else if (l > 8) {
        shuffledWord = shuffleMiddleLetters(word)
    }
    if (checkForWordChunks(word, shuffledWord) == "word Chunk found") {
        shuffledWord = shuffleWord(word)
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

function shuffleLetterPairs(word) {
    let letterList = []
    let i = 0
    let letters
    while (i < word.length) {
        let randomPosition = Math.floor(Math.random() * (letterList.length + 1))
        if (i == (word.length - 1)) {
            letters = word[i]
        } else {
            letters = word[i] + word[i+1] 
        }
        letterList.splice(randomPosition, 0, letters)
        i += 2
    }
    const shuffledWord = letterList.join('') 
    return shuffledWord
}

function shuffleMiddleLetters(word) {
    const firstLetter = word[0]
    const lastLetter = word[(word.length - 1)]
    const middleLetters = word.slice(1, (word.length - 1))
    const shuffledMiddleLetters = shuffleLetters(middleLetters)
    return firstLetter + shuffledMiddleLetters + lastLetter
}

function checkForWordChunks(word, shuffledWord) {
    let wordChunksArr = []
    let shuffledWordChunksArr = []
    for (let i = 0; i < (word.length - 2); i++) {
        const wordChunk = word.slice(i, i + 3)
        wordChunksArr.push(wordChunk)
    }
    for (let j = 0; j < (shuffledWord.length - 2); j++) {
        const shuffledWordChunk = shuffledWord.slice(j, j + 3)
        shuffledWordChunksArr.push(shuffledWordChunk)
    }
    for (let i = 0; i < (word.length - 2); i++) {
        for (let j = 0; j < (shuffledWord.length - 2); j++) {
            if (wordChunksArr[i] === shuffledWordChunksArr[j]) {
                return "word Chunk found"
            }
        }
    }
}


const fileInput = document.getElementById('fileinput')
const output = document.getElementById("output")

let defaultString = "RHEE ERA ESMO \nEMAPLEEX RDWOS"
output.textContent=defaultString

fileInput.addEventListener('change', () => {
    const fr = new FileReader()
    fr.readAsText(fileInput.files[0])
    fr.onload = () => {
        content = fr.result
        
        let newContent = []
        const lines = content.split(/\r?\n/)
        for (const line of lines) {
            newContent.push(shuffle(line))
        }

        output.textContent=newContent.join('\n')
    }
}
)