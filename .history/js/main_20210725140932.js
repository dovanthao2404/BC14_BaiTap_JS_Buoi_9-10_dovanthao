
Validtor("#formQLNV")
document.querySelector("#btnThemNV").addEventListener("click", handleAddStaff)

function handleAddStaff() {
  var validation = new Validtor("#formQLNV");
  var data = validation.getData();
  console.log(data)
  if (Object.keys(data).length !== 0) {
    console.log("a");
  }

}
