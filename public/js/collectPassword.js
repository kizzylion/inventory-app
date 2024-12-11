function collectPassword(event, inputId) {
  console.log(event);
  let password = prompt("Enter admin password to perform this action");

  if (!password) {
    alert("Password is required to perform this action");
    return false;
  }
  document.getElementById(inputId).value = password;
  return true;
}
