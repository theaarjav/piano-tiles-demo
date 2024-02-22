// imports
import { SerialPort } from 'serialport';

// port
const port = new SerialPort({
    path: 'COM8',
    baudRate: 115200, // Adjusted to match the second code snippet
    autoOpen: true,
});



// port.on('data', (data) => {
// 	const colors = extractData(data);
// 	const serialColors = convertToSerial(colors, gamePlay.rows, gamePlay.columns);
// 	for(let i = 0; i < serialColors.length; i++) {
// 		const item = serialColors[i];
// 		if(item === '0a'){
// 			gamePlay.hitTile(i);
// 		}
// 	}; 
// });



// 3    4 -> connected through power
// 2    1 -> connected through usb

// [ 'FC', '04', '05', '05', '05', '0A' ]
// [ 'FC', '04', '05', '05', '0A', '05' ]
// [ 'FC', '04', '05', '0A', '05', '05' ]
// [ 'FC', '04', '0A', '05', '05', '05' ]

// [ '0A', '05', '05', '05' ] => extracted => output

// [ 'FF', 'FF', 'FF0000', '00FF00', '0000FF', 'FF0000' ]

// [ 'FF0000', '00FF00', '0000FF', 'FF0000' ] => original => input