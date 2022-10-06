import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const cityMaster = {
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
          text: "City",
          value: "city_name",
          width: "50%",
          sortable: true,
          align: "start",
        },
        {
          text: "Status",
          value: "city_is_active",
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
      entity: "City",
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
      addUpdateButtonText: "Add City",
      addEditText: "Add",
      isLoaderActive: false,
      isDialogLoaderActive: false,

      tableItems: [],
      tableDataLoading: false,

      //end

      //excel
      excelFields: {
        ID: "product_mode_id",
        Name: "product_mode",
      },
      excelFileName:
        //  "CityMaster" + "_" + moment().format("DD/MM/YYYY") + ".xls",
        "CityMaster" + "_aaaa.xls",
      //end
    };
  },
  created() {
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
    // #region Get Details
    getDetails() {
      this.isLoaderActive = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `city_id` : sortBy[0];
      ApiService.get(ApiEndPoint.City.getCity, {
        itemsPerPage: itemsPerPage,
        sortColumn: sortBy,
        sortOrder: sortDesc,
        page: page,
        searchText: this.searchText,
      })
        .then((response) => {
          this.isLoaderActive = false;
          console.log("City", response.data.resultData.data);

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

    //show add edit dialog
    showAddEditDialog(item) {
      if (item == null && this.isAddEdit == true) {
        this.addEditText = `Add New ${this.entity}`;
        this.addEditDialog = true;
        this.addUpdateButtonText = " Add ";
      } else {
        this.item = Object.assign({}, item);
        this.addEditText = `Edit ${this.entity} : ` + item.city_name;
        this.addEditDialog = true;
        this.addUpdateButtonText = "Update";
      }
    },

     //#region add Edit
     addEditItem() {
      if (this.$refs.holdingFormAddEdit.validate()) {
        if (this.isAddEdit) {
          // save
          this.isDialogLoaderActive = true;
          ApiService.post(ApiEndPoint.City.saveCity, {
            city_name: this.item.city_name,
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.getDetails();
              this.close();
              if (response.data.success == "true") {
                Global.showSuccessAlert(true, "success", response.data.message);
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
          ApiService.post(ApiEndPoint.City.updateCity, {
            city_name: this.item.city_name,
            Id: this.item.city_id,
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.getDetails();
              this.close();
              if (response.data.success == "true") {
                Global.showSuccessAlert(true, "success", response.data.message);
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

     //#region  enable disable
     async enableDisableItem(item) {
      const result = await Global.showConfirmationAlert(
        `Change  ${this.entity} : ${item.city_name} Status`,
        "Are you sure to change the status",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;

        ApiService.post(ApiEndPoint.City.changeCityStatus, {
          Id: item.city_id,
          city_status: item.city_is_active,
        })
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

            if (error.response.status != 401 || error.response.status != 403) {
              Global.showErrorAlert(true, "error", "Something went wrong");
            }
          });
      } else {
        if (item.city_is_active == false) {
          item.city_is_active = true;
        } else {
          item.city_is_active = false;
        }
      }
    },
    //#endregion

    //#region Delete Item
    async deleteItem(item) {
      const result = await Global.showConfirmationAlert(
        `Delete Specialization ${item.city_name}`,
        "Are you sure to delete",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;
        ApiService.post(ApiEndPoint.City.deleteCity, {
          city_id: item.city_id,
        })
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

            if (error.response.status != 401 || error.response.status != 403) {
              Global.showErrorAlert(true, "error", "Something went wrong");
            }
          });
      }
    },
    // #endregion
  },
};
