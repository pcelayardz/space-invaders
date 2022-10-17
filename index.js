const state ={
    // esto da 255, pero para saber de donde sale el numero. si el width es 600 y cada cuadrado dentro del width queremos que sea 40, tendremos 15 cuadrados
    //lo mismo pasa para el height
    numCells:(600/40) * (600/40),
    cells: [],
    shipPosition : 217
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
    //add the instructions and the score
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
        //add the laser image
        state.cells[laserPosition].classList.add('laser')
    }, 100)
}

const play = () => {
    //set up the ship controls
    //*controlShip is not a function call, its a reference call
    window.addEventListener('keydown',controlShip)
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