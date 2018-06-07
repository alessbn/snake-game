;(function(){
	class Random{
		static get(start,end){
			return Math.floor(Math.random() * end) + start
		}
	}

	class Square{
		constructor(x,y){
			this.x = x
			this.y = y
			this.width = 10
			this.height = 10
			this.tail = null
		}

		draw(){
			ctx.fillRect(this.x,this.y,this.width,this.height)
			if(this.hasTail()){
				this.tail.draw()
			}
		}

		add(){
			if(this.hasTail()) return this.tail.add();
			this.tail = new Square(this.x,this.y)
		}

		hasTail(){
			return this.tail !== null
		}

		copy(){
			if(this.hasTail()){
				this.tail.copy()
				this.tail.x = this.x
				this.tail.y = this.y
			}
		}

		right(){
			this.copy()
			this.x += 10
		}

		left(){
			this.copy()
			this.x -= 10
		}

		up(){
			this.copy()
			this.y -= 10
		}

		down(){
			this.copy()
			this.y += 10
		}

		hit(head,second=false){
			if(this === head && !this.hasTail()) return false
			if(this === head) return this.tail.hit(head,true)
			if(second && !this.hasTail()) return false
			if(second) return this.tail.hit(head)
			if(this.hasTail()){
				return snakeHit(this,head) || this.tail.hit(head)
			}
			return snakeHit(this,head)
		}

		hitBorder(){
			return this.x > 480 || this.x < 0 || this.y > 280 || this.y < 0
		}
	}

	class Snake{
		constructor(){
			this.head = new Square(100,0)
			this.draw()
			this.direction = "right"
			this.head.add()
			this.head.add()
			this.head.add()
			this.head.add()
		}

		draw(){
			this.head.draw()
		}

		right(){
			if(this.direction === "left") return
			this.direction = "right"
		}

		left(){
			if(this.direction === "right") return
			this.direction = "left"
		}

		up(){
			if(this.direction === "down") return
			this.direction = "up"
		}

		down(){
			if(this.direction === "up") return
			this.direction = "down"
		}

		move(){
			if (this.direction === "right") return this.head.right()
			if (this.direction === "left") return this.head.left()
			if (this.direction === "up") return this.head.up()
			if (this.direction === "down") return this.head.down()
		}

		eat(){
			this.head.add()
		}

		dead(){
			return this.head.hit(this.head) || this.head.hitBorder()
		}
	}


	class Food{
		constructor(x,y){
			this.x = x
			this.y = y
			this.width = 10
			this.height = 10
		}

		draw(){
			ctx.fillRect(this.x,this.y,this.width,this.height)
		}

		static generate(){
			return new Food(Random.get(0,490),Random.get(0,290))
		}
	}


	const canvas = document.getElementById('canvas')
	const ctx = canvas.getContext('2d')
	const snake = new Snake()
	let foods = []
	window.addEventListener("keydown", function(ev){
		if(ev.KeyCode > 36 && ev.KeyCode < 41) ev.preventDefault()
		if(ev.keyCode === 39) return snake.right();
		if(ev.keyCode === 37) return snake.left();
		if(ev.keyCode === 38) return snake.up();
		if(ev.keyCode === 40) return snake.down();
		return false
	})

	const animation = setInterval(function(){
		snake.move()
		ctx.clearRect(0,0,canvas.width,canvas.height)
		snake.draw()
		drawFood()

		if(snake.dead()){
			console.log("Game Over")
			window.clearInterval(animation)
		}
	},1000/5)

	setInterval(function(){
		const food = Food.generate()
		foods.push(food)
		setTimeout(function(){
			removeFromFoods(food)
		},10000)
	},4000)

	function drawFood() {
		for(const index in foods){
			const food = foods[index]
			if(typeof food !== "undefined") {
				food.draw()
				if(hit(food,snake.head)){
					snake.eat()
					removeFromFoods(food)
				}
			}
		}
	}

	function removeFromFoods(food){
		foods = foods.filter(function(f){
			return food !== f
		})
	}

	function snakeHit(square_one, square_two){
		return square_one.x == square_two.x && square_one.y == square_two.y
	}

	function hit(a,b){
		var hit = false;
		//Horizontal collision
		if(b.x + b.width >= a.x && b.x < a.x + a.width){
			//Vertical collision
			if(b.y + b.height >= a.y && b.y < a.y + a.height)
				hit = true;
		}
		//Collision between a and b
		if(b.x <= a.x && b.x + b.width >= a.x + a.width){
			if(b.y <= a.y && b.y + b.height >= a.y + a.height)
				hit = true;
		}
		return hit;
	}
})()
