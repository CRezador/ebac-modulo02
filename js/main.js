const FORM = document.querySelector(".calculator-numbers");
const KEYBOARD = document.querySelector(".keyboard");
const SCREEN = document.querySelector(".input-number");
const HISTORY = document.querySelector(".calculator-history");


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
  loadHistory(true);
} 

//recebendo os valores e fazendo o calculo
FORM.addEventListener('submit', (e) =>{
  e.preventDefault();
  generateOperation(SCREEN.value, "=", refresh);
});

KEYBOARD.addEventListener('click', (e) =>{
  var target = e.target.innerText;
  var classe = e.target.className;

  switch(target){
    case "C":
      /*
          Fazer tratamento para apagar o histórico
      */  
      SCREEN.value = "0";
      break;
    case "D":
      deleteHistory();
      SCREEN.value = "0";
      break;
    case "/":
      generateOperation(SCREEN.value, target, refresh)
      SCREEN.value = "0";
      break;
    case "X":
      generateOperation(SCREEN.value, target, refresh)
      SCREEN.value = "0";
      break;
    case "-":
      generateOperation(SCREEN.value, target, refresh)
      SCREEN.value = "0";
      break;
    case "+":
      generateOperation(SCREEN.value, target, refresh)
      SCREEN.value = "0";
      break;
    case "=":
      break;
    default:
      if(target[1] == null && classe !== "calculator-button b-percent"){
        var numero = geraNumero(target);
        SCREEN.value = numero;
      }
    }
})

//--------------FUNCTIONS

//carrega as ultimas operações
function loadHistory(isRefresh = false){

  if(isRefresh){
    number = [];
    operator = [];
  }
  const html = ` 
  <div class"results-history">
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

  HISTORY.innerHTML = html;
}
//valida qual operação será calculada
function validaOperacao(){

}

//adiciona um numero no input
function geraNumero(dig){

  numberGenerator.push(dig);

  return validaGeracaoNum();
}

//reseta o gerador de numero
function resetNumberGenerator(){
  numberGenerator = [];
  loadHistory();
}

//Confirmar um número gerado e gera um calculo, caso necessário
function generateOperation(num, opp, isRefresh){
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
          break;
          case "-":
            results = parseFloat(number[number.length - 1]) - parseFloat(num);
          break;
          case "X":
            results = parseFloat(number[number.length - 1]) * parseFloat(num);
          break;  
          case "/":
            results = parseFloat(number[number.length - 1]) / parseFloat(num);
          break;
          
        }
        saveStorage(results,opp, true, mathOperationButtonsIsPressed);
        resetNumberGenerator();
        return  
  }
  refresh = false;
  saveStorage(num,opp);
  resetNumberGenerator();
}

//Limpa o histórico de operações
function deleteHistory(){
  saveStorage(null,null);
  resetNumberGenerator();
}

//--------------VALIDADORES
function validaGeracaoNum(){
  let numero = "";
  for (let index = 0; index < numberGenerator.length; index++) {
    numero = numero.concat(numberGenerator[index]);
  }
  if(numberGenerator[numberGenerator.length - 1] === "."){
    numero = numero.concat("0");
  }

  return numero;
}

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
      operationResult.push(`${number[number.length - 2]} ${operator[operator.length - 1]} ${number[number.length - 1]} = ${num}`);
    }
    localStorage.setItem('operationResult', JSON.stringify(operationResult));
    loadHistory(false, false)
    return
  }

  localStorage.setItem('number', JSON.stringify(number));
  localStorage.setItem('operator', JSON.stringify(operator));
  loadHistory()
}