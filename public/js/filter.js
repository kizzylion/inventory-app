const filterButton = document.getElementById("filterButton");

const filtersBar = document.getElementById("filtersBar");

filterButton.addEventListener("click", () => {
  filtersBar.classList.toggle("hidden");
});
