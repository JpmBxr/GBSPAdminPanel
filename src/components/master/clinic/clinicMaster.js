import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const clinicMaster = {
  props: ["userPermissionDataProps"],
  mixins: [globalMixin],
  //#region  Data section
  data() {
    return {
      // Data Table
      tableLoadingDataText: "Loading data",
      tableHeader: [
        {
          text: "#",
          value: "index",
          width: "5%",
          sortable: false,
          align: "start",
        },
        {
          text: "Name",
          value: "clinic_full_name",
          width: "25%",
          sortable: true,
          align: "start",
        },
        {
          text: "Mobile",
          value: "clinic_mobile_number",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "City",
          value: "city_name",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Clinic Active",
          value: "clinic_is_active",
          sortable: false,
          width: "12%",
          align: "start",
        },
        {
          text: "Master Clinic",
          value: "is_master_clinic",
          sortable: false,
          width: "12%",
          align: "start",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          width: "30%",
          align: "end",
        },

      ],

      pagination: {},
      entity: "Clinic Master",
      // search
      searchText: "",
      // add edit
      totalItemsInDB: 0,
      item: {},
      addEditDialog: false,
      isFormAddEditValid: false,
      isAddEdit: true,
      addUpdateButtonText: "Add Clinic Master",
      addEditText: "Add",
      isLoaderActive: false,
      isDialogLoaderActive: false,
      //Service
      addServiceDialog: false,
      isFormAddServiceValid: false,
      isAddService: true,
      addUpdateButtonText: "Add Clinic Service",
      addServiceText: "Clinic Service",
      //Timing
      addTimingDialog: false,
      isFormAddTimingValid: false,
      isAddTiming: true,
      addUpdateButtonText: "Add Clinic Timing",
      addTimingText: "Clinic Timing",

      tableItems: [],
      cityItems: [],
      areaItems: [],
      clinicServiceItems:[],
      clinicTimingItems:[],
      tableDataLoading: false,

      //end

      //excel
      excelFields: {
        clinic_full_name: "clinic_full_name",
        clinic_mobile_number: "clinic_mobile_number",
        city_name: "city_name",
        clinic_is_active: "clinic_is_active",
        is_master_clinic: "is_master_clinic",
        
      },
      excelFileName:
        "ClinicMaster" + "_" + moment().format("DD/MM/YYYY") + ".xls",

      //end
    };
  },
  //#endregion
  //#region  created section
  created() {
    //#get Clinic Details List
    this.getClinicDetailsList();
    
  },
  //#endregion

  //#region loading City, Area on page load/ mount 
  mounted() {
    // Show Add in dialog
    this.getCity();
    this.getClinicService();
    this.getClinicTiing();

  },
  //#endregion

  //#region Computed section
  computed: {
    //#region  Numbering data table row
    dataTableRowNumbering() {
      return this.tableItems.map((items, index) => ({
        ...items,
        index: index + 1,
      }));
    },
    //#endregion
  },
  //#endregion
  //#region watch setion
  watch: {
    //#region  add/edit dialog
    addEditDialog(value) {
      return value ? true : this.close();
    },
    //#endregion
    //#region  add/edit dialog
    addServiceDialog(value) {
      return value ? true : this.close();
    },
    //#endregion
    //#region Pagination
    pagination: {
      handler() {
        this.getClinicDetailsList();
      },
      deep: true,
    },
    //#endregion
  },
  //#endregion

  //#region Method section
  methods: {
    //#region To get the Clinic Details
    getClinicDetailsList() {
      this.tableDataLoading = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `clinic_id` : sortBy[0];
      ApiService.get(ApiEndPoint.Clinic.webGetClinicDetails, {
        itemsPerPage: itemsPerPage,
        sortColumn: sortBy,
        sortOrder: sortDesc,
        page: page,
        searchText: this.searchText,
      })
        .then((response) => {
          this.tableDataLoading = false;

          this.tableItems = response.data.resultData.data;
          console.log(response);
          this.totalItemsInDB = response.data.resultData.total;
        })
        .catch((error) => {
          this.tableDataLoading = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
    //#endregion

    //#region To get the Clinic Service
    getClinicService() {
      this.isDialogLoaderActive = true;
      ApiService.get(
        ApiEndPoint.Clinic.webGetClinicService,
        {}
      )
        .then((response) => {
          this.isDialogLoaderActive = false;
          console.log(response);
          this.clinicServiceItems = response.data.resultData;
        })
        .catch((error) => {
          this.isDialogLoaderActive = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });


    },
    //#endregion

    //#region To get the Clinic Timing
    getClinicTiing() {
      this.isDialogLoaderActive = true;
      ApiService.get(
        ApiEndPoint.Clinic.webGetClinicTiming,
        {}
      )
        .then((response) => {
          this.isDialogLoaderActive = false;
          console.log(response);
          this.clinicTimingItems = response.data.resultData;
        })
        .catch((error) => {
          this.isDialogLoaderActive = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });


    },
    //#endregion

    //#region  search
    searchInfo() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.getClinicDetailsList();
      }, 500);
    },

    //#endregion

    //#region  show add/edit dialog
    showAddEditDialog(item) {

      if (item == null && this.isAddEdit == true) {
        this.addEditText = `Add  ${this.entity}`;
        this.addEditDialog = true;
        this.addUpdateButtonText = " Add ";
      } else {
        this.item = Object.assign({}, item);
        this.addEditText = `Edit ${this.entity} : ` + item.clinic_full_name;
        this.addEditDialog = true;
        this.addUpdateButtonText = "Update";
        this.getCity();
        this.getArea();

      }
    },
    //#endregion

    //#region  show add Service dialog
    showAddServiceDialog(item) {
      if (item == null && this.isAddService == true) {
        this.addServiceText = `Add  ${this.entity}`;
        this.addServiceDialog = true;
        this.addUpdateButtonText = " Add ";
      } else {
        this.item = Object.assign({}, item);
        this.addServiceText = `Edit ${this.addServiceText} : ` + item.clinic_full_name;
        this.addServiceDialog = true;
        this.addUpdateButtonText = "Update";
        this.getClinicService();
      }
    },
    //#endregion

    //#region  show add Timing dialog
    showAddTimingDialog(item) {
      
      if (item == null && this.isAddTiming == true) {
        this.addTimingText = `Add  ${this.entity}`;
        this.addTimingDialog = true;
        this.addUpdateButtonText = " Add ";
      } else {
        
        this.item = Object.assign({}, item);
        this.addTimingText = `Edit ${this.addTimingText} : ` + item.clinic_full_name;
        this.addTimingDialog = true;
        this.addUpdateButtonText = "Update";
        this.getClinicTiming();
      }
    },
    //#endregion

    //#region  to load City
    getCity() {
      this.isDialogLoaderActive = true;
      ApiService.get(
        ApiEndPoint.Clinic.getCityIdWithoutPagination,
        {}
      )
        .then((response) => {
          this.isDialogLoaderActive = false;
          this.cityItems = response.data.resultData;
        })
        .catch((error) => {
          this.isDialogLoaderActive = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
    //#endregion

    //#region  to load Area
    async getArea() {
      this.isDialogLoaderActive = true;
      try {
        const response = await ApiService.get(
          ApiEndPoint.Clinic.getAreaIdWithoutPagination,
          { city_id: this.item.city_id.toString() }
        )
        this.areaItems = response.data.resultData;
        this.isDialogLoaderActive = false;
      } catch (error) {
        this.isDialogLoaderActive = false;
        if (error.response.status != 401 && error.response.status != 403) {
          this.showErrorAlert(true, "error", "Something went wrong");
        }
      }
    },
    //#endregion

    //#region  add/edit item
    addEditItem() {
      if (this.$refs.holdingFormAddEdit.validate()) {
        if (this.isAddEdit) {
          // save

          this.isDialogLoaderActive = true;
          ApiService.post(ApiEndPoint.Clinic.webSaveClinicDetails, {
            city_id: this.item.city_id,
            area_id: this.item.area_id,
            clinic_first_name: this.item.clinic_first_name,
            clinic_last_name: this.item.clinic_last_name,
            clinic_mobile_number: this.item.clinic_mobile_number,
            clinic_address: this.item.clinic_address,
            clinic_description: this.item.clinic_description,
            clinic_longitude: this.item.clinic_longitude,
            clinic_latitude: this.item.clinic_latitude,
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.result == "success") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getClinicDetailsList();
              } else if (response.data.result == "error") {
                Global.showErrorAlert(true, "error", response.data.message);
              }
            })
            .catch((error) => {
              this.isDialogLoaderActive = false;

              if (
                error.response.status != 401 ||
                error.response.status != 403
              ) {
                Global.showErrorAlert(true, "error", "Something went wrong");
              }
            });
        } else {
          //update

          this.isDialogLoaderActive = true;
          ApiService.post(ApiEndPoint.Clinic.webUpdateClinicDetails, {
            city_id: this.item.city_id,
            area_id: this.item.area_id,
            clinic_first_name: this.item.clinic_first_name,
            clinic_last_name: this.item.clinic_last_name,
            clinic_mobile_number: this.item.clinic_mobile_number,
            clinic_address: this.item.clinic_address,
            clinic_description: this.item.clinic_description,
            clinic_longitude: this.item.clinic_longitude,
            clinic_latitude: this.item.clinic_latitude,
            clinic_id: this.item.clinic_id,
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.result == "success") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getClinicDetailsList();
              } else if (response.data.result == "error") {
                Global.showErrorAlert(true, "error", response.data.message);
              }
            })
            .catch((error) => {
              this.isDialogLoaderActive = false;

              if (
                error.response.status != 401 ||
                error.response.status != 403
              ) {
                Global.showErrorAlert(true, "error", "Something went wrong");
              }
            });
        }
      }
    },

    //#endregion

    //#region  add Service item
    addServiceItem() {
      if (this.$refs.holdingFormAddService.validate()) {
        if (this.isAddService) {
          // save

          this.isDialogLoaderActive = true;
          ApiService.post(ApiEndPoint.Clinic.webSaveClinicService, {
            clinic_id: this.item.clinic_id,
            clinic_service_name: this.item.clinic_service_name,
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.result == "success") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getClinicService();
              } else if (response.data.result == "error") {
                Global.showErrorAlert(true, "error", response.data.message);
              }
            })
            .catch((error) => {
              this.isDialogLoaderActive = false;

              if (
                error.response.status != 401 ||
                error.response.status != 403
              ) {
                Global.showErrorAlert(true, "error", "Something went wrong");
              }
            });
        } else {
          //update

          this.isDialogLoaderActive = true;
          ApiService.post(ApiEndPoint.Clinic.webUpdateClinicService, {
            clinic_id: this.item.clinic_id,
            clinic_service_name: this.item.clinic_service_name,
            
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.result == "success") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getClinicService();
              } else if (response.data.result == "error") {
                Global.showErrorAlert(true, "error", response.data.message);
              }
            })
            .catch((error) => {
              this.isDialogLoaderActive = false;

              if (
                error.response.status != 401 ||
                error.response.status != 403
              ) {
                Global.showErrorAlert(true, "error", "Something went wrong");
              }
            });
        }
      }
    },
    //#endregion

    //#region  add Timing item
    addTimingItem() {
      if (this.$refs.holdingFormAddTiming.validate()) {
        if (this.isAddTiming) {
          // save

          this.isDialogLoaderActive = true;
          ApiService.post(ApiEndPoint.Clinic.webSaveClinicTiming, {
            clinic_id: this.item.clinic_id,
            clinic_days: this.item.clinic_days,
            clinic_timing: this.item.clinic_timing,
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.result == "success") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getClinicTiming();
              } else if (response.data.result == "error") {
                Global.showErrorAlert(true, "error", response.data.message);
              }
            })
            .catch((error) => {
              this.isDialogLoaderActive = false;
              if (
                error.response.status != 401 ||
                error.response.status != 403
              ) {
                Global.showErrorAlert(true, "error", "Something went wrong");
              }
            });
        } else {
          //update
          this.isDialogLoaderActive = true;
          ApiService.post(ApiEndPoint.Clinic.webUpdateClinicTiming, {
            clinic_id: this.item.clinic_id,
            clinic_days: this.item.clinic_days,
            clinic_timing_id: this.item.clinic_timing_id,
            clinic_timing: this.item.clinic_timing,
          })
            .then((response) => {
              
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.result == "success") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getClinicTiming();
              } else if (response.data.result == "error") {
                Global.showErrorAlert(true, "error", response.data.message);
              }
            })
            .catch((error) => {
              this.isDialogLoaderActive = false;

              if (
                error.response.status != 401 ||
                error.response.status != 403
              ) {
                Global.showErrorAlert(true, "error", "Something went wrong");
              }
            });
        }
      }
    },
    //#endregion


    //#region  to close the dialog
    close() {
      this.addEditDialog = false;
      setTimeout(() => {
        this.item = Object.assign({}, {});
      }, 300);
      this.addServiceDialog = false;
      setTimeout(() => {
        this.item = Object.assign({}, {});
      }, 300);
      this.addTimingDialog = false;
      setTimeout(() => {
        this.item = Object.assign({}, {});
      }, 300)
    },
    //#endregion

    //#region  enable disable for clinic active
    async enableDisableClinicActive(item) {
      const result = await Global.showConfirmationAlert(
        `Change  Clinic : ${item.clinic_full_name} is Active`,
        "Are you sure to change the Active",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;

        ApiService.post(
          ApiEndPoint.Clinic.webChangeClinicActive,
          {
            clinic_id: item.clinic_id,
            clinic_is_active: item.clinic_is_active,
          }
        )
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.result == "success") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getClinicDetailsList();
            } else if (response.data.result == "error") {
              Global.showErrorAlert(true, "error", response.data.message);
            }
          })
          .catch((error) => {
            this.isLoaderActive = false;

            if (error.response.status != 401 || error.response.status != 403) {
              Global.showErrorAlert(true, "error", "Something went wrong");
            }
          });
      } else {
        if (item.clinic_is_active == false) {
          item.clinic_is_active = true;
        } else {
          item.clinic_is_active = false;
        }
      }
    },
    //#endregion

    //#region  enable disable for Master Clinic
    async enableDisableMasterClinic(item) {
      const result = await Global.showConfirmationAlert(
        `Change  Clinic : ${item.clinic_full_name} is Active the Master Clinic`,
        "Are you sure to change the Active",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;

        ApiService.post(
          ApiEndPoint.Clinic.webChangeMasterClinic,
          {
            clinic_id: item.clinic_id,
            is_master_clinic: item.is_master_clinic,
          }
        )
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.result == "success") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getClinicDetailsList();
            } else if (response.data.result == "error") {
              Global.showErrorAlert(true, "error", response.data.message);
            }
          })
          .catch((error) => {
            this.isLoaderActive = false;

            if (error.response.status != 401 || error.response.status != 403) {
              Global.showErrorAlert(true, "error", "Something went wrong");
            }
          });
      } else {
        if (item.clinic_is_active == false) {
          item.clinic_is_active = true;
        } else {
          item.clinic_is_active = false;
        }
      }
    },
    //#endregion
  },
  //#endregion
};
