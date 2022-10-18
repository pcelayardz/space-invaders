const state ={
    // esto da 255, pero para saber de donde sale el numero. si el width es 600 y cada cuadrado dentro del width queremos que sea 40, tendremos 15 cuadrados
    //lo mismo pasa para el height
    numCells:(600/40) * (600/40),
    cells: [],
    shipPosition : 217,
    aliensPositions:[
        3, 4, 5, 6, 7, 8, 9, 10,11,
        18,19,20,21,22,23,24,25,26,
        33,34,35,36,37,38,39,40,41,
        48,49,50,51,52,53,54,55,56
    ],
    gameover : false,
    score:0
}

//*Arrow functions allows a short syntax for writing function expressions.
//*You don't need the function keyword, the return keyword, and the curly brackets.

const  setupGame = (element) => {

    //Guardamos el elemento que estamos poasando a la funcion de forma dinamica para usarlo mas tarde
    state.element = element
    //do all the things needed to draw the game
    //draw the grid
    drawGrid()
    //draw the spaceship
    drawShip()
    //draw the aliens
    drawAliens()
    //add the instructions and the score
    drawScoreboard()
}

//Esta funcion creara el grid y luego lo añadira a la pagina
const drawGrid = () => {
    //Create the containing element
    const grid = document.createElement('div')
    grid.classList.add('grid')
    //Create a lot of cells = 15x15 (255 cells)
    for (let i = 0; i < state.numCells; i++) {
        //create the cell
        const cell = document.createElement('div')
        //append the cell to the grid
        grid.append(cell)
        //store de cell in game state
        state.cells.push(cell)
    }
    //Append the cells to the containing element and the containing element to the app
    state.element.append(grid)
}

const drawShip = () => {
    state.cells[state.shipPosition].classList.add('spaceship')
    //find the bottom row, middle cell (from game state), and a bg image
}

const controlShip = (event) => {
    if(state.gameover){
        return
    }
    if (event.code === 'ArrowLeft'){
        moveShip('left')
    }else if (event.code === 'ArrowRight'){
        moveShip('right')
    }else if(event.code === 'Space'){
        fire()
    }
}

const moveShip = (direction) =>{
    //remove image from current pos
    state.cells[state.shipPosition].classList.remove('spaceship')
    //figure our the delta
    //el porcentaje 15 es para que no se salga del cuadrado del juego que hemos creado
    if (direction === 'left' && state.shipPosition%15 !==0){
        state.shipPosition--
    }else if( direction=== 'right' && state.shipPosition%15 !==14){
        state.shipPosition++
    }
    //add image to new position
    state.cells[state.shipPosition].classList.add('spaceship')
}

const fire = () => {
    //use an interval: run some code repeatedly each time after a specified time
    let interval;
    //laser start at the ship position
    let laserPosition = state.shipPosition
    //esto lo que hace es que cada 100 ms se ejecuta la funcion que esta dentro
    interval = setInterval(() => {
        //remove the saler image
        state.cells[laserPosition].classList.remove('laser')
        //decrease (move up a row) the laser position
        laserPosition-=15
        //check we are still in bounds of the grid
        if(laserPosition < 0){
            clearInterval(interval)
            return 
        }

        //if there's an alien BOOM!
        //clear the interval, remove the alien image, remove the alien from the alien position, add the BOOM image, set a timeout to remove the BOOM image.
        if (state.aliensPositions.includes(laserPosition)) {
            clearInterval(interval)
            state.aliensPositions.splice(state.aliensPositions.indexOf(laserPosition),1)
            state.cells[laserPosition].classList.remove('alien','laser')
            state.cells[laserPosition].classList.add('hit')
            state.score++
            state.scoreElement.innerText = state.score
            setTimeout(() => {
                state.cells[laserPosition].classList.remove('hit')
            })
            return 
        }
        //add the laser image
        state.cells[laserPosition].classList.add('laser')
    }, 100)
}

const drawAliens =() =>{
    //adding the alines to the grid
    //we need to store positios of the aliens in our game state
    state.cells.forEach((cell,index) => {
        //remove any alien images
        if(cell.classList.contains('alien')){
            cell.classList.remove('alien')
        }
        //add the image to the cell if the index is in the set of aliens positions
        if (state.aliensPositions.includes(index)) {
            cell.classList.add('alien')
        }
    })
}

const play = () => {
    //start the march of the aliens
    let interval
    // set starting direction
    let direction = 'right'
    interval = setInterval(()=> {
        let movement

        if (direction === 'right') {
            //but if we are at the edge, increase de position by 15, and move left (-1)
            if(atEdge('right')){
                movement = 15 - 1
                direction='left'
            }else{
                //if right, increase the position by 1,
                movement = 1
            }
        } else if(direction === 'left'){
            // if left in the edge, increase position by 15, and move right (+1)
            if(atEdge('left')){
                movement = 15 + 1
                direction='right'
            }else{
                movement = -1
            }
        }
        //update the alien positions
        state.aliensPositions = state.aliensPositions.map(position => position + movement)
        //redraw aliens on the page
        drawAliens()
        //check the game stage
        checkGameState(interval)
    },400)
    //set up the ship controls
    //*controlShip is not a function call, its a reference call
    window.addEventListener('keydown',controlShip)
}

const atEdge = (side) => {
    //are there any aliens in the left hand column
    if (side === 'left'){
        return state.aliensPositions.some(position => position % 15 === 0)
        //are there any aliens in the right hand column
    }else if (side === 'right' ){
        return state.aliensPositions.some(position => position % 15 === 14)
    }
}

const checkGameState = (interval) => {
    //has the aliens got to the bottom
    //are the aliens all death
    if (state.aliensPositions.length===0) {
        //stop everything
        state.gameover = true
        //stop the interval
        clearInterval(interval)
        drawMessage('HUMAN WINS!')
    }else if(state.aliensPositions.some(position => position >= state.shipPosition)){
        clearInterval(interval)
        state.gameover = true
        //make ship go BOOM!
        //remove the ship image, add the explosion image
        state.cells[state.shipPosition].classList.remove('spaceship')
        state.cells[state.shipPosition].classList.add('hit')
        drawMessage('GAMEOVER!')
    }
}

const drawMessage = (message) => {
    //create a message
    const messageElement = document.createElement('div')
    messageElement.classList.add('message')
    //create the heading text
    const h1 = document.createElement('h1')
    h1.innerText = message
    messageElement.append(h1)
    //append it to the app
    state.element.append(messageElement)
}

const drawScoreboard = () => {
    const heading = document.createElement("h1")
    heading.innerText = 'Space Invaders'
    const paragraph1 = document.createElement("p")
    paragraph1.innerText = 'Press SPACE to shoot.'
    const paragraph2 = document.createElement("p")
    paragraph2.innerText = 'Press ← and → to move'
    const scoreboard = document.createElement('div')
    scoreboard.classList.add('scoreboard')
    const scoreElement = document.createElement('span')
    scoreElement.innerText = state.score
    const heading3 = document.createElement('h3')
    heading3.innerText = 'Score: '
    heading3.append(scoreElement)
    scoreboard.append(heading, paragraph1, paragraph2, heading3)
  
    state.scoreElement = scoreElement
    state.element.append(scoreboard)
  }
//*The Document method querySelector() returns the first Element
//*within the document that matches the specified selector, or group of selectors. 
//*If no matches are found, null is returned. 

//query the page for the place to insert my game
const appElement = document.querySelector('.app')

//do all the things needed to draw the game
setupGame(appElement)

//play the game - staret being able to move the ship, move aliens ... 
play()