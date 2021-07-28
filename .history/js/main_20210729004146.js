var staffManager = new StaffManager();
staffManager.start();
var pwdPage = 1;
showListStaff(staffManager.listStaff)
new Validator("#formQLNV");
var listStaffFinded;
// Hien thi modal
document.querySelector("#btnThem").addEventListener("click", function () {
  callModal("Thêm nhân viên", false, 1);
  updateForm();
})

// Nhấn vào button thêm nhân viên
document.querySelector("#btnThemNV").addEventListener("click", handleAddStaff)

// Nhấn vào button cập nhật nhân viên
document.querySelector("#btnCapNhat").addEventListener("click", handleUpdateStaff)

// Xử lý khi nhấn vào table
document.querySelector("#tableDanhSach").addEventListener("click", function (e) {
  delegationTable(e);
})

// Xử lý chuyển trang
document.querySelector("#ulPhanTrang").addEventListener("click", function (event) {
  var findStaff = document.querySelector("#searchName").value;
  if (findStaff) {
    if (event.target.id.includes("page")) {
      var numberId = event.target.id.split("-");
      pwdPage = numberId[1];
      findStaffByClassification(pwdPage);
    }
  } else {
    if (event.target.id.includes("page")) {
      var numberId = event.target.id.split("-");
      pwdPage = numberId[1];
      showListStaff(staffManager.listStaff);
    }
  }
})

document.querySelector("#btnTimNV").addEventListener("click", function () {
  findStaffByClassification(1)
})
document.querySelector("#searchName").addEventListener("input", function () {
  findStaffByClassification(1)
})

// Xử lý thêm nhân viên
function handleAddStaff() {
  var validation = new Validator("#formQLNV");
  var data = validation.getData();
  if (data !== undefined) {
    var dataStaff = [];
    var count = 0;
    for (var key in data) {
      dataStaff[count] = data[key];
      count++;
    }
    var staff = new Staff(...dataStaff)
    staffManager.addStaff(staff);
    showListStaff(staffManager.listStaff);
    updateForm()
    document.querySelector("#searchName").value = "";
  }
}

// Xử lý cập nhật nhân viên
function handleUpdateStaff() {

  var validation = new Validator("#formQLNV");
  var data = validation.getDataUpdate();
  var staff = null;
  var account = document.querySelector("#tknv").value;
  if (data !== undefined) {
    var dataStaff = [];
    var count = 0;
    for (var key in data) {
      dataStaff[count] = data[key];
      count++;
    }
    staff = new Staff(account, ...dataStaff)
    staff.calculationOfSalary();
    staff.staffAssessment();
    if (staff) {
      var findStaff = document.querySelector("#searchName").value;
      staffManager.updateStaff(staff);
      if (findStaff) {

        /**
         * Hiện tại e đang để 2 row 1 trang cho nên đoạn code dưới này có thể chạy được :)))
         * E nghĩ đúng hơn thì phải là dòng đầu tiên và là phần tử cuối cùng của màng còn (listStaffFinded.length - 1) % 2 === 0 chỉ có thể áp dụng cho page có 2 trang.
         *
         *
         */

        if (listStaffFinded) {
          var classification = staff.classification;
          var lastAccountFind = listStaffFinded[listStaffFinded.length - 1].account;

          if (account === lastAccountFind &&
            (listStaffFinded.length - 1) % 2 === 0 &&
            classification !== listStaffFinded[listStaffFinded.length - 1].classification) {
            pwdPage -= 1;
          }
        }
        if (pwdPage >= 1) {
          findStaffByClassification(pwdPage);
        } else {
          console.log("a");
          showListStaff([]);
        }

        document.querySelector('#btnDong').click();
      } else {
        showListStaff(staffManager.listStaff);
        document.querySelector('#btnDong').click();
      }
    }
  }

}


// Show danh sách nhân viên ra màn hình
function showListStaff(listStaff) {

  var html = '';
  var htmlUlPagination = '';

  var tbody = document.querySelector("#tableDanhSach");
  var ulPagination = document.querySelector("#ulPhanTrang");

  if (listStaff.length > 0) {
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
  }

  tbody.innerHTML = html;
  if (pwdPage < 1) {
    ulPagination.innerHTML = "";
  }
}

// Update form
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
  removeMessage();
}

// Lấy phần tử cha
function getParent(element, selector) {
  while (element.parentElement) {
    if (element.parentElement.matches(selector)) {
      return element.parentElement;
    }
    element = element.parentElement;
  }
}

// Xóa message()
function removeMessage() {
  var inputs = document.querySelectorAll("[name][rules]");
  var lengthInputs = inputs.length;
  for (var i = 0; i < lengthInputs; i++) {
    var formGroup = getParent(inputs[i], ".form-group");
    var messageElement = formGroup.querySelector(".form-message");
    messageElement.innerText = "";
  }
}

// Hiện thị modal
function callModal(title, readonly, type) {
  document.querySelector("#header-title").innerText = title;
  if (readonly) {
    document.querySelector("#tknv").setAttribute("disabled", "");
  } else {
    document.querySelector("#tknv").removeAttribute("disabled");
  }
  if (type === 1) {
    document.querySelector("#btnThemNV").style.display = "block";
    document.querySelector("#btnCapNhat").style.display = "none";
  } else {
    document.querySelector("#btnThemNV").style.display = "none";
    document.querySelector("#btnCapNhat").style.display = "block";
  }
}

// Xử lý khi nhấn vào table
function delegationTable(e) {
  var action = e.target.getAttribute("data-action");
  var account = e.target.getAttribute("data-account");
  if (action === "delete") {
    staffManager.removeStaff(account);

    if (staffManager.listStaff.length > 0) {
      pwdPage = 1;
      showListStaff(staffManager.listStaff);
    } else {
      showListStaff([])
    }
    document.querySelector("#searchName").value = "";

  }
  if (action === "change") {
    callModal("Sửa nhân viên", true, 2);
    staff = staffManager.listStaff.find((staff) => staff.account === account)
    updateForm(staff)
  }
}

// Tim nhan vien theo xep loai
function findStaffByClassification(page) {

  var content = document.querySelector("#searchName").value;
  listStaffFinded = staffManager.findStaffByClassification(content);

  pwdPage = page;
  showListStaff(listStaffFinded);

}