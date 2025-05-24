// Array to store history of calculations
const history = [];

// Get references to important HTML elements
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const historyLog = document.getElementById('history-log');
const historyBtn = document.getElementById('history');
const clearBtn = document.getElementById('clear');
const equalsBtn = document.getElementById('equals');

// Variable to store the current expression entered by user
let currentExpression = "";

/**
 * Function to add a calculation to history.
 * @param {number} num1 - First operand
 * @param {string} operator - Operator used (+, -, *, /)
 * @param {number} num2 - Second operand
 * @param {number} result - Result of calculation
 */
function addToHistory(num1, operator, num2, result) {
  history.push({ num1, operator, num2, result });
}

/**
 * Function to display the history or show a message if no history exists.
 */
function displayHistory() {
  if (history.length === 0) {
    historyLog.innerHTML = "<p>No calculations yet.</p>";
  } else {
    // Build a list of history entries
    let html = "<ul>";
    history.forEach(item => {
      html += `<li>${item.num1} ${item.operator} ${item.num2} = ${item.result}</li>`;
    });
    html += "</ul>";
    historyLog.innerHTML = html;
  }
  // Toggle visibility of history log
  historyLog.style.display = historyLog.style.display === "none" ? "block" : "none";
}

/**
 * Function to safely evaluate the expression and handle errors.
 * @param {string} expr - Expression string like "3+4"
 * @returns {number|string} - Result or error message
 */
function calculate(expr) {
  try {
    // Use eval carefully because expression is controlled by button clicks
    let result = eval(expr);
    // If result is Infinity (divide by zero), return error
    if (!isFinite(result)) {
      return "Error: Division by zero";
    }
    return result;
  } catch (error) {
    return "Error: Invalid expression";
  }
}

// Add event listeners to all buttons
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');

    // If button has a data-value, add it to the current expression
    if (value !== null) {
      currentExpression += value;
      display.value = currentExpression;
    }
  });
});

// Clear button resets everything
clearBtn.addEventListener('click', () => {
  currentExpression = "";
  display.value = "";
  historyLog.style.display = "none"; // hide history on clear
});

// Equals button calculates result
equalsBtn.addEventListener('click', () => {
  if (currentExpression === "") return; // Do nothing if empty

  // Extract numbers and operator from currentExpression using regex
  const match = currentExpression.match(/^(-?\d*\.?\d+)([\+\-\*\/])(-?\d*\.?\d+)$/);

  if (!match) {
    display.value = "Error: Invalid input";
    return;
  }

  const num1 = parseFloat(match[1]);
  const operator = match[2];
  const num2 = parseFloat(match[3]);

  const result = calculate(currentExpression);

  if (typeof result === "number") {
    display.value = result;
    // Add to history array
    addToHistory(num1, operator, num2, result);
    currentExpression = result.toString(); // allow chaining calculations
  } else {
    display.value = result; // show error message
    currentExpression = "";
  }
});

// History button shows or hides calculation history
historyBtn.addEventListener('click', () => {
  displayHistory();
});
