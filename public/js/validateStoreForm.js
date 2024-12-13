const email = document.getElementById("storeEmail");
const emailError = document.getElementById("storeEmailError");
const tel = document.getElementById("storePhone");
const telError = document.getElementById("storePhoneError");
const address = document.getElementById("storeLocation");
const addressError = document.getElementById("storeLocationError");
const name = document.getElementById("storeName");
const nameError = document.getElementById("storeNameError");

email.addEventListener("input", (event) => {
  if (email.validity.valid) {
    emailError.textContent = "";
    email.classList.remove("error");
  } else if (email.validity.typeMismatch) {
    emailError.textContent = "Please enter a valid email address";
    email.classList.add("error");
  } else {
    emailError.textContent = "Please enter an email address";
    email.classList.add("error");
  }
});

const telRegex = /^[0-9]{10}$/;

tel.addEventListener("input", (event) => {
  if (telRegex.test(tel.value)) {
    telError.textContent = "";
    tel.classList.remove("error");
  } else if (tel.validity.typeMismatch) {
    telError.textContent = "Please enter a valid phone number";
    tel.classList.add("error");
  } else if (!telRegex.test(tel.value)) {
    telError.textContent = "Please enter a valid phone number";
    tel.classList.add("error");
  } else {
    telError.textContent = "Please enter a phone number";
    tel.classList.add("error");
  }
});

address.addEventListener("input", (event) => {
  if (address.validity.valid) {
    addressError.textContent = "";
    address.classList.remove("error");
  } else if (address.validity.valueMissing) {
    addressError.textContent = "Please enter an address";
    address.classList.add("error");
  } else {
    addressError.textContent = "Please enter a valid address";
    address.classList.add("error");
  }
});

const checkAllFields = () => {
  if (email.validity.valid && tel.validity.valid && address.validity.valid) {
    console.log("all fields are valid");
    return true;
  }
  console.log("all fields are not valid");
  return false;
};

const form = document.querySelector("#addStoreForm");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (checkAllFields()) {
    form.submit();
  } else {
    console.log("all fields are not valid");
  }
});
