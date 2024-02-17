// imports
import { SerialPort } from 'serialport';

// port
const port = new SerialPort({
    path: 'COM8',
    baudRate: 115200, // Adjusted to match the second code snippet
    autoOpen: true,
});


// read
port.on('data', (data) => {
    const resultArray = [];
    const hexedData = data.toString('hex');
    const numberOfTiles = Number(hexedData.slice(2, 4));

    for (let i = 0; i < (numberOfTiles * 2) + 4; i += 2) {
        resultArray.push(hexedData.slice(i, i + 2).toUpperCase());
    }

    console.log('serial port data: parser: ', resultArray);
});

// 3    4 -> connected through power
// 2    1 -> connected through usb

// [ 'FC', '04', '05', '05', '05', '0A' ]
// [ 'FC', '04', '05', '05', '0A', '05' ]
// [ 'FC', '04', '05', '0A', '05', '05' ]
// [ 'FC', '04', '0A', '05', '05', '05' ]

// [ '0A', '05', '05', '05' ] => extracted => output

// [ 'FF', 'FF', 'FF0000', '00FF00', '0000FF', 'FF0000' ]

// [ 'FF0000', '00FF00', '0000FF', 'FF0000' ] => original => input