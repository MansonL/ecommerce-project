"use strict";
const generateRandomNumber = () => Math.floor(Math.random() * (1000 - 1) + 1);
const randomNumbers = (howMany) => {
    const obj = {};
    for (let i = 0; i < howMany; i++) {
        const number = generateRandomNumber();
        if (obj[number]) {
            obj[number]++;
        }
        else {
            obj[number] = 1;
        }
    }
    return obj;
};
process.on("message", howMany => {
    const result = randomNumbers(howMany);
    if (process.send) {
        process.send(result);
    }
});
