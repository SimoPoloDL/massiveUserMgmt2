sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/m/Dialog',
    './BaseController',
    '../model/CommonManager'
], function (jQuery, JSONModel, MessageBox, MessageToast, Fragment, Dialog, BaseController, CommonCallManager) {
    "use strict";

    var CopyFromUserController = BaseController.extend("massiveusermgmt.controller.CopyFromUser", {
        onInit: function () {
            this.tableCopyFromUserUsersSrc = this.getView().byId("tableCopyFromUserUsersSrc");
            this.tableCopyFromUserWorkCenters = this.getView().byId("tableCopyFromUserWorkCenters");
            this.tableCopyFromUserUsersDest = this.getView().byId("tableCopyFromUserUsersDest");
            this.tableCopyFromUserUserGroupsDest = this.getView().byId("tableCopyFromUserUserGroupsDest");

            this.inputCopyFromUserUsersSrc = this.getView().byId("inputCopyFromUserUsersSrc");
            this.inputCopyFromUserWorkCenters = this.getView().byId("inputCopyFromUserWorkCenters");
            this.inputCopyFromUserUsersDest = this.getView().byId("inputCopyFromUserUsersDest");
            this.inputCopyFromUserUserGroupsDest = this.getView().byId("inputCopyFromUserUserGroupsDest");

            this.modelCopyFromUserUsersSrc = new JSONModel({});
            this.modelCopyFromUserWorkCenters = new JSONModel({});
            this.modelCopyFromUserUsersDest = new JSONModel({});
            this.modelCopyFromUserUserGroupsDest = new JSONModel({});

            this.tableCopyFromUserUsersSrc.setModel(this.modelCopyFromUserUsersSrc, "modelCopyFromUserUsersSrc");
            this.tableCopyFromUserWorkCenters.setModel(this.modelCopyFromUserWorkCenters, "modelCopyFromUserWorkCenters");
            this.tableCopyFromUserUsersDest.setModel(this.modelCopyFromUserUsersDest, "modelCopyFromUserUsersDest");
            this.tableCopyFromUserUserGroupsDest.setModel(this.modelCopyFromUserUserGroupsDest, "modelCopyFromUserUserGroupsDest");

            this.selectedUserFrom = "";
            this.selectedWorkCenters = [];
            this.selectedUsersDest = [];
            this.selectedUserGroupsDest = [];

            //this.getView().setModel(this.getInfoModel(), "infoModel");
        },
        onAfterRendering: function () {
            this.getUsersSrc();
            //this.getWorkCenters();
            this.getUsersDest();
            //this.getUserGroupsDest();
        },
        getWorkCenters: function () {

            var that = this;

            var transaction = "8800/TRANSACTION/MASSIVE_CERTIFICATION/getWorkCenters";

            function success(data) {
                if (data.Rows) {
                    that.arrayCopyFromUserWorkCenters = data.Rows;
                    that.modelCopyFromUserWorkCenters.setProperty("/", data.Rows);

                }
            }

            function failure(err) {

            }

            var callData = {
                MOCK: "getWorkCenters",
                site: that.getInfoModel().getProperty("/site")
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        getUsersSrc: function () {

            var that = this;

            var transaction = "ES/TRANSACTIONS/MASSIVEUSERMANAGEMENT/GET_ALL_UME_USERS";

            function success(data) {
                if (data.Rows) {
                    that.arrayCopyFromUserUsersSrc = data.Rows;
                    that.modelCopyFromUserUsersSrc.setProperty("/", data.Rows);
                }
            }

            function failure(err) {

            }

            var callData = {
                //MOCK: "getUsers",
                //site: that.getInfoModel().getProperty("/site")
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        getUsersDest: function () {

            var that = this;

            var transaction = "ES/TRANSACTIONS/MASSIVEUSERMANAGEMENT/GET_ALL_UME_USERS";

            function success(data) {
                if (data.Rows) {
                    that.arrayCopyFromUserUsersDest = data.Rows;
                    that.modelCopyFromUserUsersDest.setProperty("/", data.Rows);
                }
            }

            function failure(err) {

            }

            var callData = {
                //MOCK: "getUsers",
                //site: that.getInfoModel().getProperty("/site")
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        getUserGroupsDest: function () {

            var that = this, USER_BO;
            var transaction = "ES/TRANSACTIONS/MASSIVEUSERMANAGEMENT/GET_ALL_USER_GROUPS_BY_USER_ID";
            try {
                USER_BO = that.tableCopyFromUserUsersSrc.getContextByIndex(that.tableCopyFromUserUsersSrc.getSelectedIndex()).getObject().USERNAME;
            } catch (err) {
                that.getWorkCenters();
                that.selectedWorkCenters.length = 0;
            }
            function success(data) {
                if (data.Rows) {
                    that.arrayCopyFromUserUserGroupsDest = data.Rows;
                    that.modelCopyFromUserUserGroupsDest.setProperty("/", data.Rows);
                }
            }

            function failure(err) {

            }

            var callData = {
                MOCK: "getUserGroups",
                //site: that.getInfoModel().getProperty("/site")
                USER_ID: USER_BO
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        getUserWorkCenters: function () {

            var that = this, USER_BO;

            try {
                USER_BO = that.tableCopyFromUserUsersSrc.getContextByIndex(that.tableCopyFromUserUsersSrc.getSelectedIndex()).getObject().USERNAME;
            } catch (err) {
                that.getWorkCenters();
                that.selectedWorkCenters.length = 0;
            }

            var transaction = "ES/TRANSACTIONS/MASSIVEUSERMANAGEMENT/GET_ALL_WORK_CENTERS_BY_USER_ID";

            function success(data) {
                if (data.Rows) {
                    that.modelCopyFromUserWorkCenters.setProperty("/", data.Rows);
                    that.getUserGroupsDest();
                } else {
                    that.getWorkCenters();
                    that.selectedWorkCenters.length = 0;
                }
            }

            function failure(err) {

            }

            var callData = {
                MOCK: "getWorkCenters",
                USER_ID: USER_BO
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        onSaveCopy: function() {
            var that = this;
            that.selectedUserFrom = that.tableCopyFromUserUsersSrc.getContextByIndex(that.tableCopyFromUserUsersSrc.getSelectedIndex()).getObject().USERNAME
            that.selectedWorkCenters.length = 0;

            for (var c in that.modelCopyFromUserWorkCenters.getProperty("/")) {
                if (that.modelCopyFromUserWorkCenters.getProperty("/")[c].SELECTED) that.selectedWorkCenters.push(that.modelCopyFromUserWorkCenters.getProperty("/")[c].USER_WORK_CENTER_BO);
            }

            that.selectedUsersDest.length = 0;

            for (var d in that.modelCopyFromUserUsersDest.getProperty("/")) {
                if (that.modelCopyFromUserUsersDest.getProperty("/")[d].SELECTED) that.selectedUsersDest.push(that.modelCopyFromUserUsersDest.getProperty("/")[d].USERNAME);
            }

            that.selectedUserGroupsDest.length = 0;

            for (var g in that.modelCopyFromUserUsersDest.getProperty("/")) {
                if (that.modelCopyFromUserUsersDest.getProperty("/")[g].SELECTED) that.selectedUserGroupsDest.push(that.modelCopyFromUserUsersDest.getProperty("/")[g]);
            }

            if (!that.selectedWorkCenters.length) {
                MessageBox.warning(that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.noCertSelected"), {
                    title: that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.warning")
                });
            } else if (!that.selectedUsersDest.length && !that.selectedUserGroupsDest.length) {
                MessageBox.warning(that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.noDestSelected"), {
                    title: that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.warning")
                });
            } else {
                that.createWorkCenter();
            }
        },
        createWorkCenter: function() {
          if (!this._busyDialog) {
            this._busyDialog = sap.ui.xmlfragment("massiveusermgmt.view.BusyDialog", this);
            this.getView().addDependent(this._busyDialog);
          }
          jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._busyDialog);
          this._busyDialog.open();
            var that = this;

            var workCentersXML = '<workCenters><WorkCenterBO>' + that.selectedWorkCenters.map(function(c){return c;}).join("</WorkCenterBO><WorkCenterBO>") + '</WorkCenterBO></workCenters>';
            var usersXML = '<users><UserBO>' + that.selectedUsersDest.map(function(c){return c;}).join("</UserBO><UserBO>") + '</UserBO></users>';
            var userGroupsXML = '<userGroups><UserGroupBO>' + that.selectedUserGroupsDest.map(function(c){return c;}).join("</UserGroupBO><UserGroupBO>") + '</UserGroupBO></userGroups>';

            var transaction = "ES/TRANSACTIONS/MASSIVEUSERMANAGEMENT/COPY_WC_AND_USERGROUP";

            function success(data) {
                that.onClearSelections();
                that._busyDialog.close();
            }

            function failure(err) {
              that._busyDialog.close();
                MessageBox.error(that.getI18nModel().getResourceBundle().getText("massiveusermgmt.error.createWorkCenter"), {
                    title: that.getI18nModel().getResourceBundle().getText("massiveusermgmt.error.error")
                });
            }

            var callData = {
                MOCK: "createWorkCenterMessage",
                DA: that.selectedUserFrom,
                A: usersXML
                //workCentersXML: workCentersXML,
                //usersXML: usersXML,
                //userGroupsXML: userGroupsXML,
                //removeExisting: true
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        onClearSelections: function() {
            this.getUsersSrc();
            //this.getUserWorkCenters();
            this.getUsersDest();
            //this.getUserGroupsDest();

            this.inputCopyFromUserUsersSrc.setValue();
            this.inputCopyFromUserWorkCenters.setValue();
            this.inputCopyFromUserUsersDest.setValue();
            this.inputCopyFromUserUserGroupsDest.setValue();

            this.tableCopyFromUserUsersSrc.clearSelection();
            //this.selectedWorkCenters.length = 0;
            this.selectedUsersDest.length = 0;
            //this.selectedUserGroupsDest.length = 0;
        },
        filterUsersSrc: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();

            var oFilterUsers = new sap.ui.model.Filter([
              new sap.ui.model.Filter("USERNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("FIRSTNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("LASTNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("BADGE", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableCopyFromUserUsersSrc.getBinding("rows").filter(oFilterUsers);

        },
        filterWorkCenters: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();

            var oFilterWorkCenters = new sap.ui.model.Filter([
              new sap.ui.model.Filter("WORK_CENTER", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableCopyFromUserWorkCenters.getBinding("rows").filter(oFilterWorkCenters);

        },
        filterUsersDest: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();

            var oFilterUsers = new sap.ui.model.Filter([
              new sap.ui.model.Filter("USERNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("FIRSTNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("LASTNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("BADGE", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableCopyFromUserUsersDest.getBinding("rows").filter(oFilterUsers);

        },
        filterUserGroupsDest: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();

            var oFilterUserGroups = new sap.ui.model.Filter([
              new sap.ui.model.Filter("USER_GROUP", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableCopyFromUserUserGroupsDest.getBinding("rows").filter(oFilterUserGroups);

        },
        resetWorkCentersSrc: function() {
          var sValue = "";

          var oFilterWorkCenters = new sap.ui.model.Filter([
            new sap.ui.model.Filter("WORK_CENTER", sap.ui.model.FilterOperator.Contains, sValue),
            new sap.ui.model.Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, sValue)
          ]);
          this.tableCopyFromUserWorkCenters.getBinding("rows").filter(oFilterWorkCenters);

          this.selectedWorkCenters = "";
          this.tableCopyFromUserWorkCenters.clearSelection();
          this.onClearSelections();
        },
        resetUserGroupsSrc: function() {
          var sValue = "";

          var oFilterUserGroups = new sap.ui.model.Filter([
            new sap.ui.model.Filter("USER_GROUP", sap.ui.model.FilterOperator.Contains, sValue),
            new sap.ui.model.Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, sValue)
          ]);

          this.tableCopyFromUserUserGroupsDest.getBinding("rows").filter(oFilterUserGroups);

          this.selectedUserGroupsDest = "";
          this.tableCopyFromUserUserGroupsDest.clearSelection();
          this.onClearSelections();
        },
        resetUsersSrc: function() {
          var sValue = "";

          var oFilterUsers = new sap.ui.model.Filter([
              new sap.ui.model.Filter("USERNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("FIRSTNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("LASTNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("BADGE", sap.ui.model.FilterOperator.Contains, sValue)
          ]);

          this.tableCopyFromUserUsersSrc.getBinding("rows").filter(oFilterUsers);

          this.selectedUser = "";
          this.tableCopyFromUserUsersSrc.clearSelection();
          this.onClearSelections();

        },
        resetUsersDest: function() {
          var sValue = "";

          var oFilterUsers = new sap.ui.model.Filter([
              new sap.ui.model.Filter("USERNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("FIRSTNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("LASTNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("BADGE", sap.ui.model.FilterOperator.Contains, sValue)
          ]);

          this.tableCopyFromUserUsersDest.getBinding("rows").filter(oFilterUsers);

          this.selectedUsersDest = "";
          this.tableCopyFromUserUsersDest.clearSelection();
          this.onClearSelections();

        }
    });

    return CopyFromUserController;
});
