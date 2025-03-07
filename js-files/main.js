// Global variables for display and UI elements
const displayOperations = document.getElementById("result");
const DisplayOperationsPreviousResult = document.getElementById("previous-result");
const adaptiveClearOperator = document.querySelector(".toggleClear");
const plusMinusOperator = document.querySelector(".plus-minus");
const evaluater = document.querySelector(".evaluate");
const operators = document.querySelectorAll(".operator");
const numbers = document.querySelectorAll(".number");
let resultContainerWidth = Math.max(1, Math.floor(parseFloat(window.getComputedStyle(displayOperations).width)));
// Constants
const HOLD_DURATION = 1000;  // 1000ms -> 1 second, used for clearOnLongHold Function

// Variables for calculator operations
let currentOperator = '';
let usedOperator = '';
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
    updateResultContainerWidth();
    evaluate();
}

// Format calculation results consistently
function formatResult(result) {
    let maxDigits = Math.max(8, Math.min(20, resultContainerWidth / 10));
    // Convert result to a reasonable number of digits
    if (Math.abs(result) >= 1e12) {
        // Use scientific notation for very large numbers
        return result.toExponential(Math.max(1, Math.min(5, maxDigits - 5)));
    } else if (Math.abs(result) < 1) {
        // For smaller numbers, keep a reasonable number of decimal places
        return parseFloat(result.toFixed(13)).toString();
    } else {
        // For normal numbers, use toPrecision to limit total digits
        return parseFloat(result.toPrecision(15)).toString();
    }
}

// This function calls a main calculation function
function evaluate() {
    evaluater.addEventListener("click", () => {
        calculateResult();
    });
}

// Extracted calculation logic for reuse
function calculateResult() {
    if (currentOperator === '' || secondNumberValue === '') return;
    
    const firstNumber = parseFloat(firstNumberValue);
    const secondNumber = parseFloat(secondNumberValue);
    
    switch(usedOperator) {
        case '+':
            operationResult = add(firstNumber, secondNumber);
            break;
        case '-':
            operationResult = subtract(firstNumber, secondNumber);
            break;
        case '*':
            operationResult = multiply(firstNumber, secondNumber);
            break;
        case '/':
            operationResult = divide(firstNumber, secondNumber);
            break;
        case '%':
            operationResult = remainder(firstNumber, secondNumber);
            break;
    }
    
    handlePostCalculation(operationResult);
}

// Main Calculation Functions
function add(number1, number2) {
    return formatResult(number1 + number2);
}

function subtract(number1, number2) {
    return formatResult(number1 - number2);
}

function multiply(number1, number2) {
    return formatResult(number1 * number2);
}

function divide(number1, number2) {
    if (number2 === 0) {
        return 'Error';
    }
    return formatResult(number1 / number2);
}

function remainder(number1, number2) {
    return formatResult(number1 % number2);
}

// Calculator setup functions
function setupadaptiveClearOperator() {
    manipulateClearOperator();
    clearOnNormalOrLongPress();
}

function setUpOperators() {
    operators.forEach((operator) => {
        operator.addEventListener("click", () => {
            // Store the displayed operator symbol for UI
            let displaySymbol = operator.textContent;
            
            // Convert to functional operator for calculations
            let functionalOperator = displaySymbol;
            if (functionalOperator === '÷') functionalOperator = '/';
            if (functionalOperator === '×') functionalOperator = '*';
            
            if (firstNumberValue !== '') {
                // If we already have a complete expression (num1 op num2), calculate it first
                if (currentOperator !== '' && secondNumberValue !== '') {
                    calculateResult();
                }
                
                // Set the new operator for the next calculation
                currentOperator = displaySymbol;
                usedOperator = functionalOperator;
                displayOperations.textContent = firstNumberValue + displaySymbol;
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
            updateDisplay();
        }
    });
}

// Helper function to update display consistently
function updateDisplay() {
    if (currentOperator === '') {
        displayOperations.textContent = firstNumberValue || '0';
    } else {
        if (secondNumberValue.startsWith('-')) {
            // If second number is negative, display the operator and negative number together
            displayOperations.textContent = firstNumberValue + currentOperator + '(' + secondNumberValue + ')';
        } else {
            // If second number is positive, display normally
            displayOperations.textContent = firstNumberValue + currentOperator + secondNumberValue;
        }
    }
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
            updateDisplay();
        }
    } else {
        if (!secondNumberValue.includes('.')) {
            // If second number is empty, set it to '0.'
            if (secondNumberValue === '') {
                secondNumberValue = '0.';
            } else {
                secondNumberValue += '.';
            }
            updateDisplay();
        }
    }
}

function handleNumberInput(number) {
    // Check if we're starting a new calculation after a result
    if (DisplayOperationsPreviousResult.textContent !== '' && 
        currentOperator === '' && secondNumberValue === '' &&
        !firstNumberValue.includes('.')) {
        // Clear the previous result to start a new calculation
        firstNumberValue = '';
        operationResult = 0;
        DisplayOperationsPreviousResult.textContent = '';
    }
    
    // Handle regular numbers
    if (currentOperator === '') {
        // If display shows only '0', replace it with the new number
        if (firstNumberValue === '0' || firstNumberValue === '') {
            firstNumberValue = number.textContent;
        } else {
            firstNumberValue += number.textContent;
        }
        updateDisplay();
    } else {
        // If second number is '0', replace it with the new number
        if (secondNumberValue === '0') {
            secondNumberValue = number.textContent;
        } else {
            secondNumberValue += number.textContent;
        }
        updateDisplay();
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
        if (secondNumberValue === '-') {
            secondNumberValue = '';
        }
    }
    else if (currentOperator !== '') {
        currentOperator = '';
    }
    else if (firstNumberValue !== '') {
        firstNumberValue = firstNumberValue.slice(0, -1);
        if (firstNumberValue === '-') {
            firstNumberValue = '';
        }
    }
    
    updateDisplay();
    
    // If everything is cleared, reset to 0
    if (firstNumberValue === '' && currentOperator === '' && secondNumberValue === '') {
        displayOperations.textContent = '0';
    }
}

function resetCalculator() {
    displayOperations.textContent = '0';
    DisplayOperationsPreviousResult.textContent = '';
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
        characterData: true,
        childList: true,
        subtree: true
    };
    observeDisplayInput.observe(displayOperations, config);
    return observeDisplayInput;
}

//This function updates the display after each calculation and the appropriate variables
function handlePostCalculation(result) {
    if (result === "Error") {
        DisplayOperationsPreviousResult.textContent = displayOperations.textContent + ' =';
        displayOperations.textContent = "Error"
    }
    else {
        DisplayOperationsPreviousResult.textContent = displayOperations.textContent + ' =';
        displayOperations.textContent = result;
        firstNumberValue = result;
        secondNumberValue = '';
        currentOperator = '';
    }
}

// This function updates the value that stores the width of the display operation results container
function updateResultContainerWidth() {
    // Initial calculation of container width
    resultContainerWidth = Math.floor(parseFloat(window.getComputedStyle(displayOperations).width));
    
    // Set a reasonable default if the calculation fails or gives an unreasonable value
    if (isNaN(resultContainerWidth) || resultContainerWidth < 1) {
        resultContainerWidth = 100; // Default reasonable width
    }
    
    window.addEventListener("resize", () => {
        // Update width when window resizes
        resultContainerWidth = Math.floor(parseFloat(window.getComputedStyle(displayOperations).width));
        
        // Ensure value stays reasonable
        if (isNaN(resultContainerWidth) || resultContainerWidth < 1) {
            resultContainerWidth = 100;
        }
    });
}

// Start the calculator
main();