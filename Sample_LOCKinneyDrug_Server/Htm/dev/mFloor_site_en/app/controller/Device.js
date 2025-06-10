consoleLog('Device.load.start');

var DeviceCtrl;

//Wedge variables
var globalScanBuffer = '';
var globalScanSufix = null;
var globalScanPrefix = null;


//Device properties
var globalDeviceOS = null;
var globalDeviceModel = null;
var globalDeviceApp = null;
var globalDeviceName = null;
var globalDeviceEnabled = null;
var globalCameraEnabled = false;

//Handheld Barcode Scanner variables
var globalDataScannerBarcode = null;
var globalTimeScannerBarcode = null;
var globalTypeScannerBarcode = null;
var globalScannerAvailablity = false;
var globalScannerCallback = null;
var globalScannerForm = null;
var ghyperlink = null;
var gappScannerServiceUrl = 'http://localhost:8080'; //Based on Datalogic DXU service that will no longer be supported for new devices.

//Symbol scanner variables
var laserScannerSymbol;

//Honeywell scanner variables
var laserScannerHoneywell;

//Language variable
var msgDeviceOnInfiniteSwipeName = "Name: ";
var msgDeviceOnInfiniteSwipeNumber = "\nNumber: ";
var msgDeviceOnInfiniteSwipeExpire = "\nExpire: ";
var msgDeviceOnInfiniteSwipeTrack1 = "Track 1: ";
var msgDeviceOnInfiniteSwipeTrack2 = "\nTrack 2: ";
var msgDeviceOnInfiniteSwipeTrack3 = "\nTrack 3: ";
var msgcallbackDataZebraPicture = 'Error loading camera';
var msgcloverPayCancelled = 'Payment process cancelled';
var msgDevFailledScan = "Scanner failure: ";
var msgDevScan = "Please enter scancode.";
var msgDevScanError = "scan error: ";
var msgDeviceEnableHSObj = "Failed to enable BarcodeReader";
var msgDeviceEnableHSBufferMsg = "Failed to set setting, Family: ";
var msgDeviceEnableHSBufferKey = ", Key: ";
var msgDeviceEnableHSBufferOption = ", Option: ";
var msgDeviceEnableHSBufferStatus = ", Status: ";
var msgDeviceDisableHS = "Failed to close BarcodeReader";
var msgDeviceMessageHS = " and message: ";

var msgDeviceImgSendSuccess = 'Image was sent to the server successfully';
var msgDeviceImgSendError = 'Failed to send the image to the server. Please check your URL path!';

// INFINITE PERIPHERAL EVENTS
function onInfiniteScan(ev){
	var scan = ev.data;
	DeviceCtrl.scannerDecode(scan.value,'stripCheckInfinite','1');
}

function onInfiniteSwipe(ev){
	var swipe = ev.data;
	if ( swipe.isFinancialCard ){
		alert(msgDeviceOnInfiniteSwipeName + swipe.name + msgDeviceOnInfiniteSwipeNumber + swipe.number + msgDeviceOnInfiniteSwipeExpire + swipe.month + "/" + swipe.year );
	} else {
		alert(msgDeviceOnInfiniteSwipeTrack1 + swipe.track1 + msgDeviceOnInfiniteSwipeTrack2 + swipe.track2 + msgDeviceOnInfiniteSwipeTrack3 + swipe.track3 );
	}
}

try {
	document.addEventListener("BarcodeScanned", onInfiniteScan, false);
	document.addEventListener("MagCardSwiped", onInfiniteSwipe, false);
} catch(err) {
	consoleLog('Infinite devices error: ' + err.message);
}

/// MAIN DEVICE CONTROLLER //////////////////////////////////////////////////////

