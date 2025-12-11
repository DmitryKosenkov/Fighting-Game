const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.4
const speed = 10
const flor = 58

const background = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    imageSrc: './img/back/background3.png',
    scale: 4
})

const player = new Fighter({
    position:{
        x:0,
        y:0
    },
    velocity: {
        x:0,
        y:0
    },
    offset:{
        x:0,
        y:0
    }

})


const enemy = new Fighter({
    position:{
        x:400,
        y:100
    },
    velocity: {
        x:0,
        y:0
    },
    color: 'blue',
    offset:{
        x: -50,
        y: 0
    }

})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
}

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0 ,canvas.width, canvas.height)
    background.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    if (keys.a.pressed && player.lastKey == 'a'){
        player.velocity.x = -speed
    }
    else if(keys.d.pressed && player.lastKey == 'd'){
        player.velocity.x = speed
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft'){
        enemy.velocity.x = -speed
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight'){
        enemy.velocity.x = speed
    }

    // detect for collision
    if (
        rectangualCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
        ){
            player.isAttacking = false
            enemy.health -= 20
            document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
        rectangualCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
        ){
            enemy.isAttacking = false
            player.health -= 20
            document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // endgame based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWiner({player, enemy, timerId})
    }

}

animate()

window.addEventListener('keydown', (event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -15
            break
        case ' ':
            player.attack()
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -15
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})

