sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/Log",
	"sap/base/util/UriParameters",
	"sap/ui/util/XMLHelper"
], function (MockServer, Log, UriParameters, XMLHelper) {
	"use strict";
	var oMockServer,
		_sAppModulePath = "Trial_Formulation/trial_formulation/",
		_sJsonFilesModulePath = _sAppModulePath + "localService/mockdata";

	return {

		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */

		init: function () {

			var oUriParameters = new UriParameters(window.location.href),
				sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesModulePath),
				sManifestUrl = sap.ui.require.toUrl(_sAppModulePath + "manifest" + ".json"),
				sEntity = "Recipe",
				sEntity1 = "recipeStatusSave",
				sEntity2 = "addSpecification",
				sEntity3 = "formulaQuantityCalculation",
				sEntity4 = "updateDraftSpecificationValues",
				sEntity5 = "validateManuallyEnteredUOM",
				sEntity6 = "deleteFormulaItem",
				sEntity7 = "validateSpecificationId",
				sEntity8 = "reorderSpecificationID",
				sErrorParam = oUriParameters.get("errorType"),
				iErrorCode = sErrorParam === "badRequest" ? 400 : 500,
				oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
				oDataSource = oManifest["sap.app"].dataSources,
				oMainDataSource = oDataSource.mainService,
				sMetadataUrl = sap.ui.require.toUrl(_sAppModulePath + oMainDataSource.settings.localUri.replace(".xml", "") + ".xml"),
				// ensure there is a trailing slash
				sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/",
				aAnnotations = oMainDataSource.settings.annotations;

			oMockServer = new MockServer({
				rootUri: sMockServerUrl
			});

			// configure mock server with a delay of 1s
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 1000)
			});

			// load local mock data
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sJsonFilesUrl,
				bGenerateMissingMockData: true
			});

			var aRequests = oMockServer.getRequests(),
				fnResponse = function (iErrCode, sMessage, aRequest) {
					aRequest.response = function (oXhr) {
						oXhr.respond(iErrCode, {
							"Content-Type": "text/plain;charset=utf-8"
						}, sMessage);
					};
				};

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)recipeStatusSave(.*)"),
				response: function (oXhr) {
					jQuery.sap.log.debug("Mock Server: recipeStatusSave");
					var oResponse = {
						data: {},
						headers: {
							"Content-Type": "application/json;charset=utf-8",
							"DataServiceVersion": "1.0"
						},
						status: "204",
						statusText: "No Content"
					};
					oXhr.respond(oResponse.status, oResponse.headers, JSON.stringify({
						d: oResponse.data
					}));
				}
			});
			
			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)addSpecification(.*)"),
				response: function (oXhr) {
					jQuery.sap.log.debug("Mock Server: addSpecification");
					var oResponse = {
						data: {},
						headers: {
							"Content-Type": "application/json;charset=utf-8",
							"DataServiceVersion": "1.0"
						},
						status: "204",
						statusText: "No Content"
					};
					oXhr.respond(oResponse.status, oResponse.headers, JSON.stringify({
						d: oResponse.data
					}));
				}
			});
			
			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)formulaQuantityCalculation(.*)"),
				response: function (oXhr) {
					jQuery.sap.log.debug("Mock Server: formulaQuantityCalculation");
					var oResponse = {
						data: {},
						headers: {
							"Content-Type": "application/json;charset=utf-8",
							"DataServiceVersion": "1.0"
						},
						status: "204",
						statusText: "No Content"
					};
					oXhr.respond(oResponse.status, oResponse.headers, JSON.stringify({
						d: oResponse.data
					}));
				}
			});
			
			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)updateDraftSpecificationValues(.*)"),
				response: function (oXhr) {
					jQuery.sap.log.debug("Mock Server: updateDraftSpecificationValues");
					var oResponse = {
						data: {},
						headers: {
							"Content-Type": "application/json;charset=utf-8",
							"DataServiceVersion": "1.0"
						},
						status: "204",
						statusText: "No Content"
					};
					oXhr.respond(oResponse.status, oResponse.headers, JSON.stringify({
						d: oResponse.data
					}));
				}
			});
			
			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)validateSpecificationId(.*)"),
				response: function (oXhr) {
					jQuery.sap.log.debug("Mock Server: validateSpecificationId");
					var oResponse = {
						data: {},
						headers: {
							"Content-Type": "application/json;charset=utf-8",
							"DataServiceVersion": "1.0"
						},
						status: "204",
						statusText: "No Content"
					};
					oXhr.respond(oResponse.status, oResponse.headers, JSON.stringify({
						d: oResponse.data
					}));
				}
			});
			
			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)reorderSpecificationID(.*)"),
				response: function (oXhr) {
					jQuery.sap.log.debug("Mock Server: reorderSpecificationID");
					var oResponse = {
						data: {},
						headers: {
							"Content-Type": "application/json;charset=utf-8",
							"DataServiceVersion": "1.0"
						},
						status: "204",
						statusText: "No Content"
					};
					oXhr.respond(oResponse.status, oResponse.headers, JSON.stringify({
						d: oResponse.data
					}));
				}
			});
			
			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)validateManuallyEnteredUOM(.*)"),
				response: function (oXhr) {
					jQuery.sap.log.debug("Mock Server: validateManuallyEnteredUOM");
					var oResponse = {
						data: {},
						headers: {
							"Content-Type": "application/json;charset=utf-8",
							"DataServiceVersion": "1.0"
						},
						status: "204",
						statusText: "No Content"
					};
					oXhr.respond(oResponse.status, oResponse.headers, JSON.stringify({
						d: oResponse.data
					}));
				}
			});
			
			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)deleteFormulaItem(.*)"),
				response: function (oXhr) {
					jQuery.sap.log.debug("Mock Server: deleteFormulaItem");
					var oResponse = {
						data: {},
						headers: {
							"Content-Type": "application/json;charset=utf-8",
							"DataServiceVersion": "1.0"
						},
						status: "204",
						statusText: "No Content"
					};
					oXhr.respond(oResponse.status, oResponse.headers, JSON.stringify({
						d: oResponse.data
					}));
				}
			});

			// handling the metadata error test
			if (oUriParameters.get("metadataError")) {
				aRequests.forEach(function (aEntry) {
					if (aEntry.path.toString().indexOf("$metadata") > -1) {
						fnResponse(500, "metadata Error", aEntry);
					}
				});
			}

			// Handling request errors
			if (sErrorParam) {
				aRequests.forEach(function (aEntry) {
					if (aEntry.path.toString().indexOf(sEntity) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
					if (aEntry.path.toString().indexOf(sEntity1) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
					if (aEntry.path.toString().indexOf(sEntity2) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
					if (aEntry.path.toString().indexOf(sEntity3) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
					if (aEntry.path.toString().indexOf(sEntity4) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
					if (aEntry.path.toString().indexOf(sEntity5) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
					if (aEntry.path.toString().indexOf(sEntity6) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
					if (aEntry.path.toString().indexOf(sEntity7) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
					if (aEntry.path.toString().indexOf(sEntity8) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
				});
			}

			oMockServer.setRequests(aRequests);
			oMockServer.start();

			Log.info("Running the app with mock data");

			if (aAnnotations && aAnnotations.length > 0) {
				aAnnotations.forEach(function (sAnnotationName) {
					var oAnnotation = oDataSource[sAnnotationName],
						sUri = oAnnotation.uri,
						sLocalUri = sap.ui.require.toUrl(_sAppModulePath + oAnnotation.settings.localUri.replace(".xml", "") + ".xml");

					// backend annotations
					new MockServer({
						rootUri: sUri,
						requests: [{
							method: "GET",
							path: new RegExp("([?#].*)?"),
							response: function (oXhr) {
								sap.ui.require("jquery.sap.xml");

								var oAnnotations = jQuery.sap.sjax({
									url: sLocalUri,
									dataType: "xml"
								}).data;

								oXhr.respondXML(200, {}, XMLHelper.serialize(oAnnotations));
								return true;
							}
						}]

					}).start();

				});
			}

		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer}
		 */
		getMockServer: function () {
			return oMockServer;
		}
	};

});