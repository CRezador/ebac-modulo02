const FORM = document.querySelector(".calculator-numbers");
const KEYBOARD = document.querySelector(".keyboard");
const SCREEN = document.querySelector(".input-number");
const STORAGE = document.querySelector(".calculator-storage");


//Storage
let numberGenerator = [];
let refresh = true;
let operationResult = JSON.parse(localStorage.getItem('operationResult')) || [];
let number = JSON.parse(localStorage.getItem('number')) || [];
let operator =  JSON.parse(localStorage.getItem('operator')) || [];
//-----------LISTENERS

window.onload = () =>{
  if(!operationResult.length)
   return
  loadStorage(true);
} 

//recebendo os valores e fazendo o calculo
FORM.addEventListener('submit', (e) =>{
  e.preventDefault();
  generateOperation(SCREEN.value, "=", false);
});

KEYBOARD.addEventListener('click', (e) =>{
  let target = e.target.innerText;

  handleButtonPress(target);

})

window.addEventListener("keydown", (e) =>{
  let target = e.key;
  const KEYPRESS = true; 

  handleButtonPress(target, KEYPRESS);
})
//--------------FUNCTIONS

//Valida qual botão foi apertado
function handleButtonPress(target, keyPress = false){
  switch(target){
    case "C":
      SCREEN.value = "";
      break;
    case "Backspace":
      SCREEN.value = "";
    case "D":
      deleteStorage();
      SCREEN.value = "";
      break;
    case "Delete":
      deleteStorage();
      SCREEN.value = "";      
      break;
    case "/":
      generateOperation(SCREEN.value, target, true);     
      SCREEN.value = "";
      break;
    case "X":
      generateOperation(SCREEN.value, target, true);
      SCREEN.value = "";
      break;
    case "*":
      generateOperation(SCREEN.value, target, true);
      SCREEN.value = "";
      break;      
    case "-":
      generateOperation(SCREEN.value, target, true);
      SCREEN.value = "";
      break;
    case "+":
      generateOperation(SCREEN.value, target, true);
      SCREEN.value = "";
      break;
    case "=":
      if(keyPress){
        generateOperation(SCREEN.value, "=", false);
      }
      break;
    case "Enter":
      if(keyPress){
        generateOperation(SCREEN.value, "=", false);
      }      
      break;
    default:
      if (target >= 0 && target <= 9) {
        var numero = geraNumero(target);
        SCREEN.value = numero;
      }
    }
}

//carrega as ultimas operações
function loadStorage(isRefresh = false){

  if(isRefresh){
    number = [];
    operator = [];
  }
  const html = ` 
  <div class"results-storage">
    <ul>
      ${operationResult.map( result =>{
        return `<li><span class="operation-result">${result}</span></li>`
      }).join("")}
    <ul>
  </div>
  <div class="operator-number">
    <ul class="operator-list">
      <li><span class="operator">${ !operator.length ? " " : operator[operator.length - 1]}</span></li>
    </ul>
    <ul class="number-list">
      <li><span class="number">${ !operator.length ? " " : number[number.length - 1]}</span></li>
    </ul>
  </div>`;

  STORAGE.innerHTML = html;
}

//Salva o dados da operação no storage
function saveStorage(num, opp, saveResult = false, mathOperationButtonsIsPressed = true){
  if((num != null) && (opp != null))
  {
    number.push(num);
    operator.push(opp);
    if((number.length && operator.length) > 4){
      number.shift();
      operator.shift() ;
    }
    if(operationResult.length > 6){
      operationResult.shift();
    }
  }else{
    number = [];
    operator = [];
    operationResult = [];
  }

  if(saveResult){
    if(mathOperationButtonsIsPressed){
      operationResult.push(`${operator[operator.length - 1]}          ${number[number.length - 1]}`);
    }else{
      operationResult.push(`${number[number.length - 3]} ${operator[operator.length - 1]} ${number[number.length - 2]} = ${num}`);
    }
    localStorage.setItem('operationResult', JSON.stringify(operationResult));
    loadStorage(false, false)
    return
  }
  
  localStorage.setItem('number', JSON.stringify(number));
  localStorage.setItem('operator', JSON.stringify(operator));
  localStorage.setItem('operationResult', JSON.stringify(operationResult));
  loadStorage()
}

//adiciona um numero no input
function geraNumero(dig){

  numberGenerator.push(dig);

  return handleGenerateNum();
}

//reseta o gerador de numero
function resetNumberGenerator(){
  numberGenerator = [];
  loadStorage();
}

//Confirmar um número gerado e gera um calculo, caso necessário
function generateOperation(num, opp, isRefresh = true){
  let results;
  let mathOperationButtonsIsPressed = true;
  if(number.length && !isRefresh){
    if(opp === "="){
      opp = operator[operator.length - 1];
      mathOperationButtonsIsPressed = false;
    }
        switch(opp){
          case "+":
            results = parseFloat(number[number.length - 1]) + parseFloat(num);
            number.push(num);
          break;
          case "-":
            results = parseFloat(number[number.length - 1]) - parseFloat(num);
            number.push(num);
          break;
          case "X":
            results = parseFloat(number[number.length - 1]) * parseFloat(num);
            number.push(num);
          break;  
          case "/":
            if(!handleDivision(num)){
              alert("Não é possível dividir um número por zero!");
              resetNumberGenerator();
              return false;
            }else{          
            results = parseFloat(number[number.length - 1]) / parseFloat(num);
            number.push(num);
            }
          break;
          
        }
        if(validateOperation(results)){
          saveStorage(results,opp, true, mathOperationButtonsIsPressed);
        }     
        resetNumberGenerator();
        return  
  }
  
  refresh = false;
  saveStorage(num,opp);
  resetNumberGenerator();
}

//Limpa o histórico de operações
function deleteStorage(){
  saveStorage(null,null);
  resetNumberGenerator();
}

//--------------VALIDADORES

function handleGenerateNum(){
  let numero = "";
  for (let index = 0; index < numberGenerator.length; index++) {
    numero = numero.concat(numberGenerator[index]);
  }
  if(numberGenerator[numberGenerator.length - 1] === "."){
    numero = numero.concat("0");
  }

  return numero;
}

function validateOperation(result){
  if((typeof result === "number" && isNaN(result)) || typeof result === "undefined"){
    alert("Operação inválida, Tente outra vez!!");
    SCREEN.value = "";
    return false;
  }

  return true;
}

function handleDivision(num){
  if(num === "0"){
    
    return false;
  }

  return true;
}

