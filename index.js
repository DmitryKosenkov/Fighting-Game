const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
c.imageSmoothingEnabled = false;

const gravity = 0.5
const speed = 10
const flor = 60

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
        x:100,
        y:380
    },
    velocity: {
        x:0,
        y:0
    },
    offset:{
        x:0,
        y:0
    },
    imageSrc: './img/red/red_idle.png',
    framesMax: 8,
    scale: 4,
    offset: {
        x: 16,
        y: 0
    },

    sprites:{
        idle: {
            imageSrc: './img/red/red_idle.png',
            framesMax: 8
        },
        run_foward: {
            imageSrc: './img/red/red_fly_forward.png',
            framesMax: 8
        },
        run_back: {
            imageSrc: './img/red/red_fly_back.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/red/red_jumpp.png',
            framesMax: 8
        },
        attack: {
            imageSrc: './img/red/red_attack.png',
            framesMax: 8
        },
        death: {
            imageSrc: './img/red/red_defeat.png',
            framesMax: 8
        }
    },
    attackBox:{
        offset:{
            x: 74,
            y: 0
        },
        width: 32,
        height: 128

    },
    sounds:{
        attack: './sounds/player/attack.wav',
        hit: './sounds/player/hit.wav',
        jump: './sounds/player/jump.wav',
        dash: './sounds/player/dash.wav'
    }

})


const enemy = new Fighter({
    position:{
        x:824,
        y:380
    },
    velocity: {
        x:0,
        y:0
    },
    color: 'blue',
    offset:{
        x: -50,
        y: 0
    },
    imageSrc: './img/blue/blue_idle.png',
    framesMax: 8,
    scale: 4,
    offset: {
        x: 40,
        y: 0
    },

    sprites:{
        idle: {
            imageSrc: './img/blue/blue_idle.png',
            framesMax: 8
        },
        run_foward: {
            imageSrc: './img/blue/blue_fly_forward.png',
            framesMax: 8
        },
        run_back: {
            imageSrc: './img/blue/blue_fly_back.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/blue/blue_jump.png',
            framesMax: 8
        },
        attack: {
            imageSrc: './img/blue/blue_attack.png',
            framesMax: 8
        },
        death: {
            imageSrc: './img/blue/blue_defeat.png',
            framesMax: 8
        }
    },
    attackBox:{
        offset:{
            x: -42,
            y: 32
        },
        width: 64,
        height: 72

    },
    sounds:{
        attack: './sounds/enemy/attack.wav',
        hit: './sounds/enemy/hit.wav',
        jump: './sounds/enemy/jump.wav',
        dash: './sounds/enemy/dash.wav'
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
    c.fillStyle = 'rgba(0, 0, 255, 0.03)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    
    if (keys.a.pressed && player.lastKey == 'a'){
        player.velocity.x = -speed
        player.switchSprite('run_back')
    } else if(keys.d.pressed && player.lastKey == 'd'){
        player.velocity.x = speed
        player.switchSprite('run_forward')
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0){
        player.switchSprite('jump')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft'){
        enemy.velocity.x = -speed
        enemy.switchSprite('run_forward')
    } else if(keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight'){
        enemy.velocity.x = speed
        enemy.switchSprite('run_back')
    } else {
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }

    // detect for collision
    if (
        rectangualCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.framesCurrent == 4
        ){
            player.isAttacking = false
            enemy.takeHit()
            document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (player.isAttacking && player.framesCurrent == 4){
        player.isAttacking = false
    }

    if (
        rectangualCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent == 4
        ){
            enemy.isAttacking = false
            player.takeHit()
            document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    if (enemy.isAttacking && enemy.framesCurrent == 4){
        enemy.isAttacking = false
    }

    // endgame based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWiner({player, enemy, timerId})
    }

}

animate()

window.addEventListener('keydown', (event)=>{
    if (!player.isDead){
        switch(event.key){
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                if (player.sounds.dash) {
                    player.sounds.dash.currentTime = 0
                    player.sounds.dash.volume = 0.6
                    player.sounds.dash.play()
                }
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                if (player.sounds.dash) {
                    player.sounds.dash.currentTime = 0
                    player.sounds.dash.volume = 0.5
                    player.sounds.dash.play()
                }
                break
            case 'w':
                if (player.position.y == 388)
                    player.velocity.y = -15
                    if (player.sounds.jump) {
                        player.sounds.jump.currentTime = 0
                        player.sounds.jump.volume = 0.5
                        player.sounds.jump.play()
                    }
                break
            case ' ':
                player.attack()
                break
        }
    }
    
    if (!enemy.isDead){
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                if (enemy.sounds.dash) {
                    enemy.sounds.dash.currentTime = 0
                    enemy.sounds.dash.volume = 0.5
                    enemy.sounds.dash.play()
                }
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                if (enemy.sounds.dash) {
                    enemy.sounds.dash.currentTime = 0
                    enemy.sounds.dash.volume = 0.5
                    enemy.sounds.dash.play()
                }
                break
            case 'ArrowUp':
                if (enemy.position.y == 388)
                    enemy.velocity.y = -15
                    if (enemy.sounds.jump) {
                        enemy.sounds.jump.currentTime = 0
                        enemy.sounds.jump.volume = 0.6
                        enemy.sounds.jump.play()
                    }
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
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
