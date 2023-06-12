const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');
const convert = require('heic-convert');

const INPUT = path.resolve(__dirname, 'HEIC');
const OUTPUT = path.resolve(__dirname, 'JPG');
let nbfile = 0;
let nbMaxFile;

const getHeic = async() => {
    try {
        console.time('CONVERT HEIC TO JPG');
        const files = await fs.readdir(INPUT);

        if(!files.length) {
            console.timeEnd('CONVERT HEIC TO JPG');
            process.exit(1);
        }

        nbMaxFile = files.length;

        await convertHeicToJpg(files);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

getHeic();

const convertHeicToJpg = async(files) => {
    if(!files.length) {
        console.timeEnd('CONVERT HEIC TO JPG');
        process.exit(1);
    }

    const filename = files[0];

    try {
        const inputBuffer = await promisify(fs.readFile)(INPUT+'/'+filename);

        if(!inputBuffer) {
            throw err;
        }

        const outputBuffer = await convert({
            buffer: inputBuffer,
            format: 'JPEG'
        })

        if(!outputBuffer) {
            throw err;
        }

        await promisify(fs.writeFile)(`${OUTPUT+'/'+filename.split('.')[0]}.jpg`, outputBuffer);

        nbfile++;
        console.log(`${filename.split('.')[0]} convertie en JPG - ${nbfile}/${nbMaxFile}`);

        // fs.unlink(INPUT+filename);

        files.shift();
        convertHeicToJpg(files);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}