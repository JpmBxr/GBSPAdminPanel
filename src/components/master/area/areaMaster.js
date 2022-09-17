import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const areaMaster = {
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
          text: "Area",
          value: "area_name",
          width: "30%",
          sortable: true,
          align: "start",
        },
        {
          text: "City",
          value: "city_name",
          width: "30%",
          sortable: true,
          align: "start",
        },

        {
          text: "Status",
          value: "area_is_active",
          sortable: false,
          width: "20%",
          align: "start",
        },

        {
          text: "Actions",
          value: "actions",
          sortable: false,
          width: "25%",
          align: "end",
        },
      ],

      pagination: {},
      entity: "Area",
      // search
      searchText: "",
      // add edit
      defaultItem: {},
      payLoad: {},
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
      cityItems: [],
      tableDataLoading: false,

      //end

      //excel
      excelFields: {
        ID: "product_mode_id",
        Name: "product_mode",
      },
      excelFileName:
        //  "AreaMaster" + "_" + moment().format("DD/MM/YYYY") + ".xls",
        "AreaMaster" + "_aaaa.xls",
      //end
    };
  },
  async created() {
    this.cityItems = await this.getAll("getWithoutPaginationCity", {});
    this.getDetails();
  },
  computed: {
    // For numbering the Data Table Rows
    dataTableRowNumbering() {
      return this.tableItems.map((items, index) => ({
        ...items,
        index: index + 1,
      }));
    },
  },
  watch: {
    addEditDialog(value) {
      return value ? true : this.close();
    },
    pagination: {
      handler() {
        this.getDetails();
      },
      deep: true,
    },
  },
  methods: {
    getAll(endPoint, payload) {
      return new ApiService.get(endPoint, payload)
        .then((response) => {
          return response.data.resultData;
        })
        .catch((error) => {
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
    searchInfo() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.getDetails();
      }, 500);
    },
    close() {
      this.addEditDialog = false;
      setTimeout(() => {
        this.item = Object.assign({}, this.defaultItem);
      }, 300);
    },
    // add edit
    addEditItem() {
      if (this.$refs.holdingFormAddEdit.validate()) {
        if (this.isAddEdit) {
          // save
          this.apiCallPost(ApiEndPoint.Area.saveArea, {
            area_name: this.item.area_name,
            city_id: this.item.city_id,
          });
          this.close();
        } else {
          this.apiCallPost(ApiEndPoint.Area.updateArea, {
            area_name: this.item.area_name,
            Id: this.item.area_id,
            city_id: this.item.city_id,
          });

          this.close();
        }
      }
    },
    //show add edit dialog
    showAddEditDialog(item) {
      if (item == null && this.isAddEdit == true) {
        this.addEditText = `Add New ${this.entity}`;
        this.addEditDialog = true;
        this.addUpdateButtonText = " Add ";
      } else {
        this.item = Object.assign({}, item);
        this.addEditText = `Edit ${this.entity} : ` + item.area_name;
        this.addEditDialog = true;
        this.addUpdateButtonText = "Update";
      }
    },
    // enable disable
    async enableDisableItem(item) {
      console.log(item);
      const result = await Global.showConfirmationAlert(
        `Change  ${this.entity} : ${item.area_name} Status`,
        "Are you sure to change the status",
        "warning"
      );
      if (result.isConfirmed) {
        this.apiCallPost(ApiEndPoint.Area.changeAreaStatus, {
          Id: item.area_id,
          area_status: item.area_is_active,
        });
      } else {
        if (item.area_is_active == false) {
          item.area_is_active = true;
        } else {
          item.area_is_active = false;
        }
      }
    },
    // #region Get Details
    getDetails() {
      this.isLoaderActive = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `area_id` : sortBy[0];
      ApiService.get(ApiEndPoint.Area.getArea, {
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
    // delete
    async deleteItem(item) {
      const result = await Global.showConfirmationAlert(
        `Delete Specialization ${item.area_name}`,
        "Are you sure to delete",
        "warning"
      );
      if (result.isConfirmed) {
        this.apiCallPost(ApiEndPoint.Area.deleteArea, {
          area_id: item.area_id,
        });
      }
    },

    apiCallPost(endPoint, parameter) {
      ApiService.post(endPoint, parameter)
        .then((response) => {
          this.isLoaderActive = false;
          if (response.data.success == "true") {
            Global.showSuccessAlert(true, "success", response.data.message);
            this.getDetails();
          } else if (response.data.result == "error") {
            Global.showErrorAlert(true, "error", response.data.message);
          }
        })
        .catch((error) => {
          this.isLoaderActive = false;
          console.log(error);
          if (error.response.status != 401 || error.response.status != 403) {
            Global.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
    // #endregion
  },
};
