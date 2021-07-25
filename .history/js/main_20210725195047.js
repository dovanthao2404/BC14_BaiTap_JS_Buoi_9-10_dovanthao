var staffManager = new StaffManager();
staffManager.start();
var pwdPage = 1;
showListStaff(staffManager.listStaff)
new Validator("#formQLNV");

document.querySelector("#btnThem").addEventListener("click", function () {
  updateForm();
  removeMessage();
  callModal("Thêm nhân viên", false, 1);
})
document.querySelector("#btnThemNV").addEventListener("click", handleAddStaff)
document.querySelector("#btnThemNV").addEventListener("click", handleUpdateStaff)
document.querySelector("#tableDanhSach").addEventListener("click", function (e) {
  delegationTable(e);
})

function handleAddStaff() {
  var validation = new Validator("#formQLNV");
  var data = validation.getDataUpdate();
  var staff = null;
  if (Object.keys(data).length !== 0) {
    var dataStaff = [];
    var count = 0;
    for (var key in data) {
      dataStaff[count] = data[key];
      count++;
    }
    staff = new Staff(...dataStaff)
  }
}

function handleUpdateStaff() {
  var validation = new Validator("#formQLNV");
  var data = validation.getData();

  if (Object.keys(data).length !== 0) {
    var dataStaff = [];
    var count = 0;
    for (var key in data) {
      dataStaff[count] = data[key];
      count++;
    }
    var staff = new Staff(...dataStaff)
    staffManager.addStaff(staff);
    showListStaff(staffManager.listStaff);
  }
}

document.querySelector("#ulPhanTrang").addEventListener("click", function (event) {
  if (event.target.id.includes("page")) {
    var numberId = event.target.id.split("-");
    pwdPage = numberId[1];
    showListStaff(staffManager.listStaff);
  }
})

function showListStaff(listStaff) {
  var ulPagination = document.querySelector("#ulPhanTrang");
  var htmlUlPagination = '';
  var totalStaff = listStaff.length;
  var row = 2;
  var totalPages = Math.ceil(listStaff.length / row);
  for (var i = 1; i <= totalPages; i++) {
    htmlUlPagination += `
    <li class="page-item">
      <a class="page-link" id="page-${i}">${i}</a>
    </li>`
  }
  ulPagination.innerHTML = htmlUlPagination;

  var rowStart = (pwdPage - 1) * row;
  var rowEnd = pwdPage * row;
  if (totalStaff < rowEnd) {
    rowEnd = totalStaff;
  }

  var tbody = document.querySelector("#tableDanhSach");


  var html = '';
  for (var i = rowStart; i < rowEnd; i++) {
    html += `
    <tr>
      <th>${listStaff[i].account}</th>
      <th>${listStaff[i].fullName}</th>
      <th>${listStaff[i].email}</th>
      <th>${listStaff[i].startingDate}</th>
      <th>${listStaff[i].position}</th>
      <th>${listStaff[i].totalSalary}</th>
      <th>${listStaff[i].classification}</th>
      <th>

        <div class="input-group-prepend" id="button-addon3">
        <button class="btn btn-warning" data-toggle="modal" data-target="#myModal" data-action="change" data-account="${listStaff[i].account}">Sửa</button>
        <button class="btn btn-danger" data-action="delete" data-account="${listStaff[i].account}">Xóa</button>

        </div>
      </th>
    </tr>
    `
  }

  tbody.innerHTML = html;
}

function updateForm(staff) {
  var inputs = document.querySelectorAll("[name][rules]")

  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].name !== "ngaylam" && !staff) {
      inputs[i].value = "";
    }
    if (staff) {
      inputs[i].value = staff.arrayProperties[i];
    }
  }
}

function getParent(element, selector) {
  while (element.parentElement) {
    if (element.parentElement.matches(selector)) {
      return element.parentElement;
    }
    element = element.parentElement;
  }
}

function removeMessage() {
  var inputs = document.querySelectorAll("[name][rules]");
  var lengthInputs = inputs.length;
  for (var i = 0; i < lengthInputs; i++) {
    var formGroup = getParent(inputs[i], ".form-group");
    var messageElement = formGroup.querySelector(".form-message");
    messageElement.innerText = "";
  }
}

function callModal(title, readonly, type) {
  document.querySelector("#header-title").innerText = title;
  if (readonly) {
    document.querySelector("#tknv").setAttribute("disable", "");
  } else {
    document.querySelector("#tknv").removeAttribute("disable");
  }
  if (type === 1) {
    document.querySelector("#btnThemNV").style.display = "block";
    document.querySelector("#btnCapNhat").style.display = "none";
  } else {
    document.querySelector("#btnThemNV").style.display = "none";
    document.querySelector("#btnCapNhat").style.display = "block";
  }
}

function delegationTable(e) {
  var action = e.target.getAttribute("data-action");
  var account = e.target.getAttribute("data-account");
  if (action === "delete") {
    staffManager.removeStaff(account);
    pwdPage = 1;
    showListStaff(staffManager.listStaff);
  }
  if (action === "change") {
    callModal("Sửa nhân viên", true, 2);
    staff = staffManager.listStaff.find((staff) => staff.account === account)
    updateForm(staff)
  }
}