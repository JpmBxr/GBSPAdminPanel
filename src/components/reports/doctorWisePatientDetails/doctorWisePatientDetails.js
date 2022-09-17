import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const doctorWisePatientDetails = {
    props: ["userPermissionDataProps"],
    mixins: [globalMixin],
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
                    text: "Patient Name",
                    value: "family_member_full_name",
                    sortable: false,
                    width: "15%",
                    align: "start",
                },
                {
                    text: "Mobile",
                    value: "family_member_mobile_number",
                    sortable: false,
                    width: "15%",
                    align: "start",
                },
                {
                    text: "Booking Date",
                    value: "booking_date",
                    width: "10%",
                    sortable: true,
                    align: "start",
                },
                {
                    text: "Doctor",
                    value: "doctor_full_name",
                    sortable: false,
                    width: "10%",
                    align: "start",
                },
                {
                    text: "Clinic",
                    value: "clinic_full_name",
                    sortable: false,
                    width: "15%",
                    align: "start",
                },
                {
                    text: "Booking Slot",
                    value: "in_clinic_booking_slot_position",
                    sortable: false,
                    width: "15%",
                    align: "start",
                },
                {
                    text: "Booking Code",
                    value: "booking_code",
                    sortable: false,
                    width: "10%",
                    align: "start",
                },
                {
                    text: "Booked By",
                    value: "booked_by",
                    sortable: false,
                    width: "5%",
                    align: "start",
                },
                {
                    text: "Status",
                    value: "status",
                    sortable: false,
                    width: "5%",
                    align: "start",
                },
            ],
            tableItems: [],
            totalItemsInDB: 0,
            tableDataLoading: false,
            booking_is_active: null,
            opd_video: null,
            doctor_id: null,
            doctorItems: [],
            bookingItems: [
                {
                    id: 1,
                    name: "OPD Booking"
                },

                {
                    id: 2,
                    name: "VIDEO Booking"
                },
            ],
            bookingStatusItems: [
                {
                    id: 1,
                    status: "Active"
                },

                {
                    id: 2,
                    status: "Cancel"
                },
                {
                    id: 3,
                    status: "Completed"
                },
                {
                    id: 4,
                    status: "Absent"
                },
            ],

            show: true,
            isLoaderActive: false,
            pagination: {},
            module: "Reports",
            entity: "Doctor Wise Patient Details",

            // search
            searchText: "",

            //excel
            excelFields: {
                "Booking Date": "in_clinic_booking_date",
                Doctor: "doctor_full_name",
                Clinic: "clinic_full_name",
                Department: "specialization_name",
                Disease: "disease_name",
                Mobile: "family_member_mobile_number",
                Patient: "family_member_full_name",
                "Booking Position": "in_clinic_booking_slot_position",
                "Currebt Position": "in_clinic_booking_current_slot_position",
                Status: "status",
            },
            excelFileName: "PatientBooking" + moment().format("DD/MM/YYYY") + ".xls",
            //end
        };
    },
    //#region created
    created() {
        // To get Details in List
        this.getDetails();
    },
    //#endregion

    //#region mounted
    mounted() {
        // To get Doctor
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
            // console.log(item);
            this.isLoaderActive = true;
            let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
            sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
            sortBy =
                sortBy.length == 0
                    ? `family_member_full_name`
                    : sortBy[0];
            ApiService.get(ApiEndPoint.DoctorWisePatientDetails.webGetDoctorWisePatientDetails, {
                opd_video: this.opd_video,
                doctor_id: this.doctor_id,
                booking_is_active: this.booking_is_active,

                itemsPerPage: itemsPerPage,
                sortColumn: sortBy,
                sortOrder: sortDesc,
                page: page,
                searchText: this.searchText,
            })
                .then((response) => {

                    this.isLoaderActive = false;
                    this.tableItems = response.data.resultData.data;
                    this.totalItemsInDB = response.data.resultData.total;
                })
                .catch((error) => {
                    this.isLoaderActive = false;
                    if (error.response.status != 401 || error.response.status != 403) {
                        Global.showErrorAlert(true, "error", "Something went wrong");
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

        //#region searchInfo
        searchInfo() {
            clearTimeout(this._timerId);
            this._timerId = setTimeout(() => {
                this.getDetails();
            }, 500);
        },
        //#endregion
    },
    //#endregion
};
