export const ApiEndPoint = {
  // #region Authentication Api End Point
  Authentication: {
    login: "webValidateLogin",
    logout: "logout",
    changePassword: "changePassword",
  },
  // #endregion

  //#region  User End point
  User: {
    getUser: "users",
    saveUser: "save",
  },
  //#endregion
  // <-------------------------------------MASTER------------------------------------------------------>
  //#region  City End point
  City: {
    getCity: "getCity",
    saveCity: "saveCity",
    updateCity: "updateCity",
    changeCityStatus: "changeCityStatus",
    deleteCity: "deleteCity",
  },
  //#endregion

  //#region  Area End point
  Area: {
    getArea: "getArea",
    saveArea: "saveArea",
    updateArea: "updateArea",
    changeAreaStatus: "changeAreaStatus",
    deleteArea: "deleteArea",
    getWithoutPaginationCity: "getWithoutPaginationCity",
  },
  //#endregion

  //#region Doctor End point
  Doctor: {
    getCityIdWithoutPagination: "getCityIdWithoutPagination",
    getAreaIdWithoutPagination: "getAreaIdWithoutPagination",
    webGetDoctorDetails: "webGetDoctorDetails",
    saveDoctorDetails: "saveDoctorDetails",
    webUpdateDoctorDetails: "webUpdateDoctorDetails",
    changeDoctorDetailsStatus: "changeDoctorDetailsStatus",
    deleteDoctorDetails: "deleteDoctorDetails",
    webGetDiseaseCategory: "webGetDiseaseCategory",
  },
  //#endregion

  //#region Clinic
  Clinic: {
    webGetClinicDetails: "webGetClinicDetails",
    webSaveClinicDetails: "webSaveClinicDetails",
    webUpdateClinicDetails: "webUpdateClinicDetails",
    webChangeClinicActive: "webChangeClinicActive",
    webChangeMasterClinic: "webChangeMasterClinic",
    getCityIdWithoutPagination: "getCityIdWithoutPagination",
    getAreaIdWithoutPagination: "getAreaIdWithoutPagination",

    webGetClinicService: "webGetClinicService",
    webSaveClinicService: "webSaveClinicService",
   
    webGetClinicTiming: "webGetClinicTiming",
    webSaveClinicTiming: "webSaveClinicTiming",
  },
  //#endregion
  // <-------------------------------------END------------------------------------------------------>

  // <-------------------------------------TRANSACTION------------------------------------------------------>
  //#region Block Dates
  SlotDates: {
    getSlotDates: "getSlotDates",
    saveSlotDate: "saveSlotDate",
    changeSlotStatus: "changeSlotStatus",
    changeDateSlotsStatus: "changeDateSlotsStatus",
    clinicActiveDetails: "clinicActiveDetails",
    doctorActiveDetails: "doctorActiveDetails",
    deleteSlotDate: "deleteSlotDate",
    webUpdateSlotDate: "webUpdateSlotDate",
  },
  //#endregion
  //#region VideoBookingDetails
  VideoSlotDate: {

    webGetVideoSlotDates: "webGetVideoSlotDates",
    webSaveVideoSlotDates: "webSaveVideoSlotDates",
    webChangeVideoBookingAvailable: "webChangeVideoBookingAvailable",
    webChangeVideoSlotDatesActive: "webChangeVideoSlotDatesActive",
    getDoctorDetailsWithoutPagination: "getDoctorDetailsWithoutPagination",
    webUpdateVideoSlotDate: "webUpdateVideoSlotDate",
  },
  //#endregion
  //#region VideoBookingDetails
  VideoBookingDetails: {
    getVideoBookingDetails: "getVideoBookingDetails",
    getDoctorDetailsWithoutPagination: "getDoctorDetailsWithoutPagination",
  },
  //#endregion
  //#region Upcoming Video Booking Details
  UpcomingVideoBookingDetails: {
    getUpcomingVideoBookingDetails: "getUpcomingVideoBookingDetails",
  },
  //#endregion BookMedicine
  //#region 
  BookMedicine: {
    webGetBookMedicine: "webGetBookMedicine",
    webChangeBookMedicineStatus: "webChangeBookMedicineStatus",
    webGetPrescriptionDoc: "webGetPrescriptionDoc",
  },
  //#endregion
   //#region 
   BookTest: {
    webGetBookTest: "webGetBookTest",
    webChangeBookTestStatus: "webChangeBookTestStatus",
    webGetTestDoc: "webGetTestDoc",
  },
  //#endregion
  // <-------------------------------------END------------------------------------------------------>

  // <-------------------------------------Report------------------------------------------------------>
  //#region  BookingDetails
  BookingDetails: {
    getBookingDetails: "getBookingDetails",
    clinicActiveDetails: "clinicActiveDetails",
    doctorActiveDetails: "doctorActiveDetails",
  },
  //#endregion
  //#region  ClinicWiseBooking
  ClinicWiseBooking: {
    clinicActiveDetails: "clinicActiveDetails",
    clinicWiseBooking: "clinicWiseBooking",

  },
  //#endregion

  //#region  UpcomingBookingDetails
  UpcomingBookingDetails: {
    clinicActiveDetails: "clinicActiveDetails",
    upcomingBookingDetails: "upcomingBookingDetails",
  },
  //#endregion

  //#region Reg Patient
  RegPatient: {
    webGetRegisteredPatient: "webGetRegisteredPatient",
    webGetInClinicBookingForPatient: "webGetInClinicBookingForPatient",
    webGetVideoBookingForPatient: "webGetVideoBookingForPatient",
  },
  //#endregion

  //#region Video Visit Clinic Wise
  VideoVisitClinicWise: {
    webGetVideoVisitClinicWise: "webGetVideoVisitClinicWise",
  },
  //#endregion

  //#region Doctor Wise Patient Details
  DoctorWisePatientDetails: {
    webGetDoctorWisePatientDetails: "webGetDoctorWisePatientDetails",
  },
  //#endregion

  //#region Patient Wise Booking
  PatientWiseBooking: {
    webGetPatientWiseBookingDetails: "webGetPatientWiseBookingDetails",
  },
  //#endregion

  // <-------------------------------------END------------------------------------------------------>
};
