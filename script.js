// ゲーム進行状況
const currentTurn = document.getElementById('currentPlayer');
const currentTurnContainer = ["currentPlayer1","currentPlayer2","currentPlayer3","currentPlayer4",];
let currentRotation = -1;

// プレイヤー情報
let player1position = -1;
let player2position = -1;
let player3position = -1;
let player4position = -1;

const piece1Array = Array.from(document.querySelectorAll('.piece1'));
const piece2Array = Array.from(document.querySelectorAll('.piece2'));
const piece3Array = Array.from(document.querySelectorAll('.piece3'));
const piece4Array = Array.from(document.querySelectorAll('.piece4'));

const playerInformation = [
    {
        position:player1position,
        piece:piece1Array
    },{
        position:player2position,
        piece:piece2Array
    },{
        position:player3position,
        piece:piece3Array
    },{
        position:player4position,
        piece:piece4Array
    }
];
let currentPlayerCount = sessionStorage.getItem('players'); //人数取得

// ランダムでポジティブマスとネガティブマスを決める
const pieceAllArray = Array.from(document.querySelectorAll('.pieces'));
const positiveSpace = [];
const negativeSpace = [];

let i = 1;
let iLength = 16;
while(i <= iLength){
    let randomSpace = Math.floor(Math.random() * 46);
    if (!positiveSpace.includes(randomSpace) && positiveSpace.length <= iLength / 2 - 1 && randomSpace != 7 && randomSpace != 8) {
        let isConsecutive = false;
        if ((positiveSpace.includes(randomSpace - 2) && positiveSpace.includes(randomSpace - 1)) ||
            (positiveSpace.includes(randomSpace - 1) && positiveSpace.includes(randomSpace + 1)) ||
            (positiveSpace.includes(randomSpace + 1) && positiveSpace.includes(randomSpace + 2))) {
            isConsecutive = true;
        }
        if (!isConsecutive) {
            positiveSpace.push(randomSpace);
            i++;
        }
    } else if (!negativeSpace.includes(randomSpace) && !positiveSpace.includes(randomSpace) && positiveSpace.length > iLength / 2 - 1) {
        let isConsecutive = false;
        if ((negativeSpace.includes(randomSpace - 2) && negativeSpace.includes(randomSpace - 1)) ||
            (negativeSpace.includes(randomSpace - 1) && negativeSpace.includes(randomSpace + 1)) ||
            (negativeSpace.includes(randomSpace + 1) && negativeSpace.includes(randomSpace + 2))) {
            isConsecutive = true;
        }
        if (!isConsecutive) {
            negativeSpace.push(randomSpace);
            i++;
        }
    };
};

positiveSpace.forEach(index => {
    pieceAllArray[index].classList.add('positiveSpace');
});
negativeSpace.forEach(index => {
    pieceAllArray[index].classList.add('negativeSpace');
});

// サイコロを回す → 駒を進める
const throwDiceButton = document.getElementById('throwDiceButton');
const buttonMask = document.getElementById('buttonMask');
const diceImgs = ['dice01_a_01.png','dice01_a_02.png','dice01_a_03.png','dice01_a_04.png','dice01_a_05.png','dice01_a_06.png'];
const dice = document.getElementById('dice');

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
});

throwDiceButton.addEventListener('click', function() {
    buttonMask.classList.add('clickedButton');
    currentRotation++;
    let j = 0;
    while(playerInformation[currentRotation % currentPlayerCount].position >= 46 && j < currentPlayerCount - 1){
        currentRotation++;
        j++;
    };
    currentRotation = currentRotation % currentPlayerCount;

    let nextRoutation = currentRotation + 1;
    let nextSkipCount = 0;
    while(playerInformation[nextRoutation % currentPlayerCount].position >= 46 && nextSkipCount < currentPlayerCount - 1){
        nextRoutation++;
        nextSkipCount++;
    };
    throwDice(currentRotation, nextSkipCount);
});
const throwDice = (currentRotation, nextSkipCount) => {
    const intervalId = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * 6);
        dice.src = diceImgs[randomNumber];
    }, 100);
    setTimeout(() => {
        clearInterval(intervalId);
        const randomNumber = Math.floor(Math.random() * 6);
        dice.src = diceImgs[randomNumber];
        playerInformation[currentRotation].position = goToSpace(randomNumber + 1, playerInformation[currentRotation].position, playerInformation[currentRotation].piece, 1, 1, nextSkipCount);
    }, 1200);
};

const goToSpace = (diceResult, playerposition, pieceArray, positiveOne_or_negativeOne, flg, nextSkipCount) => {
    const intervalId = setInterval(() => {
        playerposition += positiveOne_or_negativeOne;

        pieceArray.forEach(all => all.classList.remove('active'));
        if(playerposition >= 0 && playerposition <= 45){
            pieceArray[playerposition].classList.add('active');
        }else{
            pieceArray.forEach(all => all.classList.remove('active'));
            if(playerposition === 46){
                setTimeout(() => {
                    alert('ゴール！');
                }, 280);
            };
            clearInterval(intervalId);
            return;
        };
    }, 400);
    
    setTimeout(() => {
        if(playerposition >= 46 && nextSkipCount === currentPlayerCount - 1){
            currentTurn.classList.remove(currentTurnContainer[currentRotation]);
            buttonMask.classList.add('clickedButton');
            return;
        };
        clearInterval(intervalId);
        buttonMask.classList.remove('clickedButton');
        currentTurn.classList.remove(currentTurnContainer[currentRotation]);
        currentTurn.classList.add(currentTurnContainer[(currentRotation + 1 + nextSkipCount) % currentPlayerCount]);
        if(flg === 1){
            if(positiveSpace.includes(playerposition)){
                buttonMask.classList.add('clickedButton');
                currentTurn.classList.remove(currentTurnContainer[(currentRotation + 1 + nextSkipCount) % currentPlayerCount]);
                currentTurn.classList.add(currentTurnContainer[currentRotation]);
                const randomNumber = Math.floor(Math.random() * 4) + 2;
                setTimeout(() => {
                    alert('+' + randomNumber + 'マス');
                    playerInformation[currentRotation].position = goToSpace(randomNumber, playerInformation[currentRotation].position, playerInformation[currentRotation].piece , 1 ,0, nextSkipCount);
                }, 280);
            }
            if(negativeSpace.includes(playerposition)){
                buttonMask.classList.add('clickedButton');
                currentTurn.classList.remove(currentTurnContainer[(currentRotation + 1 + nextSkipCount) % currentPlayerCount]);
                currentTurn.classList.add(currentTurnContainer[currentRotation]);
                const randomNumber = Math.floor(Math.random() * 3) + 1;
                setTimeout(() => {
                    alert('-' + randomNumber + 'マス');
                    playerInformation[currentRotation].position = goToSpace(randomNumber, playerInformation[currentRotation].position, playerInformation[currentRotation].piece, -1, 0, nextSkipCount);
                }, 280);
            }
        };
    }, 400 * diceResult);
    let returnNumber = playerposition + diceResult * positiveOne_or_negativeOne;
    if(returnNumber <= -1){
        returnNumber = -1;
    };
    return returnNumber;
}