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
				sEntity = "saveUserDefaultLayout",
				sEntity1 = "getLayoutList",
				sEntity2 = "LayoutInformation",
				sErrorParam = oUriParameters.get("errorType"),
				iErrorCode = sErrorParam === "badRequest" ? 400 : 500,
				oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
				oDataSource = oManifest["sap.app"].dataSources,
				oMainDataSource = oDataSource.layOutService,
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
				path: new RegExp("(.*)saveUserDefaultLayout(.*)"),
				response: function (oXhr) {
					jQuery.sap.log.debug("Mock Server: saveUserDefaultLayout");
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
				path: new RegExp("(.*)getLayoutList(.*)"),
				response: function (oXhr) {
					jQuery.sap.log.debug("Mock Server: getLayoutList");
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
						"d": {
							"results": [{
								"ID": "f3e90896-0a5e-4c86-86ea-cf9424f75486",
								"layoutName": "kjh",
								"status": null,
								"description": null,
								"defaultFlag": null,
								"layoutType": "User Specific Layout",
								"referenceQuantity": null,
								"UOM": null,
								"defaultFlagCriticality": null,
								"createdAt": "\/Date(1587379433142)\/",
								"createdBy": "j.ganesh.hedaoo@accenture.com",
								"modifiedAt": "\/Date(1587379433142)\/",
								"modifiedBy": "j.ganesh.hedaoo@accenture.com",
								"IsActiveEntity": false,
								"HasActiveEntity": false,
								"HasDraftEntity": false
							}, {
								"ID": "11111111-1111-1111-1111-111111111111",
								"layoutName": "Default",
								"status": "Available",
								"description": null,
								"defaultFlag": true,
								"layoutType": "Default",
								"referenceQuantity": 100,
								"UOM": "KG",
								"defaultFlagCriticality": null,
								"createdAt": "\/Date(1587379433142)\/",
								"createdBy": "j.ganesh.hedaoo@accenture.com",
								"modifiedAt": "\/Date(1587379433142)\/",
								"modifiedBy": "j.ganesh.hedaoo@accenture.com",
								"IsActiveEntity": true,
								"HasActiveEntity": false,
								"HasDraftEntity": false
							}]
						}
					}));
				}
			});
			
			aRequests.push({
				method: "GET",
				path: /ColumnsSelectedInLayout(.*)/, 
				response: function (oXhr) {
					var sPath = jQuery.sap.getModulePath("i2d/pp/pmrpsim/simboms1/localService/mockdata/ColumnsSelectedInLayout", ".json");
					var oResponse = jQuery.sap.syncGetJSON(sPath).data;
					oXhr.respondJSON(200, {}, JSON.stringify(oResponse));
					return true;
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