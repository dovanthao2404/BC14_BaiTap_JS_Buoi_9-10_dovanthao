/**
 * Mục đính: Quản lý các nghiệp vụ liên quan đến lớp Quản lý nhân viên
 * Ngày tạo: 23/7/2021
 * Version: 1.0
 * Người tao: Đỗ Văn Thảo
 */



function StaffManager() {
  this.listStaff =
    JSON.parse(localStorage.getItem("listStaff")) || [];
}

StaffManager.prototype.start = function () {
  if (this.listStaff === []) return;

  this.listStaff = this.listStaff.map(function (staff) {
    var newStaff = new Staff(
      staff.account,
      staff.fullName,
      staff.email,
      staff.password,
      staff.startingDate,
      staff.basicSalary,
      staff.position,
      staff.workingHours
    )
    newStaff.calculationOfSalary();
    newStaff.staffAssessment();

    return newStaff;
  })
}


StaffManager.prototype.saveLocalStorage = function () {
  localStorage.setItem("listStaff", JSON.stringify(this.listStaff));
}


StaffManager.prototype.addStaff = function (staff) {
  staff.calculationOfSalary();
  staff.staffAssessment();
  this.listStaff.push(staff);
  this.saveLocalStorage();
}

StaffManager.prototype.removeStaff = function (account) {
  this.listStaff = this.listStaff.filter(function (staff) {
    return staff.account !== account;
  })
  this.saveLocalStorage();
}

StaffManager.prototype.updateStaff = function (staff) {
  this.listStaff = this.listStaff.map(function (st) {
    if (st.maSV !== staff.maSV) {
      return st;
    }
    return staff;
  });

  this.saveLocalStorage();
}


StaffManager.prototype.calculationOfSalary = function () {
  for (var staff of this.listStaff) {
    staff.calculationOfSalary();
  }
}

StaffManager.prototype.staffAssessment = function () {
  for (var staff of this.listStaff) {
    staff.staffAssessment();
  }
}

StaffManager.prototype.findStaffByClassification = function (classification) {
  var staffTemp = this.listStaff.filter(function (staff, index) {

    classification = classification.trim().toLowerCase();
    var classificaitonStaff = staff.classification.toLowerCase().trim();
    return classificaitonStaff.includes(classification);

  })

  return staffTemp;
}