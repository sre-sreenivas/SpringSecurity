sap.ui.define(["sap/suite/ui/generic/template/lib/AppComponent","ComplianceEvaluator/ext/controller/ErrorHandler"], function (AppComponent,ErrorHandler) {
	return AppComponent.extend("ComplianceEvaluator.Component", {
		metadata: {
			"manifest": "json"
		},
			onBeforeRendering : function () {
			
				// initialize the error handler with the component
				this._oErrorHandler = new ErrorHandler(this);
			}
	});
});
