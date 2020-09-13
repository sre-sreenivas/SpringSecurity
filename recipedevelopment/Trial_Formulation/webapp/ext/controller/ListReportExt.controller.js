sap.ui.controller("Trial_Formulation.trial_formulation.ext.controller.ListReportExt", {
	//Recipe Description Field is removed from list report personalization dialog
	onInit: function () {
		var oConstraintSmartTable = sap.ui.getCore().byId(
			"Trial_Formulation.trial_formulation::sap.suite.ui.generic.template.ListReport.view.ListReport::Recipe--listReport");
		if (oConstraintSmartTable) {
			var arrFields = ["recipeDESCRIPTION"];
			oConstraintSmartTable.setRequestAtLeastFields(arrFields);
			oConstraintSmartTable.setIgnoreFromPersonalisation(
				"recipeDESCRIPTION"
			);
		}
	},
	//Text in the message box is set when the delete button in the list report is clicked.
	beforeDeleteExtension: function () {
		var sText = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("deleteConfirm");
		var sTitle = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("delete");
		var oMessageText = {
			title: sTitle,
			text: sText
		};
		return oMessageText;
	}
});
