export const convertToSnake = (serialArr, rows, columns) => {
    const snakedArr = [];
    
    for (let i = 0; i < rows; i++) {
        // For even rows, push elements in normal order
        if (i % 2 === 0) {
            for (let j = 0; j < columns; j++) {
                snakedArr.push(serialArr[i * columns + j]);
            }
        } else {
            // For odd rows, push elements in reverse order
            for (let j = columns - 1; j >= 0; j--) {
                snakedArr.push(serialArr[i * columns + j]);
            }
        }
    }
    
    return snakedArr;
}

// convert snaked formate array into serial formate array
export const convertToSerial = (snakedArr, rows, columns) => {
    const serialArr = [];

    for (let i = 0; i < rows; i++) {
        if (i % 2 === 0) {
            // For even rows, push elements in normal order
            for (let j = 0; j < columns; j++) {
                serialArr.push(snakedArr[i * columns + j]);
            }
        } else {
            // For odd rows, push elements in reverse order
            for (let j = columns - 1; j >= 0; j--) {
                serialArr.push(snakedArr[i * columns + j]);
            }
        }
    }

    return serialArr;
}