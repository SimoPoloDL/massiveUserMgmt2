sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    './BaseController',
    '../model/CommonManager'
], function (jQuery, JSONModel, MessageBox, BaseController, CommonCallManager) {
    "use strict";

    var RemoveController = BaseController.extend("massiveusermgmt.controller.Remove", {
        onInit: function () {
            this.tableRemoveWorkCenters = this.getView().byId("tableRemoveWorkCenters");
            this.tableRemoveUsers = this.getView().byId("tableRemoveUsers");
            this.tableRemoveUserGroups = this.getView().byId("tableRemoveUserGroups");

            this.inputRemoveWorkCenters = this.getView().byId("inputRemoveWorkCenters");
            this.inputRemoveUsers = this.getView().byId("inputRemoveUsers");
            this.inputRemoveUserGroups = this.getView().byId("inputRemoveUserGroups");

            this.modelRemoveWorkCenters = new JSONModel({});
            this.modelRemoveUsers = new JSONModel({});
            this.modelRemoveUserGroups = new JSONModel({});

            this.tableRemoveWorkCenters.setModel(this.modelRemoveWorkCenters, "modelRemoveWorkCenters");
            this.tableRemoveUsers.setModel(this.modelRemoveUsers, "modelRemoveUsers");
            this.tableRemoveUserGroups.setModel(this.modelRemoveUserGroups, "modelRemoveUserGroups");

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
        getWorkCenters: function () {

            var that = this;

            var transaction = "8800/TRANSACTION/MASSIVE_CERTIFICATION/getWorkCenters";

            function success(data) {
                if (data.Rows) {
                    that.arrayRemoveWorkCenters = data.Rows;
                    that.modelRemoveWorkCenters.setProperty("/", data.Rows);
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
        getUsers: function () {

            var that = this;

            var transaction = "8800/TRANSACTION/MASSIVE_CERTIFICATION/getUsers";

            function success(data) {
                if (data.Rows) {
                    that.arrayRemoveUsers = data.Rows;
                    that.modelRemoveUsers.setProperty("/", data.Rows);
                }
            }

            function failure(err) {

            }

            var callData = {
                MOCK: "getUsers",
                site: that.getInfoModel().getProperty("/site")
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        getUserGroups: function () {

            var that = this;

            var transaction = "8800/TRANSACTION/MASSIVE_CERTIFICATION/getUserGroups";

            function success(data) {
                if (data.Rows) {
                    that.arrayRemoveUserGroups = data.Rows;
                    that.modelRemoveUserGroups.setProperty("/", data.Rows);
                }
            }

            function failure(err) {

            }

            var callData = {
                MOCK: "getUserGroups",
                site: that.getInfoModel().getProperty("/site")
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        onSave: function() {
            var that = this;

            that.selectedWorkCenters.length = 0;

            for (var c in that.modelRemoveWorkCenters.getProperty("/")) {
                if (that.modelRemoveWorkCenters.getProperty("/")[c].SELECTED) that.selectedWorkCenters.push(that.modelRemoveWorkCenters.getProperty("/")[c].HANDLE);
            }

            that.selectedUsers.length = 0;

            for (var u in that.modelRemoveUsers.getProperty("/")) {
                if (that.modelRemoveUsers.getProperty("/")[u].SELECTED) that.selectedUsers.push(that.modelRemoveUsers.getProperty("/")[u].HANDLE);
            }

            that.selectedUserGroups.length = 0;

            for (var g in that.modelRemoveUserGroups.getProperty("/")) {
                if (that.modelRemoveUserGroups.getProperty("/")[g].SELECTED) that.selectedUserGroups.push(that.modelRemoveUserGroups.getProperty("/")[g].HANDLE);
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
                that.removeWorkCenter();
            }
        },
        removeWorkCenter: function() {
            var that = this;

            var workCentersXML = '<workCenters><WorkCenterBO>' + that.selectedWorkCenters.map(function(c){return c;}).join("</WorkCenterBO><WorkCenterBO>") + '</WorkCenterBO></workCenters>';
            var usersXML = that.selectedUsers.map(function(c){return c;}).join(";");
            var userGroupsString = that.selectedUserGroups.map(function(c){return c;}).join(";");

            var transaction = "8800/TRANSACTION/MASSIVE_CERTIFICATION/removeWorkCenter";

            function success(data) {
                that.onClearSelections();
            }

            function failure(err) {
                MessageBox.error(that.getI18nModel().getResourceBundle().getText("massiveusermgmt.error.removeWorkCenter"), {
                    title: that.getI18nModel().getResourceBundle().getText("massiveusermgmt.error.error")
                });
            }

            var callData = {
                MOCK: "removeWorkCenterMessage",
                workCentersXML: workCentersXML,
                usersXML: usersXML,
                userGroupsString: userGroupsString
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        onClearSelections: function() {
            this.inputRemoveWorkCenters.setValue();
            this.inputRemoveUsers.setValue();
            this.inputRemoveUserGroups.setValue();

            this.getWorkCenters();
            this.getUsers();
            this.getUserGroups();

            this.selectedWorkCenters.length = 0;
            this.selectedUsers.length = 0;
            this.selectedUserGroups = 0;
        },
        filterWorkCenters: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();

            var oFilterWorkCenters = new sap.ui.model.Filter([
                new sap.ui.model.Filter("CERTIFICATION", sap.ui.model.FilterOperator.Contains, sValue),
                new sap.ui.model.Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableRemoveWorkCenters.getBinding("rows").filter(oFilterWorkCenters);

        },
        filterUsers: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();

            var oFilterUsers = new sap.ui.model.Filter([
                new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.Contains, sValue),
                new sap.ui.model.Filter("USER_NAME", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableRemoveUsers.getBinding("rows").filter(oFilterUsers);

        },
        filterUserGroups: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();

            var oFilterUserGroups = new sap.ui.model.Filter([
                new sap.ui.model.Filter("USER_GROUP", sap.ui.model.FilterOperator.Contains, sValue),
                new sap.ui.model.Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableRemoveUserGroups.getBinding("rows").filter(oFilterUserGroups);

        }
    });

    return RemoveController;
});
