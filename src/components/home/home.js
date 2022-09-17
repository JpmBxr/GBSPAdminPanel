import { globalMixin } from "../../mixins/globalMixin";
import { Global } from "../../helpers/global";
import SecureLS from "secure-ls";
export const home = {
  mixins: [globalMixin],
  //#region - Data Section
  data() {
    return {
      //#region - Menu
      menuClass: Global.menuClass,
      menuColor: Global.menuColor,
      menuItemsUsers: [
        {
          text: "City",
          icon: "mdi-city",
          to: "/home/master/city/city-master",
        },
        {
          text: "Area",
          icon: "mdi-home",
          to: "/home/master/area/area-master",
        },

        {
          text: "Doctor",
          icon: "mdi-account-settings",
          to: "/home/master/doctor/doctor-master",
        },
        {
          text: "Cinic",
          icon: "mdi-medical-bag",
          to: "/home/master/clinic/clinic-master",
        },
      ],

      menuItemsTrans: [
        {
          text: "Book My Test",
          icon: "mdi-cryengine",
          to: "/home/transaction/bookTest/book-test",
        },
        {
          text: "Book Medicine",
          icon: "mdi-ambulance",
          to: "/home/transaction/bookMedicine/book-medicine",
        },
        {
          text: "OPD Booking Dates",
          icon: "mdi-bookmark-plus-outline ",
          to: "/home/transaction/slotDates/slot-dates",
        },
        {
          text: "Video Slot Date",
          icon: "mdi-movie-open-plus",
          to: "/home/transaction/videoSlotDate/video-slot-date",
        },
        {
          text: "Video Booking Details",
          icon: "mdi-video-wireless-outline",
          to: "/home/transaction/videoBookingDetails/video-booking-details",
        },
        {
          text: "Upcoming Video Booking Details",
          icon: "mdi-video-check-outline",
          to: "/home/transaction/upcomingVideoBookingDetails/upcoming-video-booking-details",
        },
      ],

      menuItemsReports: [
        {
          text: "Booking Details",
          icon: "mdi-calendar-check",
          to: "/home/reports/bookingDetails/booking-details",
        },
        {
          text: "Upcoming Booking",
          icon: "mdi-calendar-sync",
          to: "/home/reports/upcomingClinicBookingDetails/upcoming-clinic-booking-details",
        },
        {
          text: "Clinic Wise Booking",
          icon: "mdi-home-search-outline",
          to: "/home/reports/clinicBookingDetails/clinic-booking-details",
        },
        {
          text: "Register Patient's Booking",
          icon: "mdi-home-search-outline",
          to: "/home/reports/regPatient/reg-patient",
        },
        {
          text: "Video Visit Clinic Wise",
          icon: "mdi-video-marker-outline",
          to: "/home/reports/videoVisitClinicWise/video-visit-clinic-wise",
        },
        {
          text: "Doctor Wise Patient Details",
          icon: "mdi-doctor",
          to: "/home/reports/doctorWisePatientDetails/doctor-wise-patient-details",
        },
      ],
      //#endregion

      

      //#region - Side Bar Data
      sideMenu: true,
      toggleMini: false,
      toggleNavbar: true,
      companyName: Global.companyName,
      poweredBy: Global.poweredBy,
      //#endregion

      //#region - Logged User Data
      loggedUserFullName: secureLS.get(Global.fullName),
      loggedUserInitials:
        secureLS.get(Global.firstName).substring(0, 1) +
        secureLS.get(Global.lastName).substring(0, 1),
      loggedUserProfileImage:
        secureLS.get(Global.profileImage) == "0"
          ? Global.profileImageUrl + "default.png"
          : Global.profileImageUrl + secureLS.get(Global.profileImage),

      //#endregion

      //#region - Theme Data
      isLoaderActive: false,
      isDarkMode: false,
      themeId: "",
      themeName: "",
      themes: [
        {
          themeData: {
            Id: 2,
            name: "Blue",
            dark: {
              primary: "#3366FF",
              accent: "#e83e8c",
              secondary: "#425761",
              success: "#00d68f",
              info: "#0095ff",
              warning: "#ffaa00",
              error: "#ff3d71",
              background: "#151a30",
              cardbackground: "#222b45",
              appbar: "#222B45",
              appbarcontent: "#fff",
              sidepanel: "#222B45",
              primaryBtn: "#598bff",
              secondaryBtn: "#607d8b",
              textBtn: "#fff",
            },
            light: {
              primary: "#3366FF",
              accent: "#e83e8c",
              secondary: "#33393e",
              success: "#00d68f",
              info: "#0095ff",
              warning: "#ffaa00",
              error: "#ff3d71",
              background: "#edf1f7",
              cardbackground: "#FFFFFF",
              appbar: "#fff",
              appbarcontent: "#212121",
              sidepanel: "#FFFFFF",
              primaryBtn: "#598bff",
              secondaryBtn: "#6c757d",
              textBtn: "#fff",
            },
          },
        },
        {
          themeData: {
            Id: 6,
            name: "Orange",
            dark: {
              primary: "#ffa450",
              accent: "#FFCA28",
              secondary: "#425761",
              success: "#00d68f",
              info: "#0095FF",
              warning: "#FFAA00",
              error: "#ff3d71",
              background: "#161B30",
              cardbackground: "#222B45",
              appbar: "#222B45",
              appbarcontent: "#fff",
              sidepanel: "#222B45",
              primaryBtn: "#ffc94d",
              secondaryBtn: "#607d8b",
              textBtn: "#fff",
            },
            light: {
              primary: "#ffa450",
              accent: "#a1e754",
              secondary: "#33393e",
              success: "#00d68f",
              info: "#0095FF",
              warning: "#FFAA00",
              error: "#ff3d71",
              background: "#EBEFF5",
              cardbackground: "#FFFFFF",
              appbar: "#6200EE",
              appbarcontent: "#fff",
              sidepanel: "#D3D3D3",
              primaryBtn: "#ffc94d",
              secondaryBtn: "#6c757d",
              textBtn: "#fff",
            },
          },
        },

        {
          themeData: {
            Id: 1,
            name: "Purple",
            dark: {
              primary: "#6200EE",
              accent: "#FFCA28",
              secondary: "#425761",
              success: "#00d68f",
              info: "#0095ff",
              warning: "#ffaa00",
              error: "#ff4c51",
              background: "#161B30",
              cardbackground: "#222B45",
              appbar: "#222B45",
              appbarcontent: "#fff",
              sidepanel: "#222B45",
              primaryBtn: "#ff7b9e",
              secondaryBtn: "#607d8b",
              textBtn: "#fff",
            },
            light: {
              primary: "#6200EE",
              accent: "#ffe063",
              secondary: "#33393e",
              success: "#00d68f",
              info: "#0095ff",
              warning: "#ffaa00",
              error: "#ff4c51",
              background: "#EDF1F7",
              cardbackground: "#fff",
              appbar: "#6200EE",
              appbarcontent: "#fff",
              sidepanel: "#fff",
              primaryBtn: "#903df4",
              secondaryBtn: "#6c757d",
              textBtn: "#fff",
            },
          },
        },
      ],
      //#endregion
    };
  },
  //#endregion
  //#region - Mounted Section
  mounted() {
    window.onpopstate = (event) => {
      if (this.$router.history.current.path == "/home") {
        this.$router.push({
          path: "home/master/role/role-master",
        });
      }
    };
  },
  //#endregion

  //#region - Computed Section
  computed: {
    mini() {
      return this.toggleMini;
    },
  },
  //#endregion
  //#region - Created Section
  created() {
    this.setTheme("Purple");
    // this.getLoggedUserRolePermission();
  },
  //#endregion
  //#region - Method Section
  methods: {
    //#region - Toggle Mini Bar
    toggleMiniBar() {
      if (!this.$vuetify.breakpoint.lgAndUp) {
        this.sideMenu = !this.sideMenu;
      } else if (this.$vuetify.breakpoint.mdAndUp) {
        this.toggleMini = !this.toggleMini;
      }
    },
    //#endregion

    //#region -Logout
    logout() {
      secureLS.removeAll();
      this.$router.push({ name: "Login" });
    },
    //#endregion

    //#region - Toggle Theme
    toggleLightDarkMode() {
      this.$vuetify.theme.dark = this.isDarkMode;
    },
    //#endregion

    //#region - Set Theme
    setTheme(themeName) {
      this.$vuetify.theme.dark = this.isDarkMode;
      Object.keys(this.themes).forEach((i) => {
        if (
          this.themes[i].themeData.name.toUpperCase() == themeName.toUpperCase()
        ) {
          let dark = this.themes[i].themeData.dark;
          let light = this.themes[i].themeData.light;
          this.themeId = this.themes[i].themeData.Id;
          Object.keys(dark).forEach((j) => {
            this.$vuetify.theme.themes.dark[j] = dark[j];
          });
          Object.keys(light).forEach((j) => {
            this.$vuetify.theme.themes.light[j] = light[j];
          });
        }
      });
    },
    //#endregion
  },
  //#endregion
};
