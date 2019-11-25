sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/m/Dialog',
    './BaseController',
    '../model/CommonManager'
], function (jQuery, JSONModel, MessageBox, MessageToast, Dialog, BaseController, CommonCallManager) {
    "use strict";

    var MainController = BaseController.extend("massiveusermgmt.controller.Main", {
        onInit: function () {
            this.theTable = this.getView().byId("theTable");
            this.nameInput = this.getView().byId("nameInput");

            this.getView().setModel(this.getInfoModel(), "infoModel");
        },
        onAfterRendering: function () {

        },
        onPress: function () {
            this.getRT1();
        },
        getRT1: function () {

            var that = this;

            var inputName = this.nameInput.getValue();

            var transaction = "/8800/TRANSACTION/GetRT1";

            if (!inputName || inputName === "") {
                var mes = that.getI18nModel().getProperty("massiveusermgmt.errors.no_input_name");
                MessageToast.show(mes);
                return;
            }

            function success(data) {
                if (data.Rows) {
                    //data.Rows is your data
                }
            }

            function failure(err) {

            }

            var callData = {
                inputName: inputName,
                site: that.getInfoModel().getProperty("/site"),
                user_id: that.getInfoModel().getProperty("/user/id")
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        }
    });

    return MainController;
});
