import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const doctorMaster = {
  props: ["userPermissionDataProps"],
  mixins: [globalMixin],
  //#region  Data section
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
          value: "doctor_full_name",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Device Profile Image",
          value: "doctor_profile_image",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Mobile",
          value: "doctor_mobile_number",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Specialization",
          value: "specialization_name",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Experience",
          value: "doctor_overall_experience",
          width: "10%",
          sortable: true,
          align: "start",
        },
        {
          text: "Status",
          value: "doctor_is_active",
          sortable: false,
          width: "15%",
          align: "start",
        },

        {
          text: "Actions",
          value: "actions",
          sortable: false,
          width: "15%",
          align: "end",
        },
      ],

      pagination: {},
      entity: "Doctor",
      searchText: "", // search
      totalItemsInDB: 0,
      item: {},
      addEditDialog: false,
      isFormAddEditValid: false,
      isAddEdit: true,
      addUpdateButtonText: "Add Doctor",
      addEditText: "Add",
      isLoaderActive: false,
      isDialogLoaderActive: false,

      tableItems: [],
      cityItems: [],
      areaItems: [],
      diseaseCategoryItems: [],
      doctorApprovedItems: [
        {
          "value": "0",
          "name": "No",
        },
        {
          "value": "1",
          "name": "Yes",
        }
      ],
      imageRule: [],
      doctorProfileImage: null,
      profileImageUrl: null,
      tableDataLoading: false,

      //end

      //excel
      excelFields: {
        doctor_full_name: "doctor_full_name",
        doctor_profile_image: "doctor_profile_image",
        doctor_mobile_number: "doctor_mobile_number",
        specialization_name: "specialization_name",
        doctor_overall_experience: "doctor_overall_experience",
        Status: "doctor_is_active",
      },
      excelFileName:
        "Doctor" + "_" + moment().format("DD/MM/YYYY") + ".xls",
      //end
    };

  },
  //#endregion

  //#region  created section
  created() {
    //  get the Doctor Details List
    this.profileImageUrl = Global.profileImageUrl;
    this.getDoctorDetailsList();
    

  },
  //#endregion

   //#region loading City, Area on page load/ mount 
   mounted() {
    // Show Add in dialog
    this.getCity();

  },
  //#endregion

  //#region Computed section
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

  //#region watch setion
  watch: {
    //#region  add/edit dialog
    addEditDialog(value) {
      return value ? true : this.close();
    },
    //#endregion

    //#region 
    doctorProfileImage(val) {
      this.doctorProfileImage = val;
      this.imageRule =
        this.doctorProfileImage != null
          ? [(v) => !v || v.size <= 1048576 || "File size should be 1MB"]
          : [];
    },
    //#endregion

    //#region Pagination
    pagination: {
      handler() {
        this.getDoctorDetailsList();
      },
      deep: true,
    },
    //#endregion
  },
  //#endregion


  //#region loading City, Area on page load/ mount 
  mounted() {
    // Show Add in dialog
    this.getCity();
    this.getDiseaseCategory();

  },
  //#endregion

  //#region Method section
  methods: {
    //#region To get the Doctor Details List
    getDoctorDetailsList() {
      this.tableDataLoading = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `doctor_id` : sortBy[0];
      ApiService.get(ApiEndPoint.Doctor.webGetDoctorDetails, {
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

    //#region  search
    searchInfo() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.getDoctorDetailsList();
      }, 500);
    },
    //#endregion

    //#region  show add/edit dialog
    async showAddEditDialog(item) {
      
      // Show Add
      if (item == null && this.isAddEdit == true) {
        this.addEditText = `Add ${this.entity}`;
        this.addEditDialog = true;
        this.addUpdateButtonText = " Add ";
      } else {
        // Show Edit (Update)

        let city_id = this.cityItems.filter((c) => item?.city_id.split(",").includes(String(c.city_id))).map(i => i)
        this.item.city_id = item.city_id
        await this.getArea();
        let area_id = this.areaItems.filter((a) => item?.area_id.split(",").includes(String(a.area_id))).map(i => i);

        const disease_category_id = this.diseaseCategoryItems.filter((d) => item?.disease_category_id.split(",").includes(String(d.disease_category_id))).map(i => i);

        const [doctor_first_name, doctor_last_name] = item?.doctor_full_name?.split(" ");

        // const doctor_is_approved = this.doctorApprovedItems.map((i) => i.value === item.doctor_is_approved)

        this.item = {
          ...item,
          city_id,
          area_id,
          disease_category_id,
          doctor_first_name, 
          doctor_last_name,
          // doctor_is_approved,
          
        };
        this.addEditText = `Edit ${this.entity} : ` + item.doctor_full_name;
        this.addEditDialog = true;
        this.addUpdateButtonText = "Update";
      }
    },
    //#endregion

    //#region  to load City
    getCity() {
      this.isDialogLoaderActive = true;
      ApiService.get(
        ApiEndPoint.Doctor.getCityIdWithoutPagination,
        {}
      )
        .then((response) => {
          this.isDialogLoaderActive = false;
          this.cityItems = response.data.resultData;
        })
        .catch((error) => {
          this.isDialogLoaderActive = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
    //#endregion


    //#region  to load Area
    async getArea() {
      this.isDialogLoaderActive = true;
      try {
        const response = await ApiService.get(
          ApiEndPoint.Doctor.getAreaIdWithoutPagination,
          { city_id: this.item.city_id.toString() }
        )
        this.areaItems = response.data.resultData;
        this.isDialogLoaderActive = false;
      } catch (error) {
        this.isDialogLoaderActive = false;
        if (error.response.status != 401 && error.response.status != 403) {
          this.showErrorAlert(true, "error", "Something went wrong");
        }
      }
    },
    //#endregion

    //#region  to load City
    getDiseaseCategory() {
      this.isDialogLoaderActive = true;
      ApiService.get(
        ApiEndPoint.Doctor.webGetDiseaseCategory,
        {}
      )
        .then((response) => {
          this.isDialogLoaderActive = false;
          this.diseaseCategoryItems = response.data.resultData;
        })
        .catch((error) => {
          this.isDialogLoaderActive = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
    //#endregion

    //#region  add/edit item
    addEditItem() {

      if (this.$refs.holdingFormAddEdit.validate()) {
        if (this.isAddEdit) {
          // save
          this.isDialogLoaderActive = true;
          let postData = new FormData();
          if (this.doctorProfileImage != null) {
            postData.append("doctor_profile_image", this.doctorProfileImage);
          }
          postData.append("disease_category_id", 0);
          postData.append("city_id", this.item.city_id);
          postData.append("area_id", this.item.area_id);
          postData.append("disease_category_id", this.item.disease_category_id);
          postData.append("doctor_overall_experience", this.item.doctor_overall_experience);
          postData.append("doctor_first_name", this.item.doctor_first_name);
          postData.append("doctor_last_name", this.item.doctor_last_name);
          postData.append("specialization_name", this.item.specialization_name);
          postData.append("education_name", this.item.education_name);
          postData.append("doctor_mobile_number", this.item.doctor_mobile_number);
          postData.append("doctor_description", this.item.doctor_description);
          postData.append("experience_name", this.item.experience_name);

          ApiService.post(ApiEndPoint.Doctor.saveDoctorDetails, postData)
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.success == "true") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getDoctorDetailsList();
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
        } else {

          //update
          this.isDialogLoaderActive = true;
          let postData = new FormData();
          if (this.doctorProfileImage != null) {
            postData.append("doctor_profile_image", this.doctorProfileImage);
          }
          postData.append("disease_category_id", 0);
          postData.append("city_id", this.item.city_id.toString());
          postData.append("area_id", this.item.area_id.toString());
          postData.append("disease_category_id", this.item.disease_category_id);
          postData.append("doctor_overall_experience", this.item.doctor_overall_experience);
          postData.append("doctor_first_name", this.item.doctor_first_name);
          postData.append("doctor_last_name", this.item.doctor_last_name);
          postData.append("specialization_name", this.item.specialization_name);
          postData.append("education_name", this.item.education_name);
          postData.append("doctor_mobile_number", this.item.doctor_mobile_number);
          postData.append("doctor_description", this.item.doctor_description);
          postData.append("experience_name", this.item.experience_name);
          postData.append("doctor_id", this.item.doctor_id);

          ApiService.post(ApiEndPoint.Doctor.webUpdateDoctorDetails, postData)
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.success == "true") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getDoctorDetailsList();
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

    //#region  to close the dialog
    close() {
      this.addEditDialog = false;
      setTimeout(() => {
        this.item = Object.assign({}, {
          cityItems: this.cityItems,
          areaItems: this.areaItems,
        });
      }, 300);
    },
    //#endregion

    //#region  enable disable
    async enableDisableItem(item) {
      const result = await Global.showConfirmationAlert(
        `Change  ${this.entity} : ${item.doctor_full_name} Status`,
        "Are you sure to change the status",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;

        ApiService.post(
          ApiEndPoint.Doctor.changeDoctorDetailsStatus, {
          doctor_id: item.doctor_id,
          doctor_is_active: item.doctor_is_active,
        }
        )
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.success == "true") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getDoctorDetailsList();
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
        if (item.doctor_is_active == false) {
          item.doctor_is_active = true;
        } else {
          item.doctor_is_active = false;
        }
      }
    },
    //#endregion

    //#region Delete Item
    async deleteItem(item) {
      const result = await Global.showConfirmationAlert(
        `Delete ${this.entity} ${item.doctor_full_name}`,
        "Are you sure to delete",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;
        ApiService.post(ApiEndPoint.Doctor.deleteDoctorDetails, {
          doctor_id: item.doctor_id,
        })
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.success == "true") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getDoctorDetailsList();
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
  },
  //#endregion
};
