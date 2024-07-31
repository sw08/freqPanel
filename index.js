const udp = require('dgram');
const buffer = require('smart-buffer').SmartBuffer;
const SerialPort = require('serialport');


const serial = new SerialPort.SerialPort({path: 'COM8',baudRate: 9600}); // serial port

const port = 49001; // udp port

serial.pipe(new SerialPort.ReadlineParser().on('data', console.log));


const client = udp.createSocket('udp4');

function addZero(string, length) {
    string = string.toString();
    if (!string.includes(".")) string += ".";
    while (length - string.length > 0) {
        string += "0";
    }
    return string;
}


client.on('message', (msg, info) => {
    const buf = buffer.fromBuffer(msg);
    buf.readOffset = 5;
    const cnt = (buf.length - buf.readOffset) / 36;
    let data = {};
    for (let i = 0; i < cnt; i++) {
        const type = buf.readInt32LE();
        data[type] = [];
        for (let j = 0; j < 8; j++) {
            data[type].push(buf.readFloatLE());
        }
    }
    // console.log(96, data[96]); // com
    // console.log(data[97]); // nav
    
    const com1 = addZero(data[96][0] / 1000, 7);
    const com1_stby = addZero(data[96][1] / 1000, 7);
    // const nav1 = addZero(data[97][0] / 100, 6);
    // const nav1_stby = addZero(data[97][1] / 100, 6);
    // const com2 = addZero(data[96][3] / 1000, 7);
    // const com2_stby = addZero(data[96][4] / 1000, 7);
    // const nav2 = addZero(data[97][4] / 100, 6);
    // const nav2_stby = addZero(data[97][5] / 100, 6);
    const row1 = 'ACTV: ' + com1;
    const row2 = 'STBY: ' + com1_stby;
    serial.write(row1 + row2);
});

client.bind(port);