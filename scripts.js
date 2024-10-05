let mouseDown = false;
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

let operation =[];
let currentNumber = '', currentOperator = '';
let resultDisplayed = false; // this variable makes sure that the partial results can't be deleted with the C button (only entered numbers)
let equalsPressed = false;
let isError = false;

const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator")
const currentNumberText = document.querySelector(".current-number")
const calculationText = document.querySelector(".calculation")
const equals = document.querySelector('.equals')

equals.onclick = () => equalsPressed = true

numbers.forEach(number => {
    number.addEventListener('click', () => {
        //clears the text content if it's a result otherwise not
        if (!isError && currentNumberText.textContent.length<12){
            if (resultDisplayed) {
                currentNumberText.textContent = ''
                resultDisplayed = false
            }
            currentNumberText.textContent += number.textContent
        }
        
    });
})

operators.forEach(operator => {
    operator.addEventListener('click', () =>{
        //storing entered number and operator in string format
        currentNumber = currentNumberText.textContent
        currentOperator = operator.textContent
        //error occurs if something like 50=12 is entered or divided by 0
        if (!isError){
            if (currentOperator === 'AC') clearDisplay();
            else if (currentOperator === 'C') deleteDigit();
            else if (currentOperator === '.') decimal();
            else if ((currentNumber === '') || (resultDisplayed)) {
                //if number was not entered OR the number we see is just only the result of the previous calculation step
                //but an operator button was pressed then the operator has to be removed,
                //then the newly pressed operator gets added and displayed --> this prevents jamming the array with operators and changes the operator to the latest pressed one
                operation.pop()
                if (operation.length > 0) {
                    operation.push(currentOperator)
                    calculationText.textContent = calculationText.textContent.slice(0, -2) + `${currentOperator} `;
                }
                //since the = is an operator too it rewrites the calculation (upper) window after you decide to continue the calculation just like windows' calculator does
                if (equalsPressed) {
                    calculationText.textContent = `${currentNumber} ${currentOperator} `;
                    equalsPressed = false;
                }
            }
            //this executes if both a number and an operator is present
            else operate();
        }
        else if (currentOperator === 'AC') clearDisplay();
        
    });
})

function operate(){
    currentNumberText.textContent = '';
    calculationText.textContent += `${currentNumber} ${currentOperator} `;

    //pushing the number and operator in the array (looks like this -> ["12", "+"])
    operation.push(currentNumber);
    operation.push(currentOperator);

    //checking if the array at least length 3, eventually it will be 4 -> ["12", "+", "3", "-"]
    if (operation.length >= 3){
        //popping the first 3 elements to do the calculation (12 + 3)
        let num1 = Number.parseFloat(operation.shift());
        let op = operation.shift();
        let num2 = Number.parseFloat(operation.shift());
        let result = calculate(num1, op, num2);
        result = convertToExponential(result)

        //putting the result back to the start of the array if not error and the parsed result (could be float or string due to convertToExponential) is a number -> [12, "-"]
        console.log(typeof result)
        if (!(typeof parseFloat(result) === 'number')) isError = true
        else operation.unshift(result)
        //remamber that now the result being displayed (can't be deleted)
        currentNumberText.textContent = result;
        resultDisplayed = true;
    }
}
function convertToExponential(n) {
    if (typeof n === 'number'){
        n = n.toFixed(4)
        if (n.length > 12) return parseFloat(n).toExponential(2);
    } 
    return parseFloat(n);
}
function decimal(){
    if (currentNumberText.textContent.at(-1) !== '.' && !resultDisplayed) currentNumberText.textContent += '.'
}
function deleteDigit(){
    if (!(resultDisplayed)) currentNumberText.textContent = currentNumberText.textContent.slice(0, -1);
}

function clearDisplay(){
    operation =[];
    calculationText.textContent = ''
    currentNumberText.textContent = ''
    resultDisplayed = false
    equalsPressed = false
    isError = false
}

function calculate(num1, operator, num2){
    switch(operator) {
        case '+':
            result = add(num1, num2)
            break;
        case '-':
            result = subtract(num1, num2)
            break;
        case '÷':
            if (num2 === 0) return 'You dumb'
            result = divide(num1, num2)
            break;
        case '×':
            result = multiply(num1, num2)
            break;
        case 'mod':
            result = modulo(num1,num2)
            break;
        default:
            result = 'error'
    }
    return result
}

function add(x,y){
    return x +y
}
function subtract(x,y){
    return x - y
}
function multiply(x,y) {
    return x*y
}
function divide(x,y){
    return x/y
}
function modulo(x, y){
    return x % y
}
