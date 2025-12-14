class Sprite{
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}){
        this.position = position
        this.width = 50
        this.height = 100
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.offset = offset
    }

    draw(){
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax) ,
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
            )
    }

    animateFrames(){
        this.framesElapsed++
        
        if (this.framesElapsed % this.framesHold === 0){
            if (this.framesCurrent < this.framesMax - 1){
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update(){
        this.draw()
        this.animateFrames()

    }

}

class Fighter extends Sprite{
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {x: 0, y: 0},
        sprites,
        attackBox = {offset: {}, width: undefined, height: undefined},
        sounds = {attack: null, hit: null, jump: null, dash: null}
    }){
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset, 
        })

        this.velocity = velocity
        this.width = 64
        this.height = 128
        this.lastKey
        this.attackBox = {
            position:{
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 3
        this.sprites = sprites
        this.isDead = false

        for(const sprite in sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

        this.sounds = {
            attack: sounds.attack ? new Audio(sounds.attack) : null,
            hit: sounds.hit ? new Audio(sounds.hit) : null,
            jump: sounds.jump ? new Audio(sounds.jump) : null,
            dash: sounds.dash ? new Audio(sounds.dash) : null
        }
        
    }

    drawCollisions(){
        c.fillStyle = this.color
        c.globalAlpha = 0.5
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        if (!this.isDead)
            this.animateFrames()
        
        this.drawCollisions()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - flor){
            this.velocity.y = 0
        }
        else{
            this.velocity.y += gravity
        }
    }

    attack(){
        this.switchSprite('attack')
        this.isAttacking = true

        if (this.sounds.attack) {
            this.sounds.attack.currentTime = 0
            this.sounds.attack.volume = 0.4
            this.sounds.attack.play()
        }

        setTimeout(() => {
            this.isAttacking = false
        }, 500)
    }

    takeHit(){
        this.health -= 20

        if (this.sounds.hit) {
            this.sounds.hit.currentTime = 0
            this.sounds.hit.volume = 0.8
            this.sounds.hit.play()
        }
    
        if (this.health <= 0){
            this.switchSprite('death')
        }
    }

    switchSprite(sprite){
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.isDead = true
            return}
        if (this.image === this.sprites.attack.image && this.framesCurrent < this.sprites.attack.framesMax - 1) return
        switch (sprite) {
            case 'idle':
                if(this.image != this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.framesCurrent = 0
                }
                break
            case 'run_forward':
                if (this.image != this.sprites.run_foward.image){
                    this.image = this.sprites.run_foward.image
                    this.framesCurrent = 0
                }
                break
            case 'run_back':
                if (this.image = this.sprites.run_back.image){
                    this.image = this.sprites.run_back.image
                    this.framesCurrent = 0
                } 
                break
            case 'jump':
                if (this.image != this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesCurrent = 0
                } 
                break
            case 'attack':
                if (this.image != this.sprites.attack.image){
                    this.image = this.sprites.attack.image
                    this.framesCurrent = 0
                } 
                break
            case 'death':
                if (this.image != this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.framesCurrent = 0
                } 
                break
        }
    }
}