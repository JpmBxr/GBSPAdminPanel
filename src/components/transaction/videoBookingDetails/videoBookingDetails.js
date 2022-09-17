import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const videoBookingDetails = {
    props: ["userPermissionDataProps"],
    mixins: [globalMixin],
    //#region data
    data() {
        return {
            // Data Table
            tableLoadingDataText: "Loading data",
            //#region List Data
            tableHeader: [
                {
                    text: "#",
                    value: "index",
                    width: "5%",
                    sortable: false,
                    align: "start",
                },
                {
                    text: "Doctor",
                    value: "doctor_full_name",
                    width: "10%",
                    sortable: true,
                    align: "start",
                },
                {
                    text: "Date",
                    value: "video_booking_date",
                    sortable: false,
                    width: "10%",
                    align: "start",
                },
                // {
                //     text: "Time",
                //     value: "clinic_full_name",
                //     sortable: false,
                //     width: "15%",
                //     align: "start",
                // },
                {
                    text: "Patient Name",
                    value: "family_member_full_name",
                    sortable: false,
                    width: "15%",
                    align: "start",
                },
                {
                    text: "Patient Name",
                    value: "family_member_mobile_number",
                    sortable: false,
                    width: "15%",
                    align: "start",
                },
                {
                    text: "Booked By",
                    value: "booking_made_by",
                    sortable: false,
                    width: "10%",
                    align: "start",
                },

            ],
            //#endregion

            tableItems: [],
            totalItemsInDB: 0,
            doctor_id: null,
            doctorItems: [],
            in_clinic_booking_is_active: null,

            bookingStatusItems: [
                { id: 1, status: "Active" },
                { id: 3, status: "Completed" },
                { id: 2, status: "Cancel" },
                { id: 4, status: "Absent" },
            ],

            show: true,
            isLoaderActive: false,
            pagination: {},
            module: "Transaction",
            entity: "Video Booking Details",
            video_booking_is_active:null,
            //#region video booking Data
            video_booking_from_date: new Date(
                //video_booking_from_date
                Date.now() - new Date().getTimezoneOffset() * 60000
            )
                .toISOString()
                .substr(0, 10),
            menu_video_booking_from_date: false,

            video_booking_to_date: new Date(
                // video_booking_to_date
                Date.now() - new Date().getTimezoneOffset() * 60000
            )
                .toISOString()
                .substr(0, 10),
            menu_video_booking_to_date: false,
            //#endregion

            searchText: "",    // search

            //#region excelFields
            excelFields: {
                Doctor: "doctor_full_name",
                BookingDate: "video_booking_date",
                Patient: "family_member_full_name",
                BookedBy: "booking_made_by",
            },
            excelFileName: "VideoBookingDetails" + moment().format("DD/MM/YYYY") + ".xls",
            //#endregion
        };

    },
    //#endregion

    //#region created
    created() {
        // To get Details
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

        //#region To get Details
        getDetails() {
            this.tableDataLoading = true;
            let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
            sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
            sortBy = sortBy.length == 0 ? `video_booking_id` : sortBy[0];
            ApiService.get(ApiEndPoint.VideoBookingDetails.getVideoBookingDetails, {
                video_booking_from_date: this.video_booking_from_date,
                video_booking_to_date: this.video_booking_to_date,
                video_booking_is_active: this.video_booking_is_active,
                doctor_id: this.doctor_id,

                itemsPerPage: itemsPerPage,
                sortColumn: sortBy,
                sortOrder: sortDesc,
                page: page,
                searchText: this.searchText,
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

        //#region search Info
        searchInfo() {
            clearTimeout(this._timerId);
            this._timerId = setTimeout(() => {
                this.getDetails();
            }, 500);
        },
        //#endregion

        //#region  to load Doctor
        getDoctor() {
            this.isLoaderActive = true;
            ApiService.get(
                ApiEndPoint.VideoBookingDetails.getDoctorDetailsWithoutPagination,
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
    },
    //#endregion
};
