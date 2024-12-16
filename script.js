
// only allow to type Number and some special letters
document.getElementById('display').addEventListener('input', function(event) {
    // Allow only numbers and special characters
    this.value = this.value.replace(/[^0-9!@#$%^&*()_+={}|\[\]:;"'<>,.?/\\-]/g, '');
});
  

///////////////////////Function to update CSS variables color based on user input////////////////////////
document.getElementById('base-color').addEventListener('input', function(event) {
// Get the color value from the color picker
const baseColor = event.target.value;

// Set the base color and the calculated border colors as CSS variables
document.documentElement.style.setProperty('--base-color', baseColor);

// Calculate border and focus colors based on the base color
const darkerColor = darkenColor(baseColor, 0.3); // Darken by 30% for border
const focusColor = darkenColor(baseColor, 0.5); // Darken by 50% for focus state

// Set the calculated colors
document.documentElement.style.setProperty('--calculator-outer', darkerColor);
document.documentElement.style.setProperty('--calculator-inner', focusColor);
});

// Function to darken the color by a certain percentage
function darkenColor(color, percent) {
// Convert hex to RGB
let hex = color.replace('#', '');
let r = parseInt(hex.substring(0, 2), 16);
let g = parseInt(hex.substring(2, 4), 16);
let b = parseInt(hex.substring(4, 6), 16);

// Darken by multiplying with the percent
r = Math.max(0, Math.min(255, r * (1 - percent)));
g = Math.max(0, Math.min(255, g * (1 - percent)));
b = Math.max(0, Math.min(255, b * (1 - percent)));

// Convert RGB back to hex
return `rgb(${r}, ${g}, ${b})`;
}

// Set the initial colors when the page loads
document.getElementById('base-color').dispatchEvent(new Event('input'));

////////////////  Calculator Working Logic ///////////////////////

let currentInput = '';
let prevInput = '';
let operation = null;
let expression = ''; // To store the complete expression for display
let isResultDisplayed = false; // To track if the result is displayed

function appendNumber(number) {
    if (isResultDisplayed) {
        // Reset everything for a new calculation
        clearDisplay(false); // Clear but retain the result for a new expression
        currentInput = ''; // Start fresh
        expression = '';   // Clear expression
        isResultDisplayed = false; // Reset result display flag
    }
    currentInput += number;
    expression += number;
    document.getElementById('display').value = expression;
}

function chooseOperator(op) {
    if (isResultDisplayed) {
        // Use the current result as the starting point for the next operation
        isResultDisplayed = false;
    }

    if (currentInput === '' && prevInput === '') {
        // Allow chaining using the result (if any)
        currentInput = prevInput;
    }

    if (prevInput !== '' && currentInput !== '') {
        calculateResult(false); // Calculate intermediate result
    }

    operation = op;
    prevInput = currentInput;
    currentInput = '';
    expression = prevInput + '' + operation + '';
    document.getElementById('display').value = expression;
}

function clearDisplay(resetExpression = true) {
    currentInput = '';
    prevInput = '';
    operation = null;
    if (resetExpression) {
        expression = '';
    }
    isResultDisplayed = false;
    document.getElementById('display').value = expression;
}

function calculateResult(showFinalResult = true) {
    let result;
    if (operation === '/' && currentInput === '0') {
        result = "Syntax Error!";
    } else {
        try {
            result = eval(prevInput + operation + currentInput);
            if (!isFinite(result)) {
                result = "Infinity";
            }
        } catch (error) {
            result = "Syntax Error!";
        }
    }

    currentInput = result.toString();
    if (showFinalResult) {
        prevInput = '';
        operation = null;
        expression = currentInput; // Show only the result
        isResultDisplayed = true; // Mark that result is displayed
    } else {
        prevInput = currentInput;
        expression = prevInput; // Keep the intermediate result in expression
    }

    document.getElementById('display').value = expression;
}

// Keybinding for the PC number pad
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        calculateResult(); // Equals button press
    } else if (event.key === 'Backspace') {
        clearDisplay(); // Clear button press
    } else if (event.key === '0' || event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4' || event.key === '5' || event.key === '6' || event.key === '7' || event.key === '8' || event.key === '9') {
        appendNumber(event.key); // Number keys
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        chooseOperator(event.key); // Operator keys
    }
});
