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
          <v-btn
            :disabled="tableDataLoading"
            class="white--text primary-button mx-0 d-none d-md-block mr-4 mt-4"
            @click="
              isAddEdit = true;
              showAddEditDialog(null);
            "
          >
            Add {{ entity }}
            <v-icon right dark> mdi-plus </v-icon>
          </v-btn>
        </v-row>
        <!-- <v-spacer></v-spacer>

        <v-btn icon @click="show = !show">
          <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn> -->
      </v-card-actions>
      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>
          <v-row dense class="mt-5 px-4">
            <v-col cols="4">
              <v-menu
                ref="menu_video_slot_dates"
                v-model="menu_video_slot_dates"
                :close-on-content-click="false"
                :return-value.sync="video_slot_dates"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="video_slot_dates"
                    label="Select Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    dense
                  ></v-text-field>
                </template>
                <v-date-picker v-model="video_slot_dates" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu_video_slot_dates = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu_video_slot_dates.save(video_slot_dates)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="4" md="4" class="px-4 my-0">
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

          <template v-slot:item.video_slot_dates_is_active="{ item }">
            <v-switch
              :color="item.video_slot_dates_is_active == 1 ? 'green' : 'red'"
              inset
              dense
              v-model="item.video_slot_dates_is_active"
              @change="enableDisableItem(item)"
            >
            </v-switch>
          </template>

          <template v-slot:item.video_booking_available="{ item }">
            <v-select
              v-model="item.video_booking_available"
              :items="blockItems"
              label="Select Block"
              single-line
              :rules="validationRulesRequired"
            >
            </v-select>
          </template>

          <template v-slot:item.update="{ item }">
            <v-btn
              color="blue-grey"
              class="ma-2 white--text"
              @click="blockItem(item)"
            >
              Update
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon
              size="30"
              class="mx-1 fitPotPrimaryIcon"
              @click="
                isAddEdit = false;
                showAddEditDialog(item);
              "
              >mdi-square-edit-outline</v-icon
            >
          </template>
        </v-data-table>
      </transition>

      <!--start of Add / edit -->
      <v-dialog
        transition="dialog-top-transition"
        v-model="addEditDialog"
        max-width="400"
        scrollable
        :fullscreen="$vuetify.breakpoint.smAndDown"
        persistent
      >
        <template v-slot:default="dialog">
          <v-overlay :value="isDialogLoaderActive" color="primary">
            <v-progress-circular
              indeterminate
              size="50"
              color="primary"
            ></v-progress-circular>
          </v-overlay>
          <v-card>
            <v-toolbar
              color="primary"
              dark
              :max-height="$vuetify.breakpoint.smAndDown ? 56 : '20vh'"
            >
              <v-toolbar-title class="popup-header">{{
                addEditText
              }}</v-toolbar-title>
              <v-spacer></v-spacer><v-spacer></v-spacer>
              <v-btn icon dark @click="addEditDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="py-4 px-2">
              <v-form
                ref="holdingFormAddEdit"
                v-model="isFormAddEditValid"
                lazy-validation
              >
                <v-row class="mx-auto">
                  <v-col cols="12" md="12" class="pt-5">
                    <v-autocomplete
                      v-model="item.doctor_id"
                      :items="doctorItems"
                      item-text="doctor_full_name"
                      item-value="doctor_id"
                      dense
                      outlined
                      :rules="validationRulesRequired"
                    >
                      <template #label>
                        Select Doctor
                        <span class="red--text">
                          <strong>*</strong>
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="12" class="pt-5">
                    <v-text-field
                      v-model="item.max_slot"
                      dense
                      outlined
                      :rules="validationRulesRequired"
                      @keypress="acceptDigit"
                    >
                      <template #label>
                        Max Slot
                        <span class="red--text">
                          <strong>*</strong>
                        </span>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="12" class="pt-5">
                    <v-menu
                      ref="menu2_video_slot_dates"
                      v-model="menu2_video_slot_dates"
                      :close-on-content-click="false"
                      :return-value.sync="video_slot_dates"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="item.video_slot_dates"
                          label="Select Date"
                          prepend-inner-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          dense
                          outlined
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="item.video_slot_dates"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="menu2_video_slot_dates = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.menu2_video_slot_dates.save(video_slot_dates)
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-end pt-4 pb-6">
              <v-btn class="mx-2 secondary-button" @click="close()"
                >Close</v-btn
              >
              <v-btn
                class="mx-2 primary-button"
                @click="addEditItem()"
                :disabled="!isFormAddEditValid"
              >
                {{ addUpdateButtonText }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <!--end of add/edit -->
      <!-- Card End -->
    </v-card>
  </v-container>
</template>
<script>
import { videoSlotDate } from "./videoSlotDate";
export default videoSlotDate;
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
