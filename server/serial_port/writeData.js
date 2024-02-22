import { SerialPort } from 'serialport';

// port
const port = new SerialPort({
    path: 'COM3',
    baudRate: 115200, // Adjusted to match the second code snippet
});

// Function to ensure asynchronous behavior
// const writeAsync = (data) => new Promise((resolve, reject) => {
//     port.write(Buffer.from(data, 'hex'), (err) => {
//         if (err) {
//             reject(err);
//         } else {
//             resolve();
//         }
//     });
// });

const writeAsync = (data) => {
    port.write(Buffer.from(data, 'hex'), (err) => {
        if (err) {
            console.log('Error while writing on serial port: ', err);
        }
    });
};

export const writeData = (array) => {
    port.write(Buffer.from([0xFF, 0xAA, 0x0A, 0x01, 0x10, 0xC3, 0x55]));
    // port.write(Buffer.from([0xFF, 0xAA, 0x0A, 0x02, 0x0F, 0xC5, 0x55]));
    port.write(Buffer.from([0xFF, 0xFF]));

    for (let i = 0; i < array.length; i++) {
        writeAsync(array[i]);
    }
};

// Call the writeData function
const colors = ['FE0000', '00FE00', '0000FE'];
var iterator = 0;
// setInterval(() => {
//     const array = new Array(20).fill(colors[iterator]);
//     // array[iterator] = 'FE0000';
//     writeData(array);
//     // if (iterator === 19) {
//     //     iterator = 0;
//     // } else {
//     //     iterator += 1;
//     // }

//     if(iterator === 2){
//         iterator = 0;
//     } else {
//         iterator ++;
//     }
// }, 1000);