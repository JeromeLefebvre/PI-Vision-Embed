
/**
# ***********************************************************************
# * DISCLAIMER:
# *
# * All sample code is provided by OSIsoft for illustrative purposes only.
# * These examples have not been thoroughly tested under all conditions.
# * OSIsoft provides no guarantee nor implies any reliability,
# * serviceability, or function of these programs.
# * ALL PROGRAMS CONTAINED HEREIN ARE PROVIDED TO YOU "AS IS"
# * WITHOUT ANY WARRANTIES OF ANY KIND. ALL WARRANTIES INCLUDING
# * THE IMPLIED WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY
# * AND FITNESS FOR A PARTICULAR PURPOSE ARE EXPRESSLY DISCLAIMED.
# ************************************************************************
#
# Updated by dlopez@osisoft.com
# Visualizations provided by amCharts: https://www.amcharts.com/
#
**/

//************************************
// Begin defining a new symbol
//************************************
(function (CS) {
	'use strict';
	// Specify the symbol definition	
	var myCustomSymbolDefinition = {
		// Specify the unique name for this symbol; this instructs PI Coresight to also
		// look for HTML template and config template files called sym-<typeName>-template.html and sym-<typeName>-config.html
		typeName: 'embedWebPage',
		// Specify the user-friendly name of the symbol that will appear in PI Coresight
		displayName: 'Embed Web Page',
		// Specify the number of data sources for this symbol
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/embedWebPage.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				// Specify the data shape type (for symbols that update with new data)
				DataShape: 'Value',
				// Specify the default height and width of this symbol
				Height: 300,
				Width: 600,
				// Specify the value of custom configuration options; see the "configure" section below
				targetURL: "https://google.com",
				refreshOnSchedule: false,
				refreshIntervalSeconds: 60
			};
		},
		// By including this, you're specifying that you want to allow configuration options for this symbol
		 configOptions: function () {
            return [{
				// Add a title that will appear when the user right-clicks a symbol
				title: 'Format Symbol',
				// Supply a unique name for this cofiguration setting, so it can be reused, if needed
                mode: 'format'
            }];
        },
		// Include variables that will be used in the custom configuration pane.
		// Define a keyword and the value of that keyword for each variable.
		// You'll specify the value for these in the getDefaultConfig section
		// by referencing these variables by the value of their keyword
		configure: {
			targetURLKeyword: 'targetURL',
			refreshOnScheduleKeyword: 'refreshOnSchedule',
			refreshIntervalSecondsKeyword: 'refreshIntervalSeconds'
		},
		// Specify the name of the function that will be called to initialize the symbol
		//init: myCustomSymbolInitFunction
	};
	
	//************************************
	// Function called to initialize the symbol
	//************************************
	//function myCustomSymbolInitFunction(scope, elem) {
	function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);
	symbolVis.prototype.init = function(scope, elem) {
		// Specify which function to call when a data update or configuration change occurs 
		//this.onDataUpdate = myCustomDataUpdateFunction;
		this.onConfigChange = myCustomConfigurationChangeFunction;
		
		// Locate the html div that will contain the symbol, using its id, which is "container" by default
		var symbolContainerElement = elem.find('#container')[0];
        // Use random functions to generate a new unique id for this symbol, to make it unique among all other custom symbols
		var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
		// Write that new unique ID back to overwrite the old id
        symbolContainerElement.id = newUniqueIDString;
		// Create a variable to hold the custom visualization object
		var customVisualizationObject;
		// Create a timer variable to be used for refreshes
		var myTimer;
		// Update the visualization
		if(!customVisualizationObject) {
			customVisualizationObject = true;
			// Set the source of the iframe
			myUpdateIFrameURLFunction();
		}

		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
		function myCustomConfigurationChangeFunction() {
			// If the chart exists...
			if(customVisualizationObject) {
				console.log("Now updating visualization with new configuration...");
				// Update the iFrame to the new desired URL
				if (scope.config.targetURL != symbolContainerElement.src) {
					myUpdateIFrameURLFunction();
				}
				// Update the refresh timer
				window.clearInterval(myTimer);
				if (scope.config.refreshOnSchedule == true) {
					if (scope.config.refreshIntervalSeconds > 0) {
						myTimer = setInterval(myUpdateIFrameURLFunction, scope.config.refreshIntervalSeconds * 1000);
					}
				} 
			}
		}
		
		//************************************
		// Function that is called to refresh the iframe
		//************************************
		function myUpdateIFrameURLFunction() {
			console.log((new Date) + " : Refreshing iFrame...");
			// Refresh the iFrame 
			symbolContainerElement.src = scope.config.targetURL;
		}
		
		// Specify which function to call when a data update or configuration change occurs 
		//return { configChange:myCustomConfigurationChangeFunction };
	}
	// Register this custom symbol definition with PI Coresight
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.PIVisualization);