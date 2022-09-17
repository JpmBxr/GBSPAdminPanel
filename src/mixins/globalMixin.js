export const globalMixin = {
  data() {
    return {
      validationRulesRequired: [(v) => !!v || "Field is required"],
      validationRulesMobile: [
        (v) => !!v || "Provide valid Mobile number",
        (v) => (v && v.length >= 10) || "Mobile number must be of 10 digits",
        (v) =>
          /^[6-9]\d{9}$/.test(v) || "Mobile number must start with 6/7/8/9",
      ],
     
    };
  },
  methods: {
    // #region Accept digit
    acceptDigit(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    // #endregion

    // #region accept Not Character 
    acceptNotCharacter(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode  ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    // #endregion

    // #region Accept charcter with space
    acceptCharacterWithSpace(evt) {
      var regex = new RegExp("^[a-zA-z ]+$");
      var key = String.fromCharCode(!evt.charCode ? evt.which : evt.charCode);
      if (!regex.test(key)) {
        evt.preventDefault();
        return false;
      }
    },
    // #endregion
  },
};
