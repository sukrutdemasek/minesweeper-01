class GridElement {
  constructor(id, elementSymbol, className, parentGrid) {
    this.id = id;
    this.elementSymbol = elementSymbol;
    this.className = className;
    this.parentGrid = parentGrid;
    this.element = document.createElement("div");

    this.setupElement();
  }

  setupElement() {
    this.element.textContent = this.elementSymbol;
    this.element.id = this.id;
    this.element.className = this.className;
    this.element.addEventListener("click", () =>
      this.parentGrid.removeAdjacentElements(this.id)
    );
  }

  appendToGrid(gridContainer) {
    gridContainer.appendChild(this.element);
  }

  clearContent() {
    this.element.textContent = "";
  }
}

class Grid {
  constructor(width, height, elements, gridSelector) {
    this.width = width;
    this.height = height;
    this.elements = elements;
    this.grid = document.querySelector(gridSelector);
    this.gridElements = [];
  }

  getRandomElement() {
    const randomSymbol =
      this.elements[Math.floor(Math.random() * this.elements.length)];
    let className;

    switch (randomSymbol) {
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

    return { symbol: randomSymbol, className: className };
  }

  addElement(i) {
    const { symbol, className } = this.getRandomElement();
    const gridElement = new GridElement(i, symbol, className, this);
    gridElement.appendToGrid(this.grid);
    this.gridElements[i] = gridElement;
  }

  createGrid() {
    for (let i = 0; i < this.width * this.height; i++) {
      this.addElement(i);
    }
  }

  getAdjacentIndexes(index) {
    const indexes = [];
    const x = index % this.width;
    const y = Math.floor(index / this.width);

    const neighbors = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
    ];

    for (const neighbor of neighbors) {
      const newX = x + neighbor.dx;
      const newY = y + neighbor.dy;
      const newIndex = newY * this.width + newX;

      if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height) {
        indexes.push(newIndex);
      }
    }

    return indexes;
  }

  removeAdjacentElements(index) {
    const clickedElement = this.gridElements[index];
    const clickedClass = clickedElement.className;

    const queue = [index];
    const visited = new Set();

    while (queue.length > 0) {
      const currentIndex = queue.shift();
      const currentElement = this.gridElements[currentIndex];

      if (!currentElement || visited.has(currentIndex)) {
        continue;
      }

      visited.add(currentIndex);

      if (currentElement.className === clickedClass) {
        currentElement.clearContent();

        const adjacentIndexes = this.getAdjacentIndexes(currentIndex);
        queue.push(...adjacentIndexes);
      }
    }
  }
}

const grid = new Grid(10, 10, ["♣", "♦", "💓", "♠"], ".grid");
grid.createGrid();
