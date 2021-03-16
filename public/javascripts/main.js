const createBtn = document.querySelector(".create-btn");
const overlay = document.querySelector(".overlay");
const listNameInput = document.querySelector(".list-name-input-container");

function toggleOverlay(){
   overlay.toggleAttribute("hidden");
   listNameInput.toggleAttribute("hidden");

};

createBtn.addEventListener("click", toggleOverlay);
overlay.addEventListener("click", toggleOverlay);
