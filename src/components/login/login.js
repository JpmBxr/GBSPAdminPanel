import { globalMixin } from "../../mixins/globalMixin";
import { ApiEndPoint } from "../../helpers/apiEndPoint";
import { ApiService } from "@/helpers/apiService";
import { Global } from "@/helpers/global";
export const login = {
  // #region Mixin
  mixins: [globalMixin],
  // #endregion

  // #region Components
  components: {},
  // #endregion

  // #region Data Section
  data() {
    return {
      mobile: "",
      password: "",
      isLoaderActive: false,
      isholdingFormValid: true,
      isPasswordVisible: false,
      companyName: Global.companyName,
    };
  },
  // #endregion
  //#region - Function Created
  created() {
    // get the vuetify dark theme false
    this.$vuetify.theme.dark = false;
  },
  //#endregion
  //#region Mounted
  mounted() {},
  //#endregion

  // #region Method Section
  methods: {
    // #region Validate Login
    validateLogin() {
      if (this.$refs.holdingForm.validate()) {
        this.isLoaderActive = true;

        ApiService.post(ApiEndPoint.Authentication.login, {
          user_mobile: this.mobile,
          password: this.password,
        })
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.result == "success") {
              console.log(response.data);
              secureLS.set(Global.tokenKey, response.data.token);
              secureLS.set(
                Global.firstName,
                response.data.userData.user_first_name
              );
              secureLS.set(
                Global.lastName,
                response.data.userData.user_last_name
              );
              secureLS.set(
                Global.fullName,
                response.data.userData.user_full_name
              );
              secureLS.set(
                Global.profileImage,
                response.data.userData.user_profile_image
              );

              secureLS.set(Global.userId, response.data.userData.user_id);
              this.$router.push({ name: "City" });
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
  //#endregion
};