Ext.define('SMS.controller.Device', {
	extend: 'Ext.app.Controller',

	init: function() {
		consoleLog('Device init');
	},

	launch: function() {
		consoleLog('Device launch');
		DeviceCtrl = this;
		if (DeviceCtrl && AppCtrl) DeviceCtrl.startLoad();
	},

/// WEDGE APPLICATION //////////////////////////////////////////////////////////

	// LOAD CONFIG AT LOGIN
	ProfileConfig: function() {
		globalScanPrefix=BaseCtrl.sessionCur().getConfig('mFloor_MainConfig','scanPrefix');
		globalScanSufix=BaseCtrl.sessionCur().getConfig('mFloor_MainConfig','scanSufix');
		if (!globalScanSufix) globalScanSufix=13;
		if (globalScanPrefix) {
			consoleLog('keypressEvent added!');
			document.addEventListener("keypress", Ext.bind(DeviceCtrl.onKeyEvent, this), true);
		}
		consoleLog('Enable Scan Prefix/Suffix:' + globalScanPrefix + ' ' + globalScanSufix);
	},

	// KEYBOARD EVENTS
	onKeyEvent: function (evt) {
		var key = evt.keyCode ? evt.keyCode : evt.which; // multi browser

		if (evt.target.localName=='input') {
			if (key==globalScanPrefix) {
				evt.cancelBubble = true;
				evt.returnValue = false;
				evt.keyCode = false;
				return false;
			}
		} else if (key==globalScanSufix && globalScanBuffer) {
			var win=Ext.Viewport.getActiveItem();
			var cards = win.down('#cards');
			var card = cards.getActiveItem();
			var edit = card.down('#searchEdit');
			var scanCode = '';
			if (edit) {
				edit.setValue(globalScanBuffer);
				globalScanBuffer = '';
				consoleLog('edit = ' + edit);
				edit.fireEvent('keyup',edit,null,null);
			}
		} else if (key==globalScanPrefix) {
			globalScanBuffer='';
		} else if (key>31 && key<128) {
			globalScanBuffer+=String.fromCharCode(key);
			if (typeof (evt.preventDefault) == 'function') evt.preventDefault();
			if (typeof (evt.stopPropagation) == 'function') evt.stopPropagation();
			if (typeof (evt.stopImmediatePropagation) == 'function') evt.stopImmediatePropagation();
			evt.cancelBubble = true;
//			evt.returnValue = false;
//			evt.keyCode = false;
			return false;
		}

	},

/// SCAN DECODE ////////////////////////////////////////////////////////////////

	scannerDecode: function(scanCode,config) {
		// Strip scan prefix
		if (globalScanPrefix && scanCode.substr(0,1)==String.fromCharCode(globalScanPrefix))
			scanCode = scanCode.substr(1);

		// Strip check digit
		if (!config) config = 'stripCheckDigit';
		var scd = BaseCtrl.sessionCur().getConfig('mFloor_MainConfig',config,'');
		if (scd=='1' && scanCode.length>7) {
			consoleLog('Strip Check Digit on 8+ codes');
			return scanCode.substr(0,scanCode.length-1);
		}
		else if (scanCode.length === 6) {
			consoleLog('UPC-E Convert');
			return BaseCtrl.UPCConvertUpcE(scanCode);
		}
		else {
			consoleLog('No Action');
			return scanCode;
		}
	},

//// ENABLE/DISABLE SCANNER HANDHELD BEHAVIOR  //////////////////////////////////

	enableHandheldScanners: function (form,listForm,callback) {

		if (form && listForm && listForm.indexOf(form.xtype) != -1) {
			globalScannerCallback = callback;
			globalScannerForm = form;
			DeviceCtrl.enableDryRainBrowserScanner();
		}
	},

	disableHandheldScanners: function (form,listForm) {
		var formExist = false;

		if (form && listForm && listForm.indexOf(form.xtype) != -1) {
			formExist = true;
		}

		if (!formExist) {
			globalScannerCallback=null;
			globalScannerForm = null;
			DeviceCtrl.disableDryRainBrowserScanner();
		}
	},

	closeAllScanners: function () {
		DeviceCtrl.closeSymbolScanner();
		DeviceCtrl.closeHoneywellScanner();
		DeviceCtrl.disableDryRainBrowserScanner();
		globalScannerAvailablity = false;
	},

	getResultStatus: function() {
		return globalScannerAvailablity;
	},

	//Barcode data
	getScannerData: function() {
		return globalDataScannerBarcode;
	},

	//Barcode type
	getScannerType: function() {
		return globalTypeScannerBarcode;
	},

	//Barcode time of the scan
	getScannerTime: function() {
		return globalTimeScannerBarcode;
	},

//// dryrain FUNCTIONS //////////////////////////////////////////////////////////
	/**
	 * Enable the scanner if using DryRain browser,
	 * if not do nothing.
	**/
	enableDryRainBrowserScanner: function () {
		var enableScanner = false;
		//Check to make sure we are running in a Dryrain Browser App
		if (typeof window['DT_DecoderHardwarePowerRequest'] == 'function') {
			//ENABLE the scanning HARDWARE
			DT_DecoderHardwarePowerRequest(true, "All", null);
			enableScanner = true;
		}
		return enableScanner;
	},

	/**
	 * Disable the scanner if using DryRain browser,
	 * if not do nothing.
	**/
	disableDryRainBrowserScanner: function () {
		var disableScanner = false;
		//Check to make sure we are running in a Dryrain Browser App
		if (typeof window['DT_DecoderHardwarePowerRequest'] == 'function') { 
			//DISABLE the scanning HARDWARE
			DT_DecoderHardwarePowerRequest(false, "All", null);
			disableScanner = true;
		}
		return disableScanner;
	},

/// CONTROL SCANNER WEDGE THROUGH DXU AGENT FOR DATALOGIC /////////////////////////

	initializeDatalogicScanner: function () {
	
		DeviceCtrl.scanAddDatalogic_StartListener();
		DeviceCtrl.scanAddDatalogic_StopListener();
		DeviceCtrl.scanAddDatalogic_TimeoutListener();
		DeviceCtrl.scanAddDatalogic_ReadListener();
	},

	scanAddDatalogic_ReadListener: function() {
		consoleLog('scanAddDatalogic_ReadListener');
		Ext.Ajax.setTimeout(30000);
		Ext.Ajax.request({
			url: gappScannerServiceUrl + '/scan?action=read_listener&output=json',
			method: 'GET',
			callback: function(response,evt,evt2,evt3,evt4) {
				try {
					//console.dir(response);
					// console.dir(evt2);
					DeviceCtrl.scanAddDatalogic_ReadListener();
				} catch (err) {
					globalScannerAvailablity = false;
					consoleLog('DeviceCtrl.scanAddDatalogic_ReadListener Datalogic  read listener: ' + err.message);
				}
			}
		});
	},

	scanAddDatalogic_StartListener: function() {
		consoleLog('scanAddDatalogic_StartListener');
		Ext.Ajax.setTimeout(30000);
		Ext.Ajax.request({
			url: gappScannerServiceUrl + '/scan?action=start_listener',
			method: 'GET',
			callback: function(response,evt,evt2) {
				try {
					DeviceCtrl.scanAddDatalogic_StartListener();
				} catch (err) {
					globalScannerAvailablity = false;
					consoleLog('DeviceCtrl.scanAddDatalogic_StartListener Datalogic  start listener: ' + err.message);
				}
			}
		});
	},

	scanAddDatalogic_StopListener: function() {
		consoleLog('scanAddDatalogic_StopListener');
		Ext.Ajax.setTimeout(30000);
		Ext.Ajax.request({
			url: gappScannerServiceUrl + '/scan?action=stop_listener',
			method: 'GET',
			callback: function(response,evt,evt2) {
				try {
					DeviceCtrl.scanAddDatalogic_StopListener();
				} catch (err) {
					globalScannerAvailablity = false;
					consoleLog('DeviceCtrl.scanAddDatalogic_StopListener Datalogic  stop listener: ' + err.message); 
				}
			}
		});
	},

	scanAddDatalogic_TimeoutListener: function() {
		consoleLog('scanAddDatalogic_TimeoutListener');
		Ext.Ajax.setTimeout(30000);
		Ext.Ajax.request({
			url: gappScannerServiceUrl + '/scan?action=timeout_listener',
			method: 'GET',
			callback: function(response,evt,evt2) {
				try {
					DeviceCtrl.scanAddDatalogic_TimeoutListener();
				} catch (err) {
					globalScannerAvailablity = false;
					consoleLog('DeviceCtrl.scanAddDatalogic_TimeoutListener Datalogic  Timeout listener: ' + err.message);
				}
			}
		});
	},

	/**
	 * Initialize Datalogic scanner handling using
	 * Intent com.datalogic.decodewedge.decode_action
	**/
	initializeIntentDatalogicScanner: function () {
		consoleLog('DeviceCtrl.initializeIntentDatalogicScanner');
		try {
			window.plugins.intentShim.registerBroadcastReceiver({
					filterActions: 'com.datalogic.decodewedge.decode_action',
					filterCategories: 'com.datalogic.decodewedge.decode_category'
				},
				function (intent) {
					console.log('Received broadcast intent');
					DeviceCtrl.callbackDataDatalogicScanned(intent.extras);
				}
			);
		} catch (err) {
			consoleLog('Datalogic deviceready error: ' + err.message);
		}
	},

	/**
	 * Handle barcode data when available
	 * for initializeIntentDatalogicScanner
	**/
	callbackDataDatalogicScanned: function (extras) {

		if (extras.barcode_string) {
			globalDataScannerBarcode = DeviceCtrl.scannerDecode(extras.barcode_string, 'stripCheckDatalogic', '1');
			console.log('DeviceCtrl.callbackDataCloverScanned: Scan decode value =' + globalDataScannerBarcode);
		}

		if (extras.barcode_type) {
			globalTypeScannerBarcode = extras.barcode_type;
		}

		if (globalScannerCallback) globalScannerCallback(globalScannerForm, globalDataScannerBarcode);
	},

//// ZEBRA SYMBOL FUNCTIONS /////////////////////////////////////////////////////

	/**
	 * Initialize Zebra scanner handling using
	 * Zebra Enterprise browser
	**/
	initializeSymbolScanner: function () {
		var laserScannerProperties = {allDecoders:true,autoEnter:true,decodeVolume:4};

		try {
			laserScannerSymbol = Object.create(EB.Barcode);
			if (laserScannerSymbol) {
				console.log('DeviceCtrl.initializeSymbolScanner: Initializing the Symbol Scanner!');
				globalScannerAvailablity = true;
				laserScannerSymbol.disable();

				//Add properties scanner (laserScannerProperties)
				//loads default values for the scanner.
				consoleLog('DeviceCtrl.initializeSymbolScanner: Loading Symbol scanner with symbologies!');
				laserScannerSymbol.enable(laserScannerProperties, function (e) {
					DeviceCtrl.callbackDataSymbolScanned(e);
				});
			} else {
				globalScannerAvailablity = false;
				console.log('DeviceCtrl.initializeSymbolScanner: fail to initialize the Symbol Scanner!');
			}
		} catch (err) {
			globalScannerAvailablity = false;
			consoleLog('DeviceCtrl.initializeSymbolScanner Symbol scanner error: ' + err.message);
		}
	},

	/**
	 * Handle barcode data when available
	 * Zebra Enterprise browser
	**/
	callbackDataSymbolScanned: function (e) {
		if (e.data != '' && e.time != '') {

			//Set the time for the scan code
			globalTimeScannerBarcode = e.time;

			//Get the barcode
			globalDataScannerBarcode = DeviceCtrl.scannerDecode(e.data, 'stripCheckZebra', '1');
			if (globalDataScannerBarcode)
				consoleLog('DeviceCtrl.callbackDataSymbolScanned: Scan decode value =' + globalDataScannerBarcode);

			if (globalScannerCallback && globalDataScannerBarcode) globalScannerCallback(globalScannerForm,globalDataScannerBarcode);
		}
	},

	/**
	 * Initialize Zebra scanner handling using
	 * Intent com.zebra.locsoftwaremfloor.ACTION
	**/
	initializeIntentSymbolScanner: function () {
		consoleLog('DeviceCtrl.initializeIntentSymbolScanner');
		try {
			window.plugins.intentShim.registerBroadcastReceiver({
				filterActions: [
					'com.zebra.locsoftwaremfloor.ACTION',
					'com.symbol.datawedge.api.RESULT_ACTION'
				],
				filterCategories: [
					'com.android.intent.category.DEFAULT'
				]
			},
				function (intent) {
					console.log('Received broadcast intent: ' + JSON.stringify(intent.extras));
					DeviceCtrl.callbackDataZebraScanned(intent.extras);
				}
			);
		} catch (err) {
			consoleLog('Phoneghap deviceready error: ' + err.message);
		}
	},

	/**
	 * Handle barcode data when available
	 * for initializeIntentSymbolScanner
	**/
	callbackDataZebraScanned: function (extras) {
		if (extras["com.symbol.datawedge.data_string"]) {
			globalDataScannerBarcode = DeviceCtrl.scannerDecode(extras["com.symbol.datawedge.data_string"], 'stripCheckZebra', '1');
			consoleLog('DeviceCtrl.callbackDataCloverScanned: Scan decode value =' + globalDataScannerBarcode);
		}

		if (extras["com.symbol.datawedge.label_type"]) {
			globalTypeScannerBarcode = extras["com.symbol.datawedge.label_type"];
		}

		if (globalScannerCallback) globalScannerCallback(globalScannerForm, globalDataScannerBarcode);
	},

	/**
	 * Disable scanner on devices
	**/
	closeSymbolScanner: function () {
		try {
			if (laserScanner && globalScannerAvailablity) {
				laserScannerSymbol.disable();
				consoleLog('Closing the Scanner Symbol!');
			}
		}
		catch(err) {
			consoleLog('Device disable scanner Symbol error: ' + err.message);
		}
	},

	/**
	 * Take pictures with default camera
	**/
	takePictureZebraSymbol: function () {
		var camArray = EB.Camera.enumerate();


		consoleLog('....taking picture with camera');

		// Capture an image from the default camera on the device, using the default image settings
		camArray[0].takePicture({}, DeviceCtrl.callbackDataZebraPicture);
	},

	/**
	 * Callback fired by network api after image
	 * upload to the server is completed.
	**/
	callbackDataZebraPicture: function (data) {
		if (data && data.imageUri)
			consoleLog('Taking picture:' + data.imageUri);

		//set the upload file properties; Refer network module for more details
		if (data && data.imageUri) {
			var uploadfileProps = {
				url: ghyperlink,
				filename: data.imageUri,
				body: "uploading file",
				fileContentType: "image/jpeg"
			};

			//below is the network module API used for uploading images when camera fire the callback
			EB.Network.uploadFile(uploadfileProps, DeviceCtrl.callbackUpdateImage);
		} else {
			if (data.status  && data.status.indexOf('error') !== -1)
				ExecCtrl.entryWarning(msgcallbackDataZebraPicture + ': ' + data.message);
			else
				ExecCtrl.entryWarning(msgcallbackDataZebraPicture);
		}
	},

	/**
	 * Callback fired by network API after image
	 * upload to the server is completed
	 */
	callbackUpdateImage: function () {
		
		//Getting the default arguments of the function
		var status = arguments[0]['status'];
		var body = arguments[0]['body'];
		
		//parsing the body received in form of string into XML
		var oParser = new DOMParser();
		var oDOM = oParser.parseFromString(body, "application/xml");

		//a status ok indicates image transferred successfully
		if (status === 'ok') {
			consoleLog('Uploading picture to server...');
			ExecCtrl.entryWarning(msgDeviceImgSendSuccess);
			ExecCtrl.processXmlHooks(null, oDOM);
		} else {
			ExecCtrl.entryWarning(msgDeviceImgSendError);
		}
	},

//// SCAN LASER HOENYWELL BEHAVIOR  /////////////////////////////////////////////

	initializeHoneywellScanner: function () {

		try {
			laserScannerHoneywell = new BarcodeReader(null, function (result) {
				if (result.status === 0) {
					globalScannerAvailablity = true;

					// BarcodeReader object was successfully created.
					// Configure the symbologies needed. Buffer the settings
					// and commit them at once.
					laserScannerHoneywell.setBuffered("Symbology", "Code39", "Enable", "true");
					laserScannerHoneywell.setBuffered("Symbology", "Code128", "EnableCode128", "true");
					laserScannerHoneywell.commitBuffer(DeviceCtrl.onCommitComplete);

					// Add an event handler for the barcodedataready event
					laserScannerHoneywell.addEventListener("barcodedataready", function(data,type,time){
						// Handle barcode data when available.
						DeviceCtrl.callbackDataHoneywellScanned(data, type, time);
					}, false);
				} else {
					consoleLog('DeviceCtrl.enableHoneywellScanner: Honeywell scanner error status ' + result.status);
				}
			});
		} catch (err) {
			globalScannerAvailablity = false;
			consoleLog('DeviceCtrl.initializeHoneywellScanner: Honeywell scanner error ' + err.message);
		}
	},

	//Handle barcode data when available
	callbackDataHoneywellScanned: function (data, type, time) {
		if (data) {
			globalDataScannerBarcode = DeviceCtrl.scannerDecode(data, 'stripCheckHoneyWell', '1');
			console.log('DeviceCtrl.callbackDataHoneywellScanned: Scan decode value =' + globalDataScannerBarcode);
		}
		if (type) {
			globalTypeScannerBarcode = type;
		}
		if (time) {
			globalTimeScannerBarcode = time;
		}

		if (globalScannerCallback) globalScannerCallback(globalScannerForm, globalDataScannerBarcode);
	},

	closeHoneywellScanner: function (result) {
		try {
			if (laserScannerHoneywell && globalScannerAvailablity) {
				//close the scanner
				laserScannerHoneywell.close(function(close){
					if (close.status === 0)
						consoleLog('DeviceCtrl.disableHoneywellScanner: Honeywell scanner close, status = ' + close.status + ', message = ' + close.message);
					else
						consoleLog('DeviceCtrl.disableHoneywellScanner: Failed to close the Honeywell scanner, status = ' + close.status + ', message = ' + close.message);
				});
			}
		} catch (err) {
			consoleLog('Device.disableHoneywellScanner: Honeywell scanner error ' + err.message);
		}
	},

	onCommitComplete: function (resultArray) {
		var resultStatus = false;
		var result;
		var msgAlert;

		try {
			if (resultArray.length > 0) {
				for (var i = 0; i < resultArray.length; i++) {
					result = resultArray[i];
					if (result.status === 0) {
						resultStatus = true;
					}
				} //endfor
				if (resultStatus) {
					consoleLog('DeviceCtrl.enableHoneywellScanner: Loading the symbologies of the Honeywell Scanner!');
				} else {
					consoleLog('Device.enableHoneywellScanner Honeywell scanner commitBuffer symbologies faillure');
					if(result.method === "getBuffered" || result.method === "setBuffered") {
						msgAlert = msgDeviceEnableHSBufferMsg + resultArray[i].family;
						msgAlert += msgDeviceEnableHSBufferKey + resultArray[i].key;
						msgAlert += msgDeviceEnableHSBufferOption + resultArray[i].option;
						msgAlert += msgDeviceEnableHSBufferStatus + resultArray[i].status;
						msgAlert += msgDeviceMessageHS + resultArray[i].message;
						consoleLog(msgAlert);
						alert(msgAlert);
					}
				}
			}
		} catch (err) {
			consoleLog('Device.onSetBufferedComplete Honeywell scanner error in enableHoneywellScanner: ' + err.message);
		} finally {
			//destroy reference object
			msgAlert = null;
		}
	},

	//// SCAN BLUEBIRD BEHAVIOR  /////////////////////////////////////////////

	initializeBluebirdScanner: function () {
		consoleLog('DeviceCtrl.initializeBluebirdScanner');
		try {
			window.plugins.intentShim.registerBroadcastReceiver({
				filterActions: [
					'kr.co.bluebird.android.bbapi.action.BARCODE_CALLBACK_DECODING_DATA'
				]
				},
				function(intent) {
					console.log('Received broadcast intent: ' + JSON.stringify(intent.extras));
					DeviceCtrl.callbackDataBluebirdScanned(intent.extras);
				}
			);
		} catch(err) {
			consoleLog('Phoneghap deviceready error: ' + err.message);
		}
	},

	//Handle barcode data when available
	callbackDataBluebirdScanned: function (extras) {

		if(extras.EXTRA_BARCODE_DECODING_DATA) {
			//Convert data ASCII to String
			var barcode = String.fromCharCode.apply(null, extras.EXTRA_BARCODE_DECODING_DATA);
			console.log(barcode);
			globalDataScannerBarcode = DeviceCtrl.scannerDecode(barcode, 'stripCheckBlueBird', '1');
			console.log('DeviceCtrl.callbackDataBluebirdScanned: Scan decode value =' + globalDataScannerBarcode);
		}
		//Symbology
		if (extras.EXTRA_INT_DATA2) {
			globalTypeScannerBarcode = extras.EXTRA_INT_DATA2;
		}

		if (globalScannerCallback) globalScannerCallback(globalScannerForm, globalDataScannerBarcode);
	},

//// SCAN CLOVER BEHAVIOR  /////////////////////////////////////////////

	initializeCloverScanner: function () {
		consoleLog('DeviceCtrl.initializeCloverScanner');
		try {
			window.plugins.intentShim.registerBroadcastReceiver({
				filterActions: [
					'com.clover.BarcodeBroadcast'
				]
				},
				function(intent) {
					console.log('Received broadcast intent: ' + JSON.stringify(intent.extras));
					// Intent extras :
					// "Barcode" ex."000000000109"
					// "BarcodeType" ex."8"
					DeviceCtrl.callbackDataCloverScanned(intent.extras);
				}
			);
		} catch(err) {
			consoleLog('Phoneghap deviceready error: ' + err.message);
		}
	},

	//Handle barcode data when available
	callbackDataCloverScanned: function (extras) {

		if(extras.Barcode) {
			globalDataScannerBarcode = DeviceCtrl.scannerDecode(extras.Barcode, 'stripCheckClover', '1');
			console.log('DeviceCtrl.callbackDataCloverScanned: Scan decode value =' + globalDataScannerBarcode);
		}

		if (extras.BarcodeType) {
			globalTypeScannerBarcode = extras.BarcodeType;
		}

		if (globalScannerCallback) globalScannerCallback(globalScannerForm, globalDataScannerBarcode);
	},

	cloverPay: function (amount) {
		try {
			console.log(amount);
			window.plugins.intentShim.startActivityForResult({
				action: "clover.intent.action.MANUAL_PAY",
				extras: {
					"clover.intent.extra.AMOUNT": amount
				},
				requestCode: 1
			},
				function (intent) {

					var url = '';
					var amt = '';
					//console.log(intent);
					console.log(JSON.stringify(intent));
					if (intent.extras.requestCode == 1) {
						if (intent.extras.resultCode == 0) {
							//Transaction canceled
							consoleLog('transaction canceled');
							ExecCtrl.entryWarning(msgcloverPayCancelled);
						}
						else if (intent.extras.resultCode == -1) {
							consoleLog('transaction in progress...');

							//Getting the JSon Payment inside the json object
							var Payment = intent.extras["clover.intent.extra.PAYMENT"];
							Payment = Payment.slice(Payment.indexOf('\'') + 1);
							Payment = Payment.slice(0, Payment.lastIndexOf('\''));
							Payment = 'pay= ' + Payment + ';';

							//Eval the json part extracted fron the json object
							eval(Payment);

							//build the string to send to SMS
							url = 'sqi=mFloor_sell_inv_pay';
							url += '&PAYRCODE=00';
							if (pay.amount > 0) {
								amt = '' + pay.amount;
								amt = amt.substr(0, amt.length - 2) + '.' + amt.substr(amt.length - 2);
								url += '&PAYAMNT=' + amt;
							} else {
								url += '&PAYAMNT=0.00';
							}
							url += '&PAYCASHBACK=';
							var trsDate = new Date();
							var strDate = trsDate.getFullYear();
							var n = trsDate.getMonth() + 1;
							strDate += (n < 10) ? '-' + ('00' + n).slice(-2) : n;
							strDate += '-' + trsDate.getDate();
							strDate += 'T' + trsDate.getHours();
							n = trsDate.getMinutes();
							strDate += (n < 10) ? '-' + ('00' + n).slice(-2) : n;
							url += '&PAYHOSTDATE=' + strDate;
							url += (pay.cardTransaction.authCode) ? '&AUTHID=' + pay.cardTransaction.authCode : '';
							url += (pay.cardTransaction.extra.authorizingNetworkName) ? '&PAYAPN=' + pay.cardTransaction.extra.authorizingNetworkName : '';
							url += (pay.cardTransaction.extra.applicationIdentifier) ? '&EMVAID=' + pay.cardTransaction.extra.applicationIdentifier : '';
							url += (pay.cardTransaction.referenceId) ? '&PAYAUTHINFO=' + pay.cardTransaction.referenceId : '';
							url += (pay.cardTransaction.transactionNo) ? '&PAYSEQUENCE=' + pay.cardTransaction.transactionNo : '';
							switch (pay.cardTransaction.entryType) {
								case 'SWIPED':
									url += '&PAYENTRYTYPE=S';
									break;
								case 'KEYED':
									url += '&PAYENTRYTYPE=M';
									break;
								case 'VOICE':
									url += '&PAYENTRYTYPE=M';
									break;
								case 'VAULTED':
									url += '&PAYENTRYTYPE=O';
									break;
								case 'OFFLINE_SWIPED':
									url += '&PAYENTRYTYPE=F';
									break;
								case 'OFFLINE_KEYED':
									url += '&PAYENTRYTYPE=G';
									break;
								case 'EMV_CONTACT':
									url += '&PAYENTRYTYPE=E';
									break;
								case 'EMV_CONTACTLESS':
									url += '&PAYENTRYTYPE=R';
									break;
								case 'MSD_CONTACTLESS':
									url += '&PAYENTRYTYPE=R';
									break;
								case 'PINPAD_MANUAL_ENTRY':
									url += '&PAYENTRYTYPE=M';
									break;
								default:
									url += '&PAYENTRYTYPE=E';
							}
							url += '&PAYTRANCODE=0';
							url += (pay.cardTransaction.token) ? '&Paytoken=' + pay.cardTransaction.token : '';
							url += (pay.cardTransaction.first6) ? '&PAYTRACK=' + pay.cardTransaction.first6 + '******' : '';
							url += (pay.cardTransaction.first6 && pay.cardTransaction.last4) ? pay.cardTransaction.last4 + '=****' : '';

							ExecCtrl.entrySendUrl(url);
						}
					}
				},
				function () {
					console.log("Cannot launch Clover MANUAL_PAY.");
				}
			);
		} catch (err) {
			consoleLog('Phoneghap device ready error: ' + err.message);
		}

	},

//// SCAN CAM BUTTON ///////////////////////////////////////////////////

	scannerCamBtnClick: function(btn,callback) {
		if (Ext.browser.is.PhoneGap) {
			cordova.plugins.barcodeScanner.scan(
				// success
				function(result) {
					var code = DeviceCtrl.scannerDecode(result.text,'stripCheckPhonegap','1');
					code = (code.length < 8) ? code.replace(/^0+/, '') : code;
					callback(btn,code);
				},
				// error
				function(message) {
					console.log(msgDevFailledScan + message);
					ExecCtrl.entryError(msgDevScanError + message);
				}
			);
		}
		else {
			var code = prompt(msgDevScan, '');
			if (code) {
				code = DeviceCtrl.scannerDecode(code);
				callback(btn,code);
			}
		}

	},

//// PICTURE HANDLING //////////////////////////////////////////////////

	/**
	 * Upload selected image from device to server
	**/
	uploadPicture: function(pic,script) {

		if (pic) {
			//Load script too process the image
			ghyperlink = appServerSms + '/scripts/trs.exe?'+BaseCtrl.sessionCur().getSessionStr();
			ghyperlink += (script) ? '&' + script : '&cgi=mFloor_itm_mod_bmp.xml';

			var data = pic.getImageDataUrl();
			if (data) {
				data = data.substr(data.indexOf(',')+1);
				var byteString = atob(data);
				var ab = new ArrayBuffer(byteString.length);
				var ia = new Uint8Array(ab);
				var i = 0;
				for (i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
				file = new Blob([ab],{type: 'image/jpeg'});
				var formData = new FormData();
				var fileName = 'INV_'+BaseCtrl.sessionCur().getConfig('session', 'F1185')+'.jpg';
				formData.append('file',file, fileName);

				var progressIndicator = Ext.create("Ext.ProgressIndicator",{
					loadingText: "Uploading: {percent}%"
				});

				var request = {
					url: ghyperlink,
					method: 'POST',
					xhr2: true,
					rawData: formData,
					progress: progressIndicator,
					success: function(response) {
						ExecCtrl.processXmlHooks(null,response.responseXML);
						consoleLog('Image successfully uploaded...');
					},
					failure: function(form, response) {
						//alert(response.message);
						alert('Image not supported!');
					}
				};

				//form submit
				Ext.Ajax.request(request);
			}
		}
	},

	/**
	 * Taking picture with camera
	 * Uploading image to server.
	**/
	takePicture: function(script,quality) {

		//Load script too process the image
		ghyperlink = appServerSms + '/scripts/trs.exe?'+BaseCtrl.sessionCur().getSessionStr();
		ghyperlink += (script) ? '&' + script : '&cgi=mFloor_itm_mod_bmp.xml';

		//Take a picture on PhoneGap
		if (Ext.browser.is.PhoneGap) {
			DeviceCtrl.takePicturePhoneGap(quality);
		} else {
			//Take picture on other devices.
			var devName = appDeviceName;
			devName = (devName && devName != '') ?  devName : DeviceCtrl.getDeviceName() ;
			if (devName == 'Zebra') {
				DeviceCtrl.takePictureZebraSymbol();
			} else {
				ExeCtrl.entryWarning('mFloor does not handle picture updload on this deivces');
			}
		}
	},


	/**
	 * Taking picture with Phonegap
	 * and sending to server.
	**/
	takePicturePhoneGap: function(quality) {

		var cameraOptions = {
			quality : 75,
			destinationType : Camera.DestinationType.DATA_URL ,
			sourceType : Camera.PictureSourceType.CAMERA,
			cameraDirection : Camera.Direction.FRONT,
			allowEdit : false,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 500,
			targetHeight: 500,
			correctOrientation: true,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false
		};

		if (quality==2) {
			cameraOptions.quality=100;
			cameraOptions.targetWidth=1000;
			cameraOptions.targetHeight=1000;
		}
		else
		if (quality>2) {
			cameraOptions.quality=100;
			cameraOptions.targetWidth=2000;
			cameraOptions.targetHeight=2000;
		}

		consoleLog('TAKE PICTURE');
		navigator.camera.getPicture(function(imageURI) {
			var byteString = atob(imageURI);
			var ab = new ArrayBuffer(byteString.length);
			var ia = new Uint8Array(ab);
			var i = 0;

			for (i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

			file = new Blob([ab],{type: 'image/jpeg'});

			//Build data to send
			var formData = new FormData();
			var fileName = BaseCtrl.hotPoolGet('F01') + '.jpg';
			formData.append('file',file, fileName);

			var progressIndicator = Ext.create("Ext.ProgressIndicator",{
				loadingText: "Uploading: {percent}%"
			});

			consoleLog('PICTURE UPLOAD:'+ ghyperlink);
			var request = {
				url: ghyperlink,
				method: 'POST',
				xhr2: true,
				rawData: formData,
				progress: progressIndicator,
				success: function(response) {
					ExecCtrl.processXmlHooks(null,response.responseXML);
					consoleLog('Image successfully uploaded...');
				},
				failure: function(response) {
					//alert(response.message);
					alert('Image not supported!');
				}
			};

			//form submit
			Ext.Ajax.request(request);

		}, function(err) {
			alert(err);
		},
		cameraOptions);

	},

/// START DEVICES ///////////////////////////////////////////////////////////////

	startLoad: function() {
		consoleLog('navigator.userAgent = ' + navigator.userAgent);

		this.getDeviceOS();
		this.getDeviceModel();
		this.getDeviceName();
		this.getDeviceApp();

		this.initializeHardware();
	},

	initializeHardware: function () {
		var deviceEnabled = null;

		if (typeof window['DT_DecoderHardwarePowerRequest'] == 'function') {
			deviceEnabled = 'DryRain EB';
			globalDeviceEnabled = 'DRYRAIN';
			globalCameraEnabled = false;
		} else if (globalDeviceApp == 'Phonegap' && globalDeviceName == 'Zebra') {
			DeviceCtrl.initializeIntentSymbolScanner();
			deviceEnabled = 'Zebra Intent';
			globalDeviceEnabled = 'IntentZebra';
			globalCameraEnabled = true;
		} else if (globalDeviceApp == 'Phonegap' && globalDeviceName == 'Datalogic') {
			DeviceCtrl.initializeIntentDatalogicScanner();
			deviceEnabled = 'Datalogic Intent';
			globalDeviceEnabled = 'IntentDatalogic';
			globalCameraEnabled = true;
		} else if (globalDeviceApp == 'Phonegap' && globalDeviceName == 'Bluebird') {
			DeviceCtrl.initializeBluebirdScanner();
			deviceEnabled = 'Bluebird Intent';
			globalDeviceEnabled = 'IntentBluebird';
			globalCameraEnabled = true;
		} else if (globalDeviceApp == 'Phonegap' && globalDeviceName == 'Clover') {
			DeviceCtrl.initializeCloverScanner();
			deviceEnabled = 'Clover Intent';
			globalDeviceEnabled = 'IntentClover';
			globalCameraEnabled = true;

		//Load EB for available device
		} else if (globalDeviceOS == 'Android' && globalDeviceName == 'Zebra') {
			DeviceCtrl.initializeSymbolScanner();
			deviceEnabled = 'Zebra EB';
			globalDeviceEnabled = 'EBZebra';
			globalCameraEnabled = true;

		//Load EB for available device
		} else if (globalDeviceOS == 'Android' && globalDeviceName == 'Honeywell') {
			DeviceCtrl.initializeHoneywellScanner();
			deviceEnabled = 'Honeywell EB';
			globalDeviceEnabled = 'EBHoneywell';

		//Load EB for available device
		} else if (globalDeviceOS == 'Android' && globalDeviceName == 'Datalogic') {
			DeviceCtrl.initializeDatalogicScanner();
			deviceEnabled = 'Datalogic Service';
			globalDeviceEnabled = 'ServiceDatalogic';
		} else if (globalDeviceApp == 'Phonegap' && globalDeviceOS == 'Android') {
			deviceEnabled = 'Phonegap wrapper';
			globalDeviceEnabled = 'APIPhonegap';
			globalCameraEnabled = true;
		}

		if (deviceEnabled)
			consoleLog('Device information: ' + deviceEnabled + ' enabled');
		else
			consoleLog('Device information: There is no device enabled for scanner control in this application');

		if (globalCameraEnabled)
			consoleLog('Device information: the camera is available on this device');
		else
			consoleLog('Device information: the camera is not available on this device');

	},

	getDeviceOS: function() {
		globalDeviceOS = 'Unknown OS';

		if (navigator.appVersion.indexOf('Win')!=-1) globalDeviceOS = 'Windows';
		if (navigator.appVersion.indexOf('Win32')!=-1) globalDeviceOS = 'Windows32';
		if (navigator.appVersion.indexOf('Win64')!=-1) globalDeviceOS = 'Windows64';
		if (navigator.appVersion.indexOf('Mac')!=-1) globalDeviceOS = 'MacOS';
//		if (navigator.appVersion.indexOf('X11')!=-1) globalDeviceOS = 'UNIX';
//		if (navigator.appVersion.indexOf('Linux')!=-1) globalDeviceOS = 'Linux';
		if (navigator.appVersion.indexOf('Android')!=-1) globalDeviceOS = 'Android';

		if (globalDeviceOS)
			consoleLog('Device information: device OS = ' + globalDeviceOS);
		else
			consoleLog('Device information: unknown OS');

	},

	getDeviceModel: function () {
		var model = navigator.appVersion.toUpperCase()

		/**
		 * Datalogic devices
		 */
		if (model.indexOf('DL-AXIS')!=-1) globalDeviceModel = 'DL-AXIS';
		if (model.indexOf('FALCON')!=-1) globalDeviceModel = 'FALCON';
		if (model.indexOf('MEMOR')!=-1) globalDeviceModel = 'MEMOR';
		if (model.indexOf('JOYA')!=-1) globalDeviceModel = 'JOYA';
		if (model.indexOf('SKORPIO')!=-1) globalDeviceModel = 'SKORPIO';

		/**
		 * Bluebird devices
		 */
		if (model.indexOf('BP50')!=-1) globalDeviceModel = 'BP50';
		if (model.indexOf('BM180')!=-1) globalDeviceModel = 'BM180';
		if (model.indexOf('EF400')!=-1) globalDeviceModel = 'EF400';
		if (model.indexOf('EF500')!=-1) globalDeviceModel = 'EF500';
		if (model.indexOf('RFR900')!=-1) globalDeviceModel = 'RFR900';
		if (model.indexOf('RT100')!=-1) globalDeviceModel = 'RT100';
		if (model.indexOf('RP350')!=-1) globalDeviceModel = 'RP350';
		if (model.indexOf('ST080')!=-1) globalDeviceModel = 'ST080';
		if (model.indexOf('ST100')!=-1) globalDeviceModel = 'ST100';
		if (model.indexOf('SF550')!=-1) globalDeviceModel = 'SF550';

		/**
		 * Honeywell devices
		 */
		if (model.indexOf('CK65')!=-1) globalDeviceModel = 'CK65';
		if (model.indexOf('CK75') != -1) globalDeviceModel = 'CK75';
		if (model.indexOf('CN51') != -1) globalDeviceModel = 'CN51';
		if (model.indexOf('CN75') != -1) globalDeviceModel = 'CN75';
		if (model.indexOf('CN80')!=-1) globalDeviceModel = 'CN80';
		if (model.indexOf('CT40')!=-1) globalDeviceModel = 'CT40';
		if (model.indexOf('CT50')!=-1) globalDeviceModel = 'CT50';
		if (model.indexOf('CT60')!=-1) globalDeviceModel = 'CT60';

		/**
		 * Zebra devices
		 */
		if (model.indexOf('M60') != -1) globalDeviceModel = 'EC30';
		if (model.indexOf('M60') != -1) globalDeviceModel = 'EC50';
		if (model.indexOf('M60') != -1) globalDeviceModel = 'EC55';
		if (model.indexOf('M60') != -1) globalDeviceModel = 'M60';
		if (model.indexOf('MC32')!=-1) globalDeviceModel = 'MC32';
		if (model.indexOf('MC33')!=-1) globalDeviceModel = 'MC33';
		if (model.indexOf('MC40')!=-1) globalDeviceModel = 'MC40';
		if (model.indexOf('MC55')!=-1) globalDeviceModel = 'MC55';
		if (model.indexOf('MC67')!=-1) globalDeviceModel = 'MC67';
		if (model.indexOf('MC93') != -1) globalDeviceModel = 'MC93';
		if (model.indexOf('TC20')!=-1) globalDeviceModel = 'TC20';
		if (model.indexOf('TC20')!=-1) globalDeviceModel = 'TC21';
		if (model.indexOf('TC25')!=-1) globalDeviceModel = 'TC25';
		if (model.indexOf('TC25')!=-1) globalDeviceModel = 'TC26';
		if (model.indexOf('TC50')!=-1) globalDeviceModel = 'TC50';
		if (model.indexOf('TC51')!=-1) globalDeviceModel = 'TC51';
		if (model.indexOf('TC52')!=-1) globalDeviceModel = 'TC52';
		if (model.indexOf('TC55')!=-1) globalDeviceModel = 'TC55';
		if (model.indexOf('TC56')!=-1) globalDeviceModel = 'TC56';
		if (model.indexOf('TC57')!=-1) globalDeviceModel = 'TC57';
		if (model.indexOf('TC70')!=-1) globalDeviceModel = 'TC70';
		if (model.indexOf('TC70x')!=-1) globalDeviceModel = 'TC70x';
		if (model.indexOf('TC72')!=-1) globalDeviceModel = 'TC72';
		if (model.indexOf('TC75')!=-1) globalDeviceModel = 'TC75';
		if (model.indexOf('TC77')!=-1) globalDeviceModel = 'TC77';
		if (model.indexOf('TC83') != -1) globalDeviceModel = 'TC83';
		if (model.indexOf('TC21') != -1) globalDeviceModel = 'TC21';

		/**
		 * Clover devices
		 */
		if (model.indexOf('C100')!=-1) globalDeviceModel = 'C100';
		if (model.indexOf('C201')!=-1) globalDeviceModel = 'C201';
		if (model.indexOf('C201')!=-1) globalDeviceModel = 'C201';
		if (model.indexOf('C300')!=-1) globalDeviceModel = 'C300';
		if (model.indexOf('C301')!=-1) globalDeviceModel = 'C301';
		if (model.indexOf('C401U')!=-1) globalDeviceModel = 'C401U';
		if (model.indexOf('C403') != -1) globalDeviceModel = 'C403';
		
		if (globalDeviceModel)
			consoleLog('Device information: device model = ' + globalDeviceModel);
		else
			consoleLog('Device information: device model = Unkown');
	},

	getDeviceName: function () {
		var devName = appDeviceName;

		if (globalDeviceModel != null) {
			switch (globalDeviceModel) {
				/**
				 * Datalogic Models
				 **/
				case 'DL-AXIS':
				case 'FALCON':
				case 'MEMOR':
				case 'JOYA':
				case 'SKORPIO':
					globalDeviceName = 'Datalogic';
					break;

				/**
				 * Bluebird Models:
				 **/
				case 'BP50':
				case 'BM180':
				case 'EF400':
				case 'EF500':
				case 'RFR900':
				case 'RT100':
				case 'RP350':
				case 'ST080':
				case 'ST100':
				case 'SF550':
					globalDeviceName = 'Bluebird';
					break;


				/**
				 * Honeywell Models
				 **/
				case 'CK65':
				case 'CK75':
				case 'CN51':
				case 'CN75':
				case 'CN80':
				case 'CT40':
				case 'CT50':
				case 'CT60':
					globalDeviceName = 'Honeywell';
					break;

				/**
				 * Zebra Models
				 **/
				case 'EC30':
				case 'EC50':
				case 'EC55':
				case 'M60':
				case 'MC32':
				case 'MC33':
				case 'MC40':
				case 'MC55':
				case 'MC67':
				case 'MC93':
				case 'TC20':
				case 'TC21':
				case 'TC25':
				case 'TC26':
				case 'TC50':
				case 'TC51':
				case 'TC52':
				case 'TC55':
				case 'TC56':
				case 'TC57':
				case 'TC70':
				case 'TC70x':
				case 'TC72':
				case 'TC75':
				case 'TC77':
				case 'TC83':
					globalDeviceName = 'Zebra';
					break;

				/**
				 * Clover Models
				 **/
				case 'C100':
				case 'C201':
				case 'C300':
				case 'C301':
				case 'C401U':
				case 'C403':	
					globalDeviceName = 'Clover';
					break;
				default:
					globalDeviceName = (devName) ?  devName : 'Android' ;
			}
		}

		if (!globalDeviceName) {
			globalDeviceName = appDeviceName
		}

		if (globalDeviceName)
			consoleLog('Device information: device name = ' + globalDeviceName);
		else
			consoleLog('Device information: device name = Unkown');
	},

	getDeviceApp: function() {

		if (Ext.browser.is.PhoneGap) {
			globalDeviceApp = 'Phonegap';
		} else {
			if (navigator.appVersion.indexOf('Opera')!=-1) globalDeviceApp = 'Opera';
			if (navigator.appVersion.indexOf('MSIE')!=-1) globalDeviceApp = 'MSIE';
			if (navigator.appVersion.indexOf('Safari')!=-1) globalDeviceApp = 'Safari';
			if (navigator.appVersion.indexOf('Firefox')!=-1) globalDeviceApp = 'Firefox';
			if (navigator.appVersion.indexOf('Chrome')!=-1) globalDeviceApp = 'Chrome';
		}

		if (globalDeviceApp)
			consoleLog('Device information: device application = ' + globalDeviceApp);
		else
			consoleLog('Device information: device application = Unkown');
	}

});
consoleLog('Device.load.done');
