// imports
import net from 'net';
// import { convertToHex, convertToSnake } from '../utils/shared.js';
import { hardwareSendTiles  } from './getTiles.js';

const TCP_IP = '192.168.0.7';
const TCP_PORT = 23;


//USR COPY: FF AA 0A 02 0F C5 55 
const FUNCTION_COMMANDS = [
    Buffer.from([0xFF, 0xAA, 0x0A, 0x00, 0x0F, 0xC3, 0x55]), // Function parameter 00
    Buffer.from([0xFF, 0xAA, 0x0A, 0x01, 0x0F, 0xC4, 0x55]), // Function parameter 01
    Buffer.from([0xFF, 0xAA, 0x0A, 0x02, 0x0F, 0xC5, 0x55]), // Function parameter 02
    Buffer.from([0xFF, 0xAA, 0x0A, 0x03, 0x0F, 0xC6, 0x55]), // Function parameter 03
    Buffer.from([0xFF, 0xAA, 0x0A, 0x04, 0x0F, 0xC7, 0x55]), // Function parameter 04
    Buffer.from([0xFF, 0xAA, 0x0A, 0x05, 0x0F, 0xC8, 0x55]), // Function parameter 05
    Buffer.from([0xFF, 0xAA, 0x0A, 0x06, 0x0F, 0xC9, 0x55]), // Function parameter 06
    Buffer.from([0xFF, 0xAA, 0x0A, 0x07, 0x0F, 0xCA, 0x55]), // Function parameter 07
    Buffer.from([0xFF, 0xAA, 0x0A, 0x08, 0x0F, 0xCB, 0x55]), // Function parameter 08
    Buffer.from([0xFF, 0xAA, 0x0A, 0x09, 0x0F, 0xCC, 0x55]), // Function parameter 09
    Buffer.from([0xFF, 0xAA, 0x0A, 0x0A, 0x0F, 0xCD, 0x55]), // Function parameter 0A
];

class TCPHandler {
    
    constructor(rows, columns, readControlData) {
        this.rows = rows;
        this.columns = columns;
        // this.status="not"
        this.clientSocket = net.createConnection({ host: TCP_IP, port: TCP_PORT }, () => {
            console.log(`Connected to ${TCP_IP} on port ${TCP_PORT}`);
            try {
                this.clientSocket.write(FUNCTION_COMMANDS[1]); // Example: writing a function command
                console.log("Function command sent successfully.");
                // this.status="connected"
            } catch (e) {
                console.log(`Error sending function command: ${e}`);
            }
        });

        this.readControlData(readControlData);

        this.clientSocket.on('error', (err) => {
            console.error(`Unable to connect to ${TCP_IP} on port ${TCP_PORT}: ${err}`);

            // process.exit(1);
        });

        this.clientSocket.on('end', () => {
            // this.status="connected";
            // Handle connection end if needed
        });
    }

    readControlData(callback) {
        // if(this.status!="connected")return;
        this.clientSocket.on('data', (data) => {
            // Handle received data if needed
            const hexedData = data.toString('hex');
            const formatedData = [];
            for (let i = 0; i < hexedData.length; i += 2) {
                formatedData.push(parseInt(hexedData.slice(i, i + 2), 16));
            }

            const tiles = formatedData[1];
            const readings = formatedData?.slice(2, formatedData?.length + tiles);

            // Invoke the callback function with the data
            
            // console.log(readings);
            callback({ tiles, readings });
        });
    }

    stopReading() {
        // Implement logic to stop reading, if needed
        this.clientSocket.removeAllListeners('data'); // Remove data event listener
    }

    sendControlData(frame) {
        // Send control data for a given frame to the hardware via TCP communication
        // if(this.status!="connected")return;
        let packet = Buffer.from([0xFF, 0xFF]); // Starting bytes

        const snakedPattern = hardwareSendTiles(frame, this.rows, this.columns);
        // console.log("snake pattern:", snakedPattern)
        // Convert each color component to bytes and add to the packet
        snakedPattern.forEach(color => {
            // console.log('color:', color);
            packet = Buffer.concat([packet, Buffer.from(color, 'hex')]);
            // console.log('hexed: ', Buffer.from(color,'hex'));
        });
        // console.log(packet)
        // console.log('snakedPattern: ', snakedPattern);
        try {
            // console.log(packet)
            // this.clientSocket.write(packet);
            this.clientSocket.write(packet);
            
            // setTimeout(() => {
            //     this.clientSocket.write(packet);
            //     setTimeout(() => {
            //         this.clientSocket.write(packet);
            //     }, 40);
            // }, 40);
        } catch (e) {
            console.log(`Error sending frame: ${e}`);
        }
    }
}

export default TCPHandler;