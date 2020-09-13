sap.ui.controller("manage.manage_layout.ext.controller.ListReportExt", {
	
	beforeDeleteExtension: function (oBeforeDeleteProperties) {
		var sText = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("deleteConfirm");
		var sTitle = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("delete");
		var oMessageText = {
			title: sTitle,
			text: sText
		};
		return oMessageText;
	}
});
