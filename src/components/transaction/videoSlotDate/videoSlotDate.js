import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const videoSlotDate = {
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
                    text: "Doctor Name",
                    value: "doctor_full_name",
                    width: "30%",
                    sortable: true,
                    align: "start",
                },
                {
                    text: "Dates",
                    value: "video_slot_dates",
                    width: "15%",
                    sortable: true,
                    align: "start",
                },
                // {
                //     text: "Start Time",
                //     value: "start_time",
                //     sortable: false,
                //     width: "15%",
                //     align: "start",
                // },
                // {
                //     text: "End Time",
                //     value: "end_time",
                //     sortable: false,
                //     width: "15%",
                //     align: "start",
                // },
                {
                    text: "Inactive",
                    value: "video_slot_dates_is_active",
                    sortable: false,
                    width: "10%",
                    align: "start",
                },
                {
                    text: "Block",
                    value: "video_booking_available",
                    sortable: false,
                    width: "20%",
                    align: "start",
                },
                
                {
                    text: "Update",
                    value: "update",
                    sortable: false,
                    width: "5%",
                    align: "start",
                },
                {
                    text: "Actions",
                    value: "actions",
                    sortable: false,
                    width: "10%",
                    align: "end",
                },

            ],
            // add edit

            totalItemsInDB: 0,
            item: {},
            addEditDialog: false,
            isFormAddEditValid: false,
            isAddEdit: true,
            addUpdateButtonText: "Add Video Slot Date",
            addEditText: "Add",
            isLoaderActive: false,
            isDialogLoaderActive: false,

            tableItems: [],
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
                    text: "Blocked For Doctor"
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
            entity: "Video Slot Date",

            //home Page clinic slot dates
            video_slot_dates: new Date(
                Date.now() - new Date().getTimezoneOffset() * 60000
            )
                .toISOString()
                .substr(0, 10),
            menu_video_slot_dates: false,

            //Dialog box clinic slot dates
            video_slot_dates: new Date(
                Date.now() - new Date().getTimezoneOffset() * 60000
            )
                .toISOString()
                .substr(0, 10),
            menu2_video_slot_dates: false,

            searchText: "",    // search

            // excel
            excelFields: {
                doctor_full_name: "doctor_full_name",
                video_slot_dates: "video_slot_dates",
                start_time: "start_time",
                end_time: "end_time",
                video_slot_dates_is_active: "video_slot_dates_is_active",
                video_booking_available: "video_booking_available",
            },
            excelFileName: "VideoSlotDate" + moment().format("DD/MM/YYYY") + ".xls",
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
        this.getDoctor();
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
            sortBy = sortBy.length == 0 ? `video_slot_dates` : sortBy[0];
            ApiService.get(ApiEndPoint.VideoSlotDate.webGetVideoSlotDates, {
                itemsPerPage: itemsPerPage,
                sortColumn: sortBy,
                sortOrder: sortDesc,
                page: page,
                searchText: this.video_slot_dates,
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

        //#region  to load Doctor
        getDoctor() {
            this.isLoaderActive = true;
            ApiService.get(
                ApiEndPoint.VideoSlotDate.getDoctorDetailsWithoutPagination,
                {}
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
                this.addEditText = `Edit ${this.entity} : ` + item.doctor_full_name;
                this.addEditDialog = true;
                this.addUpdateButtonText = "Update";
                
              }
        },
        //#endregion

        //#region add Edit
        addEditItem() {
            if (this.$refs.holdingFormAddEdit.validate()) {
                if (this.isAddEdit) {
                    // save
                    this.isDialogLoaderActive = true;
                    ApiService.post(ApiEndPoint.VideoSlotDate.webSaveVideoSlotDates, {
                        video_slot_dates: this.item.video_slot_dates,
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
                    this.isDialogLoaderActive = true;
                    ApiService.post(ApiEndPoint.VideoSlotDate.webUpdateVideoSlotDate, {
                        video_slot_dates_id: this.item.video_slot_dates_id,
                        video_slot_dates: this.item.video_slot_dates,
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
                  }
            }
        },
        //#endregion

    //#region  enable Disable Item  
        async enableDisableItem(item) {
            const result = await Global.showConfirmationAlert(
                `Close Video Slot Date for ${item.doctor_full_name} `,
                "Are you sure to close the date",
                "warning"
            );
            if (result.isConfirmed) {
                this.isLoaderActive = true;
                ApiService.post(ApiEndPoint.VideoSlotDate.webChangeVideoSlotDatesActive, {
                    video_slot_dates_id: item.video_slot_dates_id,
                    video_slot_dates_is_active: item.video_slot_dates_is_active,
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
                if (item.video_slot_dates_is_active == false) {
                    item.video_slot_dates_is_active = true;
                } else {
                    item.video_slot_dates_is_active = false;
                }
            }
        },
        //#endregion
        
    //#region  blockItem
        async blockItem(item) {
            const result = await Global.showConfirmationAlert(
                `Here we are updating existing data for Doctor ${item.doctor_full_name} `,
                "Are you sure to updating existing data",
                "warning"
            );
            if (result.isConfirmed) {
                this.isLoaderActive = true;
                ApiService.post(ApiEndPoint.VideoSlotDate.webChangeVideoBookingAvailable, {
                    video_slot_dates_id: item.video_slot_dates_id,
                    video_booking_available: item.video_booking_available,
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
