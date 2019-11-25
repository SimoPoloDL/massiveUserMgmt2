sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    './BaseController',
    '../model/CommonManager'
], function (jQuery, JSONModel, MessageBox, BaseController, CommonCallManager) {
    "use strict";

    var ByUserController = BaseController.extend("massiveusermgmt.controller.ByUser", {
        onInit: function () {
            this.tableByUserWorkCenters = this.getView().byId("tableByUserWorkCenters");
            this.tableByUserUsers = this.getView().byId("tableByUserUsers");
            this.tableByUserUserGroups = this.getView().byId("tableByUserUserGroups");

            this.inputByUserWorkCenters = this.getView().byId("inputByUserWorkCenters");
            this.inputByUserUsers = this.getView().byId("inputByUserUsers");
            this.inputByUserUserGroups = this.getView().byId("inputByUserUserGroups");

            this.modelByUserWorkCenters = new JSONModel({});
            this.modelByUserUsers = new JSONModel({});
            this.modelByUserUserGroups = new JSONModel({});

            this.tableByUserWorkCenters.setModel(this.modelByUserWorkCenters, "modelByUserWorkCenters");
            this.tableByUserUsers.setModel(this.modelByUserUsers, "modelByUserUsers");
            this.tableByUserUserGroups.setModel(this.modelByUserUserGroups, "modelByUserUserGroups");

            this.selectedWorkCenters = [];
            this.selectedUsers = [];
            this.selectedUserGroups = [];

            //this.getView().setModel(this.getInfoModel(), "infoModel");
        },
        onAfterRendering: function () {
            this.onClearSelections();
            this.getWorkCenters();
            this.getUsers();
            this.getUserGroups();
        },
        getWorkCenters: function (inputUserId) {

            var that = this;

            var transaction = "ES/TRANSACTIONS/MASSIVEUSERMANAGEMENT/GET_ALL_WORK_CENTERS_BY_USER_ID";

            function success(data) {
                if (data.Rows) {
                    //that.arrayByUserWorkCenters = data.Rows;
                    that.modelByUserWorkCenters.setProperty("/", data.Rows);
                }
            }

            function failure(err) {

            }

            var callData = {
                Mock: "GET_ALL_WORK_CENTERS_BY_USER_ID",
                USER_ID: inputUserId
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        getUsers: function () {

            var that = this;

            var transaction = "ES/TRANSACTIONS/MASSIVEUSERMANAGEMENT/GET_ALL_UME_USERS";

            function success(data) {
                if (data.Rows) {
                    //that.arrayByUserUsers = data.Rows;
                    that.modelByUserUsers.setProperty("/", data.Rows);
                }
            }

            function failure(err) {

            }

            var callData = {
                Mock: "GET_ALL_UME_USERS"
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        getUserGroups: function (inputUserId) {

            var that = this;

            var transaction = "ES/TRANSACTIONS/MASSIVEUSERMANAGEMENT/GET_ALL_USER_GROUPS_BY_USER_ID";

            function success(data) {
                if (data.Rows) {
                    //that.arrayByUserUserGroups = data.Rows;
                    that.modelByUserUserGroups.setProperty("/", data.Rows);
                }
            }

            function failure(err) {

            }

            var callData = {
                Mock: "GET_ALL_USER_GROUPS_BY_USER_ID",
                USER_ID: inputUserId
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        onSave: function() {
            var that = this;

            that.selectedWorkCenters.length = 0;

            for (var c in that.modelByUserWorkCenters.getProperty("/")) {
                if (that.modelByUserWorkCenters.getProperty("/")[c].SELECTED) that.selectedWorkCenters.push(that.modelByUserWorkCenters.getProperty("/")[c].HANDLE);
            }

            that.selectedUsers.length = 0;

            for (var u in that.modelByUserUsers.getProperty("/")) {
                if (that.modelByUserUsers.getProperty("/")[u].SELECTED) that.selectedUsers.push(that.modelByUserUsers.getProperty("/")[u].HANDLE);
            }

            that.selectedUserGroups.length = 0;

            for (var g in that.modelByUserUserGroups.getProperty("/")) {
                if (that.modelByUserUserGroups.getProperty("/")[g].SELECTED) that.selectedUserGroups.push(that.modelByUserUserGroups.getProperty("/")[g].HANDLE);
            }

            if (!that.selectedWorkCenters.length) {
                MessageBox.warning(that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.noCertSelected"), {
                    title: that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.warning")
                });
            } else if (!that.selectedUsers.length && !that.selectedUserGroups.length) {
                MessageBox.warning(that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.noDestSelected"), {
                    title: that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.warning")
                });
            } else {
                that.createWorkCenter();
            }
        },
        createWorkCenter: function() {
            var that = this;

            var workCentersXML = '<workCenters><WorkCenterBO>' + that.selectedWorkCenters.map(function(c){return c;}).join("</WorkCenterBO><WorkCenterBO>") + '</WorkCenterBO></workCenters>';
            var usersXML = '<users><UserBO>' + that.selectedUsers.map(function(c){return c;}).join("</UserBO><UserBO>") + '</UserBO></users>';
            var userGroupsXML = '<userGroups><UserGroupBO>' + that.selectedUserGroups.map(function(c){return c;}).join("</UserGroupBO><UserGroupBO>") + '</UserGroupBO></userGroups>';

            var transaction = "8800/TRANSACTION/MASSIVE_CERTIFICATION/createWorkCenter";

            function success(data) {
                that.onClearSelections();
            }

            function failure(err) {
                MessageBox.error(that.getI18nModel().getResourceBundle().getText("massiveusermgmt.error.createWorkCenter"), {
                    title: that.getI18nModel().getResourceBundle().getText("massiveusermgmt.error.error")
                });
            }

            var callData = {
                MOCK: "createWorkCenterMessage",
                workCentersXML: workCentersXML,
                usersXML: usersXML,
                userGroupsXML: userGroupsXML,
                removeExisting: false
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },

        onClearSelections: function() {
            this.inputByUserWorkCenters.setValue();
            this.inputByUserUsers.setValue();
            this.inputByUserUserGroups.setValue();

            this.getWorkCenters();
            this.getUsers();
            this.getUserGroups();

            this.selectedWorkCenters.length = 0;
            this.selectedUsers.length = 0;
            this.selectedUserGroups.length = 0;
        },

        filterWorkCenters: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();

            var oFilterWorkCenters = new sap.ui.model.Filter([
                new sap.ui.model.Filter("WORK_CENTER", sap.ui.model.FilterOperator.Contains, sValue),
                new sap.ui.model.Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableByUserWorkCenters.getBinding("rows").filter(oFilterWorkCenters);

        },
        filterUsers: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();

            var oFilterUsers = new sap.ui.model.Filter([
                new sap.ui.model.Filter("USERNAME", sap.ui.model.FilterOperator.Contains, sValue),
                new sap.ui.model.Filter("FIRSTNAME", sap.ui.model.FilterOperator.Contains, sValue),
                new sap.ui.model.Filter("LASTNAME", sap.ui.model.FilterOperator.Contains, sValue),
                new sap.ui.model.Filter("BADGE", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableByUserUsers.getBinding("rows").filter(oFilterUsers);

        },
        filterUserGroups: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();

            var oFilterUserGroups = new sap.ui.model.Filter([
                new sap.ui.model.Filter("USER_GROUP", sap.ui.model.FilterOperator.Contains, sValue),
                new sap.ui.model.Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableByUserUserGroups.getBinding("rows").filter(oFilterUserGroups);

        }
    });

    return ByUserController;
});
