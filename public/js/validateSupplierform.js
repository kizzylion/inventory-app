// client side validation
// Add the JavaScript code that checks validation as the user progresses through the form. When a user leaves a form field, it should automatically validate that field.
// Test out all possible cases.

const email = document.getElementById("supplierEmail");
const emailError = document.getElementById("supplierEmailError");
const tel = document.getElementById("supplierTel");
const telError = document.getElementById("supplierTelError");
const address = document.getElementById("supplierAddress");
const addressError = document.getElementById("supplierAddressError");
const name = document.getElementById("supplierName");
const nameError = document.getElementById("supplierNameError");

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
  if (tel.validity.valid) {
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

// check if all fields are valid
const checkAllFields = () => {
  if (email.validity.valid && tel.validity.valid && address.validity.valid) {
    console.log("all fields are valid");
    return true;
  }
  console.log("all fields are not valid");
  return false;
};

// add event listener to the form
const form = document.querySelector("#addSupplierForm");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (checkAllFields()) {
    form.submit();
  } else {
    console.log("all fields are not valid");
  }
});
