import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const upcomingVideoBookingDetails = {
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
                    text: "Date",
                    value: "video_booking_date",
                    width: "20%",
                    sortable: true,
                    align: "start",
                },
                {
                    text: "Booked By",
                    value: "booked_by",
                    width: "25%",
                    sortable: true,
                    align: "start",
                },
                {
                    text: "Doctor",
                    value: "doctor_full_name",
                    sortable: false,
                    width: "25%",
                    align: "start",
                },
                {
                    text: "Totaln Booking",
                    value: "totalVideoBooking",
                    sortable: false,
                    width: "20%",
                    align: "end",
                },
            ],
            tableItems: [],
            totalItemsInDB: 0,
            tableDataLoading: false,
            doctor_id: null,
            doctorItems: [],
            show: true,
            isLoaderActive: false,
            pagination: {},
            module: "Transaction",
            entity: "Upcoming Video Booking Details",

            //home Page clinic slot dates
            video_booking_date: new Date(
                Date.now() - new Date().getTimezoneOffset() * 60000
            )
                .toISOString()
                .substr(0, 10),
            menu_video_booking_date: false,
            // search
            searchText: "",

            //excel
            excelFields: {
                video_booking_date: "video_booking_date",
                booked_by: "booked_by",
                doctor_full_name: "doctor_full_name",
                totalVideoBooking: "totalVideoBooking",
                
            },
            excelFileName:
                "ClinicWiseBooking" + moment().format("DD/MM/YYYY") + ".xls",
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
    //#region 
    methods: {
        //#region To get the Details list
        getDetails() {
            this.isLoaderActive = true;
            let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
            sortDesc = sortDesc.length > 0 && sortDesc[0] ? "asc" : "desc";
            sortBy = sortBy.length == 0 ? `video_booking_date` : sortBy[0];
            ApiService.get(ApiEndPoint.UpcomingVideoBookingDetails.getUpcomingVideoBookingDetails, {
                video_booking_date: this.video_booking_date,
                doctor_id: this.doctor_id,
                itemsPerPage: itemsPerPage,
                sortColumn: sortBy,
                sortOrder: sortDesc,
                page: page,
                searchText: this.searchText,
            })
                .then((response) => {
                    this.isLoaderActive = false;
                    this.tableItems = response.data.resultData;
                    this.totalItemsInDB = response.data.resultData.total;
                })
                .catch((error) => {
                    this.isLoaderActive = false;
                    if (error.response.status != 401 || error.response.status != 403) {
                        Global.showErrorAlert(true, "error", "Something went wrong");
                    }
                });
        },
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

        //#region search Info
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
