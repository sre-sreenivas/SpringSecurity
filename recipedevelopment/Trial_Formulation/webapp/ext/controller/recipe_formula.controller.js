sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Token"
], function (Controller, Token) {
	"use strict";

	var that = this;

	return Controller.extend("Trial_Formulation.trial_formulation.ext.controller.recipe_formula", {

		//Triggered when the page is loaded first time
		onInit: function () {
			this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Recipe").attachMatched(this._onRouteMatched, this);
			this._onRouteMatched();
		},

		//The event handler will be triggered whenever the user goes from list report to the object page. It Triggeres the functions which makes entity calls are made here to load Component, UOM, Specification, Recipe Specification, LayoutList
		_onRouteMatched: function () {
			this.incorrectSpecID = [];
			this.uomInvalidID = []

			for (var q = sap.ui.getCore().getMessageManager().getMessageModel().getData().length - 1; q >= 0; q--) {
				if (sap.ui.getCore().getMessageManager().getMessageModel().getData()[q].message.indexOf(this._oResourceBundle
						.getText("emptySpecIndex")) !== -1 || sap.ui.getCore().getMessageManager()
					.getMessageModel().getData()[q].message.indexOf(this._oResourceBundle
						.getText("emptyQuantityIndex")) !== -1 || sap.ui.getCore().getMessageManager()
					.getMessageModel().getData()[q].message.indexOf(this._oResourceBundle
						.getText("emptyUOMIndex")) !== -1) {
					this.removeMessageFromTarget(sap.ui.getCore()
						.getMessageManager().getMessageModel().getData()[q].message);
				}
			}

			var oHashChanger = new sap.ui.core.routing.HashChanger();
			var sHash = oHashChanger.getHash();
			this.recipeID = sHash.split("'")[1];
			this.isActive = sHash.split("'")[2].split("=")[1].split(")")[0];

			this.getComponentTypes();
			this.getSpecifications();
			this.getUOM();

			this.recipeType = sap.ui.getCore().byId(
				"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::typeanddate::recipeTYPE::Field-comboBoxDisp"
			);
			if (this.recipeType) {
				if (that.recipeType.getValue() !== "") {
					that.recipeType.setValue(that.recipeType.getValue().split("(")[0]);
				}
			}

			if (this.isActive === "true") {
				this.getRecipeSpecifications();
				this.getLayoutList();
			}
		},

		//This event handles the visibility of button in the toolbar of the table. The visibility is managed depending on which button is pressed i.e. either Edit or Save.
		onAfterRendering: function () {
			var oHashChanger = new sap.ui.core.routing.HashChanger();
			var sHash = oHashChanger.getHash();
			this.recipeID = sHash.split("'")[1];
			this.isActive = sHash.split("'")[2].split("=")[1].split(")")[0];

			that = this;
			this.recipeType = sap.ui.getCore().byId(
				"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::typeanddate::recipeTYPE::Field-comboBoxDisp"
			);
			if (this.recipeType) {
				this.recipeType.addDelegate({
					onAfterRendering: function () {
						if (that.recipeType.getValue() !== "") {
							that.recipeType.setValue(that.recipeType.getValue().split("(")[0]);
						}
					}
				});
			}

			this.getRecipeSpecifications();
			this.getLayoutList();

			if (sap.ui.getCore().byId(
					"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate")) {
				if (sap.ui
					.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").getVisible()) {

					if (this.getView().byId("btn1")) {
						this.getView().byId("btn1").setVisible(true);
						this.getView().byId("btn1").setEnabled(false);
					}
					if (this.getView().byId("btn2")) {
						this.getView().byId("btn2").setVisible(true);
						this.getView().byId("btn2").setEnabled(false);
					}
					if (this.getView().byId("btn5")) {
						this.getView().byId("btn5").setVisible(true);
						this.getView().byId("btn5").setEnabled(false);

					}
					if (this.getView().byId("btn6")) {
						this.getView().byId("btn6").setVisible(true);
						this.getView().byId("btn6").setEnabled(false);
					}
				}
			}
			if (sap.ui.getCore().byId(
					"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--edit")) {
				if (sap.ui
					.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--edit").getVisible()) {

					if (this.getView().byId("btn5")) {
						this.getView().byId("btn5").setVisible(false);
					}
					if (this.getView().byId("btn6")) {
						this.getView().byId("btn6").setVisible(false);
					}
					if (this.getView().byId("btn1")) {
						this.getView().byId("btn1").setVisible(false);
					}
					if (this.getView().byId("btn2")) {
						this.getView().byId("btn2").setVisible(false);
					}
				}
			}
		},

		//A function import is called to get the layouts for the user. If no layouts are created, a default layout is set and the columns related to the default layout is returned.
		//If no layouts are created for the user, Create Layout button is enabled and Manage Layout button is made invisible. If layouts are present for the user, Manage Layout button is visible and Create Layout is made invisible.
		getLayoutList: function () {
			var that = this;
			var oLayoutModel = this.getOwnerComponent().getModel("layOutModel");

			oLayoutModel.callFunction("/getLayoutList", {
				method: "GET",
				success: function (oData) {
					var layoutArr = [];
					var layoutModel = new sap.ui.model.json.JSONModel();

					oData.results.sort(that.sortArray);
					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results[i].defaultFlag === true) {
							var element = oData.results.splice(i, 1);
							oData.results.splice(0, 0, element[0]);
							break;
						}
					}
					that.defaultLayoutId = oData.results[0].ID;
					that.defaultLayoutName = oData.results[0].layoutName;

					for (var i = 0; i < oData.results.length; i++) {
						var layoutObj = {
							layoutId: oData.results[i].ID,
							layoutName: oData.results[i].layoutName,
							isDefault: oData.results[i].defaultFlag
						};
						layoutArr.push(layoutObj);
					}
					layoutModel.setData(layoutArr);

					that.getView().byId("cmbTableType").setModel(layoutModel, "layoutModel");
					that.getView().byId("cmbTableType").setSelectedKey(that.defaultLayoutId);
					if (that.defaultLayoutName === "Default") {
						if (that.getView().byId("createLayout")) {
							that.getView().byId("createLayout").setVisible(true);
						}
						if (that.getView().byId("MenuBtn")) {
							that.getView().byId("MenuBtn").setVisible(false);
						}
					} else {
						if (that.getView().byId("createLayout")) {
							that.getView().byId("createLayout").setVisible(false);
						}
						if (that.getView().byId("MenuBtn")) {
							that.getView().byId("MenuBtn").setVisible(true);
						}
					}
					oLayoutModel.read("/LayoutInformation(ID=guid'" + that.defaultLayoutId + "',IsActiveEntity=true)/columnsSelectedInLayout", {
						success: function (oData) {
							oData.results.sort(function (a, b) {
								if (a.columnOrder < b.columnOrder) {
									return -1;
								}
							});
							if (oData.results[0].subCategoryName != "Formula Item") {
								var formulaItem = {
									ID: 1,
									categoryId: 1,
									subCategoryName: "Formula Item",
									fixedColumn: true,
									columnOrder: 0
								};
								oData.results.splice(0, 0, formulaItem);
							}

							if (that.isActive === "false") {
								var x;
								if (that.quantIndex) {
									x = that.quantIndex;
								} else if (that.compType) {
									x = that.compType;
								} else if (that.specIDIndex) {
									x = that.specIDIndex;
								} else if (that.quantIndex) {
									x = that.quantIndex;
								} else if (that.uomIndex) {
									x = that.uomIndex;
								} else if (that.specDescIndex) {
									x = that.specDescIndex;
								}
								if (that.getView().byId("TreeTable").getRows().length > 0 && x) {
									if (that.getView().byId("TreeTable").getRows()[1].getCells()[x]) {
										if (that.getView().byId("TreeTable").getRows()[1].getCells()[x].getId().indexOf("label") !== -1) {
											that.transposeLayoutColumns(oData.results);
										} else {
											that.getFormulation();
										}
									}
								} else {
									that.transposeLayoutColumns(oData.results);
								}
							} else {
								that.transposeLayoutColumns(oData.results);
							}
						},
						error: function (errorMessage) {
							that.updateMessageManager("Error",
								errorMessage.responseText.split(":")[5].split("}")[0], "");
						}
					});

				},
				error: function (errorMessage) {
					that.updateMessageManager('Error', errorMessage.responseText.split(":")[5].split("}")[0], "");
				}
			});
		},

		//A model call is made to the recipe table which has an association with recipe specification table. The data obtained would be the rows in the table. A JSON model is made with the data obtained. Also, the cells are validated as the table gets binding with the rows.
		//The data received in the result is sorted based on the item number and passed on to a function which converts this flatdata in a tree structure based on item number.
		getRecipeSpecifications: function () {
			that = this;
			var oModel = this.getOwnerComponent().getModel();

			oModel.read("/Recipe(recipeID=guid'" + this.recipeID + "',IsActiveEntity=" + this.isActive + ")/recipe?$orderby=itemNumber asc", {
				success: function (data, response) {
					if (response) {
						data.results.sort(function (a, b) {
							if (a.itemNumber < b.itemNumber) {
								return -1;
							}
						});
						var rowDataArr = [];
						var rowModel = new sap.ui.model.json.JSONModel();
						rowModel.setSizeLimit(1000);
						for (var i = 0; i < data.results.length; i++) {
							var rowDataObj = {};
							rowDataObj["ID"] = data.results[i].ID;
							rowDataObj["recipeID"] = data.results[i].recipeID;
							rowDataObj["Specification"] = data.results[i].specificationID;
							rowDataObj["Specification Description"] = data.results[i].specificationDescription;
							rowDataObj["Quantity"] = data.results[i].quantity;
							rowDataObj["UoM"] = data.results[i].UOM;
							rowDataObj["Component Type"] = data.results[i].componentType;
							rowDataObj["Formula Item"] = data.results[i].formulaItemDescription;
							rowDataObj["itemNumber"] = data.results[i].itemNumber;
							rowDataObj["density"] = data.results[i].density;
							rowDataObj["piecetoMass"] = data.results[i].piecetoMass;
							rowDataArr.push(rowDataObj);

						}
						rowModel.setData(rowDataArr);
						that.getView().byId("TreeTable").setModel(rowModel, "rowModel");
						var compMatModel = that.getView().byId("TreeTable").getModel();
						if (sap.ui.getCore().AppContext && compMatModel.getData() !== null) {
							var oAppCtx = sap.ui.getCore().AppContext;
							var columnData = oAppCtx.detailData.materialDetailRefColumnData;
							var rowData = that.transformTreeData(rowDataArr);
							compMatModel.setData({
								rows: rowData,
								columns: columnData
							});

							that.getView().byId("TreeTable").setModel(compMatModel);
							that.validatingCells();
							that.validateCompType();
						}
					}
				},
				error: function (errorMessage) {
					that.updateMessageManager('Error', errorMessage.responseText.split(":")[5].split("}")[0], "");
				}
			});
		},

		//This method converts flat data to a hierarchal data based on the item number of the specification.
		transformTreeData: function (flatdata) {
			that = this;
			var flat = {},
				key;
			var root = [];

			for (var i = 0; i < flatdata.length; i++) {
				if (flatdata[i].recipeID === flatdata[i].Specification) {
					key = flatdata[i].recipeID;
					flat[key] = flatdata[i];
				} else {
					key = flatdata[i].ID;
					flat[key] = flatdata[i];
				}
			}

			for (i in flat) {
				flat[i].children = [];
			}

			for (i in flat) {
				var parentkey = this.recipeID;
				if (parentkey === flat[i].Specification) {
					root.push(flat[i]);
				} else {
					flat[parentkey].children.push(flat[i]);
				}
			}

			return root;
		},

		//Component type is set based on the data stored in the recipe specification table.
		validateCompType: function () {
			var oHashChanger = new sap.ui.core.routing.HashChanger();
			var sHash = oHashChanger.getHash();
			this.isActive = sHash.split("'")[2].split("=")[1].split(")")[0];
			var x;
			if (that.quantIndex) {
				x = that.quantIndex;
			} else if (that.compType) {
				x = that.compType;
			} else if (that.specIDIndex) {
				x = that.specIDIndex;
			} else if (that.quantIndex) {
				x = that.quantIndex;
			} else if (that.uomIndex) {
				x = that.uomIndex;
			} else if (that.specDescIndex) {
				x = that.specDescIndex;
			}
			if (this.isActive === "false" && x) {
				if (this.getView().byId("TreeTable").getRows()[1].getCells()[x]) {
					if (this.getView().byId("TreeTable").getRows()[1].getCells()[x].getId().indexOf("label") === -1) {
						if (this.getView().byId("TreeTable")._getTotalRowCount() > 10) {
							var length = 10;
						} else {
							var length = this.getView().byId("TreeTable")._getTotalRowCount();
						}
						for (var i = 1; i < length; i++) {
							if (this.compType) {
								var key = this.getView().byId("TreeTable").getRows()[i].getCells()[this.compType].getSelectedKey();
							} else {
								if (this.getView().byId("TreeTable").getRows()[i].getBindingContext() != null) {
									var key = this.getView().byId("TreeTable").getRows()[i].getBindingContext().getProperty("Component Type");
								}
							}
							if (this.quantIndex) {
								var qunatValue = this.getView().byId("TreeTable").getRows()[i].getCells()[this.quantIndex].getValue();
							} else {
								if (this.getView().byId("TreeTable").getRows()[i].getBindingContext() != null) {
									var qunatValue = this.getView().byId("TreeTable").getRows()[i].getBindingContext().getProperty("Quantity");
								}
							}
							if (parseFloat(qunatValue) < 0) {
								if (this.compType) {
									var compTypeOutputModel = this.getView().byId("TreeTable").getRows()[i].getCells()[this.compType].getModel(
										"compTypeOutputModel");
									this.getView().byId("TreeTable").getRows()[i].getCells()[this.compType].setModel(compTypeOutputModel, "currentCompTypeModel");
									this.getView().byId("TreeTable").getRows()[i].getCells()[this.compType].setSelectedKey(key);
								}

								this.getView().byId("TreeTable").getRows()[i].getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
									"Trial_Formulation/trial_formulation/ext/images/SecondaryOutput.png"));
								this.getView().byId("TreeTable").getRows()[i].getCells()[0].getContent()[1].setDesign("Bold");

							} else {
								if (this.compType) {
									var compTypeModel = this.getView().byId("TreeTable").getRows()[i].getCells()[this.compType].getModel("compTypeModel");
									this.getView().byId("TreeTable").getRows()[i].getCells()[this.compType].setModel(compTypeModel, "currentCompTypeModel");
									this.getView().byId("TreeTable").getRows()[i].getCells()[this.compType].setSelectedKey(key);
								}

								this.getView().byId("TreeTable").getRows()[i].getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
									"Trial_Formulation/trial_formulation/ext/images/InputSpecification.png"));
								this.getView().byId("TreeTable").getRows()[i].getCells()[0].getContent()[1].setDesign("Standard");
							}
						}
					}
				}
			}
		},

		//Component type table is called and 3 JSON models are made: input model, which contains Ingredient and package, an output model, which contains Product and Co Product, and a current component type model which gets bound to the component type field in the table.
		getComponentTypes: function () {
			that = this;
			var oModel = this.getOwnerComponent().getModel();

			oModel.read("/ComponentType", {
				success: function (data, response) {
					if (response) {
						var compTypeModel = new sap.ui.model.json.JSONModel();
						compTypeModel.setSizeLimit(1000);
						var compTypeOutputModel = new sap.ui.model.json.JSONModel();
						compTypeOutputModel.setSizeLimit(1000);
						var cTypes = data.results;
						that.cTypesArr = [];
						that.cTypesOutputArr = [];
						for (var i = 0; i < cTypes.length; i++) {
							var temp = {};
							if (cTypes[i].item === "input") {
								temp.compTypeID = cTypes[i].ID;
								temp.compTypeDesc = cTypes[i].description;
								temp.item = cTypes[i].item;
								temp.compType = cTypes[i].compType;
								that.cTypesArr.push(temp);
							}
							if (cTypes[i].item === "output") {
								temp.compTypeID = cTypes[i].ID;
								temp.compTypeDesc = cTypes[i].description;
								temp.item = cTypes[i].item;
								temp.compType = cTypes[i].compType;
								that.cTypesOutputArr.push(temp);
							}
						}
						compTypeModel.setData(that.cTypesArr);

						compTypeOutputModel.setData(that.cTypesOutputArr);
						that.getView().byId("TreeTable").setModel(compTypeModel, "compTypeModel");
						that.getView().byId("TreeTable").setModel(compTypeOutputModel, "compTypeOutputModel");
						that.getView().byId("TreeTable").setModel(compTypeModel, "currentCompTypeModel");
					}
				},
				error: function (errorMessage) {
					that.updateMessageManager('Error', errorMessage.responseText.split(":")[5].split("}")[0], "");
				}
			});
		},

		//A model call is made to read the specifications. A JSON model is made with the data obtained.
		getSpecifications: function () {
			that = this;
			var oModel = this.getOwnerComponent().getModel();

			oModel.read("/Specification", {
				success: function (data, response) {
					if (response) {
						var specModel = new sap.ui.model.json.JSONModel();
						specModel.setSizeLimit(1000);
						var specData = data.results;
						var specArr = [];
						for (var i = 0; i < specData.length; i++) {
							var temp = {};
							temp.specificationID = specData[i].specificationID;
							temp.createdBY = specData[i].createdBY;
							temp.specType = specData[i].specType;
							temp.density = specData[i].density;
							temp.piecetoMass = specData[i].piecetoMass;
							temp.specificationDescription = specData[i].specificationDescription;
							temp.formulaItemDescription = specData[i].formulaItemDescription;
							specArr.push(temp);
						}
						specModel.setData(specArr);
						that.getView().byId("TreeTable").setModel(specModel, "specModel");
					}
				},
				error: function (errorMessage) {
					that.updateMessageManager('Error', errorMessage.responseText.split(":")[5].split("}")[0], "");
				}
			});
		},

		//A model call is made to read the UOM table. A JSON model is made with the data obtained.
		getUOM: function () {
			that = this;
			var oModel = this.getOwnerComponent().getModel();

			oModel.read("/UOM", {
				success: function (data, response) {
					if (response) {
						var uomModel = new sap.ui.model.json.JSONModel();
						uomModel.setSizeLimit(1000);
						var uomResults = data.results;
						var uomArr = [];
						for (var i = 0; i < uomResults.length; i++) {
							var temp = {};
							temp.Id = uomResults[i].Id;
							temp.Description = uomResults[i].description;
							uomArr.push(temp);
						}
						uomModel.setData(uomArr);
						that.getView().byId("TreeTable").setModel(uomModel, "uomModel");
					}
				},
				error: function (errorMessage) {
					that.updateMessageManager('Error', errorMessage.responseText.split(":")[5].split("}")[0], "");
				}
			});
		},

		//This function adds column name of the table to an array. A column template function is called here. Column index is maintaned which is used to access a particular column.
		transposeLayoutColumns: function (NumberOfNutrients) {
			var componentMaterialRowData = [],
				componentMaterialColumnData = [];

			componentMaterialRowData = this.getView().byId("TreeTable").getModel("rowModel").getData();

			var columnHeader, columnOrder, numberOfFreezedColumns = 0;
			this.specIDIndex = false;
			this.specDescIndex = false;
			this.uomIndex = false;
			this.quantIndex = false;
			this.compType = false;
			this.formulaItemIndex = false;
			for (var d = 0; d < NumberOfNutrients.length; d++) {
				columnHeader = NumberOfNutrients[d].subCategoryName;
				if (columnHeader === "Specification") {
					this.specIDIndex = d;
				} else if (columnHeader === "Specification Description") {
					this.specDescIndex = d;
				} else if (columnHeader === "UoM") {
					this.uomIndex = d;
				} else if (columnHeader === "Quantity") {
					this.quantIndex = d;
				} else if (columnHeader === "Component Type") {
					this.compType = d;
				} else if (columnHeader === "Formula Item") {
					this.formulaItemIndex = d;
				}
				if (NumberOfNutrients[d].fixedColumn === true) {
					numberOfFreezedColumns = numberOfFreezedColumns + 1;
				}
				var NutientColumn = {};
				var NutientHeader = NumberOfNutrients[d].subCategoryName;
				NutientColumn.header = NutientHeader;
				componentMaterialColumnData.push(NutientColumn);
			}
			this.getView().byId("TreeTable").setFixedColumnCount(numberOfFreezedColumns);

			var oAppCtx = sap.ui.getCore().AppContext;
			if (!oAppCtx) {
				sap.ui.getCore().AppContext = new Object();
				oAppCtx = sap.ui.getCore().AppContext;
			}
			oAppCtx.detailData = {
				materialDetailRefRowData: componentMaterialRowData,
				materialDetailRefColumnData: componentMaterialColumnData
			};
			that.createcomponentSourceTable();
			that.getFormulation();
		},

		//A default model is binded to the table which contains rows and columns data.
		createcomponentSourceTable: function () {
			var oHashChanger = new sap.ui.core.routing.HashChanger();
			var sHash = oHashChanger.getHash();
			that.isActive = sHash.split("'")[2].split("=")[1].split(")")[0];

			var oAppCtx = sap.ui.getCore().AppContext;
			var compMatModel = new sap.ui.model.json.JSONModel();
			compMatModel.setSizeLimit(1000);
			var columnData = oAppCtx.detailData.materialDetailRefColumnData;
			var rowData = that.transformTreeData(oAppCtx.detailData.materialDetailRefRowData);
			compMatModel.setData({
				rows: rowData,
				columns: columnData
			});

			this.getView().byId("TreeTable").setModel(compMatModel);

			var columnCount = 0;

			this.getView().byId("TreeTable").bindColumns("/columns", function (sId, oContext) {
				var columnName = oContext.getObject().header;
				columnCount = columnCount + 1;
				var templateValues = that.componentMaterialTableColumnTemplate(columnName);

				var columnHeader = templateValues[0];
				var template = templateValues[1];
				var id = templateValues[2];

				var periodLabel;
				periodLabel = columnHeader;
				return new sap.ui.table.Column({
					label: periodLabel,
					template: template,
					id: id,
					autoResizable: true
				});
			});
			this.getView().byId("TreeTable").attachFirstVisibleRowChanged(function (evt) {
				var oTable = evt.getSource();
				var oRows = oTable.getRows();
				var viewId = this.getId().split("--")[0];
				var that = sap.ui.getCore().byId(viewId).getController();
				var componentType;
				oTable.rerender();
				for (var i = 0; i < oRows.length; i++) {
					if (!that.compType) {
						if (oRows[i].getBindingContext() != null) {
							var compType = oRows[i].getBindingContext().getProperty("Component Type");
						}
					} else {
						if (that.isActive === "true") {
							var compType = oRows[i].getCells()[that.compType].getText();
						} else {
							if (oRows[i].getBindingContext() != null) {
								var compType = oRows[i].getCells()[that.compType].getSelectedKey();
							}
						}
					}
					if (!that.quantIndex) {
						if (oRows[i].getBindingContext() != null) {
							var quantity = oRows[i].getBindingContext().getProperty("Quantity");
						}
					} else {
						if (that.isActive === "true") {
							var quantity = oRows[i].getCells()[that.quantIndex].getText();
						} else {
							var quantity = oRows[i].getCells()[that.quantIndex].getValue();
						}
					}
					if (!that.specIDIndex) {
						if (oRows[i].getBindingContext() != null) {
							var specId = oRows[i].getBindingContext().getProperty("Specification");
						}
					} else {
						if (that.isActive === "true") {
							var specId = oRows[i].getCells()[that.specIDIndex].getText();
						} else {
							var specId = oRows[i].getCells()[that.specIDIndex].getValue();
						}
					}
					if (that.isActive === "true" && compType && quantity && specId) {
						if ((compType === that._oResourceBundle.getText("Ingredient") || compType ===
								that._oResourceBundle.getText("PACKAGE") || parseFloat(quantity) >= 0) && specId !==
							that.recipeID) {
							oRows[i].getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
								"Trial_Formulation/trial_formulation/ext/images/InputSpecification.png"));
							oRows[i].getCells()[0].getContent()[1].setDesign("Standard");
							if (that.specDescIndex) {
								oRows[i].getCells()[that.specDescIndex].setDesign("Standard");
							}
							if (that.quantIndex) {
								oRows[i].getCells()[that.quantIndex].setDesign("Standard");
							}
							if (that.uomIndex) {
								oRows[i].getCells()[that.uomIndex].setDesign("Standard");
							}
							if (that.compType) {
								oRows[i].getCells()[that.compType].setDesign("Standard");
							}
						} else if ((compType === that._oResourceBundle.getText("PRODUCT") || that._oResourceBundle.getText("CO_PRODUCT") ||
								parseFloat(quantity) < 0) && specId !== that.recipeID) {
							oRows[i].getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
								"Trial_Formulation/trial_formulation/ext/images/SecondaryOutput.png"));
							oRows[i].getCells()[0].getContent()[1].setDesign("Bold");
							if (that.specDescIndex) {
								oRows[i].getCells()[that.specDescIndex].setDesign("Bold");
							}
							if (that.quantIndex) {
								oRows[i].getCells()[that.quantIndex].setDesign("Bold");
							}
							if (that.uomIndex) {
								oRows[i].getCells()[that.uomIndex].setDesign("Bold");
							}
							if (that.compType) {
								oRows[i].getCells()[that.compType].setDesign("Bold");
							}
						}
					}
					if (that.isActive === "true") {
						if (specId === that.recipeID) {
							oRows[i].getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
								"Trial_Formulation/trial_formulation/ext/images/PrimaryOutput.png"));
							oRows[i].getCells()[0].getContent()[1].setDesign("Bold");
							if (that.specDescIndex) {
								oRows[i].getCells()[that.specDescIndex].setDesign("Bold");
							}
							if (that.quantIndex) {
								oRows[i].getCells()[that.quantIndex].setDesign("Bold");
							}
							if (that.uomIndex) {
								oRows[i].getCells()[that.uomIndex].setDesign("Bold");
							}
							if (that.compType) {
								oRows[i].getCells()[that.compType].setText();
								oRows[i].getCells()[that.compType].setDesign("Bold");
							}
						}
					}
					if (that.isActive === "false" && quantity) {
						if (parseFloat(quantity) >= 0 && specId !==
							that.recipeID) {
							oRows[i].getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
								"Trial_Formulation/trial_formulation/ext/images/InputSpecification.png"));
							oRows[i].getCells()[0].getContent()[1].setDesign("Standard");
							if (that.compType) {
								oRows[i].getCells()[that.compType].setEditable(true);
								var compTypeModel = oRows[i].getCells()[that.compType].getModel("compTypeModel");
								oRows[i].getCells()[that.compType].setModel(compTypeModel,
									"currentCompTypeModel");
								if (oRows[i].getCells()[that.compType].getSelectedKey() !== that._oResourceBundle
									.getText("PACKAGE")) {
									componentType = that._oResourceBundle.getText("Ingredient");
								} else {
									componentType = that._oResourceBundle.getText("PACKAGE");
								}
							}
							if (that.specIDIndex) {
								oRows[i].getCells()[that.specIDIndex].setEditable(true);
							}
							if (that.specDescIndex) {
								oRows[i].getCells()[that.specDescIndex].setEditable(false);
							}
							if (that.quantIndex) {
								oRows[i].getCells()[that.quantIndex].setEditable(true);
							}
							if (that.uomIndex) {
								oRows[i].getCells()[that.uomIndex].setEditable(true);
							}
						} else if (parseFloat(quantity) < 0 && specId !==
							that.recipeID) {
							oRows[i].getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
								"Trial_Formulation/trial_formulation/ext/images/SecondaryOutput.png"));
							oRows[i].getCells()[0].getContent()[1].setDesign("Bold");
							if (that.compType) {
								oRows[i].getCells()[that.compType].setEditable(true);
								var compTypeOutputModel = oRows[i].getCells()[that.compType].getModel(
									"compTypeOutputModel");
								oRows[i].getCells()[that.compType].setModel(compTypeOutputModel,
									"currentCompTypeModel");
								if (oRows[i].getCells()[that.compType].getSelectedKey() !== that._oResourceBundle
									.getText("CO_PRODUCT")) {
									componentType = that._oResourceBundle.getText("PRODUCT");
								} else {
									componentType = that._oResourceBundle.getText("CO_PRODUCT");
								}
							}
							if (that.specIDIndex) {
								oRows[i].getCells()[that.specIDIndex].setEditable(true);
							}
							if (that.specDescIndex) {
								oRows[i].getCells()[that.specDescIndex].setEditable(false);
							}
							if (that.quantIndex) {
								oRows[i].getCells()[that.quantIndex].setEditable(true);
							}
							if (that.uomIndex) {
								oRows[i].getCells()[that.uomIndex].setEditable(true);
							}
						}
					}
					if (that.isActive === "false" && specId) {
						if (specId === that.recipeID) {
							if (that.compType) {
								var compTypeOutputModel = oRows[i].getCells()[that.compType].getModel(
									"compTypeOutputModel");
							}
							oRows[i].getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
								"Trial_Formulation/trial_formulation/ext/images/PrimaryOutput.png"));
							oRows[i].getCells()[0].getContent()[1].setDesign("Bold");
							if (that.specIDIndex) {
								oRows[i].getCells()[that.specIDIndex].setEditable(false);
							}
							if (that.specDescIndex) {
								oRows[i].getCells()[that.specDescIndex].setEditable(true);
							}
							if (that.quantIndex) {
								oRows[i].getCells()[that.quantIndex].setEditable(false);
							}
							if (that.uomIndex) {
								oRows[i].getCells()[that.uomIndex].setEditable(false);
							}
							if (that.compType) {
								oRows[i].getCells()[that.compType].setEditable(false);
								oRows[i].getCells()[that.compType].setModel(compTypeOutputModel,
									"currentCompTypeModel");
							}
						}
					}
				}
			});

			this.getView().byId("TreeTable").bindRows("/rows");
			this.getView().byId("TreeTable").expandToLevel(1000);
			this.getView().byId("TreeTable").addDelegate({
				onAfterRendering: function (oevt) {}
			});
		},

		//The column templates are created in this function which gets the input parameter as column name. It returns column name, template and width.
		componentMaterialTableColumnTemplate: function (columnName) {
			var columnHeader, template, id;
			columnHeader = columnName;

			if (columnHeader === "Specification" && this.isActive === "true") {
				template = new sap.m.Link({
					text: {
						path: columnName
					},
					emphasized: true
				});
			} else if (columnHeader === "Specification" && this.isActive === "false") {
				template = new sap.m.Input({
					showValueHelp: true,
					valueHelpOnly: false,
					valueHelpRequest: this.onSpecValueHelpRequested,
					change: this.specChanged
				}).bindProperty("value", columnName);
			} else if (columnHeader === "Specification Description" && this.isActive === "true") {
				template = new sap.m.Label({
					text: {
						path: columnName
					}
				});
			} else if (columnHeader === "Specification Description" && this.isActive === "false") {
				template = new sap.m.Input({
					editable: false,
					change: this.setPODescription
				}).bindProperty("value", columnName);
			} else if (columnHeader === "UoM" && this.isActive === "true") {

				template = new sap.m.Label({

					text: {
						path: columnName
					}
				});
			} else if (columnHeader === "UoM" && this.isActive === "false") {
				template = new sap.m.Input({
					showValueHelp: true,
					valueHelpOnly: false,
					valueHelpRequest: this.onUOMValueHelpRequested,
					change: this.onUOMChanged
				}).bindProperty("value", columnName);
			} else if (columnHeader === "Quantity" && this.isActive === "true") {
				template = new sap.m.Label({
					text: {
						path: columnName
					}
				});
			} else if (columnHeader === "Quantity" && this.isActive === "false") {
				template = new sap.m.Input({
					type: "Number",
					change: this.onQuantityChange
				}).bindProperty("value", columnName);
			} else if (columnHeader === "Component Type" && this.isActive === "true") {
				template = new sap.m.Label({
					text: {
						path: columnName
					}
				});
			} else if (columnHeader === "Component Type" && this.isActive === "false") {
				template = new sap.m.Select({
					templateShareable: false,
					change: this.compTypeChanged,
					width: "100%",
					items: {
						path: "currentCompTypeModel>/",
						template: new sap.ui.core.Item({
							key: "{currentCompTypeModel>compTypeDesc}",
							text: "{currentCompTypeModel>compTypeDesc}"
						})
					}
				}).bindProperty("selectedKey", columnName);
			} else if (columnHeader === "Formula Item") {
				template = new sap.ui.layout.HorizontalLayout({
					content: [
						new sap.m.Image({
							src: sap.ui.require.toUrl("Trial_Formulation/trial_formulation/ext/images/InputSpecification.png")
						}).addStyleClass('sapUiTinyMarginEnd'),
						new sap.m.Label({
							text: {
								path: columnName
							}
						})
					]
				});
			} else {
				template = new sap.m.Label({
					text: {
						path: columnName
					}
				});
			}
			return [columnHeader, template, id];
		},

		//Depending on IsActiveEntity, it is decided which cells to be editable. Icons are set here based on the type of component it is. The rows are also set to Bold if the component type is Product
		getFormulation: function () {
			var oModel = this.getOwnerComponent().getModel();
			oModel.read("/Recipe(recipeID=guid'" + this.recipeID + "',IsActiveEntity=" + this.isActive + ")", {
				success: function (data, response) {
					if (response) {
						var oTable = that.getView().byId("TreeTable");
						var oRows = oTable.getRows();

						for (var i = 0; i < oRows.length; i++) {
							if (!that.compType) {
								if (oRows[i].getBindingContext() != null) {
									var compType = oRows[i].getBindingContext().getProperty("Component Type");
								}
							} else {
								if (that.isActive === "true") {
									var compType = oRows[i].getCells()[that.compType].getText();
								} else {
									var compType = oRows[i].getCells()[that.compType].getSelectedKey();
								}
							}
							if (!that.quantIndex) {
								if (oRows[i].getBindingContext() != null) {
									var quantity = oRows[i].getBindingContext().getProperty("Quantity");
								}
							} else {
								if (that.isActive === "true") {
									var quantity = oRows[i].getCells()[that.quantIndex].getText();
								} else {
									var quantity = oRows[i].getCells()[that.quantIndex].getValue();
								}
							}
							if (!that.specIDIndex) {
								if (oRows[i].getBindingContext() != null) {
									var specId = oRows[i].getBindingContext().getProperty("Specification");
								}
							} else {
								if (that.isActive === "true") {
									var specId = oRows[i].getCells()[that.specIDIndex].getText();
								} else {
									var specId = oRows[i].getCells()[that.specIDIndex].getValue();
								}
							}
							if (that.isActive === "true" && specId && compType && quantity) {
								if ((compType === that._oResourceBundle.getText("Ingredient") || compType === that._oResourceBundle.getText("PACKAGE") ||
										parseFloat(quantity) >= 0) && specId !== that.recipeID) {
									oRows[i].getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
										"Trial_Formulation/trial_formulation/ext/images/InputSpecification.png"));
									oRows[i].getCells()[0].getContent()[1].setDesign("Standard");
									if (that.specDescIndex) {
										oRows[i].getCells()[that.specDescIndex].setDesign("Standard");
									}
									if (that.quantIndex) {
										oRows[i].getCells()[that.quantIndex].setDesign("Standard");
									}
									if (that.uomIndex) {
										oRows[i].getCells()[that.uomIndex].setDesign("Standard");
									}
									if (that.compType) {
										oRows[i].getCells()[that.compType].setDesign("Standard");
									}
								} else if ((compType === that._oResourceBundle.getText("PRODUCT") || compType === that._oResourceBundle.getText(
										"CO PRODUCT") || parseFloat(quantity) < 0) && specId !== that.recipeID) {
									oRows[i].getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
										"Trial_Formulation/trial_formulation/ext/images/SecondaryOutput.png"));
									oRows[i].getCells()[0].getContent()[1].setDesign("Bold");
									if (that.specDescIndex) {
										oRows[i].getCells()[that.specDescIndex].setDesign("Bold");
									}
									if (that.quantIndex) {
										oRows[i].getCells()[that.quantIndex].setDesign("Bold");
									}
									if (that.uomIndex) {
										oRows[i].getCells()[that.uomIndex].setDesign("Bold");
									}
									if (that.compType) {
										oRows[i].getCells()[that.compType].setDesign("Bold");
									}
								}
							}
							if (that.isActive === "true") {
								if (specId === that.recipeID) {
									oRows[i].getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
										"Trial_Formulation/trial_formulation/ext/images/PrimaryOutput.png"));
									oRows[i].getCells()[0].getContent()[1].setDesign("Bold");
									if (that.specDescIndex) {
										oRows[i].getCells()[that.specDescIndex].setDesign("Bold");
									}
									if (that.quantIndex) {
										oRows[i].getCells()[that.quantIndex].setDesign("Bold");
									}
									if (that.uomIndex) {
										oRows[i].getCells()[that.uomIndex].setDesign("Bold");
									}
									if (that.compType) {
										oRows[i].getCells()[that.compType].setText(that._oResourceBundle.getText("PRODUCT"));
										oRows[i].getCells()[that.compType].setDesign("Bold");
									}
								}
							}
						}

						if (that.isActive === "false") {
							if (that.compType) {
								var compTypeOutputModel = that.getView().byId("TreeTable").getRows()[0].getCells()[that.compType].getModel(
									"compTypeOutputModel");
							}
							that.getView().byId("TreeTable").getRows()[0].getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
								"Trial_Formulation/trial_formulation/ext/images/PrimaryOutput.png"));
							that.getView().byId("TreeTable").getRows()[0].getCells()[0].getContent()[1].setDesign("Bold");
							if (that.specIDIndex) {
								that.getView().byId("TreeTable").getRows()[0].getCells()[that.specIDIndex].setEditable(false);
							}
							if (that.specDescIndex) {
								that.getView().byId("TreeTable").getRows()[0].getCells()[that.specDescIndex].setEditable(true);
							}
							if (that.quantIndex) {
								that.getView().byId("TreeTable").getRows()[0].getCells()[that.quantIndex].setEditable(false);
							}
							if (that.uomIndex) {
								that.getView().byId("TreeTable").getRows()[0].getCells()[that.uomIndex].setEditable(false);
							}
							if (that.compType) {
								that.getView().byId("TreeTable").getRows()[0].getCells()[that.compType].setEditable(false);
								that.getView().byId("TreeTable").getRows()[0].getCells()[that.compType].setModel(compTypeOutputModel,
									"currentCompTypeModel");
							}
						}
					}
				}
			});
		},

		//It is triggered when the the PO description is filled with a value. This gets updated in the draft.
		setPODescription: function (oEvent) {
			var viewId = this.getParent().getParent().getId().split("--")[0];

			var ID = oEvent.getSource().getBindingContext().getProperty("ID");
			var UOM = oEvent.getSource().getBindingContext().getProperty("UoM");
			var quantity = oEvent.getSource().getBindingContext().getProperty("Quantity");
			var componentType = oEvent.getSource().getBindingContext().getProperty("Component Type");
			var specDescription = oEvent.getParameters().value;
			var specID = oEvent.getSource().getBindingContext().getProperty("Specification");
			var formulaItem = specDescription;
			var density = oEvent.getSource().getBindingContext().getProperty("density");
			var piecetoMass = oEvent.getSource().getBindingContext().getProperty("piecetoMass");
			if (density === null) {
				density = 0.0;
			}
			if (piecetoMass === null) {
				piecetoMass = 0.0;
			}

			sap.ui.getCore().byId(viewId).getController().updateDraft(ID, UOM, quantity, componentType, specDescription, specID, formulaItem,
				density, piecetoMass);
			sap.ui.getCore().byId(viewId).getController().getRecipeSpecifications();
		},

		//When a single row is selected, the item number and next item number is calculated. Toolbar buttons are set to enabled here based on the row selected. If more rows are selected or none of the rows are selected or the PO row is selected, all the toolbar buttons are set to disabled.
		//If the first child is selected, it can't be moved up. If the last child is selected, it can't be moved down.
		onRowSelected: function (oEvent) {
			if (oEvent.getSource().getSelectedIndices().length === 1) {
				this.selectedIndex = oEvent.getSource().getSelectedIndices()[0];
				if (oEvent.getParameters().rowContext) {
					this.selectedItemNumber = this.getView().byId("TreeTable").getModel("rowModel").getData()[this.selectedIndex].itemNumber;
					this.selectedID = this.getView().byId("TreeTable").getModel("rowModel").getData()[this.selectedIndex].ID;
					if (this.selectedIndex + 1 === this.getView().byId("TreeTable")._getTotalRowCount()) {
						this.nextItemNumber = "";
					} else {
						this.nextItemNumber = this.getView().byId("TreeTable").getModel("rowModel").getData()[this.selectedIndex].itemNumber;
					}
				}

				if (that.getView().byId("btn1")) {
					that.getView().byId("btn1").setEnabled(true);
				}
				if (that.getView().byId("btn2") && oEvent.getSource().getSelectedIndices()[0] > 0) {
					that.getView().byId("btn2").setEnabled(true);
				}
				if (oEvent.getSource().getSelectedIndices()[0] === 1 &&
					oEvent.getSource().getSelectedIndices()[0] + 1 === this.getView().byId("TreeTable")._getTotalRowCount()) { // only child row
					that.getView().byId("btn5").setEnabled(false);
					that.getView().byId("btn6").setEnabled(false);
				} else if (oEvent.getSource().getSelectedIndices()[0] === 1 &&
					oEvent.getSource().getSelectedIndices()[0] + 1 !== this.getView().byId("TreeTable")._getTotalRowCount()) { // first child row
					that.getView().byId("btn5").setEnabled(false);
					that.getView().byId("btn6").setEnabled(true);
				} else if (oEvent.getSource().getSelectedIndices()[0] > 1 &&
					oEvent.getSource().getSelectedIndices()[0] + 1 === this.getView().byId("TreeTable")._getTotalRowCount()) { //last row
					that.getView().byId("btn5").setEnabled(true);
					that.getView().byId("btn6").setEnabled(false);
				} else if (oEvent.getSource().getSelectedIndices()[0] > 1 &&
					oEvent.getSource().getSelectedIndices()[0] + 1 !== this.getView().byId("TreeTable")._getTotalRowCount()) { //other rows
					that.getView().byId("btn5").setEnabled(true);
					that.getView().byId("btn6").setEnabled(true);
				}
			} else {
				if (that.getView().byId("btn1")) {
					that.getView().byId("btn1").setEnabled(false);
				}
				if (that.getView().byId("btn2")) {
					that.getView().byId("btn2").setEnabled(false);
				}
				if (that.getView().byId("btn5")) {
					that.getView().byId("btn5").setEnabled(false);
				}
				if (that.getView().byId("btn6")) {
					that.getView().byId("btn6").setEnabled(false);
				}
			}
		},

		//A blank entry is made by calling the function import AddSpecification. In the UI, it shows a blank Specification ID, Description and formula item and quantity is filled as 0, UOM as KG and component type as Ingredient.
		onPressAddRow: function (oEvent) {
			if (this.selectedItemNumber !== 999) {
				if (this.selectedItemNumber === this.nextItemNumber - 1) {
					sap.m.MessageBox.show(this._oResourceBundle.getText("renumberItem"), {
						icon: sap.m.MessageBox.Icon.ERROR,
						actions: [sap.m.MessageBox.Action.OK]
					});
				} else {
					var viewId = oEvent.getSource().getParent().getParent().getId().split("--")[0];
					var oModel = sap.ui.getCore().byId(viewId).getController().getOwnerComponent().getModel();

					oModel.callFunction("/addSpecification", {
						method: "GET",
						urlParameters: {
							recipeID: sap.ui.getCore().byId(viewId).getController().recipeID,
							specificationID: "",
							itemNumber: sap.ui.getCore().byId(viewId).getController().selectedItemNumber,
							nextItemNumber: sap.ui.getCore().byId(viewId).getController().nextItemNumber
						},
						success: function () {
							sap.ui.getCore().byId(viewId).getController().getRecipeSpecifications();
						},
						error: function (errorMessage) {
							that.updateMessageManager('Error', errorMessage.responseText.split(":")[5].split("}")[0], "");
						}
					});
				}

				this.getView().byId("TreeTable").setSelectedIndex(-1);
			} else {
				sap.m.MessageBox.show(this._oResourceBundle.getText("maxItemNumber"), {
					icon: sap.m.MessageBox.Icon.ERROR,
					actions: [sap.m.MessageBox.Action.OK]
				});
			}
		},

		//Triggered when the value help of UOM is pressed.
		onUOMValueHelpRequested: function (oEvent) {
			this.viewID = this.getParent().getId().split("--")[0];
			var uomData = this.getModel("uomModel").getData();
			this.rowModel = new sap.ui.model.json.JSONModel();
			this.rowModel.setData({
				data: uomData
			});

			var aColumns = [{
				"label": sap.ui.getCore().byId(this.viewID).getController()._oResourceBundle.getText("UOM"),
				"template": "Id"
			}, {
				"label": sap.ui.getCore().byId(this.viewID).getController()._oResourceBundle.getText("UOMDescription"),
				"template": "Description"
			}];

			this.oColModel = new sap.ui.model.json.JSONModel();
			this.oColModel.setData({
				cols: aColumns
			});

			this._oValueHelpDialog = sap.ui.xmlfragment("Trial_Formulation.trial_formulation.ext.fragment.valueHelpUOM", this);
			this.addDependent(this._oValueHelpDialog);

			this._oValueHelpDialog.getTableAsync().then(function (oTable) {
				oTable.setModel(this.rowModel);
				oTable.setModel(this.oColModel, "columns");
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
				this._oValueHelpDialog.update();
			}.bind(this));

			var oToken = new Token();
			oToken.setKey(oEvent.getSource().getValue());
			oToken.setText(oEvent.getSource().getValue());
			this._oValueHelpDialog.setTokens([oToken]);
			this._oValueHelpDialog.attachCancel(sap.ui.getCore().byId(this.viewID).getController().onValueHelpCancelPress);
			this._oValueHelpDialog.attachOk(sap.ui.getCore().byId(this.viewID).getController().onValueHelpUOMOkPress);
			this._oValueHelpDialog.open();
		},

		//When a UOM is selected, updatedraft function import and formulaQuantityCalculation is called to calculate the PO row quantity.
		onValueHelpUOMOkPress: function (oEvent) {
			var viewId = this.getParent().getParent().getId().split("--")[0];
			var aTokens = oEvent.getParameter("tokens");
			if (aTokens[0]) {
				oEvent.getSource().getParent().setValue(aTokens[0].getKey());
				var specID = oEvent.getSource().getBindingContext().getProperty("Specification");
				if (that.specIDIndex) {
					if ((specID || specID !== "") && oEvent.getSource().getParent().getParent().getCells()[that.specIDIndex].getValueState() !==
						"Error") {

						var ID = oEvent.getSource().getBindingContext().getProperty("ID");
						var UOM = aTokens[0].getKey();
						var quantity = oEvent.getSource().getBindingContext().getProperty("Quantity");
						var componentType = oEvent.getSource().getBindingContext().getProperty("Component Type");
						var specDesc = oEvent.getSource().getBindingContext().getProperty("Specification Description");
						var formulaItem = oEvent.getSource().getBindingContext().getProperty("Formula Item");
						var density = oEvent.getSource().getBindingContext().getProperty("density");
						var piecetoMass = oEvent.getSource().getBindingContext().getProperty("piecetoMass");
						for (var i = 0; i < that.uomInvalidID.length; i++) {
							that.removeMessageFromTarget(that._oResourceBundle.getText("uomIDNotFound", [that.uomInvalidID[i]]));
						}
						that.changeValueState();
						var bError = that.checkForerrors();
						if (!bError) {
							sap.ui.getCore().byId(
								"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setEnabled(
								true);
						}

						sap.ui.getCore().byId(viewId).getController().updateDraft(ID, UOM, quantity, componentType, specDesc, specID, formulaItem,
							density, piecetoMass);

						sap.ui.getCore().byId(viewId).getController().formulaCalculation(sap.ui.getCore().byId(viewId).getController().recipeID);
					}
				}
			}
			this.close();
		},

		//Any manual entry in the UOM input box triggers this method. The value entered is checked if it is stored in the master UOM table. If not, it throws an error
		onUOMChanged: function (oEvent) {
			var viewId = this.getParent().getParent().getId().split("--")[0];
			var that = sap.ui.getCore().byId(viewId).getController();
			that.ID = oEvent.getSource().getBindingContext().getProperty("ID");
			that.specID = oEvent.getSource().getBindingContext().getProperty("Specification");
			if (that.specID) {
				that.UOM = oEvent.getParameters().value;
				that.quantity = oEvent.getSource().getBindingContext().getProperty("Quantity");
				that.componentType = oEvent.getSource().getBindingContext().getProperty("Component Type");
				that.specDesc = oEvent.getSource().getBindingContext().getProperty("Specification Description");
				that.formulaItem = oEvent.getSource().getBindingContext().getProperty("Formula Item");
				that.density = oEvent.getSource().getBindingContext().getProperty("density");
				that.piecetoMass = oEvent.getSource().getBindingContext().getProperty("piecetoMass");
				that.uomID = oEvent.getSource().getId();

				if (oEvent.getParameters().value === "") {
					that.updateDraft(that.ID, that.UOM, that.quantity, that.componentType, that.specDesc, that.specID, that.formulaItem,
						that.density, that.piecetoMass);
					that.validatingCells();
					that.formulaCalculation(that.recipeID);
					for (var i = 0; i < that.uomInvalidID.length; i++) {
						if (that.uomInvalidID[i] === oEvent.getSource().getValueStateText().split(" ")[4]) {
							that.removeMessageFromTarget(that._oResourceBundle.getText("uomIDNotFound", [that.uomInvalidID[i]]));
						}
					}
					sap.ui.getCore().byId(that.uomID).setValueState("None");
					var bError = that.checkForerrors();
					if (!bError) {
						sap.ui.getCore().byId(
							"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setEnabled(
							true);
					}
				} else {
					var oModel = that.getOwnerComponent().getModel();
					oModel.callFunction("/validateManuallyEnteredUOM", {
						method: "GET",
						urlParameters: {
							uom: that.UOM
						},
						success: function (oData) {
							that.UOM = oData.validateManuallyEnteredUOM;
							that.updateDraft(that.ID, that.UOM, that.quantity, that.componentType, that.specDesc, that.specID, that.formulaItem,
								that.density, that.piecetoMass);
							that.formulaCalculation(that.recipeID);
							for (var i = 0; i < that.uomInvalidID.length; i++) {
								that.removeMessageFromTarget(that._oResourceBundle.getText("uomIDNotFound", [that.uomInvalidID[i]]));
							}
							that.validatingCells();
							that.changeValueState();
							var bError = that.checkForerrors();
							if (!bError) {
								sap.ui.getCore().byId(
									"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setEnabled(
									true);
							}
						},
						error: function (errorMessage) {
							that.uomInvalidID.push(sap.ui.getCore().byId(that.uomID).getValue());
							for (var i = 0; i < that.uomInvalidID.length; i++) {
								if (that.uomInvalidID[i] === sap.ui.getCore().byId(that.uomID).getValueStateText().split(" ")[4]) {
									that.removeMessageFromTarget(that._oResourceBundle.getText("uomIDNotFound", [that.uomInvalidID[i]]));
								}
							}
							sap.ui.getCore().byId(that.uomID).setValueState("Error");
							sap.ui.getCore().byId(that.uomID).setValueStateText(that._oResourceBundle.getText("uomIDNotFound", [sap.ui.getCore().byId(
								that.uomID).getValue()]));
							that.updateMessageManager("Error", errorMessage.responseText.split(":")[5].split("}")[0].split('"')[1], "");
							sap.ui.getCore().byId(
								"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setEnabled(
								false);
							that.validatingCells();
						}
					});
				}
			}
		},

		//Triggers when user clicks on cancel in the value help dialog
		onValueHelpCancelPress: function () {
			this.close();
		},

		//Triggered when the value help of Specification is pressed.
		onSpecValueHelpRequested: function (oEvent) {
			this.viewID = this.getParent().getId().split("--")[0];
			var that = sap.ui.getCore().byId(this.viewID).getController();
			var uomData = this.getModel("specModel").getData();
			this.specRowModel = new sap.ui.model.json.JSONModel();
			this.specRowModel.setData({
				data: uomData
			});

			this._oBasicSearchField = new sap.m.SearchField({
				showSearchButton: false
			});

			var aColumns = [{
				"label": sap.ui.getCore().byId(this.viewID).getController()._oResourceBundle.getText("SpecificationID"),
				"template": "specificationID"
			}, {
				"label": sap.ui.getCore().byId(this.viewID).getController()._oResourceBundle.getText("SpecificationDescription"),
				"template": "specificationDescription"
			}, {
				"label": sap.ui.getCore().byId(this.viewID).getController()._oResourceBundle.getText("CreatedBy"),
				"template": "createdBY"
			}, {
				"label": sap.ui.getCore().byId(this.viewID).getController()._oResourceBundle.getText("SpecificationType"),
				"template": "specType"
			}];

			this.oSpecColModel = new sap.ui.model.json.JSONModel();
			this.oSpecColModel.setData({
				cols: aColumns
			});

			that._oSpecValueHelpDialog = sap.ui.xmlfragment("Trial_Formulation.trial_formulation.ext.fragment.valueHelpSpec", this);
			this.addDependent(that._oSpecValueHelpDialog);

			that._oSpecValueHelpDialog.setRangeKeyFields([{
				label: "specificationID",
				key: "specificationID",
				type: "string"
			}]);

			that._oSpecValueHelpDialog.getFilterBar().setBasicSearch(this._oBasicSearchField);

			that._oSpecValueHelpDialog.getTableAsync().then(function (oTable) {
				oTable.setModel(this.specRowModel);
				oTable.setModel(this.oSpecColModel, "columns");
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
				that._oSpecValueHelpDialog.update();
			}.bind(this));

			var oToken = new Token();
			oToken.setKey(oEvent.getSource().getValue());
			oToken.setText(oEvent.getSource().getValue());
			that._oSpecValueHelpDialog.setTokens([oToken]);
			that._oSpecValueHelpDialog.attachCancel(sap.ui.getCore().byId(this.viewID).getController().onValueHelpCancelPress);
			that._oSpecValueHelpDialog.attachOk(sap.ui.getCore().byId(this.viewID).getController().onValueHelpOkPress);
			that._oSpecValueHelpDialog._oFilterBar.attachSearch(sap.ui.getCore().byId(this.viewID).getController().onFilterBarSearch, this);
			that._oSpecValueHelpDialog.open();
		},

		//Search implemented for specification value help dialog.
		onFilterBarSearch: function (oEvent) {
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
						path: "specificationID",
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sSearchQuery
					}),
					new sap.ui.model.Filter({
						path: "specificationDescription",
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sSearchQuery
					}),
					new sap.ui.model.Filter({
						path: "specType",
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sSearchQuery
					}),
					new sap.ui.model.Filter({
						path: "createdBY",
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sSearchQuery
					})
				],
				and: false
			}));
			this.viewID = this.getParent().getParent().getParent().getParent().getParent().getId().split("--")[0];
			sap.ui.getCore().byId(this.viewID).getController()._filterTable(new sap.ui.model.Filter({
				filters: aFilters,
				and: true
			}), this);
		},

		//Based on the filters, the table is filtered.
		_filterTable: function (oFilter) {
			var oValueHelpDialog = that._oSpecValueHelpDialog;

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

		//When a Specification is selected, updatedraft function import and the Formula item, specification description, UOM, Quantity, Component type values are set to the default values.
		onValueHelpOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			var viewId = this.getParent().getParent().getId().split("--")[0];
			if (aTokens[0]) {
				var ID = oEvent.getSource().getBindingContext().getProperty("ID");
				var UOM = sap.ui.getCore().byId(viewId).getController()._oResourceBundle.getText("KG");
				var componentType = sap.ui.getCore().byId(viewId).getController()._oResourceBundle.getText("Ingredient");
				var quantity = 0.00;
				var specID = aTokens[0].getKey();

				for (var i = 0; i < oEvent.getSource().oRows.getModel().getData().data.length; i++) {
					if (oEvent.getSource().oRows.getModel().getData().data[i].specificationID === specID) {
						var specDesc = oEvent.getSource().oRows.getModel().getData().data[i].specificationDescription;
						oEvent.getSource().getParent().setValue(aTokens[0].getKey());
						var formulaItem = this.getModel("specModel").getData()[i].formulaItemDescription;
						var density = parseFloat(this.getModel("specModel").getData()[i].density);
						var piecetoMass = parseFloat(this.getModel("specModel").getData()[i].piecetoMass);
					}
				}
				for (var i = 0; i < that.incorrectSpecID.length; i++) {
					that.removeMessageFromTarget(that._oResourceBundle.getText("specIDNotFound", [that.incorrectSpecID[i]]));
				}
				for (var i = 0; i < that.uomInvalidID.length; i++) {
					that.removeMessageFromTarget(that._oResourceBundle.getText("uomIDNotFound", [that.uomInvalidID[i]]));
				}
				that.changeValueState();
				var bError = that.checkForerrors();
				if (!bError) {
					sap.ui.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setEnabled(
						true);
				}
				sap.ui.getCore().byId(viewId).getController().updateDraft(ID, UOM, quantity, componentType, specDesc, specID, formulaItem,
					density, piecetoMass);
				sap.ui.getCore().byId(viewId).getController().getRecipeSpecifications();
			}
			this.close();
		},

		//Triggered when a quantity is changed. updatedraft function import and formulaQuantityCalculation is called. Component type model changes when depending of the value of quanity. If it positive, the values remain the same. If it is negative, the model will have Product and Co-product as keys
		onQuantityChange: function (oEvent) {
			var specID = oEvent.getSource().getBindingContext().getProperty("Specification");
			that.oView.getController().validatingCells();
			if (that.specIDIndex) {
				if ((specID || specID !== "") && oEvent.getSource().getParent().getCells()[that.specIDIndex].getValueState() !== "Error") {
					var viewId = this.getParent().getParent().getId().split("--")[0];
					var qVal = oEvent.getParameters().value;
					var quantValue;
					if (qVal === "") {
						quantValue = 0.0;
					} else {
						quantValue = parseFloat(oEvent.getParameters().value);
					}

					this.decimalErrorCounter = 0;
					this.digitErrorCounter = 0;
					if (qVal.split(".")[1]) {
						if (qVal.split(".")[1].length > 6) { //after decimal
							this.decimalErrorCounter = this.decimalErrorCounter + 1;
						} else {
							this.decimalErrorCounter = this.decimalErrorCounter - 1;
						}
						if (qVal.split(".")[0].length > 12) { //before decimal
							this.digitErrorCounter = this.digitErrorCounter + 1;
						} else {
							this.digitErrorCounter = this.digitErrorCounter - 1;
						}
					} else {
						if (qVal.split(".")[0].length > 12) { //before decimal
							this.digitErrorCounter = this.digitErrorCounter + 1;
						} else {
							this.digitErrorCounter = this.digitErrorCounter - 1;
						}
					}

					if (this.digitErrorCounter > 0) {
						oEvent.getSource().setValueState("Error");
						oEvent.getSource().setValueStateText(sap.ui.getCore().byId(viewId).getController()._oResourceBundle.getText("maxDigit"));
					} else {
						oEvent.getSource().setValueState("None");
					}
					if (this.decimalErrorCounter > 0) {
						oEvent.getSource().setValueState("Error");
						oEvent.getSource().setValueStateText(sap.ui.getCore().byId(viewId).getController()._oResourceBundle.getText("maxDecimal"));
					} else {
						if (this.digitErrorCounter === 0)
							oEvent.getSource().setValueState("None");
					}

					var ID = oEvent.getSource().getBindingContext().getProperty("ID");
					var UOM = oEvent.getSource().getBindingContext().getProperty("UoM");
					var componentType;
					if (quantValue < 0) {
						if (that.oView.getController().compType) {
							var compTypeOutputModel = oEvent.getSource().getParent().getCells()[that.oView.getController().compType].getModel(
								"compTypeOutputModel");
							oEvent.getSource().getParent().getCells()[that.oView.getController().compType].setModel(compTypeOutputModel,
								"currentCompTypeModel");
							if (oEvent.getSource().getParent().getCells()[that.oView.getController().compType].getSelectedKey() !== sap.ui.getCore().byId(
									viewId).getController()._oResourceBundle
								.getText("CO_PRODUCT")) {
								componentType = sap.ui.getCore().byId(viewId).getController()._oResourceBundle.getText("PRODUCT");
							} else {
								componentType = sap.ui.getCore().byId(viewId).getController()._oResourceBundle.getText("CO_PRODUCT");
							}
						} else {
							if (oEvent.getSource().getBindingContext().getProperty("Component Type") !== sap.ui.getCore().byId(
									viewId).getController()._oResourceBundle
								.getText("CO_PRODUCT")) {
								componentType = sap.ui.getCore().byId(viewId).getController()._oResourceBundle.getText("PRODUCT");
							} else {
								componentType = sap.ui.getCore().byId(viewId).getController()._oResourceBundle.getText("CO_PRODUCT");
							}
						}
						oEvent.getSource().getParent().getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
							"Trial_Formulation/trial_formulation/ext/images/SecondaryOutput.png"));
						oEvent.getSource().getParent().getCells()[0].getContent()[1].setDesign("Bold");
					} else if (quantValue >= 0) {
						if (that.oView.getController().compType) {
							var compTypeModel = oEvent.getSource().getParent().getCells()[that.oView.getController().compType].getModel("compTypeModel");
							oEvent.getSource().getParent().getCells()[that.oView.getController().compType].setModel(compTypeModel, "currentCompTypeModel");
							if (oEvent.getSource().getParent().getCells()[that.oView.getController().compType].getSelectedKey() !== sap.ui.getCore().byId(
									viewId).getController()._oResourceBundle
								.getText("PACKAGE")) {
								componentType = sap.ui.getCore().byId(viewId).getController()._oResourceBundle.getText("Ingredient");
							} else {
								componentType = sap.ui.getCore().byId(viewId).getController()._oResourceBundle.getText("PACKAGE");
							}
						} else {
							if (oEvent.getSource().getBindingContext().getProperty("Component Type") !== sap.ui.getCore().byId(
									viewId).getController()._oResourceBundle
								.getText("PACKAGE")) {
								componentType = sap.ui.getCore().byId(viewId).getController()._oResourceBundle.getText("Ingredient");
							} else {
								componentType = sap.ui.getCore().byId(viewId).getController()._oResourceBundle.getText("PACKAGE");
							}
						}
						oEvent.getSource().getParent().getCells()[0].getContent()[0].setSrc(sap.ui.require.toUrl(
							"Trial_Formulation/trial_formulation/ext/images/InputSpecification.png"));
						oEvent.getSource().getParent().getCells()[0].getContent()[1].setDesign("Standard");
					}

					var specDesc = oEvent.getSource().getBindingContext().getProperty("Specification Description");
					var formulaItem = oEvent.getSource().getBindingContext().getProperty("Formula Item");
					var density = oEvent.getSource().getBindingContext().getProperty("density");
					var piecetoMass = oEvent.getSource().getBindingContext().getProperty("piecetoMass");
					if (piecetoMass === null) {
						piecetoMass = 0.0;
					}

					sap.ui.getCore().byId(viewId).getController().updateDraft(ID, UOM, oEvent.getParameters().value, componentType, specDesc, specID,
						formulaItem,
						density, piecetoMass);

					sap.ui.getCore().byId(viewId).getController().formulaCalculation(sap.ui.getCore().byId(viewId).getController().recipeID);
				}
			}
		},

		//Any manual entry in the specification input box triggers this method. The value entered is checked if it is stored in the master specification table. If not, it throws an error
		specChanged: function (oEvent) {
			var viewId = this.getParent().getParent().getId().split("--")[0];
			var ID = oEvent.getSource().getBindingContext().getProperty("ID");
			var that = sap.ui.getCore().byId(viewId).getController();
			that.specValueID = oEvent.getSource().getId();
			if (oEvent.getParameters().value === "") {
				oEvent.getSource().getParent().getCells()[0].getContent()[1].setText("");
				if (this.specDescIndex) {
					oEvent.getSource().getParent().getCells()[this.specDescIndex].setValue("");
				}
				if (this.quantIndex) {
					oEvent.getSource().getParent().getCells()[this.quantIndex].setValue("0.0");
				}
				if (this.uomIndex) {
					oEvent.getSource().getParent().getCells()[this.uomIndex].setValue("KG");
				}
				if (this.compType) {
					var compTypeModel = oEvent.getSource().getParent().getCells()[this.compType].getModel("compTypeModel");
					oEvent.getSource().getParent().getCells()[this.compType].setModel(compTypeModel, "currentCompTypeModel");
					oEvent.getSource().getParent().getCells()[this.compType].getSelectedKey(sap.ui.getCore().byId(viewId).getController()._oResourceBundle
						.getText("Ingredient"));
				}

				that.updateDraft(ID, "KG", "0.0", sap.ui.getCore().byId(viewId).getController()._oResourceBundle
					.getText("Ingredient"), "", "", "", "0", "0");
				sap.ui.getCore().byId(that.specValueID).setValueState("None");
				for (var i = 0; i < that.incorrectSpecID.length; i++) {
					if (that.incorrectSpecID[i] === oEvent.getSource().getValueStateText().split(" ")[1]) {
						that.removeMessageFromTarget(that._oResourceBundle.getText("specIDNotFound", [that.incorrectSpecID[i]]));
					}
				}
				for (var i = 0; i < that.uomInvalidID.length; i++) {
					that.removeMessageFromTarget(that._oResourceBundle.getText("uomIDNotFound", [that.uomInvalidID[i]]));
				}
				var bError = that.checkForerrors();
				if (!bError) {
					sap.ui.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setEnabled(
						true);;
				}

			} else {
				that.ID = oEvent.getSource().getBindingContext().getProperty("ID");
				that.UOM = that._oResourceBundle.getText("KG");
				that.componentType = that._oResourceBundle.getText("Ingredient");
				that.quantity = 0.00;
				that.specID = oEvent.getParameters().value;
				for (var i = 0; i < oEvent.getSource().getModel("specModel").getData().length; i++) {
					if (oEvent.getSource().getModel("specModel").getData()[i].specificationID === that.specID) {
						that.specDesc = oEvent.getSource().getModel("specModel").getData()[i].specificationDescription;
						oEvent.getSource().setValue(oEvent.getParameters().value);
						that.formulaItem = this.getModel("specModel").getData()[i].formulaItemDescription;
						that.density = parseFloat(this.getModel("specModel").getData()[i].density);
						that.piecetoMass = parseFloat(this.getModel("specModel").getData()[i].piecetoMass);
					}
				}
				var oModel = that.getOwnerComponent().getModel();
				oModel.callFunction("/validateSpecificationId", {
					method: "GET",
					urlParameters: {
						specificationID: oEvent.getParameters().value
					},
					success: function () {
						that.updateDraft(that.ID, that.UOM, that.quantity, that.componentType, that.specDesc, that.specID, that.formulaItem,
							that.density, that.piecetoMass);
						that.formulaCalculation(that.recipeID);
						for (var i = 0; i < that.incorrectSpecID.length; i++) {
							that.removeMessageFromTarget(that._oResourceBundle.getText("specIDNotFound", [that.incorrectSpecID[i]]));
						}
						for (var i = 0; i < that.uomInvalidID.length; i++) {
							that.removeMessageFromTarget(that._oResourceBundle.getText("uomIDNotFound", [that.uomInvalidID[i]]));
						}
						that.changeValueState();
						var bError = that.checkForerrors();
						if (!bError) {
							sap.ui.getCore().byId(
								"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setEnabled(
								true);
						}
						sap.ui.getCore().byId(that.specValueID).setValueState("None");
						sap.ui.getCore().byId(that.specValueID).setValueStateText("");
					},
					error: function (errorMessage) {
						that.updateMessageManager('Error', errorMessage.responseText.split(":")[5].split("}")[0].split('"')[1], "");
						that.incorrectSpecID.push(errorMessage.responseText.split(":")[5].split("}")[0].split(" ")[1]);
						for (var i = 0; i < that.incorrectSpecID.length; i++) {
							if (that.incorrectSpecID[i] === sap.ui.getCore().byId(that.specValueID).getValueStateText().split(" ")[1]) {
								that.removeMessageFromTarget(that._oResourceBundle.getText("specIDNotFound", [that.incorrectSpecID[i]]));
							}
						}
						sap.ui.getCore().byId(that.specValueID).setValueState("Error");
						sap.ui.getCore().byId(that.specValueID).setValueStateText(that._oResourceBundle.getText("specIDNotFound", [errorMessage.responseText
							.split(":")[5].split("}")[0].split(" ")[1]
						]));
						sap.ui.getCore().byId(
							"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setEnabled(
							false);
						that.validatingCells();
					}
				});
			}
		},

		//Triggered when a component type is changed. updatedraft function import and formulaQuantityCalculation is called
		compTypeChanged: function (oEvent) {
			var specID = oEvent.getSource().getBindingContext().getProperty("Specification");
			if (that.specIDIndex) {
				if ((specID || specID !== "") && oEvent.getSource().getParent().getCells()[that.specIDIndex].getValueState() !== "Error") {
					var viewId = this.getParent().getParent().getId().split("--")[0];

					var ID = oEvent.getSource().getBindingContext().getProperty("ID");
					var UOM = oEvent.getSource().getBindingContext().getProperty("UoM");
					var quantity = oEvent.getSource().getBindingContext().getProperty("Quantity");
					var componentType = oEvent.getParameters().selectedItem.getText();
					var specDesc = oEvent.getSource().getBindingContext().getProperty("Specification Description");
					var formulaItem = oEvent.getSource().getBindingContext().getProperty("Formula Item");
					var density = oEvent.getSource().getBindingContext().getProperty("density");
					var piecetoMass = oEvent.getSource().getBindingContext().getProperty("piecetoMass");
					sap.ui.getCore().byId(viewId).getController().updateDraft(ID, UOM, quantity, componentType, specDesc, specID, formulaItem,
						density, piecetoMass);

					sap.ui.getCore().byId(viewId).getController().formulaCalculation(sap.ui.getCore().byId(viewId).getController().recipeID);
				}
			}
		},

		//Function import to save the values in draft table is called
		updateDraft: function (ID, UOM, quantity, componentType, specificationDescription, specificationID, formulaItem, density, piecetoMass) {
			var viewId = this.getView().getId().split("--")[0];
			var oModel = sap.ui.getCore().byId(viewId).getController().getOwnerComponent().getModel();
			oModel.callFunction("/updateDraftSpecificationValues", {
				method: "GET",
				urlParameters: {
					ID: ID,
					UOM: UOM,
					quantity: quantity,
					componentType: componentType,
					specificationDescription: specificationDescription,
					specificationID: specificationID,
					formulaItemDescription: formulaItem,
					density: density,
					piecetoMass: piecetoMass
				},
				success: function () {
					sap.ui.getCore().byId(viewId).getController().validatingCells();
				},
				error: function (errorMessage) {
					that.updateMessageManager('Error', errorMessage.responseText.split(":")[5].split("}")[0], "");
				}
			});
		},

		//Function import to calculate the values is called.
		formulaCalculation: function (recipeID) {
			var viewId = this.getView().getId().split("--")[0];
			var oModel = sap.ui.getCore().byId(viewId).getController().getOwnerComponent().getModel();
			oModel.callFunction("/formulaQuantityCalculation", {
				method: "GET",
				urlParameters: {
					recipeID: recipeID
				},
				success: function () {
					sap.ui.getCore().byId(viewId).getController().getRecipeSpecifications();
					that.removeMessageFromTarget(that._oResourceBundle.getText("negativePOUI"));
					that.removeMessageFromTarget(that._oResourceBundle.getText("poMaxDigits"));
					that.removeMessageFromTarget(that._oResourceBundle.getText("conversionError"));
				},
				error: function (errorMessage) {

					if (errorMessage.responseText.indexOf("Adjust input quantity for calculation") > -1) {
						that.removeMessageFromTarget("Adjust input quantity for calculation");
						that.updateMessageManager("Warning", that._oResourceBundle.getText("negativePOUI"), "");
					} else if (errorMessage.responseText.indexOf("Overflow during quantity calculation") > -1) {
						that.removeMessageFromTarget("Overflow during quantity calculation");
						that.updateMessageManager("Warning", that._oResourceBundle.getText("poMaxDigits"), "");
					}

				}
			});
		},

		//Validates if the specification ID, UOM is empty. It also displays error message when a UOM is selected which cant be converted to KG.
		validatingCells: function () {
			var oHashChanger = new sap.ui.core.routing.HashChanger();
			var sHash = oHashChanger.getHash();

			var iZeroQtyCount = 0,
				iIncorrectDigitCount = 0,
				iIncorrectDecimalCount = 0,
				conversionErrorCount = 0;
			this.isActive = sHash.split("'")[2].split("=")[1].split(")")[0];
			if (this.isActive === "false") {
				var x;
				if (that.quantIndex) {
					x = that.quantIndex;
				} else if (that.compType) {
					x = that.compType;
				} else if (that.specIDIndex) {
					x = that.specIDIndex;
				} else if (that.quantIndex) {
					x = that.quantIndex;
				} else if (that.uomIndex) {
					x = that.uomIndex;
				} else if (that.specDescIndex) {
					x = that.specDescIndex;
				}
				if (x) {
					var test = this.getView().byId("TreeTable").getRows()[1].getCells()[x].getId().indexOf("label");
				} else {
					var test = 1;
				}
				if (test === -1) {
					for (var i = 1; i < this.getView().byId("TreeTable").getModel("rowModel").getData().length; i++) {
						if (this.getView().byId("TreeTable").getModel("rowModel").getData()[i].Specification === "") {
							this.updateMessageManager("Warning", this._oResourceBundle.getText("emptySpec", [i + 1]), "");
						} else {
							this.removeMessageFromTarget(this._oResourceBundle.getText("emptySpec", [i + 1]));
							var bError = this.checkForerrors();
							if (!bError) {
								sap.ui.getCore().byId(
									"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setEnabled(
									true);
							}
						}

						if (this.getView().byId("TreeTable").getModel("rowModel").getData()[i].Quantity === "") {
							this.updateMessageManager("Warning", this._oResourceBundle.getText("emptyQuantity", [i + 1]), "");
						} else if (this.getView().byId("TreeTable").getModel("rowModel").getData()[i].Quantity === "0" || this.getView().byId(
								"TreeTable").getModel("rowModel").getData()[i].Quantity === "0.0") {
							if (i > 0)
								iZeroQtyCount++;
						} else {
							this.removeMessageFromTarget(this._oResourceBundle.getText("emptyQuantity", [i + 1]));
							var bError = this.checkForerrors();
							if (!bError) {
								sap.ui.getCore().byId(
									"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setEnabled(
									true);
							}

							var qVal = this.getView().byId("TreeTable").getModel("rowModel").getData()[i].Quantity;
							if (qVal.split(".")[1]) {
								if (qVal.split(".")[1].length > 6) { //after decimal
									iIncorrectDecimalCount++;
								}
								if (qVal.split(".")[0].length > 12) { //before decimal
									iIncorrectDigitCount++;
								}
							} else {
								if (qVal.split(".")[0].length > 12) { //before decimal
									iIncorrectDigitCount++;
								}
							}
						}

						var uom = this.getView().byId("TreeTable").getModel("rowModel").getData()[i].UoM;
						if (uom === "C" || uom === "TSP" || uom === "TBS") {
							conversionErrorCount++;
						} else if (uom === "") {
							this.updateMessageManager("Warning", this._oResourceBundle.getText("emptyUOM", [i + 1]), "");
						} else {
							this.removeMessageFromTarget(this._oResourceBundle.getText("emptyUOM", [i + 1]));
							this.removeMessageFromTarget(this._oResourceBundle.getText("conversionError"));
							var bError = this.checkForerrors();
							if (!bError) {
								sap.ui.getCore().byId(
									"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setEnabled(
									true);
							}
						}
					}
				}

				if (iZeroQtyCount > 0 && this.quantIndex) {
					this.updateMessageManager("Warning", this._oResourceBundle.getText("zeroQuantity"), "");
				} else {
					this.removeMessageFromTarget(this._oResourceBundle.getText("zeroQuantity"));
				}
				if (iIncorrectDigitCount > 0) {
					this.updateMessageManager("Error", this._oResourceBundle.getText("maxDigit"), "");
					sap.ui.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setBlocked(
						true);
				} else {
					that.removeMessageFromTarget(this._oResourceBundle.getText("maxDigit"));
					var bError = this.checkForerrors();
					if (!bError) {
						sap.ui.getCore().byId(
							"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setBlocked(
							false);
					}
				}
				if (iIncorrectDecimalCount > 0) {
					this.updateMessageManager("Error", this._oResourceBundle.getText("maxDecimal"), "");
					sap.ui.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setBlocked(
						true);
				} else {
					that.removeMessageFromTarget(this._oResourceBundle.getText("maxDecimal"));
					var bError = this.checkForerrors();
					if (!bError) {
						sap.ui.getCore().byId(
							"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--activate").setBlocked(
							false);
					}
				}

				if (conversionErrorCount > 0 && this.uomIndex) {
					this.updateMessageManager("Warning", this._oResourceBundle.getText("conversionError"), "");
				} else {
					this.removeMessageFromTarget(this._oResourceBundle.getText("conversionError"));
				}
			}
		},

		//Sets the value state of all the cells to None.
		changeValueState: function () {
			for (var i = 1; i < this.getView().byId("TreeTable").getRows().length; i++) {
				if (that.specIDIndex) {
					var specID = that.getView().byId("TreeTable").getRows()[i].getCells()[that.specIDIndex];
					specID.setValueState("None");
					specID.setValueStateText("");
				}
				if (that.uomIndex) {
					var uom = that.getView().byId("TreeTable").getRows()[i].getCells()[that.uomIndex];
					uom.setValueState("None");
					uom.setValueStateText("");
				}
			}
		},

		//Errors are added to the message manager and the visibility of the message manager is manipulated here
		updateMessageManager: function (sType, sMsg, sDesc) {
			this.removeMessageFromTarget(sMsg);
			var oMessage = new sap.ui.core.message.Message({
				message: sMsg,
				type: sType
			});
			sap.ui.getCore().getMessageManager().addMessages(oMessage);
			var oMsgBtn = sap.ui.getCore().byId(
				"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--showMessages");
			oMsgBtn.setVisible(true);
			oMsgBtn.setText(sap.ui.getCore().getMessageManager().getMessageModel().getData().length);
		},

		//Rectified errors are removed from the message manager model
		removeMessageFromTarget: function (sMessage) {
			sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(function (oMessage) {
				if (oMessage.message === sMessage) {
					sap.ui.getCore().getMessageManager().removeMessages(oMessage);
					var oMsgBtn = sap.ui.getCore().byId(
						"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ObjectPage.view.Details::Recipe--showMessages");

					if (oMsgBtn)
						oMsgBtn.setText(sap.ui.getCore().getMessageManager().getMessageModel().getData().length);

				}
			}.bind(this));
		},

		//Check if messages in the message manager are of type error. If yes, it returns ERROR, else, true is returned
		checkForerrors: function () {
			var sError = "";
			sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(function (oMessage) {
				if (oMessage.type === "Error") {
					sError = true;
				}
			});
			return sError;
		},

		//Triggered when Create layout is clicked. It navigates to the create page of the formula layout management application
		onClickCreateLayout: function () {
			var shelHash = "#layout-manage?preferredMode=create";
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: shelHash
				}
			});
		},

		//When a layout is selected from the combo box, this function get triggered. The selected layout columns are displayed in the table
		onSelectionChange: function (oEvent) {
			var selectedLayoutId = oEvent.getParameters().selectedItem.getKey();
			var selectedLayoutName = oEvent.getParameters().selectedItem.getText();

			var oLayoutModel = that.getOwnerComponent().getModel("layOutModel");
			oLayoutModel.read("/LayoutInformation(ID=guid'" + selectedLayoutId + "',IsActiveEntity=true)/columnsSelectedInLayout", {
				success: function (oData) {
					oData.results.sort(function (a, b) {
						if (a.columnOrder < b.columnOrder) {
							return -1;
						}
					});
					var formulaItem = {
						ID: 1,
						categoryId: 1,
						subCategoryName: "Formula Item",
						fixedColumn: true,
						columnOrder: 0
					};
					oData.results.splice(0, 0, formulaItem);
					that.transposeLayoutColumns(oData.results);
					that.getRecipeSpecifications();
				},
				error: function (errorMessage) {
					that.updateMessageManager("Error",
						errorMessage.responseText.split(":")[5].split("}")[0], "");
				}
			});

			this.setDefaultLayout(selectedLayoutId, selectedLayoutName);
		},

		//When a single row is selected, Delete button is enabled. However this is disabled for the PO row. When the delete button is clicked, the row gets removed from the database table
		onPressDeleteRow: function (oEvent) {
			var oModel = that.getOwnerComponent().getModel();
			this.getView().byId("TreeTable").setSelectedIndex(-1);
			oModel.callFunction("/deleteFormulaItem", {
				method: "GET",
				urlParameters: {
					itemNumber: this.selectedItemNumber
				},
				success: function (oData) {
					that.formulaCalculation(that.recipeID);

					for (var q = sap.ui.getCore().getMessageManager().getMessageModel().getData().length - 1; q >= 0; q--) {
						if (sap.ui.getCore().getMessageManager().getMessageModel().getData()[q].message.indexOf(that._oResourceBundle
								.getText("emptySpecIndex")) !== -1 || sap.ui.getCore().getMessageManager()
							.getMessageModel().getData()[q].message.indexOf(that._oResourceBundle
								.getText("emptyQuantityIndex")) !== -1 || sap.ui.getCore().getMessageManager()
							.getMessageModel().getData()[q].message.indexOf(that._oResourceBundle
								.getText("emptyUOMIndex")) !== -1) {
							that.removeMessageFromTarget(sap.ui.getCore()
								.getMessageManager().getMessageModel().getData()[q].message);
						}
					}
					that.validatingCells();
				},
				error: function (errorMessage) {
					that.updateMessageManager("Error",
						errorMessage.responseText.split(":")[5].split("}")[0], "");
				}
			});
		},

		//When a Layout is selected from combo box, it sets that layout as Default layout. It calls a function import saveUserDefaultLayout
		setDefaultLayout: function (ID, Layoutname) {
			var oLayoutModel = this.getOwnerComponent().getModel("layOutModel");
			var that = this;
			oLayoutModel.callFunction("/saveUserDefaultLayout", {
				method: "GET",
				urlParameters: {
					ID: ID
				},
				success: function (oData) {},
				error: function (errorMessage) {

				}
			});

		},

		//Triggered when the “Up” button is clicked in the toolbar. It moves the selected row upwards by one row. It is disabled for the first child row and the PO row
		onClickUp: function (oEvent) {
			var id = this.selectedID;
			this.onReorder(id, "up");
		},

		//Triggered when the “Down” button is clicked in the toolbar. It moves the selected row downward by one row. It is disabled for the last child row and the PO row.
		onClickDown: function (oEvent) {
			var id = this.selectedID;
			this.onReorder(id, "down");
		},

		//This is triggered whenever the row is expected to move up and down
		onReorder: function (id, direction) {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			oModel.callFunction("/reorderSpecificationID", {
				method: "GET",
				urlParameters: {
					ID: id,
					reorderAction: direction
				},
				success: function () {
					that.getRecipeSpecifications();
					that.getView().byId("TreeTable").setSelectedIndex(-1);
				},
				error: function () {}
			});
		},

		//Triggered when Edit layout button is clicked from the menu button. It navigates to the edit page of the formula layout management application
		onClickEditLayout: function (oEvent) {

			var oComboLayout = this.getView().byId("cmbTableType");
			var key = oComboLayout.getSelectedKey();
			var shelHash = "#layout-manage?preferredMode=display&//LayoutInformation(ID=guid'" + key + "',IsActiveEntity=true)";
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: shelHash
				}
			});
		},

		//Sorts the layout list in the Layout combo box in an alphabetical manner
		sortArray: function (a, b) {
			const bandA = a.layoutName.toUpperCase();
			const bandB = b.layoutName.toUpperCase();

			var comparison = 0;
			if (bandA > bandB) {
				comparison = 1;
			} else if (bandA < bandB) {
				comparison = -1;
			}
			return comparison;

		}
	});
});
