<template>
  <!-- Card Start -->
  <v-container fluid class="pa-4">
    <v-overlay :value="isLoaderActive" color="primary">
      <v-progress-circular
        indeterminate
        size="50"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
    <v-card class="mb-10">
      <v-card-actions>
        <v-row class="ml-4 mr-4 mt-1 mb-4">
          <v-toolbar-title dark color="primary">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5">
                  <strong>{{ entity }}</strong>
                </v-list-item-title>
                <v-list-item-subtitle
                  >Home <v-icon>mdi-chevron-right</v-icon> {{ module }}
                  <v-icon>mdi-chevron-right</v-icon>
                  {{ entity }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-row>

        <v-spacer></v-spacer>

        <v-btn icon @click="show = !show">
          <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="show">
         
          <v-row dense class="mt-5 px-4">
            <v-col cols="4">
              <v-autocomplete
                v-model="clinic_id"
                :items="clinicItems"
                dense
                chips
                small-chips
                label="Select Clinic"
                item-text="clinic_full_name"
                item-value="clinic_id"
              ></v-autocomplete>
            </v-col>

            <v-col cols="3">
              <v-autocomplete
                v-model="in_clinic_booking_is_active"
                :items="bookingStatusItems"
                dense
                small-chips
                label="Booking Status"
                item-text="status"
                item-value="id"
              >
              </v-autocomplete>
            </v-col>

            <v-col cols="2" class="px-4 my-0">
              <v-btn
                class="ma-0"
                outlined
                color="indigo"
                rounded
                small
                @click="getDetails"
              >
                <v-icon class="mr-2" small>mdi-magnify</v-icon> Search Booking
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>
      <transition name="fade" mode="out-in">
        <v-data-table
          :headers="tableHeader"
          :items="dataTableRowNumbering"
          item-key="id"
          dense
          :options.sync="pagination"
          class="elevation-0"
          :loading="tableDataLoading"
          :loading-text="tableLoadingDataText"
          :server-items-length="totalItemsInDB"
          :items-per-page="15"
          :footer-props="{
            itemsPerPageOptions: [200, 300, 500, 1000],
          }"
        >
          <template v-slot:no-data>
            <p class="font-weight-black bold title" style="color: red">
              No Data Found
            </p>
          </template>

          <template v-slot:top>
            <v-toolbar flat>
              <v-text-field
                class="mt-4"
                v-model="searchText"
                label="Search"
                placeholder="Enter Clinic Name | Doctor | Disease and press ENTER to search"
                prepend-inner-icon="mdi-magnify"
                @keydown.enter="searchInfo"
              ></v-text-field>
              <v-spacer></v-spacer>
              <span class="text-right mx-1 d-none d-md-block">
                <strong class="primary--text">
                  {{ totalItemsInDB }}
                </strong>
                Records Found
              </span>
              <v-btn
                class="mx-md-4 mx-sm-1"
                icon
                small
                color="success"
                size="24"
                v-if="!tableDataLoading"
              >
                <download-excel
                  :data="tableItems"
                  :fields="excelFields"
                  :name="excelFileName"
                >
                  <v-icon dark>mdi-cloud-download</v-icon>
                </download-excel>
              </v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </transition>

      <!-- Card End -->
    </v-card>
  </v-container>
</template>
<script>
import { upcomingClinicBookingDetails } from "../upcomingClinicBookingDetails/upcomingClinicBookingDetails";
export default upcomingClinicBookingDetails;
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.9s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
