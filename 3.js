function bubbleSort(arr, n = arr.length) {
    if (n === 1) return arr;

    for (let i = 0; i < n - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        }
    }

    return bubbleSort(arr, n - 1);
}

function sortArray(arr) {
    const sortedArray = bubbleSort([...arr]); 
    const oddNumbers = sortedArray.filter(num => num % 2 !== 0);
    const evenNumbers = sortedArray.filter(num => num % 2 === 0);

    console.log("Array:", sortedArray.join(", "));
    console.log("Ganjil:", oddNumbers.join(", "));
    console.log("Genap:", evenNumbers.join(", "));

    return {
        sortedArray: sortedArray,
        oddNumbers: oddNumbers,
        evenNumbers: evenNumbers
    };
}

const inputArray = [2, 24, 32, 22, 31, 100, 56, 21, 99, 7, 5, 37, 97, 25, 13, 11];
sortArray(inputArray);
