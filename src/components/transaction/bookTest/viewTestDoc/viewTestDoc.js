import { Global } from "@/helpers/global";
import { globalMixin } from "../../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../../helpers/apiEndPoint";
export const viewTestDoc = {
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
          text: "Test Doc Name",
          value: "book_test_doc_name",
          width: "10%",
          sortable: true,
          align: "start",
        },

        {
          text: "Date",
          value: "book_test_docs_created_at",
          sortable: false,
          width: "15%",
          align: "start",
        },
        {
          text: "Downlode",
          value: "downlode",
          sortable: false,
          width: "5%",
          align: "start",
        },  
      ],
      tableItems: [],
      totalItemsInDB: 0 ,
      tableDataLoading: false,
      isLoaderActive: false,
      pagination: {},
      module: "Trasaction",
      entity: "Test Doc",
      
      // search
      searchText: "",

      //excel
      excelFields: {
        book_test_doc_name: "book_test_doc_name",
        book_test_docs_created_at: "book_test_docs_created_at",
        
      },
      excelFileName:
        "TestDoc" + moment().format("DD/MM/YYYY") + ".xls",
      //end
    };
  },
  //#region created
  created() {
    // To get Details in List
    this.user_id = this.$route.query.user_id;
    this.book_test_id = this.$route.query.book_test_id;
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
      sortBy = sortBy.length == 0 ? `in_clinic_booking_date` : sortBy[0];
      ApiService.get(ApiEndPoint.BookTest.webGetTestDoc, {
        user_id:this.user_id,
        book_test_id: this.book_test_id,
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

    //#region download Doc
    downloadDoc(item){
        this.isLoaderActive=true;
        ApiService.get( Global.testDocsUrl+item.book_test_doc_name)
          .then((response) => {
            this.isLoaderActive = false;
            var fileURL = window.URL.createObjectURL(new Blob([response.data]));
            var fileLink = document.createElement("a");
            fileLink.href = fileURL;
            fileLink.setAttribute(
              "download",
              item.book_test_doc_name
            );
          
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
