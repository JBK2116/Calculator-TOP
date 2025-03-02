// Important Variables For Use
const operators = document.querySelectorAll(".operator");
const numbers = document.querySelectorAll(".number");
//Below are the variables that will be used in each calculator operation
let currentOperator = ''; // The Single Operator being used in each calculation
let firstNumberValue = ''; //  The first number of the operation
let secondNumberValue = '' // The second number of the operation
let operationResult = 0;
// Below are the variables for displaying each operation
const adaptiveClearOperator = document.querySelector(".toggleClear");
const plusMinusOperator = document.querySelector(".plus-minus")
const evaluater = document.querySelector(".evaluate"); // Calls a Main Calculator Function
let displayOperations = document.getElementById("result"); // Visually showcase each value inputted and the final result

// Helper Functions
function setUpCalc() {
    operators.forEach((operator) => {
        operator.addEventListener("click", () => {
            if (currentOperator === '' && displayOperations.textContent !== '' && displayOperations.textContent !== '0'){
            currentOperator = operator.textContent;
            displayOperations.textContent += operator.textContent;
            }
        })
    })

    numbers.forEach((number) => {
        number.addEventListener("click", () => {
            if (number.textContent === '.') {
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
            } else {
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
        });
    });
    


}

function stepclearOperator() {
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
}

function resetCalculator() {
    displayOperations.textContent = '0';
    firstNumberValue = '';
    secondNumberValue = '';
    currentOperator = '';
}

// This function modifies the display of the clear operator!
function manipulateClearOperator() {
    const observeDisplayInput = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                if (displayOperations.textContent !== '0' && displayOperations.textContent.length > 0) {
                    adaptiveClearOperator.textContent = 'C'
                }
                else {
                    adaptiveClearOperator.textContent = 'AC'
                }
            }
        } )
    })
    const config = {
        CharacterData: true,
        childList: true,
        subtree: true
    };
    observeDisplayInput.observe(displayOperations, config)
    return observeDisplayInput;
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
    setUpCalc()
}

main()