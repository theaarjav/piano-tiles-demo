export const hardwareSendTiles = (serialArr, rows, columns) => {
    const snakedArr = [];
    // console.log(serialArr)
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
for (let i = 0; i < rows - 2; i++) {
    for (let j = 0; j < columns; j++)initNotes.push("#000000");
}
for (let i = 0, j = 0; i < 2*columns; i++) {
    if (j%columns>=midCol-players && j%columns<=midCol+players-1) initNotes.push("#000033");
    else initNotes.push("#000000");
    j++;
}