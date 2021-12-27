interface randomNumbersResponse {
    [key: number]: number;
}

const generateRandomNumber = () => Math.floor(Math.random() * (1000 - 1) + 1)

const randomNumbers = (howMany: number): randomNumbersResponse => {
    const obj : randomNumbersResponse = {} 
    for (let i = 0; i < howMany; i++) {
        const number = generateRandomNumber();
        if(obj[number]){
            obj[number]++;
        }else{
            obj[number] = 1;
        }
    }
    return obj
};

process.on("message", howMany => {
    const result = randomNumbers(howMany as number);
    if(process.send){
        process.send(result)
    }
})