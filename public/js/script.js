document.addEventListener("DOMContentLoaded", () => {
  toggleSidenav();
});

function toggleSidenav() {
  let toggleSidenav = document.getElementById("toggle-sidenav");
  let closeToggleSidenav = document.getElementById("close-toggle-sidenav");
  let sidenavNav = document.getElementById("sidenav-nav");

  toggleSidenav.addEventListener("click", () => {
    closeToggleSidenav.classList.remove("hidden");
    toggleSidenav.classList.add("hidden");
    sidenavNav.classList.remove("hidden");
    sidenavNav.classList.remove("-translate-x-full");
    sidenavNav.classList.add("translate-x-0");
  });

  closeToggleSidenav.addEventListener("click", () => {
    closeToggleSidenav.classList.add("hidden");
    toggleSidenav.classList.remove("hidden");
    sidenavNav.classList.remove("translate-x-0");
    sidenavNav.classList.add("-translate-x-full");
  });
}
