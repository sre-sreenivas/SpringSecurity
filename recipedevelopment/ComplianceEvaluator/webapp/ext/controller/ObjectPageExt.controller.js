sap.ui.controller("ComplianceEvaluator.ext.controller.ObjectPageExt", {

	//Initializing objectpage
	onInit: function () {
		this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var that = this;
		this.evaluationDataModel = this.getOwnerComponent().getModel("evaluationDataModel");
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.getRoute("Evaluation").attachMatched(that._onRouteMatched, that);
		that._onRouteMatched();
		
		sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--objectPage").setUseIconTabBar(
			true);
		sap.ui.getCore().getMessageManager().removeAllMessages();
		//Getting UI fields and adding event handlers for validation and defining width
		this.evalNameTxtField = sap.ui.getCore().byId(
			"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.HeaderInfo::Title::Field"
		);
		sap.ui.getCore().byId(
			"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::validity::validFrom::Label"
		).setText("Compliance From");
		sap.ui.getCore().byId(
			"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::validity::validFrom::Field-label"
		).setText("Compliance From");
		if (this.evalNameTxtField)
			this.evalNameTxtField.setWidth('90%');
		this.tarCountryTxtField = sap.ui.getCore().byId(
			"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::validity::market::sellingMarket::MultiInput"
		);
	
		var oTextArea = sap.ui.getCore().byId(
			"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.HeaderInfo::Description::Field"
		);

		if (oTextArea)
			oTextArea.setWidth('90%');
		var oHeaderValidity = sap.ui.getCore().byId(
			"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::validity::Form"
		);
		if (oHeaderValidity)
			oHeaderValidity.setWidth('25%');
		var oStatusBtn = sap.ui.getCore().byId(
			"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::");
		if (oStatusBtn)
			oStatusBtn.attachPress(this._openStatusChangeConfirm, this);
		if (this.evalNameTxtField)
			this.evalNameTxtField.attachChange(this._validateEvalName, this);
		if (this.tarCountryTxtField)
			this.tarCountryTxtField.attachTokenUpdate(this._validateTarCountry, this);

		oView = this.getView();
		// set message model
		oMessageManager = sap.ui.getCore().getMessageManager();
		oView.setModel(oMessageManager.getMessageModel(), "message");
		// or just do it for the whole view
		oMessageManager.registerObject(oView, true);
		sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--showMessages").mEventRegistry.press.pop();
		sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--showMessages").attachPress(
			this.handleMessagePopoverPress, this);
	},
	
	// Event handler to replace the default confirmation message on Delete with Custom Message
	beforeDeleteExtension: function (oBeforeDeleteProperties) {
		var sEvaluation = this.evaluationDataModel.getProperty("/data/evaluationName");
		var sText = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("deleteConfirm", [sEvaluation]);
		var sTitle = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("delete");
		var oMessageText = {
			title: sTitle,
			text: sText

		};
		return oMessageText;
	},
	
	//Route match method contains the checks needed when ever user navigate to details page. It is controlling the Save button and Status field value.
	_onRouteMatched: function (oEvent) {
		this.saveFlag = false;
		var that = this;
		if (this.tarCountryTxtField) {
			var TargetCountry = this.tarCountryTxtField.getValue();
		}
		if (this.evalNameTxtField) {
			var sEvalName = this.evalNameTxtField.getValue();
		}
		var oObjectPageController = this;
		oObjectPageController.extensionAPI.attachPageDataLoaded(function () {
			sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::additionalInfo_btn").setIcon("sap-icon://message-information");
			sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::additionalInfo_btn").setType("Transparent");
			var displayMode = sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--edit").getVisible();
			if(displayMode){
				sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::additionalInfo_btn").setVisible(true);	
			}else{
				sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::additionalInfo_btn").setVisible(false);
			}
			
			sap.ui.getCore().byId(
				"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--copyRcp_obj_btn").setEnabled(
				false);
			sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::copyEvaluationSheet_obj_btn").setVisible(false);
			var oRecipeTable = sap.ui.getCore().byId(
				"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--recipe::com.sap.vocabularies.UI.v1.LineItem::recipe::responsiveTable"
			);
			oRecipeTable.attachSelectionChange(that._tableSelectionChange, that);
			var oDateFrom = sap.ui.getCore().byId(
				"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::validity::validFrom::Field-datePicker"
			);
			if (oDateFrom)
				oDateFrom.attachChange(that._validateDateFrom, that);
			var oDateTo = sap.ui.getCore().byId(
				"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::validity::validTo::Field-datePicker"
			);
			if (oDateTo) {
				oDateTo.attachChange(that._validateDateFrom, that);
				var dMinDate = new Date();
				oDateTo.setMinDate(dMinDate);
			}
			sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::copyEvaluationSheet_obj_btn").setVisible(false);
			var oModel = sap.ui.getCore().byId(
				"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--objectPage").getModel();
			var ctx = sap.ui.getCore().byId(
				"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--objectPage").getBindingContext();
			var sActive = oModel.getProperty("IsActiveEntity", ctx);
			
			if (!sActive) {
				if (oDateTo)
					oDateTo.fireChange();
				if (that.tarCountryTxtField)
					that.tarCountryTxtField.fireTokenUpdate();
				if (that.evalNameTxtField)
					that.evalNameTxtField.fireChange();
				sap.ui.getCore().byId(
					"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--addRcpToEval_btn").setIcon(
					"sap-icon://add");
				sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--createRcp_obj_btn").setVisible(false);
				sap.ui.getCore().byId(
					"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--addPurpToEval_btn").setIcon(
					"sap-icon://add");
				sap.ui.getCore().byId(
					"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.HeaderInfo::Description::Field"
				).setVisible(false);
				sap.ui.getCore().byId(
					"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.DataPoint::status::FormGroup"
				).setVisible(false);
				sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::").setVisible(
					false);
			
				sap.ui.getCore().byId(
					"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--addPurpToEval_btn"
				).setVisible(false);

				sap.ui.getCore().byId(
					"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::validity::sellingMarket::Field"
				).setVisible(false);
				sap.ui.getCore().byId(
					"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--addRcpToEval_btn").setVisible(
					true);
				sap.ui.getCore().byId(
					"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--addPurpToEval_btn").setVisible(
					true);
				
			
			} else {
				sap.ui.getCore().byId(
					"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::validity::market::sellingMarket::Label"
				).setVisible(false);
				sap.ui.getCore().byId(
					"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--addRcpToEval_btn").setVisible(
					false);
					sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--createRcp_obj_btn").setVisible(true);
				sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::").setVisible(
					true);
				sap.ui.getCore().byId(
					"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--copyRcp_obj_btn").setVisible(
					false);
				that.getEvaluation();

				sap.ui.getCore().byId(
					"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--addPurpToEval_btn"
				).setVisible(false);
			}

		});

	},

	// Validating Evalauation name
	_validateEvalName: function (oEvent) {
		var sSource = oEvent.getSource();
		var sValue = sSource.getValue();
		this.saveFlag = true;
		if (!sValue || sValue.length === 0) {
			if(oEvent.getParameter("value")!== undefined)
			sSource.setValueState(sap.ui.core.ValueState.Error);
			sSource.setValueStateText(this._oResourceBundle.getText("nameEnter"));
			this.updateMessageManager('Error', this._oResourceBundle.getText("nameEnter"), "");
			sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--activate").setBlocked(
				true);
		} else {
			this.removeMessageFromTarget(this._oResourceBundle.getText("nameEnter"));
			var bError = this.checkForerrors();
			if (!bError) {
				sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--activate").setBlocked(
					false);

			}
		}
	},
	
	//updating the concatenated value for selling market 
	updateCountry: function (aCountries) {
		that = this;
		var sCountries = [];
		for (var i = 0; i < aCountries.length; i++) {
			var sCountry = aCountries[i].getText();
			sCountries.push(" " + sCountry);
		}
		sCountries.sort();
		var oModel = this.getOwnerComponent().getModel();
		var sEvaluationId = this.getEvaluationId();
		oModel.callFunction("/updateSellignMarket", {
			method: "GET",
			urlParameters: {
				EVALUATION_ID: sEvaluationId,
				sellingMarket: sCountries
			},
			success: function (oData, oResponse) {},
			error: function (oError) {
				that.updateMessageManager('Error', oError, "");
			}
		});
	},
	
	//Validating Target Country field
	_validateTarCountry: function (oEvent) {
		var sSource = oEvent.getSource();
		var sValue = sSource.getValue();
		this.updateCountry(sValue);
		this.saveFlag = true;
		if (!sValue || sValue.length === 0) {
			if(oEvent.getParameter("addedTokens")!== undefined){
			sSource.setValueState(sap.ui.core.ValueState.Error);
			
			}
			sSource.setValueStateText(this._oResourceBundle.getText("countrySelect"));
			this.updateMessageManager('Error', this._oResourceBundle.getText("countrySelect"), "");
			sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--activate").setBlocked(
				true);
		} else {
			this.removeMessageFromTarget(this._oResourceBundle.getText("countrySelect"));
			var bError = this.checkForerrors();
			if (!bError) {
				sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--activate").setBlocked(
					false);

			}
		}
	},
	
	//The event handler will be triggered whenever the Valid from or To Fields are changed. If Valid From Date field value is lesser than the Valid To Date Field, it changes the value state of Error and the Save button is made disabled.
	_validateDateFrom: function (oEvent) {
		var oValFrom = sap.ui.getCore().byId(
			"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::validity::validFrom::Field-datePicker"
		);
		var dValueFrom = oValFrom.getDateValue();
		var oValTo = sap.ui.getCore().byId(
			"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::validity::validTo::Field-datePicker"
		);
		var sValueTo = oValTo.getValue();
		var dValueTo = new Date(sValueTo);
		if (sValueTo && (dValueFrom > dValueTo)) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			oEvent.getSource().setValueStateText(this._oResourceBundle.getText("validFromMsg"));
			sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--activate").setBlocked(
				true);
			this.updateMessageManager('Error', this._oResourceBundle.getText("validFromMsg"), "");
		} else {
			this.removeMessageFromTarget(this._oResourceBundle.getText("validFromMsg"));
			oValFrom.setValueState(sap.ui.core.ValueState.None);
			oValTo.setValueState(sap.ui.core.ValueState.None);
			var bError = this.checkForerrors();
			if (!bError)
				sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--activate").setBlocked(
					false);
		}
	},
	
	//Triggers when Message manager is clicked.
	handleMessagePopoverPress: function (oEvent) {
		this._getMessagePopover().openBy(oEvent.getSource());
	},
	
	//Triggers when Table row is selected/changed
	_tableSelectionChange: function (oEvent) {
	var sLength = oEvent.getSource().getSelectedItems().length;
	if(sLength>0){
		sap.ui.getCore().byId(
			"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--copyRcp_obj_btn").setEnabled(
			true);
	}else{
			sap.ui.getCore().byId(
			"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--copyRcp_obj_btn").setEnabled(
			false);
	}
	},
	
	//Displays Confirmation message while changing the status
	_openStatusChangeConfirm: function (oEvent) {
		var sStatus = this.evaluationDataModel.getProperty("/data/nextEvalStatus");

		var that = this;
		sap.m.MessageBox.show(that._oResourceBundle.getText("statusChangeConfirm"), {
			title: that._oResourceBundle.getText("Confirmtitle"),
			icon: sap.m.MessageBox.Icon.QUESTION,
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose: function (sAction) {
				if (sAction === sap.m.MessageBox.Action.YES) {

					var sEvaluationId = that.evaluationDataModel.getProperty("/data/evaluationID");
					var oModel = this.getOwnerComponent().getModel();

					oModel.callFunction("/evaluationStatusSave", {
						method: "GET",
						urlParameters: {
							EVALUATION_ID: sEvaluationId,
							evalStatus: sStatus
						},
						success: function (oData, oResponse) {
							that.getOwnerComponent().getModel().refresh();
							that.getEvaluation();
						},
						error: function (oError) {
							that.updateMessageManager('Error', oError, "");
						}
					});

				}
			}.bind(this)
		});
	},
	
	//Retrieves the details of the Evaluation Object
	getEvaluation: function () {
		var oHashChanger = new sap.ui.core.routing.HashChanger();
		var sHash = oHashChanger.getHash();
		var that = this;
		var sPath = sHash.split("/")[1].split("'")[1];
		if (!sPath) {
			sPath = sHash.split("/")[2].split("'")[1];
		}
		var oModel = this.getOwnerComponent().getModel();
		oModel.read("/Evaluation(evaluationID=guid'" + sPath + "',IsActiveEntity=true)", {

			success: function (data, response) {
				if (response) {
					that.evaluationDataModel.setData({
						data: data
					});
					var futureStatus = that.evaluationDataModel.getProperty("/data/nextEvalStatus");
					var sCurrentStatus = that.evaluationDataModel.getProperty("/data/evalStatus");
					sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::").setType(
						sap.m.ButtonType.Transparent);

					sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::").setText(
						that._oResourceBundle.getText("statusChangeBtnText", [futureStatus]));

					if (sCurrentStatus === that._oResourceBundle.getText("Closed")) {
						sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::").setType(
							sap.m.ButtonType.Default);
						sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--action::").setEnabled(
							false);

					}
				}
			},
			error: function (oError) {
				that.updateMessageManager('Error', oError, "");
			}
		});
	},
	
	//Displays a pop up for selecting a recipe
	onClickAddRcpToEval: function (oEvent) {
		var that = this;
		var oModel = this.getOwnerComponent().getModel();
		this.getView().setBusy(true);
		oModel.read("/MasterRecipe", {
			success: function (data, response) {
				that.getView().setBusy(false);
				if (response) {
					var oRecipes = data.results;
					that.recipeModel = that.getOwnerComponent().getModel("recipeDataModel");
					that.recipeModel.setData({
						data: oRecipes
					});

					that._oBasicSearchField = new sap.m.SearchField({
						showSearchButton: false
					});

					var aColumns = [{
						"label": that._oResourceBundle.getText("recipeid"),
						"template": "recipeUUID",

					}, {
						"label": that._oResourceBundle.getText("recipeDesc"),
						"template": "recipeDescription",
						"width": "5rem"
					}, {
						"label": that._oResourceBundle.getText("validityArea"),
						"template": "validityArea"
					}, {
						"label": that._oResourceBundle.getText("validityDate"),
						"template": "validityDate"
					}];
					that.oColModel = new sap.ui.model.json.JSONModel();
					that.oColModel.setData({
						cols: aColumns
					});

					that._oValueHelpDialog = sap.ui.xmlfragment("ComplianceEvaluator.ext.fragments.RecipeValueHelp", that);
					that.getView().addDependent(that._oValueHelpDialog);
					that._oValueHelpDialog.setRangeKeyFields([{
						label: "RECIPE",
						key: "RECIPE",
						type: "string",
						typeInstance: new sap.ui.model.type.String({}, {
							maxLength: 7
						})
					}]);

					that._oValueHelpDialog.getFilterBar().setBasicSearch(that._oBasicSearchField);
					that._oValueHelpDialog.getTableAsync().then(function (oTable) {
						oTable.setModel(that.recipeModel);
						oTable.setModel(that.oColModel, "columns");
						if (oTable.bindRows) {
							oTable.bindAggregation("rows", "/data");
						}
						if (oTable.bindItems) {
							oTable.bindAggregation("items", "/data", function () {
								return new sap.m.ColumnListItem({
									cells: aColumns.map(function (column) {
										return new sap.m.Label({
											text: "{" + column.template + "}"
										});
									})
								});
							});
						}
						that._oValueHelpDialog.update();
					}.bind(that));
					
					that._oValueHelpDialog.open();
				}
			},
			error: function (errorMessage) {
				that.getView().setBusy(false);
			}
		});
	},
	
	//When the object page is exited, the ValueHelp Dialog is destroyed to avoid duplicate IDs.
	onRecipeVHCancelPress: function () {
		this._oValueHelpDialog.destroy();
	},
	
	//Event handler for OK button in the pop up for adding recipes. This will call function import for updating recipes in backend table. And will show the pop up with already added recipes if any.
	onRecipeVHOkPress: function (oEvent) {
		var that = this;
		var oModel = this.getOwnerComponent().getModel();
		var aSelectedTokens = oEvent.getParameters().tokens;
		var aDuplicateRecipes = [];
		var sEvaluation = this.getEvaluationId();
		var sAddedUser = sap.ushell.Container.getService("UserInfo").getUser().getFullName();
		var sDate = new Date().toLocaleDateString();
		var sRecCount = 0;
		for (var i = 0; i < aSelectedTokens.length; i++) {
			var sRecId = aSelectedTokens[i].getKey();
			var sPath = "/MasterRecipe(guid'" + sRecId + "')";
			var aSelectedRec = that.getOwnerComponent().getModel().getProperty(sPath);

			oModel.callFunction("/addRecipe", {
				method: "GET",
				urlParameters: {
					evaluationID: sEvaluation,
					recipeId: aSelectedRec.recipeUUID,
					recipeDescription: aSelectedRec.recipeDescription,
					recipeType: aSelectedRec.recipeType,
					recipeStatus: aSelectedRec.recipeStatus,
					createdBy: ""

				},
				success: function (oData, oResponse) {
					sRecCount++;
					var oData = oData;
					if (oData && oData.addRecipe) {
						aDuplicateRecipes.push(" &" + oData.addRecipe);
					}
					if (aDuplicateRecipes.length > 0 && sRecCount == aSelectedTokens.length) {
						var sDuplicateMsg = "";
						var sPopUpRecMsg = that._oResourceBundle.getText("duplRecPopMsg");
						if (aDuplicateRecipes.length == 1) {
							sDuplicateMsg = that._oResourceBundle.getText("duplicateRecMsg", [aDuplicateRecipes]);
						} else {
							sDuplicateMsg = that._oResourceBundle.getText("duplicateRecMsgPlural", [aDuplicateRecipes]);
						}
						that.updateMessageManager('Information', sDuplicateMsg, "");
						sap.m.MessageBox.show(sPopUpRecMsg, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: that._oResourceBundle.getText("info")
						});

					}
					oModel.refresh();
				},
				error: function (oError) {
					that.updateMessageManager('Error', oError, "");
				}
			});

		}

		this._oValueHelpDialog.close();
	},
	
	//Event handler for search field in evaluation sheet.
	onRecFilterBarSearch: function (oEvent) {
		var sSearchQuery = this._oBasicSearchField.getValue(),
			aSelectionSet = oEvent.getParameter("selectionSet");
		var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
			if (oControl.getValue()) {
				aResult.push(new sap.ui.model.Filter({
					path: oControl.getName(),
					operator: sap.ui.model.FilterOperator.Contains,
					value1: oControl.getValue()
				}));
			}

			return aResult;
		}, []);

		aFilters.push(new sap.ui.model.Filter({
			filters: [
				new sap.ui.model.Filter({
					path: "recipeUUID",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: sSearchQuery
				}),
				new sap.ui.model.Filter({
					path: "recipeDescription",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: sSearchQuery
				}),
				new sap.ui.model.Filter({
					path: "RECIPETYPE",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: sSearchQuery
				})
			],
			and: false
		}));

		this._filterRecipeTable(new sap.ui.model.Filter({
			filters: aFilters,
			and: true
		}));
	},
	
	//Event handler for performing filter on specified data.
	_filterRecipeTable: function (oFilter) {
		var oValueHelpDialog = this._oValueHelpDialog;

		oValueHelpDialog.getTableAsync().then(function (oTable) {
			if (oTable.bindRows) {
				oTable.getBinding("rows").filter(oFilter);
			}

			if (oTable.bindItems) {
				oTable.getBinding("items").filter(oFilter);
			}

			oValueHelpDialog.update();
		});
	},
	
	//Event handler for performing filter on specified data.
	_filterPurposeTable: function (oFilter) {
		var oValueHelpDialog1 = this._oValueHelpDialog1;

		oValueHelpDialog1.getTableAsync().then(function (oTable) {
			if (oTable.bindRows) {
				oTable.getBinding("rows").filter(oFilter);
			}

			if (oTable.bindItems) {
				oTable.getBinding("items").filter(oFilter);
			}

			oValueHelpDialog1.update();
		});
	},

	//Retrieving the Evaluation ID and returning to the calling Function.
	getEvaluationId: function () {
		var oHashChanger = new sap.ui.core.routing.HashChanger();
		var sHash = oHashChanger.getHash();
		var sPath = sHash.split("/")[1].split("'")[1];
		if (!sPath) {
			sPath = sHash.split("/")[2].split("'")[1];
		}
		return sPath;
	},

	onClickCopyRecipe: function (oEvent) {

		var oSource = oEvent.getSource();
		var that = this;
		var osel = sap.ui.getCore().byId(
						"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--recipe::com.sap.vocabularies.UI.v1.LineItem::recipe::responsiveTable"
					).getSelectedContextPaths();
					var oRecModel = sap.ui.getCore().byId(
						"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--recipe::com.sap.vocabularies.UI.v1.LineItem::recipe::responsiveTable"
					).getModel();
					var aRecData = oRecModel.getProperty(osel[0]);
		sap.m.MessageBox.show(that._oResourceBundle.getText("copyRecipeConfirm",[aRecData.recipeDescription]), {
			title: that._oResourceBundle.getText("Confirmtitle"),
			icon: sap.m.MessageBox.Icon.QUESTION,
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose: function (sAction) {
				if (sAction === sap.m.MessageBox.Action.YES) {
					var osel = sap.ui.getCore().byId(
						"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--recipe::com.sap.vocabularies.UI.v1.LineItem::recipe::responsiveTable"
					).getSelectedContextPaths();
					var oRecModel = sap.ui.getCore().byId(
						"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--recipe::com.sap.vocabularies.UI.v1.LineItem::recipe::responsiveTable"
					).getModel();
					var aRecData = oRecModel.getProperty(osel[0]);
					var sEvaluationId = that.getEvaluationId();
					var oModel = that.getOwnerComponent().getModel();
					oModel.callFunction("/copyRecipe", {
						method: "GET",
						urlParameters: {
							evaluationID: sEvaluationId,
							recipeId: aRecData.recipeId,
							recipeDescription: aRecData.recipeDescription,
							recipeType:"",
							recipeStatus: aRecData.recipeStatus
						},
						success: function (oData, oResponse) {
							var aData = oData
							oModel.refresh();
						},
						error: function (oError) {
							that.updateMessageManager('Error', oError, "");
						}
					});
				}
			}
		});
	},
	
	//Event handler of the button for adding Purposes to the Evaluation.
	onClickAddPurpToEval: function (oEvent) {
		var that = this;
		this.getView().setBusy(true);
		var oModel = this.getOwnerComponent().getModel();
		oModel.read("/MasterPurpose", {
			success: function (data, response) {
				that.getView().setBusy(false);
				if (response) {

					var oPurposes = data.results;
					that.purposeModel = that.getOwnerComponent().getModel("purposeDataModel");
					that.purposeModel.setData({
						data: oPurposes
					});
					that._oBasicSearchField1 = new sap.m.SearchField({
						showSearchButton: false
					});
					that.oColModel = new sap.ui.model.json.JSONModel();
					var aColumns = [{
						"label": that._oResourceBundle.getText("purposetxt"),
						"template": "purpose",
						"width": "5rem"
					}, {
						"label": that._oResourceBundle.getText("noOfRequirementstxt"),
						"template": "noOfRequirements"

					}, {
						"label": that._oResourceBundle.getText("createdBytxt"),
						"template": "createdBy"
					}, {
						"label": that._oResourceBundle.getText("createdOntxt"),
						"template": "createdOn"
					}];
					that.oColModel.setData({
						cols: aColumns
					});
					that._oValueHelpDialog1 = sap.ui.xmlfragment("ComplianceEvaluator.ext.fragments.PurposeValueHelp", that);
					that.getView().addDependent(that._oValueHelpDialog1);
					that._oValueHelpDialog1.getFilterBar().setBasicSearch(that._oBasicSearchField1);
					that._oValueHelpDialog1.getTableAsync().then(function (oTable) {
						oTable.setModel(that.purposeModel);
						oTable.setModel(that.oColModel, "columns");
						if (oTable.bindRows) {
							oTable.bindAggregation("rows", "/data");
						}
						if (oTable.bindItems) {
							oTable.bindAggregation("items", "/data", function () {
								return new sap.m.ColumnListItem({
									cells: aColumns.map(function (column) {
										return new sap.m.Label({
											text: "{" + column.template + "}"
										});
									})
								});
							});
						}
						that._oValueHelpDialog1.update();
					}.bind(that));
					that._oValueHelpDialog1.open();
				}
			},
			error: function (errorMessage) {
				that.getView().setBusy(false);
				that.updateMessageManager('Error', oError, "");
			}
		});

	},
	
	//Event handler for OK button in the pop up for adding recipes.
	onPurposeVHOkPress: function (oEvent) {
		var that = this;
		var oModel = this.getOwnerComponent().getModel();
		var aSelectedTokens = oEvent.getParameters().tokens;
		var aDuplicatePurposes = [];
		var sEvaluation = this.getEvaluationId();
		var sAddedUser = sap.ushell.Container.getService("UserInfo").getUser().getFullName();
		var sPurposeCount = 0;
		for (var i = 0; i < aSelectedTokens.length; i++) {
			var sPurposeId = aSelectedTokens[i].getKey();
			var sPath = "/MasterPurpose(guid'" + sPurposeId + "')";
			var aSelectedPurpose = that.getOwnerComponent().getModel().getProperty(sPath);
			oModel.callFunction("/addPurpose", {
				method: "GET",
				urlParameters: {
					evaluationID: sEvaluation,
					purposeId: aSelectedPurpose.ID,
					purpose: aSelectedPurpose.purpose,
					purposeType: "",
					requirement: "",
					requirementID: "",
					addedBy: sAddedUser
				},
				success: function (oData, oResponse) {
					sPurposeCount++;
					var oData = oData;
					if (oData && oData.addPurpose) {
						aDuplicatePurposes.push(oData.addPurpose);
					}
					if (aDuplicatePurposes.length > 0 && sPurposeCount == aSelectedTokens.length) {
						var sDuplicateMsg = "";
						var sDuplicatePopMsg = that._oResourceBundle.getText("duplPurPopMsg");
						if (aDuplicatePurposes.length == 1) {
							sDuplicateMsg = that._oResourceBundle.getText("duplicatePuposeMsg", [aDuplicatePurposes]);
						} else {
							sDuplicateMsg = that._oResourceBundle.getText("duplicatePuposeMsgPlural", [aDuplicatePurposes]);
						}
						that.updateMessageManager('Information', sDuplicateMsg, "");
						sap.m.MessageBox.show(sDuplicatePopMsg, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: that._oResourceBundle.getText("info")
						});

					}
					oModel.refresh();
				},
				error: function (oError) {

					that.updateMessageManager('Error', oError, "");

				}
			});
		}
		this._oValueHelpDialog1.close();
	},
	
	//Event handler for the Cancel button in the pop up for adding purposes.
	onPurposeVHCancelPress: function () {
		this._oValueHelpDialog1.destroy();
	},
	
	//Event handler to search Purposes while adding Purpose to evaluation sheet.
	onFilterPurposeSearch: function (oEvent) {
		var sSearchQuery = this._oBasicSearchField1.getValue(),
			aSelectionSet = oEvent.getParameter("selectionSet");
		var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
			if (oControl.getValue()) {
				aResult.push(new sap.ui.model.Filter({
					path: oControl.getName(),
					operator: sap.ui.model.FilterOperator.Contains,
					value1: oControl.getValue()
				}));
			}
			return aResult;
		}, []);

		aFilters.push(new sap.ui.model.Filter({
			filters: [
				new sap.ui.model.Filter({
					path: "purpose",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: sSearchQuery
				}),
				new sap.ui.model.Filter({
					path: "activationStatus",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: sSearchQuery
				})
			],
			and: false
		}));

		this._filterPurposeTable(new sap.ui.model.Filter({
			filters: aFilters,
			and: true
		}), this._oValueHelpDialog1);
	},
	
	//Message manager popover is added to the view.
	_getMessagePopover: function () {
		// create popover lazily (singleton)
		if (!this._oMessagePopover) {
			this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "ComplianceEvaluator.ext.fragments.MessagePopOver", this);
			this.getView().addDependent(this._oMessagePopover);
		}
		return this._oMessagePopover;
	},
	
	//Errors are added to the message manager and the visibility of the message manager is manipulated here
	updateMessageManager: function (sType, sMsg, sDesc) {
		this.removeMessageFromTarget(sMsg);
		var aErrorMsg = new sap.ui.core.message.Message({
			type: sType,
			message: sMsg,
			description: sDesc

		});
		sap.ui.getCore().getMessageManager().addMessages(aErrorMsg);
		var oMsgBtn = sap.ui.getCore().byId(
			"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--showMessages");
		oMsgBtn.setVisible(true);
		oMsgBtn.setText(sap.ui.getCore().getMessageManager().getMessageModel().getData().length);

	},
	
	//Rectified errors are removed from the message manager model
	removeMessageFromTarget: function (sMessage) {
		sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(function (oMessage) {
			if (oMessage.message === sMessage) {
				sap.ui.getCore().getMessageManager().removeMessages(oMessage);
				var oMsgBtn = sap.ui.getCore().byId(
					"ComplianceEvaluator::sap.suite.ui.generic.template.ObjectPage.view.Details::Evaluation--showMessages");
				oMsgBtn.setText(sap.ui.getCore().getMessageManager().getMessageModel().getData().length);
			}
		}.bind(this));
	},
	
	//Check if messages in the message manager are of type error. If yes, it returns ERROR, else, true is returned.
	checkForerrors: function () {
		var sError = "";
		sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(function (oMessage) {
			if (oMessage.type == "Error") {
				sError = true;
			}
		});
		return sError;
	},
	
	//Event Handler to create a Recipe.
	onClickCreateRecipe: function () {

		var sEvaluationName =this.evaluationDataModel.getProperty("/data/evaluationName");
		var sEvaluationId = this.evaluationDataModel.getProperty("/data/evaluationID");
	
  		var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
        	this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");

    		// *navigate to external app
    		var toApp = this.oCrossAppNavigator && this.oCrossAppNavigator.toExternal({
        		target : {
            			semanticObject : "Formulation",
            			action : "manage"
        		},
        		params : {
            			"evaluationID" : sEvaluationId,
            			"evaluationName" : sEvaluationName,
            			"preferredMode": "create"
        		}
    		}) || "";
	},
	
	//Event Handler to open the Quickview and display the Additional Information
	openQuickView: function (oEvent, oModel) {
		var oButton = oEvent.getSource();
		if (!this._oQuickView) {
			sap.ui.core.Fragment.load({
				name: "ComplianceEvaluator.ext.fragments.AdditionalInfo",
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

	//Method to close the QuickView Fragment
	_configQuickView: function (oModel) {
		this.getView().addDependent(this._oQuickView);
		this._oQuickView.close();
	},
	

	
	//Destroying the QuickView Fragment to Avoid Dupliacate ID issue
	onExit: function() {
		if (this._oQuickView) {
				this._oQuickView.destroy();
		}
	}


});
