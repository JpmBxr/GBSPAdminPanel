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
      <v-row class="ml-4 mr-4 mt-1 mb-4">
        <v-toolbar-title dark color="primary">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5">
                <strong>{{ entity }}</strong>
              </v-list-item-title>
              <v-list-item-subtitle
                >Home <v-icon>mdi-chevron-right</v-icon> Master
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
      <transition name="fade" mode="out-in">
        <v-data-table
          :headers="tableHeader"
          :items="dataTableRowNumbering"
          item-key="id"
          :options.sync="pagination"
          class="elevation-0"
          :loading="tableDataLoading"
          :loading-text="tableLoadingDataText"
          :server-items-length="totalItemsInDB"
          :items-per-page="15"
          :footer-props="{
            itemsPerPageOptions: [15, 20, 25],
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
                prepend-inner-icon="mdi-magnify"
                @input="searchInfo"
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

              <v-btn
                icon
                small
                size="24"
                :disabled="tableDataLoading"
                color="primary"
                class="white--text my-auto mr-1 ml-3 d-md-none"
                @click="
                  isAddEdit = true;
                  showAddEditDialog(null);
                "
              >
                <v-icon>mdi-plus-circle</v-icon>
              </v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.area_is_active="{ item }">
            <v-switch
              :color="item.area_is_active == 1 ? 'green' : 'red'"
              inset
              dense
              v-model="item.area_is_active"
              @change="enableDisableItem(item)"
            >
            </v-switch>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon
              size="22"
              class="mx-1 fitPotPrimaryIcon"
              @click="
                isAddEdit = false;
                showAddEditDialog(item);
              "
              >mdi-square-edit-outline</v-icon
            >

            <v-icon
              size="22"
              class="mr-0 ml-1 fitPotErrorIcon"
              @click="deleteItem(item)"
              >mdi-delete-outline</v-icon
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
                <v-row class="mx-auto d-flex">
                  <v-col cols="12" md="12" class="pt-5">
                    <v-text-field
                      v-model="item.area_name"
                      dense
                      outlined
                      :rules="validationRulesRequired"
                    >
                      <template #label>
                        Area
                        <span class="red--text">
                          <strong>*</strong>
                        </span>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="12" class="pb-1">
                    <v-autocomplete
                      v-model="item.city_id"
                      :items="cityItems"
                      item-text="city_name"
                      item-value="city_id"
                      outlined
                      dense
                      chips
                      small-chips
                      ><template #label>
                        Select City
                        <span class="red--text">
                          <strong>*</strong>
                        </span>
                      </template></v-autocomplete
                    >
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
import { areaMaster } from "../area/areaMaster";
export default areaMaster;
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
