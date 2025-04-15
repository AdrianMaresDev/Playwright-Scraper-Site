const fs = require('fs');
const path = require('path');

const writeToFile = (filePath, data, isJson = true) => {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const content = isJson ? JSON.stringify(data, null, 2) : data;
        fs.writeFileSync(filePath, content, 'utf-8');

        console.log(`Write data to ${filePath}`);

    } catch (error) {
        console.error(`Could not write to ${filePath}`, error);
    }
};

module.exports = { writeToFile };