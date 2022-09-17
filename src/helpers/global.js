import Swal from "sweetalert2";
export const Global = {
  // #region Urls
  // appBaseUrl: "https://dmeet.dreamplesk.com/public/api/",
  // profileImageUrl:
  //   "https://dmeet.dreamplesk.com/public/storage/profile_images/",
  // #endregion

  // // // #region Urls
  appBaseUrl: "https://gbscuat.dreamplesk.com/public/api/",

  profileImageUrl:
    "https://gbscuat.dreamplesk.com/public/storage/user_profile_pic/",

  medicineDocsUrl:
  "https://gbscuat.dreamplesk.com/public/storage/prescription_doc/",

  testDocsUrl:
  "https://gbscuat.dreamplesk.com/public/storage/book_test_doc/",
  // // // #endregion

  // server url
  //appBaseUrl:'http://139.59.68.79:82/api/inventory/',
  // #region Get Base Url
  getBaseUrl() {
    return this.appBaseUrl;
  },
  // #endregion

  // #region Error alert
  showErrorAlert(isToast, icon, text) {
    let content = "<strong><font color='white'>" + text + "</font></strong>";
    Swal.fire({
      toast: isToast,
      position: "top-end",
      icon: icon,
      html: content,
      iconColor: "white",
      showConfirmButton: false,
      timer: 3500,
      background: "red",
    });
  },
  // #endregion

  // #region Success alert
  showSuccessAlert(isToast, icon, text) {
    var content = "<strong><font color='white'>" + text + "</font></strong>";
    Swal.fire({
      toast: isToast,
      position: "top-end",
      icon: icon,
      html: content,
      iconColor: "white",
      showConfirmButton: false,
      timer: 3500,
      background: "green",
    });
  },
  // #endregion

  // #region Confirmation alert
  async showConfirmationAlert(title, text, icon) {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    });
  },
  //#endregion
  //#region  generate random passwotd
  generatePassword() {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  },
  //#endregion
  // #region All Keys
  tokenKey: "tokenKey",
  firstName: "firstName",
  lastName: "lastName",
  fullName: "fullName",
  profileImage: "profileImage",
  userId: "userId",
  companyName: "Global Brain And Spine Care App",
  poweredBy: "Global Brain And Spine Care App",
  // #endregion
};
