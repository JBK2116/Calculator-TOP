// Global variables for display and UI elements
const displayOperations = document.getElementById("result");
const displaOperationsPreviousResult = document.getElementById("previous-result");
const adaptiveClearOperator = document.querySelector(".toggleClear");
const plusMinusOperator = document.querySelector(".plus-minus");
const evaluater = document.querySelector(".evaluate");
const operators = document.querySelectorAll(".operator");
const numbers = document.querySelectorAll(".number");

// Constants
const HOLD_DURATION = 1000;  // 1000ms -> 1 second, used for clearOnLongHold Function

// Variables for calculator operations
let currentOperator = '';
let firstNumberValue = '';
let secondNumberValue = '';
let operationResult = 0;

// Variables for button hold functionality
let buttonHeldTimer;
let isHeldLongEnough = false;

// Main initialization function
function main() {
    setupNumbersAndDecimal();
    setUpOperators();
    setupPlusMinusOperator();
    setupadaptiveClearOperator();
}

// Main Calculation Functions
function add(number1, number2) {}
function subtract(number1, number2) {}
function multiply(number1, number2) {}
function divide(number1, number2) {}
function remainder(number1, number2) {}


// Calculator setup functions
function setupadaptiveClearOperator() {
    manipulateClearOperator();
    clearOnNormalOrLongPress();
}

function setUpOperators() {
    operators.forEach((operator) => {
        operator.addEventListener("click", () => {
            if (currentOperator === '' && displayOperations.textContent !== '' && displayOperations.textContent !== '0'){
                currentOperator = operator.textContent;
                displayOperations.textContent += operator.textContent;
            }
        });
    });
}

function setupNumbersAndDecimal() {
    numbers.forEach((number) => {
        number.addEventListener("click", () => {
            if (number.textContent === '.') {
                handleDecimalInput(number);
            } else {
                handleNumberInput(number);
            }
        });
    });
}

function setupPlusMinusOperator() {
    plusMinusOperator.addEventListener("click", () => {
        if (currentOperator === '') {
            // Handling for first number, including empty case
            if (firstNumberValue === '') {
                // Allow starting with a negative number
                firstNumberValue = '-';
                displayOperations.textContent = firstNumberValue;
            } else if (!firstNumberValue.includes('-')) {
                firstNumberValue = '-' + firstNumberValue;
                displayOperations.textContent = firstNumberValue;
            } else {
                firstNumberValue = firstNumberValue.slice(1);
                displayOperations.textContent = firstNumberValue;
            }
        } else if (secondNumberValue !== '') {
            // Handling for second number 
            if (!secondNumberValue.includes('-')) {
                secondNumberValue = '-' + secondNumberValue;
            } else {
                secondNumberValue = secondNumberValue.slice(1);
            }
            let displayText;
            if (secondNumberValue.startsWith('-')) {
                // If second number is negative, display the operator and negative number together
                displayText = firstNumberValue + currentOperator + '(' + secondNumberValue + ')';
            } else {
                // If second number is positive, display normally
                displayText = firstNumberValue + currentOperator + secondNumberValue;
            }
            
            displayOperations.textContent = displayText;
        }
    });
}

// Input handling functions
function handleDecimalInput(number) {
    // Handle decimal points
    if (currentOperator === '') {
        if (!firstNumberValue.includes('.')) {
            // If first number is empty or just '0', set it to '0.'
            if (firstNumberValue === '' || firstNumberValue === '0') {
                firstNumberValue = '0.';
            } else {
                firstNumberValue += '.';
            }
            displayOperations.textContent = firstNumberValue;
        }
    } else {
        if (!secondNumberValue.includes('.')) {
            // If second number is empty, set it to '0.'
            if (secondNumberValue === '') {
                secondNumberValue = '0.';
            } else {
                secondNumberValue += '.';
            }
            displayOperations.textContent = firstNumberValue + currentOperator + secondNumberValue;
        }
    }
}

function handleNumberInput(number) {
    // Handle regular numbers
    if (currentOperator === '') {
        // If display shows only '0', replace it with the new number
        if (firstNumberValue === '0' || firstNumberValue === '') {
            firstNumberValue = number.textContent;
        } else {
            firstNumberValue += number.textContent;
        }
        displayOperations.textContent = firstNumberValue;
    } else {
        // If second number is '0', replace it with the new number
        if (secondNumberValue === '0') {
            secondNumberValue = number.textContent;
        } else {
            secondNumberValue += number.textContent;
        }
        displayOperations.textContent = firstNumberValue + currentOperator + secondNumberValue;
    }
}

// Clear and reset functions
function clearOnNormalOrLongPress() {
    let isMouseDown = false;

    adaptiveClearOperator.addEventListener("mousedown", () => {
        isMouseDown = true;
        isHeldLongEnough = false;
        
        buttonHeldTimer = setTimeout(() => {
            if (isMouseDown) {
                isHeldLongEnough = true;
                resetCalculator();
            }
        }, HOLD_DURATION);
    });
    
    adaptiveClearOperator.addEventListener("mouseup", () => {
        isMouseDown = false;
        clearTimeout(buttonHeldTimer);
        
        if (!isHeldLongEnough) {
            clearOnNormalPress();
        }
    });
    
    adaptiveClearOperator.addEventListener("mouseleave", () => {
        if (isMouseDown) {
            isMouseDown = false;
            clearTimeout(buttonHeldTimer);
        }
    });
}

function clearOnNormalPress() {
    if (adaptiveClearOperator.textContent === 'AC') {
        resetCalculator();
    }
    else {
        stepclearOperator();
    }
}

function stepclearOperator() {
    // Update the corresponding variable
    if (secondNumberValue !== '') {
        secondNumberValue = secondNumberValue.slice(0, -1);
    }
    else if (currentOperator !== '') {
        currentOperator = '';
    }
    else if (firstNumberValue !== '') {
        firstNumberValue = firstNumberValue.slice(0, -1);
    }
    // Remove the last character from display
    let displayOperationsString = displayOperations.textContent;
    displayOperationsString = displayOperationsString.slice(0, displayOperationsString.length - 1);
    displayOperations.textContent = displayOperationsString;
}

function resetCalculator() {
    displayOperations.textContent = '0';
    displaOperationsPreviousResult.textContent = '';
    firstNumberValue = '';
    secondNumberValue = '';
    currentOperator = '';
    operationResult = 0;
}

// UI update functions
function manipulateClearOperator() {
    const observeDisplayInput = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                if (displayOperations.textContent !== '0' && displayOperations.textContent.length > 0) {
                    adaptiveClearOperator.textContent = 'C';
                }
                else {
                    adaptiveClearOperator.textContent = 'AC';
                    displayOperations.textContent = '0'; // Resets the display to 0 as its initial base.
                }
            }
        });
    });
    const config = {
        CharacterData: true,
        childList: true,
        subtree: true
    };
    observeDisplayInput.observe(displayOperations, config);
    return observeDisplayInput;
}

// Start the calculator
main();