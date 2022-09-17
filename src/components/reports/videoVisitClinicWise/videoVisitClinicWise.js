import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const videoVisitClinicWise = {
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
          text: "Booking Date",
          value: "video_booking_date",
          width: "15%",
          sortable: true,
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
          text: "Doctor",
          value: "doctor_full_name",
          sortable: false,
          width: "15%",
          align: "start",
        },
        {
          text: "Booking Code",
          value: "video_booking_code",
          sortable: false,
          width: "15%",
          align: "start",
        },
        {
          text: "Family Name",
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
          text: "Status",
          value: "status",
          sortable: false,
          width: "5%",
          align: "End",
        },
      ],
      tableItems: [],
      totalItemsInDB: 0,
      tableDataLoading: false,
      in_clinic_booking_is_active: null,
      clinic_id: null,
      doctor_id: null,
      doctorItems: [],
      clinicItems: [],
      bookingStatusItems: [
        { id: 1, status: "Active" },
        { id: 3, status: "Completed" },
        { id: 2, status: "Cancel" },
        { id: 4, status: "Absent" },
      ],
      show: true,
      isLoaderActive: false,
      pagination: {},
      module: "Reports",
      entity: "Video Visit Clinic Wise",

      video_booking_from_date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      menu_video_booking_from_date: false,

      video_booking_to_date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      menu_video_booking_to_date: false,

      // search
      searchText: "",

      //excel
      excelFields: {
        video_booking_date: "video_booking_date",
        clinic_full_name: "clinic_full_name",
        doctor_full_name: "doctor_full_name",
        video_booking_code: "video_booking_code",
        family_member_full_name: "family_member_full_name",
        family_member_mobile_number: "family_member_mobile_number",

      },
      excelFileName: "VideoVisitClinicWise" + moment().format("DD/MM/YYYY") + ".xls",
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
    this.getClinic();
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
      this.isLoaderActive = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy =
        sortBy.length == 0
          ? `in_clinic_booking_current_slot_position`
          : sortBy[0];
      ApiService.get(ApiEndPoint.VideoVisitClinicWise.webGetVideoVisitClinicWise, {
        video_booking_from_date: this.video_booking_from_date,
        video_booking_to_date: this.video_booking_to_date,
        doctor_id: this.doctor_id,
        clinic_id: this.clinic_id,
        video_booking_is_active: this.video_booking_is_active,
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

    //#region  to load Clinic
    getClinic() {
      this.isLoaderActive = true;
      ApiService.get(
        ApiEndPoint.BookingDetails.clinicActiveDetails,
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
