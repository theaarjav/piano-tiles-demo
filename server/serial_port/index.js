import { SerialPort } from 'serialport';

// port
const port = new SerialPort({
    path: 'COM1',
    baudRate: 115200,
});


// exports
export default port;