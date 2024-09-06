class GridElement {
  //Class for any grid element
  constructor(id, elementSymbol, className, parentGrid) {
    //constructor function, crucial for any class
    this.id = id; //id of each element
    this.elementSymbol = elementSymbol; //symbol of each element
    this.className = className; //class of each element
    this.parentGrid = parentGrid; //grid parent
    this.element = document.createElement("div"); //element creation with a corresponding function

    this.setupElement();
  }

  setupElement() {
    //element's values setup
    this.element.textContent = this.elementSymbol; //adding the suit to each element
    this.element.id = this.id;
    this.element.className = this.className;
    this.element.addEventListener(
      "click",
      () => this.parentGrid.removeAdjacentElements(this.id) //this, and adjacend elements remove with this function
    );
  }

  appendToGrid(gridContainer) {
    //function used for adding this element to a parent grid
    gridContainer.appendChild(this.element);
  }

  clearContent() {
    //clears this element's background and text content

    this.element.textContent = "";
    this.element.style.transition = "background-color 300ms ease-in-out"; //adding animation to the background's change
    this.element.style.backgroundColor = "transparent";
  }
}

class Grid {
  //class for the grid
  constructor(width, height, elements, gridSelector) {
    this.width = width; //width of the grid (measures in elements)
    this.height = height; //height of the grid
    this.elements = elements; //possible text content for each element of the grid
    this.grid = document.querySelector(gridSelector); //selection of the grid in html
    this.gridElements = []; //array of elements of the grid
  }

  getRandomElement() {
    //function which sets a random suit for each element
    const randomSymbol =
      this.elements[Math.floor(Math.random() * this.elements.length)]; //choosing a random suit for this element's text content
    let className;

    switch (
      randomSymbol //switch case used to set a specific class to this element according to it's text content
    ) {
      case "♣":
        className = "element clubs";
        break;
      case "♦":
        className = "element diamonds";
        break;
      case "💓":
        className = "element hearts";
        break;
      case "♠":
        className = "element spades";
        break;
      default:
        className = "element";
    }

    return { symbol: randomSymbol, className: className }; //returns the random symbol used in a text content and the corresponding class
  }

  addElement(i) {
    //function used to add element to a grid
    const { symbol, className } = this.getRandomElement(); //getting element's data
    const gridElement = new GridElement(i, symbol, className, this); //creating an instance of class GridElement
    gridElement.appendToGrid(this.grid); //appending the element to the grid
    this.gridElements[i] = gridElement; //saves this element to the array of elements
  }

  createGrid() {
    //create grid by adding elements via for() loop
    for (let i = 0; i < this.width * this.height; i++) {
      this.addElement(i);
    }
  }

  getAdjacentIndexes(index) {
    //getting indexes of the adjacent elements of the pressed element
    const indexes = []; //array of adjacent elements
    const x = index % this.width; //x coordinate of the element (e.g, index=23, width=10, 23%10=3)
    const y = Math.floor(index / this.width); //y coordinate of the element (e.g index=23, width=10, 23/10=2.3, which rounds to 2)

    const neighbors = [
      //array, which contains possible adjacent elements aka neighbors
      { dx: -1, dy: 0 }, //neighbor on the left (e.g x=3, his left neighbor has x=2 coordinate)
      { dx: 1, dy: 0 }, //neighbor on the right (e.g x=3, his right neighbor has x=4 coordinate)
      { dx: 0, dy: -1 }, //neighbor on the top (e.g y=2, his top neighbor has y=1 coordinate)
      { dx: 0, dy: 1 }, //neighbor on the top (e.g y=2, his top neighbor has y=3 coordinate)
    ];

    for (const neighbor of neighbors) {
      //loop which checks every neighbors[] element
      const newX = x + neighbor.dx; //creating the new coordinates x,y for the adjacent element
      const newY = y + neighbor.dy;
      const newIndex = newY * this.width + newX; //calculating the index of the neighbor (e.g newY=4, newX=5, newY * this.width + newX=4*10+5=45 )
      //checking if the neighbor is within the grid borders
      if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height) {
        indexes.push(newIndex); //adding the index of the neighbor to the array
      }
    }

    return indexes; //returning the array of all the neighbors of this element
  }
  //function used to remove all the suitable neighbors
  removeAdjacentElements(index) {
    const clickedElement = this.gridElements[index]; //finding the chosen element via its id
    const clickedClass = clickedElement.className; //getting the class name of the clicked element

    const queue = [index]; //queue for all the indexes of the element and it's neighbors
    const visited = new Set(); //set for all the already checked elements to avoid infinite loop
    const queueSet = new Set(); //set to avoid adding the same index to queue[] several times

    while (queue.length > 0) {
      //loop which works as long as it has elements in the array

      const currentIndex = queue.shift(); //taking the first element from the array
      const currentElement = this.gridElements[currentIndex]; //getting the element with the index from the queue[]

      if (!currentElement || visited.has(currentIndex)) {
        //check if the element was already visited
        continue;
      }

      visited.add(currentIndex); // adding a checked index to the visited[] array

      if (currentElement.className === clickedClass) {
        //checking if the current element has the same class as the clicked element's class
        currentElement.clearContent(); //clearing the text content of current element

        const adjacentIndexes = this.getAdjacentIndexes(currentIndex); //getting adjacent indexes

        adjacentIndexes.forEach((adjIndex) => {
          //adding only adjacent indexes which have the same class and weren't added to the queue yet
          const adjElement = this.gridElements[adjIndex];
          if (
            adjElement &&
            adjElement.className === clickedClass &&
            !visited.has(adjIndex) &&
            !queueSet.has(adjIndex)
          ) {
            queue.push(adjIndex); //pushing the index to the queue
            queueSet.add(adjIndex); //adding the index to queueSet so it can't be added once again
          }
        });
      }
    }
  }
}

const grid = new Grid(10, 10, ["♣", "♦", "💓", "♠"], ".grid"); //creating a grid instance
grid.createGrid(); //creating a grid and it's elements
