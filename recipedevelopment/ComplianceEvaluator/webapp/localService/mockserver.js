sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/ui/thirdparty/jquery"
], function (MockServer, jquery) {
	"use strict"; 
	var oMockServer,
		_sAppModulePath = "ComplianceEvaluator/",
		_sJsonFilesModulePath = _sAppModulePath + "localService/mockdata";

	return {

		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */

		init: function () {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sJsonFilesUrl = jQuery.sap.getModulePath(_sJsonFilesModulePath),
				sManifestUrl = jQuery.sap.getModulePath(_sAppModulePath + "manifest", ".json"),
				sEntity = "Evaluation",
				sEntity1 = "evaluationStatusSave",
				sEntity2 = "updateSellignMarket",
				sErrorParam = oUriParameters.get("errorType"),
				iErrorCode = sErrorParam === "badRequest" ? 400 : 500,
				oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
				oDataSource = oManifest["sap.app"].dataSources,
				oMainDataSource = oDataSource.mainService,
				sMetadataUrl = jQuery.sap.getModulePath(_sAppModulePath + oMainDataSource.settings.localUri.replace(".xml", ""), ".xml"),
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
			
			// handling mocking a function import call step
			// aRequests.push({
			// 	method: "GET",
			// 	path: new RegExp("evaluationStatusSave(.*)"),
			// 	response: function (oXhr) {
			// 		var oResponse = jQuery.ajax({
			// 			url: "/evaluationStatusSave?EVALUATION_ID='60ee31d5-ae47-4d0a-b4dd-a6e65cfe2d8f'&evalStatus='In-progress'",
			// 			method: "GET"
			// 		});
			// 		oXhr.respondJSON(200, {}, JSON.stringify());
			// 		return true;
			// 	}
			// });
			aRequests.push({
                method: "GET",
                path: new RegExp("(.*)evaluationStatusSave(.*)"),
                response: function(oXhr, sUrlParams) {
                    jQuery.sap.log.debug("Mock Server: evaluationStatusSave");
                    var oResponse = {
                        data: {},
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                            "DataServiceVersion": "1.0"
                        },
                        status: "204",
                        statusText: "No Content"
                    };
                    oXhr.respond(oResponse.status, oResponse.headers, JSON.stringify({ d: oResponse.data }));
                }
            });
			// aRequests.push({
			// 	method: "GET",
			// 	path: new RegExp("addRecipe(.*)"),
			// 	response: function (oXhr) {
			// 		var oResponse = jQuery.ajax({
			// 			url: "addRecipe?evaluationID='0dc4e020-7b42-430e-82d8-cf987d5b9502'&recipeId='a86000d7-3f7d-41d2-a2e9-256d66ac8930'&recipeDescription='recipeDescription 1'&recipeType='recipeType 1'&recipeStatus='recipeStatus 1'&createdBy='createdBy 1'",
			// 			method: "GET"
			// 		});
			// 		oXhr.respondJSON(200, {}, JSON.stringify({"d":{"addRecipe":""}}));
			// 		return true;
			// 	}
			// }); 
			aRequests.push({
                method: "GET",
                path: new RegExp("(.*)addRecipe(.*)"),
                response: function(oXhr, sUrlParams) {
                    jQuery.sap.log.debug("Mock Server: addRecipe");
                    var oResponse = {
                        data: {},
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                            "DataServiceVersion": "1.0"
                        },
                        status: "204",
                        statusText: "No Content"
                    };
                    oXhr.respond(oResponse.status, oResponse.headers, JSON.stringify({ d: oResponse.data }));
                }
            });
			// aRequests.push({
			// 	method: "GET",
			// 	path: new RegExp("addPurpose(.*)"),
			// 	response: function (oXhr) {
			// 		var oResponse = jQuery.ajax({
			// 			url: "addPurpose?evaluationID='0dc4e020-7b42-430e-82d8-cf987d5b9502'&purposeId='3066e7fb-faa3-45ce-a12a-0a94a736ebb4'&purpose='purpose 1'&purposeType='purposeType 1'&requirement='requirement 1'&requirementID='requirementID 1'&addedBy='addedBy 1'",
			// 			method: "GET"
			// 		});
			// 		oXhr.respondJSON(200, {}, JSON.stringify({"d":{"addPurpose":""}}));
			// 		return true;
			// 	}
			// });
			aRequests.push({
                method: "GET",
                path: new RegExp("(.*)addPurpose(.*)"),
                response: function(oXhr, sUrlParams) {
                    jQuery.sap.log.debug("Mock Server: addPurpose");
                    var oResponse = {
                        data: {},
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                            "DataServiceVersion": "1.0"
                        },
                        status: "204",
                        statusText: "No Content"
                    };
                    oXhr.respond(oResponse.status, oResponse.headers, JSON.stringify({ d: oResponse.data }));
                }
            });
			
			oMockServer.setRequests(aRequests);
			
			// oMockServer.simulate("localService/metadata.xml", {
			// 	sMockdataBaseUrl : "localService/mockdata",
			// 	bGenerateMissingMockData : true
			// });

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

			jQuery.sap.log.info("Running the app with mock data");

			if (aAnnotations && aAnnotations.length > 0) {
				aAnnotations.forEach(function (sAnnotationName) {
					var oAnnotation = oDataSource[sAnnotationName],
						sUri = oAnnotation.uri,
						sLocalUri = jQuery.sap.getModulePath(_sAppModulePath + oAnnotation.settings.localUri.replace(".xml", ""), ".xml");

					// backend annotations
					new MockServer({
						rootUri: sUri,
						requests: [{
							method: "GET",
							path: new RegExp("([?#].*)?"),
							response: function (oXhr) {
								jQuery.sap.require("jquery.sap.xml");

								var oAnnotations = jQuery.sap.sjax({
									url: sLocalUri,
									dataType: "xml"
								}).data;

								oXhr.respondXML(200, {}, jQuery.sap.serializeXML(oAnnotations));
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
