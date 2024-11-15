function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function generatePrimes(count) {
    const primes = [];
    let num = 2;
    while (primes.length < count) {
        if (isPrime(num)) {
            primes.push(num);
        }
        num++;
    }
    return primes;
}

function drawSikuSiku(n) {
    if (n <= 0 || n >= 10) {
        console.log("Input harus antara 1 dan 9");
        return;
    }

    const primeCount = (n * (n + 1)) / 2;
    const primes = generatePrimes(primeCount);

    let index = 0;
    for (let i = 1; i <= n; i++) {
        let row = "";
        for (let j = 0; j < i; j++) {
            row += primes[index] + " ";
            index++;
        }
        console.log(row.trim());
    }
}

drawSikuSiku(7);
