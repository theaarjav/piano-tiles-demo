import { SerialPort } from 'serialport';

// port
const port = new SerialPort({
    path: 'COM4',
    baudRate: 115200,
});


// exports
export default port;