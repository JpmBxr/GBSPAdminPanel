import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const regPatient = {
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
          text: "Full Name",
          value: "family_member_full_name",
          width: "25%",
          sortable: true,
          align: "start",
        },

        {
          text: "Mobile Number",
          value: "family_member_mobile_number",
          sortable: false,
          width: "25%",
          align: "start",
        },
        {
          text: "View Clinic Booking",
          value: "View_Clinic_Booking",
          sortable: false,
          width: "25%",
          align: "start",
        },
        {
          text: "View Video Booking",
          value: "View_Video_Booking",
          sortable: false,
          width: "20%",
          align: "end",
        },
        
      ],
      tableItems: [],
      totalItemsInDB: 0 ,
      tableDataLoading: false,
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
      entity: "Register Patient's Booking",
      
      // search
      searchText: "",

       // excel
      excelFields: {
        family_member_full_name: "family_member_full_name",
        family_member_mobile_number: "family_member_mobile_number",
      },
      excelFileName:
        "RegisterPatientsBooking" + moment().format("DD/MM/YYYY") + ".xls",
      //end
    };
  },
  //#region created
  created() {
    // To get Details in List
    this.getDetails();
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
      sortBy = sortBy.length == 0 ? `user_id` : sortBy[0];
      ApiService.get(ApiEndPoint.RegPatient.webGetRegisteredPatient, {
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
    //#region search Info
    searchInfo() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.getDetails();
      }, 500);
    },
    //#endregion

    viewClinicBooking(item){
      console.log(item);
      this.$router.push({
        name: "viewClinicBooking",
        query: {
          family_member_id: item.family_member_id,
        },
      });
    },
    viewVideoBooking(item){
      console.log(item);
      this.$router.push({
        name: "viewVideoBooking",
        query: {
          family_member_id: item.family_member_id,
        },
      });
    },
  },
  //#endregion
};
