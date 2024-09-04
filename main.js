let gridParams = {
  width: 10,
  height: 10,
  elements: ["♣", "♦", "💓", "♠"],
  grid: document.querySelector(".grid"),
  addElements() {
    let gridElement = document.createElement("div");

    gridElement.textContent =
      this.elements[Math.floor(Math.random() * this.elements.length)];
    switch (gridElement.textContent) {
      case "♣":
        gridElement.className = "element clubs";
        break;
      case "♦":
        gridElement.className = "element diamonds";
        break;
      case "💓":
        gridElement.className = "element hearts";
        break;
      case "♠":
        gridElement.className = "element spades";
        break;
      default:
        gridElement.className = "element";
    }
    this.grid.appendChild(gridElement);
  },
};
gridParams.addElements();

function createGrid() {
  for (let i = 1; i < gridParams.width * gridParams.height; i++) {
    gridParams.addElements();
  }
}
createGrid();
