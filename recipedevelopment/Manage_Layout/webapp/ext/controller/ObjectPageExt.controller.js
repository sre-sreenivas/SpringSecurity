sap.ui.controller("manage.manage_layout.ext.controller.ObjectPageExt", {
	//Initilzing the Object Page
	onInit: function () {
		var that = this;
		that._oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
		var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
		oRouter.getRoute("LayoutInformation").attachMatched(that._onRouteMatched, that);
		that.extensionAPI.attachPageDataLoaded(that.onPageDataLoaded);
		that.extensionAPI.getTransactionController().attachAfterCancel(that.onCancel);
		that.extensionAPI.getTransactionController().attachAfterActivate(that.onSave);
		that.AppId = that.getView().getId();
		that.selDBCol = [];
		var oHashChanger = new sap.ui.core.routing.HashChanger();
		var sHash = oHashChanger.getHash();
		var urlParts = sHash.split("&");
		if (urlParts[0]) {
			that.sCreate = urlParts[0].split("=")[1];
		}
		that.layooutDesrcTxtField = sap.ui.getCore().byId(that.AppId +
			"--com.sap.vocabularies.UI.v1.FieldGroup::LayoutName::layoutName::Field");
		if (that.layooutDesrcTxtField) {
			that.layooutDesrcTxtField.attachChange(that._validateLayoutDesrc, that);
		}
		var columnListTable = sap.ui.getCore().byId(that.AppId +
			"--columnsSelectedInLayout::com.sap.vocabularies.UI.v1.LineItem::ColumnSelection::Table");
		columnListTable.attachBeforeRebindTable(that.columnListTableRebind);
		var deleteContent = columnListTable.getToolbar().getContent()[8];
		columnListTable.getToolbar().removeContent(deleteContent);
		columnListTable.setShowTablePersonalisation(false);
		sap.ui.getCore().getMessageManager().removeAllMessages();
		var oView = that.getView();
		var oMessageManager = sap.ui.getCore().getMessageManager();
		oView.setModel(oMessageManager.getMessageModel(), "message");
		oMessageManager.registerObject(oView, true);
		sap.ui.getCore().byId(that.AppId + "--showMessages").mEventRegistry.press.pop();
		sap.ui.getCore().byId(that.AppId + "--showMessages").attachPress(
			that.handleMessagePopoverPress, that);
		that._onRouteMatched();
	},

	//Called on navigation to object page from list report
	_onRouteMatched: function (oEvent) {
		var oHashChanger = new sap.ui.core.routing.HashChanger();
		var sHash = oHashChanger.getHash();
		var sPath = sHash.split("/")[1].split("'")[1];
		if (!sPath) {
			sPath = sHash.split("/")[2].split("'")[1];
		}
		this.layoutId = sPath;
		sap.ui.getCore().byId(this.AppId + "--columnsSelectedInLayout::com.sap.vocabularies.UI.v1.LineItem::ColumnSelection::responsiveTable")
			.attachUpdateFinished(this.onAfterTableLoad);
		sap.ui.getCore().byId(this.AppId + "--columnsSelectedInLayout::com.sap.vocabularies.UI.v1.LineItem::ColumnSelection::responsiveTable")
			.attachSelectionChange(this.onColumnTableSelectionChange);
		sap.ui.getCore().byId(this.AppId + "--columnsSelectedInLayout::com.sap.vocabularies.UI.v1.LineItem::ColumnSelection::Table").attachFieldChange(
			this.oModelRefresh);
		sap.ui.getCore().byId(this.AppId + "--idDirectUp").setIcon("sap-icon://collapse-group");
		sap.ui.getCore().byId(this.AppId + "--idUp").setIcon("sap-icon://navigation-up-arrow");
		sap.ui.getCore().byId(this.AppId + "--idDown").setIcon("sap-icon://navigation-down-arrow");
		sap.ui.getCore().byId(this.AppId + "--idDirectDown").setIcon("sap-icon://expand-group");
		sap.ui.getCore().byId(this.AppId + "--idAddColumn").setIcon("sap-icon://add");
	},

	//Gets the list of columns for the layout and opens the dalog popup
	onClickActionLayoutInformationSections1: function (oEvent) {
		var that = this;
		var oModel = this.getOwnerComponent().getModel();
		// this.getView().setBusy(true);
		oModel.read("/Subcategory", {
			success: function (data, response) {
				var oRecipes = data.results;
				that.collectionModel = that.getOwnerComponent().getModel("collectionModel");
				that.collectionModel.setData({
					oRecipes: oRecipes
				});
			},
			error: function () {}
		});
		var oDialogFragment = this._getDialog();
		if (oDialogFragment instanceof Promise) {
			oDialogFragment.then(function (oDialog) {
				this.getView().addDependent(this._oPopover);
				oDialog
					.setFilterSearchCallback(null)
					.setFilterSearchOperator(sap.m.StringFilterOperator.Contains)
					.open();
				this.setSelectedColumn(oDialog);
				oDialog.setModel(this.getView().getModel("collectionModel"));
				oDialog.setModel("i18n", that._oResourceBundle);
			}.bind(this));

		} else {
			oDialogFragment
				.setFilterSearchCallback(null)
				.setFilterSearchOperator(sap.m.StringFilterOperator.Contains)
				.open();
		}
	},

	//Loads the fragment for add column popup
	_getDialog: function () {
		if (!this._oDialog) {
			return sap.ui.core.Fragment.load({
				type: "XML",
				name: "manage.manage_layout.ext.fragments.columnListDialog",
				controller: this
			});
		} else {
			return this._oDialog;
		}
	},

	//Set the selected column name in the pop up
	setSelectedColumn: function (oDialog) {
		var that = this;
		var ctx = sap.ui.getCore().byId(that.AppId + "--activate").getBindingContext();
		var oModel = sap.ui.getCore().byId(that.AppId + "--activate").getModel();
		var sLayoutId = oModel.getProperty("ID", ctx);
		var sMode = oModel.getProperty("IsActiveEntity", ctx);
		oModel.read("/LayoutInformation(ID=guid'" + sLayoutId + "',IsActiveEntity=" + sMode + ")/columnsSelectedInLayout", {
			success: function (data, response) {
				var collectionModel = that.getView().getModel("collectionModel");
				var aColData = collectionModel.getData().oRecipes;
				var aCol = data.results;
				that.selDBCol = data.results;
				var i = 0,
					j = 0;
				for (i = 0; i < aColData.length; i++) {
					aColData[i].selectable = true;
					for (j = 0; j < that.selDBCol.length; j++) {
						if (aColData[i].subCategoryName === that.selDBCol[j].subCategoryName) {
							aColData[i].selected = true;
							break;
						}
					}
				}
				that.collectionModel.setData({
					oRecipes: aColData
				});
				oDialog.setModel(that.collectionModel);
			},
			error: function (oError) {

			}
		});
	},

	//UI elements properties are set based on edit mode and display mode
	onPageDataLoaded: function (oEvent) {
		var oController = sap.ui.getCore().byId(
			"manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation").getController();
		var defaultStatus = oEvent.context.getProperty("defaultFlag");
		oController.displayMode = oEvent.context.getProperty("IsActiveEntity");
		if (oController.sCreate === "display") {
			sap.ui.getCore().byId(oController.AppId + "--edit").firePress();
		}
		sap.ui.getCore().byId(oController.AppId + "--action::ActionRecipeHeader2button").setIcon("sap-icon://message-information");
		sap.ui.getCore().byId(oController.AppId + "--action::ActionRecipeHeader2button").setType("Transparent");
		if (oController.displayMode) {
			oController.enableDisable(false);
			sap.ui.getCore().byId(oController.AppId + "--action::ActionRecipeHeader2button").setVisible(true);
		} else {
			oController.enableDisable(true);
			sap.ui.getCore().byId(oController.AppId + "--com.sap.vocabularies.UI.v1.FieldGroup::layoutType::Field").setValue(
				"User Specific Layout");
			sap.ui.getCore().byId(oController.AppId + "--action::ActionRecipeHeader2button").setVisible(false);
			oController.referenceUOMField = sap.ui.getCore().byId(oController.AppId +
				"--com.sap.vocabularies.UI.v1.FieldGroup::referenceQuantity::Field-sfEdit-input");
			oController._validateReferenceUOM();
			oController.referenceUOMField.attachChange(oController._validateReferenceUOM, oController);
		}
		var oModel = oController.getOwnerComponent().getModel();

		oController.checkLayoutName();

	},
	
	//Update the table with the list of column selected
	handleConfirm: function (oEvent) {
		var aSelectedItems = oEvent.getSource().getSelectedFilterItems();
		var that = this;
		var ID = this.layoutId;
		var oModel = this.getOwnerComponent().getModel();
		var aDBColumns = that.selDBCol;
		var aDeleteCol = [];
		var bDelete;
		var count = 0;

		for (var i = 0; i < aDBColumns.length; i++) {
			bDelete = true;
			for (var j = 0; j < aSelectedItems.length; j++) {
				if (aDBColumns[i].subCategoryName === aSelectedItems[j].getBindingContext().getProperty("subCategoryName"))
					bDelete = false;
			}
			if (bDelete === true)
				aDeleteCol.push(aDBColumns[i]);
		}
		if (aDeleteCol.length > 0) {
			for (var k = 0; k < aDeleteCol.length; k++) {
				oModel.remove("/ColumnsSelectedInLayout(ID=guid'" + aDeleteCol[k].ID + "',IsActiveEntity=false)", {
					success: function () {
						count++;
						if (count == aDeleteCol.length) {
							if (aSelectedItems.length > 0) {
								for (var l = 0; l < aSelectedItems.length; l++) {
									var categoryId = aSelectedItems[l].getBindingContext().getProperty("categoryId");
									var subCategoryName = aSelectedItems[l].getBindingContext().getProperty("subCategoryName");
									oModel.callFunction("/addBasicColumn", {
										method: "GET",
										urlParameters: {
											ID: ID,
											category: categoryId,
											subCategory: subCategoryName
										},
										success: function (oData, oResponse) {
											that.getOwnerComponent().getModel().refresh();
											that.checkLayoutName();
										},
										error: function (oError) {}
									});
								}
							} else {
								that.getOwnerComponent().getModel().refresh();
							}
						}
					},
					error: function (oError) {}
				});
			}
		} else {
			for (var l = 0; l < aSelectedItems.length; l++) {
				var categoryId = aSelectedItems[l].getBindingContext().getProperty("categoryId");
				var subCategoryName = aSelectedItems[l].getBindingContext().getProperty("subCategoryName");
				oModel.callFunction("/addBasicColumn", {
					method: "GET",
					urlParameters: {
						ID: ID,
						category: categoryId,
						subCategory: subCategoryName
					},
					success: function (oData, oResponse) {
						that.getOwnerComponent().getModel().refresh();
						that.checkLayoutName();
					},
					error: function (oError) {}
				});

			}
		}
	},
	
	// Validates the Layout Name field 
	_validateLayoutDesrc: function (oEvent) {
		var sSource = oEvent.getSource();
		var sValue = sSource.getValue();
		this.saveFlag = true;
		if (!sValue || sValue === "") {
			sSource.setValueState(sap.ui.core.ValueState.Error);
			sSource.setValueStateText(this._oResourceBundle.getText("enterLayoutName"));
			this.updateMessageManager("Error", this._oResourceBundle.getText("enterLayoutName"), "");
			sap.ui.getCore().byId(this.AppId + "--activate").setBlocked(
				true);
		} else {
			this.removeMessageFromTarget(this._oResourceBundle.getText("enterLayoutName"));
			if (!this.iError) {
				sap.ui.getCore().byId(this.AppId + "--activate").setBlocked(
					false);
			}
		}
	},
	
	//Updates the message manager
	updateMessageManager: function (sType, sMsg, sDesc) {
		this.removeMessageFromTarget(sMsg);
		var aErrorMsg = new sap.ui.core.message.Message({
			type: sType,
			message: sMsg,
			description: sDesc

		});
		sap.ui.getCore().getMessageManager().addMessages(aErrorMsg);
		var oMsgBtn = sap.ui.getCore().byId(this.AppId + "--showMessages");
		oMsgBtn.setVisible(true);
		oMsgBtn.setText(sap.ui.getCore().getMessageManager().getMessageModel().getData().length);
	},
	
	//Extension added to check if cross app navigation is required
	onSave: function () {
		var oController = sap.ui.getCore().byId(
			"manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation").getController();

		if (oController.sCreate === "create" || oController.sCreate === "display") {
			var oCrossApp = new sap.ushell.services.CrossApplicationNavigation();
			setTimeout(function () {
                        oCrossApp.historyBack();
                    }, 1000);
		} else {

			sap.ui.getCore().byId(
				oController.AppId + "--com.sap.vocabularies.UI.v1.FieldGroup::LayoutName::layoutName::GroupElement").setVisible(false);
			sap.ui.getCore().byId(
				oController.AppId + "--idAddColumn").setVisible(false);
		}

	},
	
	//Extension added to check if cross app navigation is required
	onCancel: function () {
		var oController = sap.ui.getCore().byId(
			"manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation").getController();
		sap.ui.getCore().byId(oController.AppId + "--com.sap.vocabularies.UI.v1.FieldGroup::LayoutName::layoutName::GroupElement").setVisible(
			false);
		sap.ui.getCore().byId(oController.AppId +
			"--idAddColumn"
		).setVisible(false);
	},
	
	//Adding custom delete Message
	beforeDeleteExtension: function (oBeforeDeleteProperties) {
		var sLayoutName = this.getView().getBindingContext().getProperty("layoutName");
		var sText = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("deleteConfirm");
		var sTitle = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("delete");
		var oMessageText = {
			title: sTitle,
			text: sText
		};
		return oMessageText;
	},
	
	//Removes the message from the message manager
	removeMessageFromTarget: function (sMessage) {
		sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(function (oMessage) {
			if (oMessage.message === sMessage) {
				sap.ui.getCore().getMessageManager().removeMessages(oMessage);
				var oMsgBtn = sap.ui.getCore().byId(
					"manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--showMessages");
				oMsgBtn.setText(sap.ui.getCore().getMessageManager().getMessageModel().getData().length);
			}
		}.bind(this));
	},
	
	//Called on click of direct up button press
	onClickDirectUp: function () {
		var ColumnTable = sap.ui.getCore().byId(this.AppId +
			"--columnsSelectedInLayout::com.sap.vocabularies.UI.v1.LineItem::ColumnSelection::responsiveTable");
		var i = ColumnTable.getSelectedItems().length;
		for (i; i > 0; i--) {
			var id = ColumnTable.getSelectedItems()[i - 1].getBindingContext().getProperty("ID");
			this.onReorder(id, "directUp");
		}
	},
	
	//Called on click on up button press
	onClickUp: function (oEvent) {
		var ColumnTable = sap.ui.getCore().byId(this.AppId +
			"--columnsSelectedInLayout::com.sap.vocabularies.UI.v1.LineItem::ColumnSelection::responsiveTable");
		var i = 0;
		for (i; i < ColumnTable.getSelectedItems().length; i++) {
			var id = ColumnTable.getSelectedItems()[i].getBindingContext().getProperty("ID");
			this.onReorder(id, "up");
		}
	},
	
	//Called on click of down button press
	onClickDown: function (oEvent) {
		var ColumnTable = sap.ui.getCore().byId(this.AppId +
			"--columnsSelectedInLayout::com.sap.vocabularies.UI.v1.LineItem::ColumnSelection::responsiveTable");
		var i = ColumnTable.getSelectedItems().length;
		for (i; i > 0; i--) {
			var id = ColumnTable.getSelectedItems()[i - 1].getBindingContext().getProperty("ID");
			this.onReorder(id, "down");
		}
	},
	
	//Called on click of direct down button press
	onClickDirectDown: function (oEvent) {
		var ColumnTable = sap.ui.getCore().byId(this.AppId +
			"--columnsSelectedInLayout::com.sap.vocabularies.UI.v1.LineItem::ColumnSelection::responsiveTable");
		var i = 0;
		for (i; i < ColumnTable.getSelectedItems().length; i++) {
			var id = ColumnTable.getSelectedItems()[i].getBindingContext().getProperty("ID");
			this.onReorder(id, "directDown");
		}
	},
	
	//extension to sort the data in the table
	columnListTableRebind: function (oEvent) {
		var oBindingParams = oEvent.getParameter("bindingParams");
		oBindingParams.sorter.push(new sap.ui.model.Sorter("columnOrder"));

	},
	
	//Enable and disable button based on the display and edit mode
	enableDisable: function (sValue) {
		sap.ui.getCore().byId(this.AppId + "--idAddColumn").setVisible(sValue);
		sap.ui.getCore().byId(this.AppId + "--idRemoveColumn").setVisible(sValue);
		sap.ui.getCore().byId(this.AppId + "--com.sap.vocabularies.UI.v1.FieldGroup::LayoutName::layoutName::GroupElement").setVisible(sValue);
		this.onColumnTableSelectionChange();
	},
	
	//Calls the function import to reorder the column
	onReorder: function (id, direction) {
		var that = this;
		var oModel = this.getOwnerComponent().getModel();
		oModel.callFunction("/reorderSelectedColumn", {
			method: "GET",
			urlParameters: {
				ID: id,
				reorderAction: direction,
				displayMode: that.displayMode == true ? "" : "off"
			},
			success: function () {
				that.getOwnerComponent().getModel().refresh();
				that.checkLayoutName();
			},
			error: function () {}
		});
	},
	
	//Extension to change the fixed proptery to checkbox instead of text
	onAfterTableLoad: function () {
		var oController = sap.ui.getCore().byId(
			"manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation").getController();
		if (this.getItems().length > 0 && oController.displayMode === true) {
			oController.onColumnTableSelectionChange();
			for (var i = 0; this.getItems().length > i; i++) {
				this.getItems()[i].getCells()[3].setEditable(true);
				this.getItems()[i].getCells()[3].getEdit().setContextEditable(true);
				if (this.getItems()[i].getCells()[3].getEdit().getAllInnerControls().length > 1) {
					this.getItems()[i].getCells()[3].getEdit().getAllInnerControls()[1].setEnabled(false);
				} else {
					this.getItems()[i].getCells()[3].getEdit().getAllInnerControls()[0].setEnabled(false);
				}
			}
		}
		if (this.getItems().length > 0 && oController.displayMode === false) {
			oController.onColumnTableSelectionChange();
			for (var i = 0; this.getItems().length > i; i++) {
				if (this.getItems()[i].getCells()[3].getEdit().getAllInnerControls().length > 1) {
					this.getItems()[i].getCells()[3].getEdit().getAllInnerControls()[1].setEnabled(true);
				} else {
					this.getItems()[i].getCells()[3].getEdit().getAllInnerControls()[0].setEnabled(true);
				}
			}
		}
	},
	
	//gets the message popover
	_getMessagePopover: function () {
		if (!this._oMessagePopover) {
			this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "manage.manage_layout.ext.fragments.MessagePopOver", this);
			this.getView().addDependent(this._oMessagePopover);
		}
		return this._oMessagePopover;
	},
	
	//
	handleMessagePopoverPress: function (oEvent) {
		this._getMessagePopover().openBy(oEvent.getSource());
	},
	
	//called on the checking the fix column column in the table
	oModelRefresh: function (oEvent) {
		var oController = sap.ui.getCore().byId(
			"manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation").getController();
		var oModel = oController.getOwnerComponent().getModel();
		var ID = oEvent.getParameter("changeEvent").getSource().getBindingContext().getProperty("ID");
		var fixed = oEvent.getParameter("changeEvent").getParameter("newValue");
		oModel.callFunction("/layoutFixedColumnSave", {
			method: "GET",
			urlParameters: {
				ID: ID,
				fixed: fixed
			},
			success: function (oData, oResponse) {
				oController.getOwnerComponent().getModel().refresh();
				oController.checkLayoutName();
			},
			error: function (oError) {}
		});
	},
	
	//checks if the layout name is null or not
	checkLayoutName: function () {
		var oController = sap.ui.getCore().byId(
			"manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation").getController();
		var layoutName = sap.ui.getCore().byId(oController.AppId +
			"--com.sap.vocabularies.UI.v1.FieldGroup::LayoutName::layoutName::Field").getValue();
		if (layoutName === "" || layoutName === null) {
			sap.ui.getCore().byId(oController.AppId + "--activate").setBlocked(true);
		} else {
			if (!this.iError) {
				layoutName
				sap.ui.getCore().byId(oController.AppId + "--activate").setBlocked(false);
			}
		}
	},
	
	//Remove the selected column from the table
	onClickRemove: function (oEvent) {
		var that = this;
		var count = 0;
		var oModel = that.getOwnerComponent().getModel();
		var columnTable = sap.ui.getCore().byId(this.AppId +
			"--columnsSelectedInLayout::com.sap.vocabularies.UI.v1.LineItem::ColumnSelection::responsiveTable");
		for (var i = 0; i < columnTable.getSelectedItems().length; i++) {
			var ID = columnTable.getSelectedItems()[i].getBindingContext().getProperty("ID");
			oModel.remove("/ColumnsSelectedInLayout(ID=guid'" + ID + "',IsActiveEntity=false)", {
				success: function () {
					count++;
					if (count == columnTable.getSelectedItems().length) {
						that.getOwnerComponent().getModel().refresh();
						that.checkLayoutName();
						columnTable.removeSelections();
						that.onColumnTableSelectionChange();
					}
				},
				error: function (error) {}
			});
		}
	},
	
	//Called on row selection in the column atble
	onColumnTableSelectionChange: function () {
		var oController = sap.ui.getCore().byId(
			"manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation").getController();
		var columnTable = sap.ui.getCore().byId(oController.AppId +
			"--columnsSelectedInLayout::com.sap.vocabularies.UI.v1.LineItem::ColumnSelection::responsiveTable");
		if (columnTable.getSelectedItems().length > 0) {
			sap.ui.getCore().byId(oController.AppId + "--idDirectUp").setBlocked(false);
			sap.ui.getCore().byId(oController.AppId + "--idUp").setBlocked(false);
			sap.ui.getCore().byId(oController.AppId + "--idDown").setBlocked(false);
			sap.ui.getCore().byId(oController.AppId + "--idDirectDown").setBlocked(false);
			sap.ui.getCore().byId(oController.AppId + "--idRemoveColumn").setBlocked(false);
		} else {
			sap.ui.getCore().byId(oController.AppId + "--idDirectUp").setBlocked(true);
			sap.ui.getCore().byId(oController.AppId + "--idUp").setBlocked(true);
			sap.ui.getCore().byId(oController.AppId + "--idDown").setBlocked(true);
			sap.ui.getCore().byId(oController.AppId + "--idDirectDown").setBlocked(true);
			sap.ui.getCore().byId(oController.AppId + "--idRemoveColumn").setBlocked(true);
		}
	},
	
	//Extension to remove duplication of id
	onExit: function () {
		sap.ui.getCore().byId(
			"manage.manage_layout::sap.suite.ui.generic.template.ObjectPage.view.Details::LayoutInformation--columnsSelectedInLayout::com.sap.vocabularies.UI.v1.LineItem::ColumnSelection::deleteEntry"
		).destroy();

		if (this._oQuickView) {
			this._oQuickView.destroy();
		}
	},
	
	//Validates teh UoM Value
	_validateReferenceUOM: function (oEvent) {
		var sValue = this.referenceUOMField.getValue();
		this.saveFlag = true;
		if (sValue) {
			var oModel = this.getOwnerComponent().getModel("TrialFormulationModel");
			oModel.callFunction("/validateManuallyEnteredUOM", {
				method: "GET",
				urlParameters: {
					uom: sValue
				},
				success: function (success) {
					this.referenceUOMField.setValue(success.validateManuallyEnteredUOM);
					this.iError = null;
					this.referenceUOMField.setValueState(sap.ui.core.ValueState.None);
					if (this.incorrectUOMID) {
						this.removeMessageFromTarget(this.incorrectUOMID);
					}
					this.removeMessageFromTarget(this._oResourceBundle.getText("errortype1"));
					this.removeMessageFromTarget(this._oResourceBundle.getText("errortype2"));
					this.checkLayoutName();
				}.bind(this),
				error: function (errorMessage) {
					this.iError = true;
					if (this.incorrectUOMID) {
						this.removeMessageFromTarget(this.incorrectUOMID);
					}
					this.incorrectUOMID = JSON.parse(errorMessage.responseText).error.message.value;
					this.referenceUOMField.setValueState(sap.ui.core.ValueState.Error);
					this.referenceUOMField.setValueStateText(this._oResourceBundle.getText("referenceUoMError"));
					this.updateMessageManager("Error", this.incorrectUOMID, "");
					this.removeMessageFromTarget(this._oResourceBundle.getText("errortype1"));
					this.removeMessageFromTarget(this._oResourceBundle.getText("errortype2"));
					sap.ui.getCore().byId(this.AppId + "--activate").setBlocked(true);
				}.bind(this)
			});
		} else if (this.incorrectUOMID) {
			this.removeMessageFromTarget(this.incorrectUOMID);
			this.iError = null;
			this.checkLayoutName();
		}
	},
	
	//Opens the Addition information data about the lalyout
	openQuickView: function (oEvent, oModel) {
		var oButton = oEvent.getSource();
		if (!this._oQuickView) {
			sap.ui.core.Fragment.load({
				name: "manage.manage_layout.ext.fragments.AdditionalInfo",
				controller: this
			}).then(function (oQuickView) {
				this._oQuickView = oQuickView;
				this._configQuickView(oModel);
				this._oQuickView.openBy(oButton);
			}.bind(this));
		} else {
			this._configQuickView(oModel);
			this._oQuickView.openBy(oButton);
		}
	},
	
	//bind the data to the view
	_configQuickView: function (oModel) {
		this.getView().addDependent(this._oQuickView);
		this._oQuickView.close();
	}
	
});
