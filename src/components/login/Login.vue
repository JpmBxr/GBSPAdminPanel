<template>
  <v-app id="inspire">
    <v-overlay :value="isLoaderActive" color="primary">
      <v-progress-circular
        indeterminate
        size="50"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="12" md="4">
            <v-card class="mx-auto">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title> Login </v-toolbar-title>

                <v-spacer></v-spacer>
              </v-toolbar>

              <v-card-text>
                <v-form
                  ref="holdingForm"
                  v-model="isholdingFormValid"
                  lazy-validation
                >
                  <v-text-field
                    label="Mobile"
                    prepend-inner-icon="mdi-cellphone"
                    outlined
                    clearable
                    autofocus
                    type="text"
                    color="primary"
                    v-model="mobile"
                    :rules="validationRulesMobile"
                    @keypress="acceptDigit"
                  ></v-text-field>

                  <v-text-field
                    label="Password"
                    prepend-inner-icon="mdi-lock"
                    outlined
                    clearable
                    color="primary"
                    v-model="password"
                    :append-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    @click:append="isPasswordVisible = !isPasswordVisible"
                    @keyup.enter="validateLogin"
                    :rules="validationRulesRequired"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn text small color="primary">Forgot Password</v-btn>
                <v-divider></v-divider>

                <div class="text-center">
                  <v-btn
                    class="ma-2"
                    filled
                    color="primary"
                    :disabled="!isholdingFormValid"
                    @click="validateLogin"
                  >
                    Login</v-btn
                  >
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer color="primary" padless>
      <v-row justify="center" no-gutters>
        <v-col class="primary py-4 text-center white--text" cols="12">
          {{ new Date().getFullYear() }} —
          <strong>{{ companyName }}</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { login } from "../login/login";
export default login;
</script>
