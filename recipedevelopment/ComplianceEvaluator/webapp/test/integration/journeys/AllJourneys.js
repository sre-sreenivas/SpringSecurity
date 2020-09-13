jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require("sap.ui.thirdparty.sinon-qunit");
jQuery.sap.require("sap.ui.qunit.qunit-coverage");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.opaQunit");

QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"ComplianceEvaluator/test/integration/pages/Common",
		"sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
		"ComplianceEvaluator/test/integration/pages/ListReportPage",
		"ComplianceEvaluator/test/integration/pages/ObjectPage",
		 "sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
	     "sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
	],
	function(Opa5, Common, Qunit, ListReportPage) {
		"use strict";
		Opa5.extendConfig({
			arrangements: new Common(),
		autoWait: true,
		appParams: {
			"sap-ui-animation": false
		},
		timeout: 100,
		testLibs: {
			fioriElementsTestLibrary: {
				Common: {
					appId: "ComplianceEvaluator",
					entitySet: "ZEVALS"
				}
			}
		}
		});

		sap.ui.require([
			"ComplianceEvaluator/test/integration/journeys/ListReportJourney"
		], function() {
			QUnit.config.testTimeout = 99999;
			QUnit.start();
		});
	}
);