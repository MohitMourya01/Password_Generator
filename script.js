const inputSlider = document.querySelector("[data-lengthSlider]"); //custom attribute access

const lengthDisplay = document.querySelector("[data-lengthNum]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const copyBtn = document.querySelector("[data-copy]");
const copyMsg =document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = "~`!@#$%^&*()_-+={[}]|:;<,>.?/";

let password = "";
let passwordLength = 10;
let checkCount = 0;
// copyContent()
// handleSlider()
// generatePswd()
// setIndicator()
// getRandomInteger()
// getRandomUppercase()
// getRandomLowercase()
// getRandomSymbols()
// calculateStrength()

// set passwordLength
handleSlider();

setIndicator("#ccc");


function handleSlider(){
   inputSlider.value = passwordLength;
   lengthDisplay.innerText = passwordLength;
   //slider range color manage
   const min=inputSlider.min;
   const max=inputSlider.max;
   inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+("% 100%");
}
// setIndicator("#ccc");
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow='0px 0px 12px 1px ${color}';
}

function getRndInteger(min,max){
     return Math.floor(Math.random() * (max-min)) + min; 
}

function generateNumber(){
    return getRndInteger(0,9);
}

function generateLowercase(){
    return  String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const rndNum = getRndInteger(0, symbols.length);
    return symbols.charAt(rndNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower= true;
    if(numberCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym ) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied!";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(  () => {
        copyMsg.classList.remove("active");
    },2000);  
}

function shufflePassword(array){
    // fisher yates 
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i] = array[j];
        array[j]=temp;
    }
    let str = "";
    array.forEach((el) => {str+=el});
    return str;
}

function handleCheckBoxChange(){
      checkCount =0;
      allCheckBox.forEach((checkBox) =>{
        if(checkBox.checked){
            checkCount++;
        }
      });
      // special case length<cheked
      if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
      }
}
allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
   // non of the checkbox are selected
   if(checkCount<=0){
    return ;
   }
   if(passwordLength<checkCount){
    passwordLength = checkCount;
    handleSlider();
   }
   // lets start the journey to find new password
   // remove old password
   password = "";

   // letys put the stuff mention by checkboxes
//    if(uppercaseCheck.checked){
//     password+=generateUppercase();
//    }
//    if(lowercaseCheck.checked){
//     password+=generateLppercase();
//    }
//    if(numberCheck.checked){
//     password+=generateNumber();
//    }
//    if(symbolCheck.checked){
//     password+=generateSymbol();
//    }

  let funcArr = [];
  if(uppercaseCheck.checked){
    funcArr.push(generateUppercase);
  }
   if(lowercaseCheck.checked){
    funcArr.push(generateLowercase);
   }
   if(numberCheck.checked){
    funcArr.push(generateNumber);
   }
   if(symbolCheck.checked){
    funcArr.push(generateSymbol);
   }
   // compulsory addition 
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password+=funcArr[randIndex]();
    }
    // shuffle the password
    password = shufflePassword(Array.from(password));
    //  show in UI
    passwordDisplay.value = password;
    //calculate strength
    calcStrength();

});


