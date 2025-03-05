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
let buttonHeldTimer;
const HOLD_DURATION = 1000;  // 2000ms -> 2 seconds
let isHeldLongEnough = false;
const evaluater = document.querySelector(".evaluate"); // Calls a Main Calculator Function
let displayOperations = document.getElementById("result"); // Visually showcase each value inputted and the final result


//This function sets up the operators for use
function setUpOperators() {
    operators.forEach((operator) => {
        operator.addEventListener("click", () => {
            if (currentOperator === '' && displayOperations.textContent !== '' && displayOperations.textContent !== '0'){
            currentOperator = operator.textContent;
            displayOperations.textContent += operator.textContent;
            }
        })
    })
}


//This function sets up the numbers(including the decimal operator) for use!
function setupNumbersAndDecimal() {
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
            } 
            else {
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

//This function controls and sets up the plus/minus operator for use!
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
            // Handling for second number remains the same
            if (!secondNumberValue.includes('-')) {
                secondNumberValue = '-' + secondNumberValue;
            } else {
                secondNumberValue = secondNumberValue.slice(1);
            }
            displayOperations.textContent = firstNumberValue + currentOperator + secondNumberValue;
        }
    });
}

//This function sets up the adaptiveClearOperator for general use!
function setupadaptiveClearOperator() {
    // Sets up the MutationObserver to monitor the display changes and update the clear function
    manipulateClearOperator()
    clearOnNormalOrLongPress()
}

// This function works as the step clear function -> 'C'
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

//This function handles the behavior of the adaptiveClearOperator on a normal click
function clearOnNormalPress() {
    if (adaptiveClearOperator.textContent === 'AC') {
        resetCalculator();
    }
    else {
        stepclearOperator();
    }
}


// This function handles the overall use of the adaptiveClearFunction
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

// This function works as the allClear Function -> 'AC'
function resetCalculator() {
    displayOperations.textContent = '0';
    firstNumberValue = '';
    secondNumberValue = '';
    currentOperator = '';
    operationResult = 0;
}

// This function modifies the display of the clear operator and a little bit of the display via a Mutation Observer!
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

function main() {
    setupNumbersAndDecimal()
    setUpOperators()
    setupPlusMinusOperator()
    setupadaptiveClearOperator()
}

main()