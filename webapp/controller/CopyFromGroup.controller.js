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

    var CopyFromGroupController = BaseController.extend("massiveusermgmt.controller.CopyFromGroup", {
        onInit: function () {
            this.tableCopyFromGroupUserGroupsSrc = this.getView().byId("tableCopyFromGroupUserGroupsSrc");
            this.tableCopyFromGroupWorkCenters = this.getView().byId("tableCopyFromGroupWorkCenters");
            this.tableCopyFromGroupUsersDest = this.getView().byId("tableCopyFromGroupUsersDest");
            this.tableCopyFromGroupUserGroupsDest = this.getView().byId("tableCopyFromGroupUserGroupsDest");
            
            this.inputCopyFromGroupUserGroupsSrc = this.getView().byId("inputCopyFromGroupUserGroupsSrc");
            this.inputCopyFromGroupWorkCenters = this.getView().byId("inputCopyFromGroupWorkCenters");
            this.inputCopyFromGroupUsersDest = this.getView().byId("inputCopyFromGroupUsersDest");
            this.inputCopyFromGroupUserGroupsDest = this.getView().byId("inputCopyFromGroupUserGroupsDest");

            this.modelCopyFromGroupUserGroupsSrc = new JSONModel({});
            this.arrayCopyFromGroupUserGroupsSrc = [];
            this.modelCopyFromGroupWorkCenters = new JSONModel({});
            this.arrayCopyFromGroupWorkCenters = [];
            this.modelCopyFromGroupUsersDest = new JSONModel({});
            this.arrayCopyFromGroupUsersDest = [];
            this.modelCopyFromGroupUserGroupsDest = new JSONModel({});
            this.arrayCopyFromGroupUserGroupsDest = [];

            this.tableCopyFromGroupUserGroupsSrc.setModel(this.modelCopyFromGroupUserGroupsSrc, "modelCopyFromGroupUserGroupsSrc");
            this.tableCopyFromGroupWorkCenters.setModel(this.modelCopyFromGroupWorkCenters, "modelCopyFromGroupWorkCenters");
            this.tableCopyFromGroupUsersDest.setModel(this.modelCopyFromGroupUsersDest, "modelCopyFromGroupUsersDest");
            this.tableCopyFromGroupUserGroupsDest.setModel(this.modelCopyFromGroupUserGroupsDest, "modelCopyFromGroupUserGroupsDest");

            //this.getView().setModel(this.getInfoModel(), "infoModel");
        },
        onAfterRendering: function () {
            this.onClearSelections();
            this.getUserGroupsSrc();
            this.getWorkCenters();
            this.getUsersDest();
            this.getUserGroupsDest();
        },
        getWorkCenters: function () {

            var that = this;

            var transaction = "8800/TRANSACTION/MASSIVE_CERTIFICATION/getWorkCenters";

            function success(data) {
                if (data.Rows) {
                    that.arrayCopyFromGroupWorkCenters = data.Rows;
                    that.modelCopyFromGroupWorkCenters.setProperty("/", data.Rows);
                    that.tableCopyFromGroupWorkCenters.clearSelection();
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
        getUserGroupsSrc: function () {

            var that = this;

            var transaction = "8800/TRANSACTION/MASSIVE_CERTIFICATION/getUserGroups";

            function success(data) {
                if (data.Rows) {
                    that.arrayCopyFromGroupUserGroupsSrc = data.Rows;
                    that.modelCopyFromGroupUserGroupsSrc.setProperty("/", data.Rows);
                    that.tableCopyFromGroupUserGroupsSrc.clearSelection();
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
        getUsersDest: function () {

            var that = this;

            var transaction = "8800/TRANSACTION/MASSIVE_CERTIFICATION/getUsers";

            function success(data) {
                if (data.Rows) {
                    that.arrayCopyFromGroupUsersDest = data.Rows;
                    that.modelCopyFromGroupUsersDest.setProperty("/", data.Rows);
                    that.tableCopyFromGroupUsersDest.clearSelection();
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
        getUserGroupsDest: function () {

            var that = this;

            var transaction = "8800/TRANSACTION/MASSIVE_CERTIFICATION/getUserGroups";

            function success(data) {
                if (data.Rows) {
                    that.arrayCopyFromGroupUserGroupsDest = data.Rows;
                    that.modelCopyFromGroupUserGroupsDest.setProperty("/", data.Rows);
                    that.tableCopyFromGroupUserGroupsDest.clearSelection();
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
        getGroupWorkCenters: function () {

            var that = this, USERGROUP_BO;

            try {
                USERGROUP_BO = this.tableCopyFromGroupUserGroupsSrc.getContextByIndex(this.tableCopyFromGroupUserGroupsSrc.getSelectedIndex()).getObject().HANDLE;
            } catch (err) {
                that.tableCopyFromGroupWorkCenters.clearSelection();
            }

            var transaction = "8800/TRANSACTION/MASSIVE_CERTIFICATION/getWorkCentersByUserGroup";

            function success(data) {
                if (data.Rows) {
                   that.setSelectedWorkCenters(data.Rows);
                }
            }

            function failure(err) {

            }

            var callData = {
                MOCK: "getWorkCentersBySelection",
                USERGROUP_BO: USERGROUP_BO
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        setSelectedWorkCenters: function (input) {
            
            this.tableCopyFromGroupWorkCenters.clearSelection();

            var certArray = this.tableCopyFromGroupWorkCenters.getBinding().getModel().getProperty("/");

            for (var j in certArray) {
                for (var i in input) {
                    if (input[i].CERTIFICATION_BO === certArray[j].HANDLE) this.tableCopyFromGroupWorkCenters.addSelectionInterval(j,j);
                }
            }
        },
        getSelectedWorkCenters: function () {

            var table = this.tableCopyFromGroupWorkCenters;
            var selectedWorkCenters = [];

            var indices = table.getSelectedIndices(), cobj, obj;
            for (var idx = 0; idx < indices.length; idx++) {
                cobj = table.getContextByIndex(indices[idx]).getObject();
                if (cobj) {
                    obj = cobj;
                    selectedWorkCenters.push(obj);
                }
            }

            return '<workCenters><WorkCenterBO>' + selectedWorkCenters.map(function(c){return c.HANDLE;}).join("</WorkCenterBO><WorkCenterBO>") + '</WorkCenterBO></workCenters>';
        },
        getSelectedUsers: function () {

            var table = this.tableCopyFromGroupUsersDest;
            var selectedUsers = [];

            var indices = table.getSelectedIndices(), cobj, obj;
            for (var idx = 0; idx < indices.length; idx++) {
                cobj = table.getContextByIndex(indices[idx]).getObject();
                if (cobj) {
                    obj = cobj;
                    selectedUsers.push(obj);
                }
            }

            return '<users><UserBO>' + selectedUsers.map(function(c){return c.HANDLE;}).join("</UserBO><UserBO>") + '</UserBO></users>';
        },
        getSelectedUserGroups: function () {

            var table = this.tableCopyFromGroupUserGroupsDest;
            var selectedUserGroups = [];

            var indices = table.getSelectedIndices(), cobj, obj;
            for (var idx = 0; idx < indices.length; idx++) {
                cobj = table.getContextByIndex(indices[idx]).getObject();
                if (cobj) {
                    obj = cobj;
                    selectedUserGroups.push(obj);
                }
            }

            return '<userGroups><UserGroupBO>' + selectedUserGroups.map(function(c){return c.HANDLE;}).join("</UserGroupBO><UserGroupBO>") + '</UserGroupBO></userGroups>';
        },
        onSave: function() {
            var that = this;

            var noSrcSelected = that.tableCopyFromGroupUserGroupsSrc.getSelectedIndices().length == 0;
            var noCrtSelected = that.tableCopyFromGroupWorkCenters.getSelectedIndices().length == 0;
            var noUsrSelected = that.tableCopyFromGroupUsersDest.getSelectedIndices().length == 0;
            var noGrpSelected = that.tableCopyFromGroupUserGroupsDest.getSelectedIndices().length == 0;

            if (noSrcSelected) {
                MessageBox.warning(that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.noGroupSelected"), {
                    title: that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.warning")
                });
            } else if (noCrtSelected) {
                MessageBox.warning(that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.noCertSelected"), {
                    title: that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.warning")
                });
            } else if (noUsrSelected && noGrpSelected) {
                MessageBox.warning(that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.noDestSelected"), {
                    title: that.getI18nModel().getResourceBundle().getText("massiveusermgmt.warning.warning")
                });
            } else {
                that.createWorkCenter();
            }            
        },
        createWorkCenter: function() {
            var that = this;

            var workCentersXML = that.getSelectedWorkCenters();
            var usersXML = that.getSelectedUsers();
            var userGroupsXML = that.getSelectedUserGroups();

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
                removeExisting: true
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },
        onClearSelections: function() {
            this.tableCopyFromGroupUserGroupsSrc.clearSelection();
            this.tableCopyFromGroupWorkCenters.clearSelection();
            this.tableCopyFromGroupUsersDest.clearSelection();
            this.tableCopyFromGroupUserGroupsDest.clearSelection();

            this.inputCopyFromGroupUserGroupsSrc.setValue();
            this.inputCopyFromGroupWorkCenters.setValue();
            this.inputCopyFromGroupUsersDest.setValue();
            this.inputCopyFromGroupUserGroupsDest.setValue();
        },
        filterUserGroupsSrc: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();

            var oFilterUserGroups = new sap.ui.model.Filter([
                new sap.ui.model.Filter("USER_GROUP", sap.ui.model.FilterOperator.Contains, sValue), 
                new sap.ui.model.Filter("USER_DESCRIPTION", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableCopyFromGroupUserGroupsSrc.getBinding("rows").filter(oFilterUserGroups);

        },  
        filterWorkCenters: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();

            var oFilterWorkCenters = new sap.ui.model.Filter([
                new sap.ui.model.Filter("CERTIFICATION", sap.ui.model.FilterOperator.Contains, sValue), 
                new sap.ui.model.Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableCopyFromGroupWorkCenters.getBinding("rows").filter(oFilterWorkCenters);

        },           
        filterUsersDest: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();

            var oFilterUsers = new sap.ui.model.Filter([
                new sap.ui.model.Filter("USER_ID", sap.ui.model.FilterOperator.Contains, sValue), 
                new sap.ui.model.Filter("USER_NAME", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableCopyFromGroupUsersDest.getBinding("rows").filter(oFilterUsers);

        },    
        filterUserGroupsDest: function(oEvent) {
            var sValue = oEvent.getParameter("value").toLowerCase();


            var oFilterUserGroups = new sap.ui.model.Filter([
                new sap.ui.model.Filter("USER_GROUP", sap.ui.model.FilterOperator.Contains, sValue), 
                new sap.ui.model.Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, sValue)
            ]);

            this.tableCopyFromGroupUserGroupsDest.getBinding("rows").filter(oFilterUserGroups);

        }
    });

    return CopyFromGroupController;
});
