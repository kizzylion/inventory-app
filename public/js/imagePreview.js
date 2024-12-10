const imagePreview = document.getElementById("imagePreview");
const imageInput = document.getElementById("image");

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  console.log(file);
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
  }
});
