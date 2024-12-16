// if the movement type is a add, we need to hide the from store and quantity fields
document.addEventListener("DOMContentLoaded", () => {
  const itemMovementForm = document.getElementById("itemMovementForm");
  const submitButton = document.getElementById("submitButton");

  const movementType = document.getElementById("movementType");

  itemMovementForm.addEventListener("change", (event) => {
    event.preventDefault();

    if (movementType.value === "add") {
      addMovement();
      return;
    }
    if (movementType.value === "remove") {
      removeMovement();
      return;
    }
    if (movementType.value === "transfer") {
      transferMovement();
      return;
    }
  });
});

const addMovement = () => {
  const fromStoreDiv = document.getElementById("fromStoreDiv");
  const quantityDiv = document.getElementById("quantityDiv");
  const toStoreDiv = document.getElementById("toStoreDiv");
  const itemNameDiv = document.getElementById("itemNameDiv");

  fromStoreDiv.classList.add("hidden");
  quantityDiv.classList.remove("hidden");
  toStoreDiv.classList.remove("hidden");
  itemNameDiv.classList.remove("hidden");
  submitButton.textContent = "Add";

  fromStoreDiv.querySelector("select").setAttribute("required", "false");

  toStoreDiv.querySelector("select").setAttribute("required", "true");
  quantityDiv.querySelector("input").setAttribute("required", "true");
  itemNameDiv.querySelector("select").setAttribute("required", "true");
};

const removeMovement = () => {
  const fromStoreDiv = document.getElementById("fromStoreDiv");
  const quantityDiv = document.getElementById("quantityDiv");
  const toStoreDiv = document.getElementById("toStoreDiv");
  const itemNameDiv = document.getElementById("itemNameDiv");

  fromStoreDiv.classList.remove("hidden");
  quantityDiv.classList.remove("hidden");
  toStoreDiv.classList.add("hidden");
  itemNameDiv.classList.remove("hidden");
  submitButton.textContent = "Remove";

  fromStoreDiv.querySelector("select").setAttribute("required", "true");

  toStoreDiv.querySelector("select").setAttribute("required", "false");
  quantityDiv.querySelector("input").setAttribute("required", "true");
  itemNameDiv.querySelector("select").setAttribute("required", "true");
};

const transferMovement = () => {
  const fromStoreDiv = document.getElementById("fromStoreDiv");
  const quantityDiv = document.getElementById("quantityDiv");
  const toStoreDiv = document.getElementById("toStoreDiv");
  const itemNameDiv = document.getElementById("itemNameDiv");

  fromStoreDiv.classList.remove("hidden");
  quantityDiv.classList.remove("hidden");
  toStoreDiv.classList.remove("hidden");
  itemNameDiv.classList.remove("hidden");
  submitButton.textContent = "Transfer";

  fromStoreDiv.querySelector("select").setAttribute("required", "true");
  toStoreDiv.querySelector("select").setAttribute("required", "true");
  quantityDiv.querySelector("input").setAttribute("required", "true");
  itemNameDiv.querySelector("select").setAttribute("required", "true");

  checkIfSameStore(fromStoreDiv, toStoreDiv);
};

function checkIfSameStore(fromStoreDiv, toStoreDiv) {
  //  selected store in from store should be hidden in to store
  const fromStore = fromStoreDiv.querySelector("select");
  const toStore = toStoreDiv.querySelector("select");
  itemMovementForm.addEventListener("change", (event) => {
    if (fromStore.value === "") {
      return;
    }
    if (toStore.value === "") {
      return;
    }
    if (toStore.value === fromStore.value) {
      alert("You cannot select the same store for both from and to");
      toStore.value = "";
      fromStore.value = "";
      return;
    }
  });
}
