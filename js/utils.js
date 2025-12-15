function rectangualCollision({rectangle1, rectangle2}){
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

function determineWiner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    gameState = GAME_STATE.OVER

    const displayText = document.querySelector('#displayText')
    displayText.style.display = 'flex'

    player.isAttacking = false
    enemy.isAttacking = false

    player.roundOver = true
    enemy.roundOver = true

    if (player.health === enemy.health) {
        displayText.innerText = 'DRAW'
        player.switchSprite('death')
        enemy.switchSprite('death')
    } else if (player.health > enemy.health) {
        displayText.innerText = 'PLAYER 1 WINS'
        enemy.switchSprite('death')
        player.switchSprite('idle')
    } else {
        displayText.innerText = 'PLAYER 2 WINS'
        player.switchSprite('death')
        enemy.switchSprite('idle')
    }

    setTimeout(() => {
        displayText.innerText = 'RESTART(PRESS ENTER)'
    }, 2500)
}






let timer = 30
let timerId
function decreaseTimer(){
    if (timer > 0){
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector("#timer").innerHTML = timer
    }
    if (timer == 0){
   
        determineWiner({player, enemy, timerId})
    }
    
}

const displayText = document.querySelector('#displayText')
displayText.style.display = 'flex'
displayText.innerText = 'PRESS ENTER TO START'

const GAME_STATE = {
    IDLE: 'idle',
    COUNTDOWN: 'countdown',
    PLAYING: 'playing',
    OVER: 'over'
}

let gameState = GAME_STATE.IDLE
let countdown = 3



function startCountdown() {
    gameState = GAME_STATE.COUNTDOWN

    const displayText = document.querySelector('#displayText')
    displayText.style.display = 'flex'
    displayText.innerText = countdown

    const interval = setInterval(() => {
        countdown--

        if (countdown > 0) {
            displayText.innerText = countdown
        } else {
            clearInterval(interval)
            displayText.style.display = 'none'
            startGame()
        }
    }, 1000)
}



