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
var selectedBadge ="";
var selectedNewBadge ="";
    var ByUserController = BaseController.extend("massiveusermgmt.controller.ByUser", {
        selectedUser: "",

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

            this.resetBadge = this.getView().byId("resetBadge");
            this.changeBadge = this.getView().byId("changeBadge");

            //this.getView().setModel(this.getInfoModel(), "infoModel");
        },
        onAfterRendering: function () {
            this.onClearSelections();
            //this.getWorkCenters();
            //this.getUsers();
            //this.getUserGroups();
        },
        getWorkCenters: function () {

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
                USER_ID: this.selectedUser
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
        getUserGroups: function () {

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
                USER_ID: this.selectedUser
            };

            CommonCallManager.getRows(transaction, callData, success, failure);
        },

        resetBadgeUsers: function () {
          var that = this;

          var params = {
             BADGE: selectedBadge,
             "TRANSACTION": "ES/TRANSACTIONS/MASSIVEUSERMANAGEMENT/CLEAN_USER",
             "OutputParameter": "*"
          };

          $.ajax({
             type: 'GET',
             async: true,
             data: params,
             url: "/XMII/Runner",
             dataType: 'xml',
             success: function(result) {

                try {
                  // that._busyDialog.close();
                   if (jQuery(result).find("RC").text() === "0") {
                      MessageToast.show(jQuery(result).find("MESSAGE").text());
                   } else {
                      MessageBox.show(jQuery(result).find("MESSAGE").text());
                   }
                } catch (err) {
                }
             },
             error: function(error) {
             }
          });
       },





       changeBadgeUsers: function () {
         var that = this;
         //var OLDBADGE = this.modelByUserUsers.getProperty(oEvent.getParameter("rowContext").sPath).BADGE;
         var oLabel = new sap.m.Label  ({ text: "", width:"10vw"});
         var oLabel2 = new sap.m.Label  ({ text: "", width:"10vw"});
         var oLabel6 = new sap.m.Label  ({ text: "", width:"30vw"});
         var oLabel3 = new sap.m.Label  ({ text: "", width:"4vw"});
         var oLabel5 = new sap.m.Label  ({ text: "", width:"2vw"});
         var oLabel6 = new sap.m.Label  ({ text: "", width:"30vw"});
         var oLabel7 = new sap.m.Label  ({ text: "", width:"30vw"});
         var oText = new sap.m.Input  ({
           text: "d",
           width:"10vw"
         });

         var dialog = new Dialog({
 					title: 'Inserire nuovo Badge',
 					content: [oLabel6, oLabel, oText, oLabel2, oLabel7, oLabel3,oLabel5],
 					contentWidth: '30vw',
 					contentHeight: '7vw',

 				beginButton: new sap.m.Button({
 					type: 'Emphasized',
 					text: 'Sostituisci',
 					press: function () {
            var that = this;
            selectedNewBadge = oText.getValue();
            var params = {
               OLDBADGE: selectedBadge,
               NEWBADGE: selectedNewBadge,
               "TRANSACTION": "ES/TRANSACTIONS/MASSIVEUSERMANAGEMENT/CHANGE_USER_BADGE",
               "OutputParameter": "*"
            };

            $.ajax({
               type: 'GET',
               async: true,
               data: params,
               url: "/XMII/Runner",
               dataType: 'xml',
               success: function(result) {

                  try {
                    // that._busyDialog.close();
                     if (jQuery(result).find("RC").text() === "0") {
                        MessageToast.show(jQuery(result).find("MESSAGE").text());
                     } else {
                        MessageBox.show(jQuery(result).find("MESSAGE").text());
                     }
                  } catch (err) {
                  }
               },
               error: function(error) {
               }
            });

 						dialog.close();
 					}
 				}),
 				endButton: new sap.m.Button({
 					text: 'Cancel',
 					press: function () {

 						dialog.close();
 					}
 				}),
 				afterClose: function() {
          that.resetUsers();
 					dialog.destroy();
 				}
 			});
      dialog.open();
      },


        onSave: function() {
            if (this.selectedUser == "") {
                return MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("massiveusermgmt.warning.noUserSelected.text"), {
                    title: this.getView().getModel("i18n").getResourceBundle().getText("massiveusermgmt.warning.noUserSelected.title")
                });
            }
            var that = this;

            that.selectedWorkCenters.length = 0;

            for (var c in that.modelByUserWorkCenters.getProperty("/")) {
                if (that.modelByUserWorkCenters.getProperty("/")[c].SELECTED) that.selectedWorkCenters.push(that.modelByUserWorkCenters.getProperty("/")[c].WORK_CENTER_BO);
            }

            //that.selectedUsers.length = 0;

            /*for (var u in that.modelByUserUsers.getProperty("/")) {
                if (that.modelByUserUsers.getProperty("/")[u].SELECTED) that.selectedUsers.push(that.modelByUserUsers.getProperty("/")[u].HANDLE);
            }*/

            that.selectedUserGroups.length = 0;

            for (var g in that.modelByUserUserGroups.getProperty("/")) {
                if (that.modelByUserUserGroups.getProperty("/")[g].SELECTED || that.modelByUserUserGroups.getProperty("/")[g].PRE_SELECTED)
                  that.selectedUserGroups.push({
                    "SELECTED" : that.modelByUserUserGroups.getProperty("/")[g].SELECTED,
                    "PRE_SELECTED" : that.modelByUserUserGroups.getProperty("/")[g].PRE_SELECTED,
                    "UserGroupBO" : that.modelByUserUserGroups.getProperty("/")[g].USER_GROUP_BO
                  });
            }

            that.createWorkCenter();

            /*
            if (!that.selectedWorkCenters.length) {
                MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("massiveusermgmt.warning.noCertSelected"), {
                    title: this.getView().getModel("i18n").getResourceBundle().getText("massiveusermgmt.warning.warning")
                });
            } else if (!that.selectedUsers.length && !that.selectedUserGroups.length) {
                MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("massiveusermgmt.warning.noDestSelected"), {
                    title: this.getView().getModel("i18n").getResourceBundle().getText("massiveusermgmt.warning.warning")
                });
            } else {
                that.createWorkCenter();
            } */
        },
        createWorkCenter: function() {
            var that = this;

            //var workCentersXML = '<workCenters><WorkCenterBO>' + that.selectedWorkCenters.map(function(c){return c;}).join("</WorkCenterBO><WorkCenterBO>") + '</WorkCenterBO></workCenters>';
            //PERCHè IL MAP??
            var workCentersXML = '<workCenters><WorkCenterBO>' + that.selectedWorkCenters.join("</WorkCenterBO><WorkCenterBO>") + '</WorkCenterBO></workCenters>';

            //var usersXML = '<users><UserBO>' + that.selectedUsers.map(function(c){return c;}).join("</UserBO><UserBO>") + '</UserBO></users>';
            //var userGroupsXML = '<userGroups><UserGroupBO>' + that.selectedUserGroups.map(function(c){return c;}).join("</UserGroupBO><UserGroupBO>") + '</UserGroupBO></userGroups>';

            var transaction = "ES/TRANSACTIONS/MASSIVEUSERMANAGEMENT/ASSIGN_WC_AND_USERGROUP";

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
                //USER_GROUPS_XML: workCentersXML,
                USER_GROUPS_JSON: JSON.stringify(that.selectedUserGroups),
                USERID: that.selectedUser,
                WORK_CENTERS_XML: workCentersXML
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

        },
        onSelectUser: function(oEvent) {
          if (this.tableByUserUsers.getSelectedIndex() > -1) {
            this.selectedUser = this.modelByUserUsers.getProperty(oEvent.getParameter("rowContext").sPath).USERNAME;
            selectedBadge = this.modelByUserUsers.getProperty(oEvent.getParameter("rowContext").sPath).BADGE;
            this.getWorkCenters();
            this.getUserGroups();
            this.resetBadge.setEnabled(true);
            this.changeBadge.setEnabled(true);
          } else {
            this.selectedUser = "";
            this.getWorkCenters();
            this.getUserGroups();
            this.resetBadge.setEnabled(false);
            this.changeBadge.setEnabled(false);
          }

        },
        resetWorkCenters: function() {
          var aWC = this.modelByUserWorkCenters.getProperty("/");
          aWC.map(function(c){c.SELECTED = false; return c;});
          this.modelByUserWorkCenters.setProperty("/", aWC);
        },
        resetUserGroups: function() {
          var aUG = this.modelByUserUserGroups.getProperty("/");
          aUG.map(function(c){c.SELECTED = false; return c});
          this.modelByUserUserGroups.setProperty("/", aUG);
        },
        resetUsers: function() {
          var sValue = "";

          var oFilterUsers = new sap.ui.model.Filter([
              new sap.ui.model.Filter("USERNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("FIRSTNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("LASTNAME", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("BADGE", sap.ui.model.FilterOperator.Contains, sValue)
          ]);

          this.tableByUserUsers.getBinding("rows").filter(oFilterUsers);

          this.selectedUser = "";
          this.tableByUserUsers.clearSelection();
          this.onClearSelections();

        }
    });

    return ByUserController;
});
