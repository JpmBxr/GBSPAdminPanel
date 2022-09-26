import { Global } from "@/helpers/global";
import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const router = new Router({
  mode:'history',
  routes: [
    {
      path: "/",
      redirect: {
        name: "Login",
      },
    },
    {
      path: "/login",
      name: "Login",
      component: require("../components/login/Login.vue").default,
    },

    {
      path: "/home",
      component: require("../components/home/Home.vue").default,
      name: "Home",
      meta: {
        requiresAuth: true,
      },
      children: [
        //#region Dashboard
        {
          path: "dashboard",
          component: require("../components/dashboard/Dashboard.vue").default,
          name: "Dashboard",
          meta: {
            requiresAuth: true,
          },
        },
        //#region Master
        {
          path: "master/city/city-master",
          component: require("../components/master/city/CityMaster.vue")
            .default,
          name: "City",
          meta: {
            requiresAuth: true,
          },
        },

        {
          path: "master/area/area-master",
          component: require("../components/master/area/AreaMaster.vue")
            .default,
          name: "Area",
          meta: {
            requiresAuth: true,
          },
        },

        {
          path: "master/doctor/doctor-master",
          component: require("../components/master/doctor/DoctorMaster.vue")
            .default,
          name: "Doctor",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "master/clinic/clinic-master",
          component: require("../components/master/clinic/ClinicMaster.vue")
            .default,
          name: "Clinic",
          meta: {
            requiresAuth: true,
          },
        },

        //#endregion

        //#region transaction
        {
          path: "transaction/slotDates/slot-dates",
          component:
            require("../components/transaction/slotDates/SlotDates.vue")
              .default,
          name: "OPD Booking Dates",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "transaction/videoBookingDetails/video-booking-details",
          component:
            require("../components/transaction/videoBookingDetails/VideoBookingDetails.vue")
              .default,
          name: "Video Booking Details",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "transaction/videoSlotDate/video-slot-date",
          component:
            require("../components/transaction/videoSlotDate/VideoSlotDate.vue")
              .default,
          name: "Video Booking Details",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "transaction/upcomingVideoBookingDetails/upcoming-video-booking-details",
          component:
            require("../components/transaction/upcomingVideoBookingDetails/UpcomingVideoBookingDetails.vue")
              .default,
          name: "Upcoming Video Booking Details",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "transaction/bookMedicine/book-medicine",
          component:
            require("../components/transaction/bookMedicine/BookMedicine.vue")
              .default,
          name: "Book Medicine",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "transaction/bookMedicine/viewMedicineDoc/view-medicine-doc",
          component:
            require("../components/transaction/bookMedicine/viewMedicineDoc/ViewMedicineDoc.vue")
              .default,
          name: "viewMedicineDoc",
          meta: {
            requiresAuth: true,
          },
        },

        {
          path: "transaction/bookTest/book-test",
          component:
            require("../components/transaction/bookTest/BookTest.vue")
              .default,
          name: "Book Test",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "transaction/bookTest/viewTestDoc/view-test-doc",
          component:
            require("../components/transaction/bookTest/viewTestDoc/ViewTestDoc.vue")
              .default,
          name: "viewTestDoc",
          meta: {
            requiresAuth: true,
          },
        },
        //#endregion


         //#region reports
         {
          path: "reports/bookingDetails/booking-details",
          component:
            require("../components/reports/bookingDetails/BookingDetails.vue")
              .default,
          name: "Area",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "reports/clinicBookingDetails/clinic-booking-details",
          component:
            require("../components/reports/clinicBookingDetails/ClinicBookingDetails.vue")
              .default,
          name: "Area",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "reports/upcomingClinicBookingDetails/upcoming-clinic-booking-details",
          component:
            require("../components/reports/upcomingClinicBookingDetails/UpcomingClinicBookingDetails.vue")
              .default,
          name: "Area",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "reports/regPatient/reg-patient",
          component:
            require("../components/reports/regPatient/RegPatient.vue")
              .default,
          name: "regPatient",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "reports/regPatient/viewClinicBooking/view-clinic-booking",
          component:
            require("../components/reports/regPatient/viewClinicBooking/ViewClinicBooking.vue")
              .default,
          name: "viewClinicBooking",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "reports/regPatient/viewVideoBooking/view-video-booking",
          component:
            require("../components/reports/regPatient/viewVideoBooking/ViewVideoBooking.vue")
              .default,
          name: "viewVideoBooking",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "reports/videoVisitClinicWise/video-visit-clinic-wise",
          component:
            require("../components/reports/videoVisitClinicWise/VideoVisitClinicWise.vue")
              .default,
          name: "Video Visit Clinic Wise",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "reports/doctorWisePatientDetails/doctor-wise-patient-details",
          component:
            require("../components/reports/doctorWisePatientDetails/DoctorWisePatientDetails.vue")
              .default,
          name: "Doctor Wise Patient Details",
          meta: {
            requiresAuth: true,
          },
        },
        //#endregion
      ],
    },
    {
      path: "*",
      component: require("../components/NotFound.vue").default,
    },
  ],
});

router.beforeEach((to, from, next) => {
  console.log(secureLS.get(Global.tokenKey));
  try {
    //* Check if the route requires authentication & user not logged in
    if (
      to.matched.some((route) => route.meta.requiresAuth) &&
      secureLS.get(Global.tokenKey) == ""
    ) {
      next({
        name: "Login",
      });
      return;
    }

    //* if logged in redirect to dashboard
    if (to.path === "/login" && secureLS.get(Global.tokenKey) != "") {
      next({
        name: "Dashboard",
      });
      return;
    }
    next();
  } catch (err) {
    secureLS.removeAll();
    router.push({ name: "Login" });
  }
});
export default router;
