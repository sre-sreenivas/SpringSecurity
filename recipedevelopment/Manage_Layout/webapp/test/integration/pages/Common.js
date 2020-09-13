sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press"
], function(Opa5, Press) {
	"use strict";

	function getFrameUrl(sHashParameter, sUrlParameters) {
		var sUrl = jQuery.sap.getResourcePath("manage/manage_layout/app", ".html");
		var sHash = sHashParameter || "";
		var sUrlParams = sUrlParameters ? "?" + sUrlParameters : "";

		if (sHash) {
			sHash = "#masterDetail-display&/" + (sHash.indexOf("/") === 0 ? sHash.substring(1) : sHash);
		} else {
			sHash = "#masterDetail-display";
		}

		return sUrl + sUrlParams + sHash;
	}

	return Opa5.extend("manage.manage_layout.test.integration.pages.Common", {

		iStartMyApp: function(oOptionsInput) {
			
			var sUrlParameters,
				oOptions = oOptionsInput || {};
			// Start the app with a minimal delay to make tests run fast but still async to discover basic timing issues
			var iDelay = oOptions.delay || 50;
			sUrlParameters = "serverDelay=" + iDelay;
			this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, sUrlParameters));
		},
		iPressUserMenuButton: function() {
			return this.waitFor({
				id: "meAreaHeaderButton",
				actions: new Press()
			});
		}
	});
});