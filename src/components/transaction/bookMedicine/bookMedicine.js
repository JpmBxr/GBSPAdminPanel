import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const bookMedicine = {
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
          text: "Name",
          value: "name",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Address",
          value: "delivery_address",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Date",
          value: "booking_date",
          sortable: false,
          width: "15%",
          align: "start",
        },
        {
          text: "Medicine Notes",
          value: "book_medicine_notes",
          sortable: false,
          width: "15%",
          align: "start",
        },
        {
          text: "Mobile",
          value: "mobile_number",
          sortable: false,
          width: "10%",
          align: "start",
        },
        {
          text: "Status",
          value: "book_medicine_current_status",
          sortable: false,
          width: "10%",
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
          width: "5%",
          align: "start",
        },
        {
          text: "Total Prescription",
          value: "totalPrescriptionUploaded",
          sortable: false,
          width: "25%",
          align: "start",
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
      book_medicine_current_status: null,

      tableItems: [],
      medicineDocsUrl:null,
      statusItems: [
        {
           value: 1,
          text: "Submitted"
        },
        {
           value: 2,
          text: "Accepted"
        },
        {
           value: 3,
          text: "Rejected"
        },
        {
           value: 4,
          text: "Order Dispatched"
        },
        {
           value: 5,
          text: "Delivered"
        },
      ],
      show: true,
      isLoaderActive: false,
      pagination: {},
      module: "Transaction",
      entity: "Book Medicine",
      medicineDocsUrl :null,
      searchText: "",    // search

      // excel
      excelFields: {
        name: "name",
        delivery_address: "delivery_address",
        booking_date: "booking_date",
        book_medicine_notes: "book_medicine_notes",
        mobile_number: "mobile_number",
        status: "status",
        totalPrescriptionUploaded: "totalPrescriptionUploaded",
      },
      excelFileName: "BookMedicine" + moment().format("DD/MM/YYYY") + ".xls",
      //end
    };
  },
  //#endregion

  //#region created
  created() {
   
    this.medicineDocsUrl = Global.medicineDocsUrl;
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

  //#region methods
  methods: {
    //#region To get the Details list
    getDetails() {
      this.tableDataLoading = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `book_medicine_created_at` : sortBy[0];
      ApiService.get(ApiEndPoint.BookMedicine.webGetBookMedicine, {
        itemsPerPage: itemsPerPage,
        sortColumn: sortBy,
        sortOrder: sortDesc,
        page: page,
        searchText:this.searchText,
        book_medicine_current_status:this.book_medicine_current_status,
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

    //#region  to close the dialog
    close() {
      this.addEditDialog = false;
      setTimeout(() => {
        this.item = Object.assign({}, {});
      }, 300);
    },
    //#endregion

    //#region status Items
    async bookMedicineStatus(item) {
      const result = await Global.showConfirmationAlert(
        `Here we are updating Medicine details `,
        "Are you sure to updating details",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;
        ApiService.post(ApiEndPoint.BookMedicine.webChangeBookMedicineStatus, {
          book_medicine_id: item.book_medicine_id,
          book_medicine_current_status: item.book_medicine_current_status,
         
          // secureLS.set(Global.userId, response.data.userData.user_id);
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

    viewMedicineDoc(item){
      this.$router.push({
        name: "viewMedicineDoc",
        query: {
          user_id: item.user_id,
          book_medicine_id: item.book_medicine_id,
        },
      });
    },

    
    
    //#endregion
  }
  //#endregion
}
