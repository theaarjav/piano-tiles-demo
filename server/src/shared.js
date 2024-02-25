import { rows, columns } from "./constants.js";
// import { midCol } from "./getTiles.js";
const midCol=3;
const players=1;
export const hardwareSendTiles = (serialArr, rows, columns) => {
    const snakedArr = [];
    // console.log(serialArr.length)
    for (let i = 0; i < rows; i++) {
        // For even rows, push elements in normal order
        if (i % 2 === 0) {
            for (let j = 0; j < columns; j++) {
                snakedArr.push(serialArr[i * columns + j].split(' ')[0]);
            }
        } else {
            // For odd rows, push elements in reverse order
            for (let j = columns - 1; j >= 0; j--) {
                snakedArr.push(serialArr[i * columns + j].split(' ')[0]);
            }
        }
    }
    return getHexColors(snakedArr);
}


export const getHexColors = (colors) => {
    const hexColors = [];
    for (let i = 0; i < colors.length; i++) {
        let hexColor = colors[i];
        hexColor = hexColor.replace('#', '');
        hexColor = hexColor.replace(/ff/g, 'FE');
        hexColor = hexColor.replace(/FF/g, 'FE');
        hexColors[i] = hexColor;
    };
    // console.log(hexColors)
    return hexColors;
};

export var initNotes;
initNotes = [];
for (let i = 0; i < (rows - 2)*columns; i++) {
    
        if(i%columns<midCol-players || i%columns>midCol+players-1)initNotes.push('#ffff00')
        else initNotes.push("#000000");
    
}
for (let i = (rows-2)*columns; i < rows*columns; i++) {
    if (i%columns>=midCol-players && i%columns<=midCol+players-1) initNotes.push("#000033");
    else initNotes.push("#ffff00");
    // j++;
}
initNotes[(rows-2)*columns+parseInt(columns/2)]='#00ff00';