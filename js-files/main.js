// Important Variables For Use
const operators = document.querySelectorAll(".operator");
const numbers = document.querySelectorAll(".number");
//Below are the variables that will be used in each calculator operation
let currentOperator = ''; // The Single Operator being used in each calculation
let firstNumberValue = ''; //  The first number of the operation
let secondNumberValue = '' // The second number of the operation
let operationResult = 0;
// Below are the variables for displaying each operation
let allClearOperator = document.querySelector(".allclear")
let clearOperator = document.querySelector(".clear")
const evaluater = document.querySelector(".evaluate"); // Calls a Main Calculator Function
let displayOperations = document.getElementById("result"); // Visually showcase each value inputted and the final result
displayOperations.textContent = '';

// Helper Functions
function setUpCalc() {
    operators.forEach((operator) => {
        operator.addEventListener("click", () => {
            if (currentOperator === '' && displayOperations.textContent !== ''){
            currentOperator = operator.textContent;
            displayOperations.textContent += operator.textContent;
            }
        })
    })

    numbers.forEach((number) => {
        number.addEventListener("click", () => {
            if (number.textContent === '.') {
                // Prevent adding a decimal point if one already exists in the number
                if (currentOperator === '') {
                    // Only add a decimal if it hasn't been added already
                    if (!firstNumberValue.includes('.')) {
                        firstNumberValue += number.textContent;
                        displayOperations.textContent = firstNumberValue;
                    }
                } 
                else {
                    // Only add a decimal if it hasn't been added already
                    if (!secondNumberValue.includes('.')) {
                        secondNumberValue += number.textContent;
                        displayOperations.textContent = firstNumberValue + currentOperator + secondNumberValue;
                    }
                }
            } else {
                // For non-decimal numbers, just append the number
                if (currentOperator === '') {
                    firstNumberValue += number.textContent;
                    displayOperations.textContent = firstNumberValue;
                } 
                else {
                    secondNumberValue += number.textContent;
                    displayOperations.textContent = firstNumberValue + currentOperator + secondNumberValue;
                }
            }
        });
    });
    

    allClearOperator.addEventListener("click", () => {
        resetCalculator();
    })

    clearOperator.addEventListener("click", () => {
        // Update the corresponding variable
        if (secondNumberValue !== '') {
            secondNumberValue = secondNumberValue.slice(0, -1)
        }
        else if (currentOperator !== '') {
            currentOperator = '';
        }
        else if (firstNumberValue !== '') {
            firstNumberValue = firstNumberValue.slice(0, -1)
        }
        // Remove the last character from display
        let displayOperationsString = displayOperations.textContent;
        displayOperationsString = displayOperationsString.slice(0, displayOperationsString.length - 1);
        displayOperations.textContent = displayOperationsString;
    })
}

function resetCalculator() {
    displayOperations.textContent = '';
    firstNumberValue = '';
    secondNumberValue = '';
    currentOperator = '';
}

function evaluate() {
}

// Main Calculator Operator Functions
function add(firstValue, secondValue) {
}
function subtract(firstValue, secondValue) {
}
function multiply(firstValue, secondValue){
}
function divide(firstValue, secondValue) {
}
function remainder(firstValue, secondValue) {
}

// Main Function Below
function main() {
}