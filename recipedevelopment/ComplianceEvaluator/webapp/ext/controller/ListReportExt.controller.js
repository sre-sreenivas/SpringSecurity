sap.ui.controller("ComplianceEvaluator.ext.controller.ListReportExt", {

	//Initializing ListReport page.
	onInit: function () {
		sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ListReport.view.ListReport::Evaluation--addEntry").addDelegate({
			onAfterRendering: function (event) {
				sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ListReport.view.ListReport::Evaluation--copyEvaluationSheet_btn").setVisible(false);  
			}
		});
		
		var oConstraintSmartTable = sap.ui.getCore().byId("ComplianceEvaluator::sap.suite.ui.generic.template.ListReport.view.ListReport::Evaluation--listReport");
            	if (oConstraintSmartTable) {
                	var arrFields = ["evaluationName","compliantRecipeCount","recipeCount","recipeCriticalityIndicator"];
                	oConstraintSmartTable.setRequestAtLeastFields(arrFields);
                	oConstraintSmartTable.setIgnoreFromPersonalisation(
                    	"evaluationName"
                	);
            	}	
	},
	
	// Event handler to replace the default confirmation message on Delete with Custom Message
	beforeDeleteExtension: function (oBeforeDeleteProperties) {
		var sEvaluation = oBeforeDeleteProperties.aContexts[0].getProperty("evaluationName");
		var sText = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("deleteConfirm", [sEvaluation]);
	    	var sTitle = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("delete");
		var oMessageText = {
			title: sTitle,
			text: sText

		};
		return oMessageText;
	},


	// Event handler for adding more filters to service call for Date search and selling market search
	onBeforeRebindTableExtension: function (oEvent) {
		var oBindingParams = oEvent.getParameter("bindingParams");
		oBindingParams.parameters = oBindingParams.parameters || {};
		var oSmartTable = oEvent.getSource();
		var arrFields = ["recipeCount"]; 
              	oSmartTable.setRequestAtLeastFields(arrFields);
		var oDefaultFilters = "";
		var oSmartFilterBar = oEvent.getSource().getParent().getParent().byId(oSmartTable.getSmartFilterId());
		if (oBindingParams.filters[0].aFilters) {
			oDefaultFilters = oBindingParams.filters[0].aFilters[0];
		}else{
		oDefaultFilters = oBindingParams.filters[0];
		}
		if (oDefaultFilters) {
			if (oDefaultFilters.aFilters) {
				for (var i = 0; i < oDefaultFilters.aFilters.length; i++) {
					if (oDefaultFilters.aFilters[i].aFilters !== undefined) {
						for (var j = 0; j < oDefaultFilters.aFilters[i].aFilters.length; j++) {
							if (oDefaultFilters.aFilters[i].aFilters[j].sPath == 'sellingMarket')
								oBindingParams.filters[0].aFilters[0].aFilters[i].aFilters[j].sOperator = 'Contains';
							if (oDefaultFilters.aFilters[i].aFilters[j].sPath == 'validFrom')
								oBindingParams.filters[0].aFilters[0].aFilters[i].aFilters[j].sOperator = 'ge';
							if (oDefaultFilters.aFilters[i].aFilters[j].sPath == 'validTo')
								oBindingParams.filters[0].aFilters[0].aFilters[i].aFilters[j].sOperator = 'le';
						}
					} else{
					if (oDefaultFilters.aFilters[i].sPath == 'sellingMarket')
						oBindingParams.filters[0].aFilters[0].aFilters[i].sOperator = 'Contains';
					if (oDefaultFilters.aFilters[i].sPath == 'validFrom')
						oBindingParams.filters[0].aFilters[0].aFilters[i].sOperator = 'GE';
					if (oDefaultFilters.aFilters[i].sPath == 'validTo')
						oBindingParams.filters[0].aFilters[0].aFilters[i].sOperator = 'LE';
					
					}
				}
			}else{
					if (oDefaultFilters.sPath == 'sellingMarket')
						oBindingParams.filters[0].sOperator = 'Contains';
					if (oDefaultFilters.sPath == 'validFrom')
						oBindingParams.filters[0].sOperator = 'GE';
					if (oDefaultFilters.sPath == 'validTo')
						oBindingParams.filters[0].sOperator = 'LE';
			}
		}

	}

});
