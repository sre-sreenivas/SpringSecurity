sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/Log",
	"sap/base/util/UriParameters",
	"sap/ui/util/XMLHelper"
], function (MockServer, Log, UriParameters, XMLHelper) {
	"use strict";
	var oMockServer,
		_sAppModulePath = "manage/manage_layout/",
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
				sEntity = "LayoutInformation",
				sEntity1 = "layoutDefaultFlagSave",
				sEntity2 = "addBasicColumn",
				sEntity3 = "findUserDefaultLayout",
				sEntity4 = "reorderSelectedColumn",
				sEntity5 = "ColumnsSelectedInLayout",
				sEntity6 = "validateManuallyEnteredUOM",
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
				path: new RegExp("(.*)layoutDefaultFlagSave(.*)"),
				response: function (oXhr, sUrlParams) {
					jQuery.sap.log.debug("Mock Server: layoutDefaultFlagSave");
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
				response: function (oXhr, sUrlParams) {
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
				path: new RegExp("(.*)/LayoutInformation/(.*)/ColumnsSelectedInLayout(.*)"),
				response: function (oXhr, sUrlParams) {
					jQuery.sap.log.debug("Mock Server: ColumnsSelectedInLayout");
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
								"ID": "04279deb-5f4c-40d9-97df-1a3485a4c28d",
								"layoutItemId": "9a527dba-fd4e-4dd6-8084-f6e8c6e4531d",
								"categoryName": "Basic Column",
								"subCategoryName": "UOM",
								"UOM": "",
								"fixedColumn": false,
								"columnOrder": 4,
								"IsActiveEntity": false,
								"HasActiveEntity": false,
								"HasDraftEntity": false,
								"DraftAdministrativeData_DraftUUID": "de529bfc-70bb-49a9-bcfb-306d9af66cca"
							}, {
								"ID": "45606df4-ebf4-493c-8ec3-6e29b3b60a1a",
								"layoutItemId": "9a527dba-fd4e-4dd6-8084-f6e8c6e4531d",
								"categoryName": "Basic Column",
								"subCategoryName": "Specification",
								"UOM": "",
								"fixedColumn": false,
								"columnOrder": 1,
								"IsActiveEntity": false,
								"HasActiveEntity": false,
								"HasDraftEntity": false,
								"DraftAdministrativeData_DraftUUID": "de529bfc-70bb-49a9-bcfb-306d9af66cca"
							}, {
								"ID": "773fe2de-cb24-4ea0-9603-4c7dc27cc9cf",
								"layoutItemId": "9a527dba-fd4e-4dd6-8084-f6e8c6e4531d",
								"categoryName": "Basic Column",
								"subCategoryName": "Component Type",
								"UOM": "",
								"fixedColumn": false,
								"columnOrder": 5,
								"IsActiveEntity": false,
								"HasActiveEntity": false,
								"HasDraftEntity": false,
								"DraftAdministrativeData_DraftUUID": "de529bfc-70bb-49a9-bcfb-306d9af66cca"
							}, {
								"ID": "cc509068-6a31-41ba-b761-093b500a5dfe",
								"layoutItemId": "9a527dba-fd4e-4dd6-8084-f6e8c6e4531d",
								"categoryName": "Basic Column",
								"subCategoryName": "Density",
								"UOM": "",
								"fixedColumn": false,
								"columnOrder": 6,
								"IsActiveEntity": false,
								"HasActiveEntity": false,
								"HasDraftEntity": false,
								"DraftAdministrativeData_DraftUUID": "de529bfc-70bb-49a9-bcfb-306d9af66cca"
							}, {
								"ID": "ccc1563d-a247-4c60-9ef8-cd4139079e23",
								"layoutItemId": "9a527dba-fd4e-4dd6-8084-f6e8c6e4531d",
								"categoryName": "Basic Column",
								"subCategoryName": "Quantity",
								"UOM": "",
								"fixedColumn": false,
								"columnOrder": 3,
								"IsActiveEntity": false,
								"HasActiveEntity": false,
								"HasDraftEntity": false,
								"DraftAdministrativeData_DraftUUID": "de529bfc-70bb-49a9-bcfb-306d9af66cca"
							}, {
								"ID": "dde619e3-8f46-4bab-9a96-4a2c8d592ef0",
								"layoutItemId": "9a527dba-fd4e-4dd6-8084-f6e8c6e4531d",
								"categoryName": "Basic Column",
								"subCategoryName": "Specification Description",
								"UOM": "",
								"fixedColumn": false,
								"columnOrder": 2,
								"IsActiveEntity": false,
								"HasActiveEntity": false,
								"HasDraftEntity": false,
								"DraftAdministrativeData_DraftUUID": "de529bfc-70bb-49a9-bcfb-306d9af66cca"
							}]
						}
					}));
				}
			});

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)layoutStatusSave(.*)"),
				response: function (oXhr, sUrlParams) {
					jQuery.sap.log.debug("Mock Server: layoutStatusSave");
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
				response: function (oXhr, sUrlParams) {
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
				path: new RegExp("(.*)addBasicColumn(.*)"),
				response: function (oXhr, sUrlParams) {
					jQuery.sap.log.debug("Mock Server: addBasicColumn");
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
			// findUserDefaultLayout

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)findUserDefaultLayout(.*)"),
				response: function (oXhr, sUrlParams) {
					jQuery.sap.log.debug("Mock Server: findUserDefaultLayout");
					var oResponse = {
						data: {
							"findUserDefaultLayout": "Layout Name"
						},
						headers: {
							"Content-Type": "application/json;charset=utf-8",
							"DataServiceVersion": "1.0"
						},
						status: "204",
						statusText: "No Content"
					};
					oXhr.respond(oResponse.status, oResponse.headers, JSON.stringify({
						"d": {
							"findUserDefaultLayout": "layout testing"
						}
					}));
				}
			});
			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)reorderSelectedColumn(.*)"),
				response: function (oXhr, sUrlParams) {
					jQuery.sap.log.debug("Mock Server: reorderSelectedColumn");
					var oResponse = {
						data: {},
						headers: {
							"Content-Type": "application/json;charset=utf-8",
							"DataServiceVersion": "1.0"
						},
						status: "400",
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