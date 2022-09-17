import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const slotDates = {
  props: ["userPermissionDataProps"],
  mixins: [globalMixin],
  //#region data
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
          text: "Clinic Name",
          value: "clinic_full_name",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Doctor Name",
          value: "doctor_full_name",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Start Time",
          value: "start_time",
          sortable: false,
          width: "10%",
          align: "start",
        },
        {
          text: "End Time",
          value: "end_time",
          sortable: false,
          width: "10%",
          align: "start",
        },
        {
          text: "Inactive",
          value: "in_clinic_slot_dates_is_active",
          sortable: false,
          width: "5%",
          align: "start",
        },
        {
          text: "Block",
          value: "is_booking_available",
          sortable: false,
          width: "20%",
          align: "start",
        },
        {
          text: "Update",
          value: "update",
          sortable: false,
          width: "10%",
          align: "start",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          width: "20%",
          align: "end",
        },

      ],
      // add edit

      totalItemsInDB: 0,
      item: {},
      addEditDialog: false,
      isFormAddEditValid: false,
      isAddEdit: true,
      addUpdateButtonText: "Add Area",
      addEditText: "Add",
      isLoaderActive: false,
      isDialogLoaderActive: false,

      tableItems: [],
      clinicItems: [],
      doctorItems: [],
      blockItems: [
        {
          value: 1,
          text: "All Allowed"
        },
        {
          value: 2,
          text: "Blocked For Patient"
        },
        {
          value: 3,
          text: "Blocked For Clinic"
        },
        {
          value: 4,
          text: "Blocked For All"
        },
      ],
      show: true,
      isLoaderActive: false,
      pagination: {},
      module: "Transaction",
      entity: "OPD Booking Dates",

      //Start Time
      in_clinic_slot_start_time: null,
      menu_in_clinic_slot_start_time: false,

      //End Time
      in_clinic_slot_end_time: null,
      menu2_in_clinic_slot_end_time: false,

      //home Page clinic slot dates
      in_clinic_slot_dates: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      menu_in_clinic_slot_dates: false,

      //Dialog box clinic slot dates
      in_clinic_slot_dates: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      menu2_in_clinic_slot_dates: false,

      searchText: "",    // search

      // excel
      excelFields: {
        clinic_full_name: "clinic_full_name",
        doctor_full_name: "doctor_full_name",
        start_time: "start_time",
        end_time: "end_time",
        in_clinic_slot_dates_is_active: "in_clinic_slot_dates_is_active",
        is_booking_available: "is_booking_available",
      },
      excelFileName: "BlockedDate" + moment().format("DD/MM/YYYY") + ".xls",
      //end
    };
  },
  //#endregion

  //#region created
  created() {
    // To get Details in List
    this.getDetails();
  },
  //#endregion

  //#region mounted
  mounted() {
    // To get Clinic
    this.getClinic();
  },
  //#endregion

  //#region computed
  computed: {
    // For numbering the Data Table Rows
    dataTableRowNumbering() {
      return this.tableItems.map((items, index) => ({
        ...items,
        index: index + 1,
      }));
    },
  },
  //#endregion

  //#region watch
  watch: {
    pagination: {
      handler() {
        this.getDetails();
      },
      deep: true,
    },
  },
  //#endregion

  //#region methods
  methods: {
    //#region To get the Details list
    getDetails() {
      this.tableDataLoading = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `in_clinic_slot_dates_id` : sortBy[0];
      ApiService.get(ApiEndPoint.SlotDates.getSlotDates, {
        itemsPerPage: itemsPerPage,
        sortColumn: sortBy,
        sortOrder: sortDesc,
        page: page,
        searchText: this.in_clinic_slot_dates,
      })
        .then((response) => {
          this.tableDataLoading = false;
          this.tableItems = response.data.resultData.data;
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

    //#region  to load Clinic
    getClinic() {
      this.isLoaderActive = true;
      ApiService.get(
        ApiEndPoint.SlotDates.clinicActiveDetails,
        {}
      )
        .then((response) => {
          this.isLoaderActive = false;
          this.clinicItems = response.data.resultData;
        })
        .catch((error) => {
          this.isLoaderActive = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
    //#endregion

    //#region  to load Doctor
    getDoctor() {
      this.isLoaderActive = true;
      ApiService.get(
        ApiEndPoint.SlotDates.doctorActiveDetails,
        { clinic_id: this.item.clinic_id, }
      )
        .then((response) => {
          this.isLoaderActive = false;
          this.doctorItems = response.data.resultData;
        })
        .catch((error) => {
          this.isLoaderActive = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
    //#endregion

    //#region search Info
    searchInfo() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.getDetails();
      }, 500);
    },
    //#endregion

    //#region  to close the dialog
    close() {
      this.addEditDialog = false;
      setTimeout(() => {
        this.item = Object.assign({}, {});
      }, 300);
    },
    //#endregion

    //#region show add dialog
    showAddEditDialog(item) {
      if (item == null && this.isAddEdit == true) {
        this.addEditText = `Add New ${this.entity}`;
        this.addEditDialog = true;
        this.addUpdateButtonText = " Add ";
      }else {
        this.item = Object.assign({}, item);
        this.addEditText = `Edit ${this.entity} : ` + item.clinic_full_name;
        this.addEditDialog = true;
        this.addUpdateButtonText = "Update";
        this.getClinic();
        this.getDoctor();
        
      }
    },
    //#endregion

    //#region add Edit
    addEditItem() {
      if (this.$refs.holdingFormAddEdit.validate()) {
        if (this.isAddEdit) {
          // save
          this.isDialogLoaderActive = true;
          ApiService.post(ApiEndPoint.SlotDates.saveSlotDate, {
            in_clinic_slot_dates: this.item.in_clinic_slot_dates,
            in_clinic_slot_start_time: this.item.in_clinic_slot_start_time,
            in_clinic_slot_end_time: this.item.in_clinic_slot_end_time,
            clinic_id: this.item.clinic_id,
            doctor_id: this.item.doctor_id,
            max_slot: this.item.max_slot,

          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.result == "success") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getDetails();
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

        }else {
          //update
          console.log(this.item.in_clinic_slot_dates_id);
          this.isDialogLoaderActive = true;
          ApiService.post(ApiEndPoint.SlotDates.webUpdateSlotDate, {
            in_clinic_slot_dates: this.item.in_clinic_slot_dates,
            in_clinic_slot_start_time: this.item.in_clinic_slot_start_time,
            in_clinic_slot_end_time: this.item.in_clinic_slot_end_time,
            clinic_id: this.item.clinic_id,
            doctor_id: this.item.doctor_id,
            max_slot: this.item.max_slot,
            in_clinic_slot_dates_id: this.item.in_clinic_slot_dates_id,
            in_clinic_slot_id:this.item.in_clinic_slot_id,
            
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.result == "success") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getDetails();
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

    //#region enable Disable Item
    async enableDisableItem(item) {
      const result = await Global.showConfirmationAlert(
        `Close Slot Date for ${item.clinic_full_name} `,
        "Are you sure to close the date",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;
        ApiService.post(ApiEndPoint.SlotDates.changeSlotStatus, {
          in_clinic_slot_dates_id: item.in_clinic_slot_dates_id,
          in_clinic_slot_dates_is_active: item.in_clinic_slot_dates_is_active,
        })
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.result == "success") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getDetails();
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
        if (item.in_clinic_slot_dates_is_active == false) {
          item.in_clinic_slot_dates_is_active = true;
        } else {
          item.in_clinic_slot_dates_is_active = false;
        }
      }
    },
    //#endregion

    //#region blocked Item
    async blockItem(item) {
      const result = await Global.showConfirmationAlert(
        `Here we are updating existing data for Clinic ${item.clinic_full_name} `,
        "Are you sure to updating existing data",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;
        ApiService.post(ApiEndPoint.SlotDates.changeDateSlotsStatus, {
          in_clinic_slot_dates_id: item.in_clinic_slot_dates_id,
          is_booking_available: item.is_booking_available,
        })
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.result == "success") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getDetails();
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
      }
    },
    //#endregion

    //#region Delete Item
    async deleteItem(item) {
      const result = await Global.showConfirmationAlert(
        `Delete  ${item.clinic_full_name}`,
        "Are you sure to delete",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;
        ApiService.post(ApiEndPoint.SlotDates.deleteSlotDate, {
          in_clinic_slot_dates_id: item.in_clinic_slot_dates_id,
        })
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.result == "success") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getDetails();
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
      }
    },
    //#endregion
  }
  //#endregion
}
