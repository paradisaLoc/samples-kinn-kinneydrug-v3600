var BuyCtrl;

var BuyWarningHookTitle = "WARNING";
var BuyWarningHookMsg = "Item already in transaction<br>Add it anyway?";
var BuyWarningHookYes = "Yes";
var BuyWarningHookNo = "No";

var msgBuydsdStartMenuList = "List Line Items";
var msgBuydsdStartMenuHdr = "Invoice Header";
var msgBuydsdStartMenuPrtRpt = "Print Report";
var msgBuydsdStartMenuBmp = "Bill and receipt pictures";
var msgBuydsdStartMenuCancel = "Mark as Void";
var msgBuydsdStartMenuSuspend = "Suspend Document";
var msgBuydsdStartMenuTotal = "Invoice Total";
var msgBuydsdItmStartMenuProduct = "Product Maintenance";
var msgBuydsdItmStartMenuQuick = "List All Items";
var msgBuydsdItmStartMenuMinus = "Item Deals";
var msgBuydsdItmStartMenuItmRefresh = "Refresh Item";
var msgBuydsdItmStartMenuDel = "Delete Record";
var msgBuydsdAdjustDownBottle = "Bottle return";
var msgBuydsdAdjustDownAllowance = "Global allowance";
var msgBuydsdAdjustDownDiscount = "Global discount";
var msgBuydsdAdjustDownRebate = "Global rebate";
var msgBuydsdAdjustDownAjustDown = "Adjust down";
var msgBuydsdAdjustDownTax1 = "Tax 1";
var msgBuydsdAdjustDownTax2 = "Tax 2";
var msgBuydsdAdjustDownShip = "Shipping fee";
var msgBuydsdAdjustDownLblFee = "Label fee";
var msgBuydsdAdjustDownAjustUp = "Adjust UP";
var msgBuydsdTotalMenuDrop = "Drop Payment";
var msgBuydsdTotalMenuCharge = "Charge to Account";
var msgBuydsdTotalMenuCash = "Payment by Cash";
var msgBuydsdTotalMenuCheck = "Payment by Check";
var msgBuydsdTotalMenuClose = "Close Document";
var msgBuydsdStartDptTitle = "Add By department";
var msgBuydsdStartDptMsg = "Enter a department number.";
var msgBuydsdPaymentMethodPromptCancel = "Cancel";
var msgBuydsdPaymentMethodPromptOk = "Ok";

var msgBuyordStartMenuList = "List Line Items";
var msgBuyordStartMenuHdr = "Document Header";
var msgBuyordStartMenuPrtRpt = "Print Report";
var msgBuyordStartMenuCancel = "Mark as Void";
var msgBuyordStartMenuBmp = "Bill and receipt pictures";
var msgBuyordStartMenuSuspend = "Suspend Document";
var msgBuyordStartMenuClose = "Close Document";
var msgBuyordItmStartMenuProduct = "Product Maintenance";
var msgBuyordItmStartMenuMov = "Movement Analysis";
var msgBuyordItmStartMenuList = "List Line Items";
var msgBuyordItmStartMenuItmRefresh = "Refresh Item";
var msgBuyordItmStartMenuDel = "Delete Record";

var msgBuyOrderDocCloseWarningTitle = "Closing document";
var msgBuyOrderDocCloseWarningMsg = "Would you like to email that order to ";
var msgBuyOrderDocCloseWarningOK = "Yes";
var msgBuyOrderDocCloseWarningCancel = "No";

var msgBuyrecStartMenuQuick = "List All Items";
var msgBuyrecStartMenuUnScan = "List Unscanned";
var msgBuyrecStartMenuShort = "List Shorted";
var msgBuyrecStartMenuHdr = "Document Header";
var msgBuyrecStartMenuPrtRpt = "Print Report";
var msgBuyrecStartMenuBmp = "Bill and receipt pictures";
var msgBuyrecStartMenuCancel = "Mark as Void";
var msgBuyrecStartMenuSUspend = "Suspend Document";
var msgBuyrecStartMenuClose = "Close Document";
var msgBuyrecStartMenuProduct = "Product Maintenance";
var msgBuyrecStartMenuItmRefresh = "Refresh Item";
var msgBuyrecStartMenuDel = "Delete Record";
var msgBuyrecStartDptTitle = "Add By Department";
var msgBuyrecStartDptMsg = "Enter a department number.";


Ext.define('SMS.controller.Buy', {
	extend: 'Ext.app.Controller',

	requires: [
		'Ext.Label',
		'Ext.form.FieldSet',
		'Ext.data.reader.Xml',
		'Ext.data.writer.Xml',
		'Ext.tab.Panel',
		'Ext.dataview.List',
		'Ext.carousel.Carousel',
		'Ext.field.DatePicker',
		'Ext.field.Hidden',
		'Ext.field.Email',
		'Ext.field.Search'
	],

	init: function() {
		var me=this;

		Ext.Viewport.on({
			scope: this,
			appItemBeforeChangeEvent : this.itemBeforeChangeEvent,
			appItemAfterChangeEvent: this.itemAfterChangeEvent,

			appBuyItmQuickResultHook: this.itmQuickResultHook,
			appBuyWarningHook: this.buyWarningHook,

			appBuyDsdDocOpenHook: this.dsdDocOpenHook,
			appBuyDsdDocNewHook: this.dsdDocNewHook,
			appBuyDsdStartHook: this.dsdStartHook,
			appBuyDsdHdrHook: this.dsdHdrHook,
			appBuyDsdLinQuickResultHook: this.dsdLinQuickResultHook,

			appBuyDsdDptStartHook: this.dsdDptStartHook,
			appBuyDsdItmStartHook: this.dsdItmStartHook,
			appBuyDsdLinDealsHook: this.dsdLinDealsHook,
			appBuyDsdTtlTotalHook: this.dsdTtlTotalHook,

			appBuyOrdDocOpenHook: this.ordDocOpenHook,
			appBuyOrdDocNewHook: this.ordDocNewHook,
			appBuyOrdStartHook: this.ordStartHook,
			appBuyOrdHdrHook: this.ordHdrHook,
			appBuyOrdLinQuickResultHook: this.ordLinQuickResultHook,
			appBuyOrdItmStartHook: this.ordItmStartHook,

			appSetPictureHook: this.setPictureHook,
			appBuyBillImgListHook: this.billImgHook,

			appBuyOrdItmDateResultHook: this.itmDateResultHook,

			appBuyRecDocOpenHook: this.recDocOpenHook,
			appBuyRecDocNewHook: this.recDocNewHook,
			appBuyRecStartHook: this.recStartHook,
			appBuyRecHdrHook: this.recHdrHook,
			appBuyRecLinQuickResultHook: this.recLinQuickResultHook,
			appBuyRecLinShortResultHook: this.recLinShortResultHook,
			appBuyRecLinUnscannedResultHook: this.recLinUnscannedResultHook,

			appBuyRecItmStartHook: this.recItmStartHook,
			appBuyRecDptStartHook: this.recDptStartHook
		});

		this.control({

			// start
			'buyhost': {initialize: this.hostInitialize},

			// buy start
			'buyhost #searchEdit': {keyup: this.buySearchEditKeyUp},
			'buyhost #tools': {toggle: this.buyToolBtnToggle},
			'buyhost #scanCamBtn' : {tap: this.buyScanCamBtnClick},

			'buystart': {show: this.handheldScannerHandler},
			'buystart #configBtn' : {tap: this.configBtnClick},

			'buybillimg #closeBtn': { tap: this.billImgCloseBtnClick},
			'buybillimg #cameraBtn': { tap: this.billImgPhotoBtnClick},

			// Quick result
			'buyitmquickresult': {show: this.handheldScannerHandler},
			'buyitmquickresult #closeBtn': {tap: this.itmQuickResultCloseBtnClick},
			'buyitmquickresult *[name=FindVendor]' : {keyup: this.itmQuickResultFindVendorKeyUp},
			'buyitmquickresult #resultGrid': {itemtap: this.itmResultGridItemTap},

			// DSD ////////////////////////////////////////////

			// DSD START
			'buydsdstart': {show: this.handheldScannerHandler},
			'buydsdstart #dptBtn': {tap: this.dsdStartDptBtnClick},
			'buydsdstart #menuBtn': {tap: this.dsdStartMenuBtnClick},
			'buydsdstart #currentItmBtn': {tap: this.dsdStartCurrentItmBtnClick},
			'buydsdstart #suspendDocBtn': {tap: this.dsdStartSuspendDocBtnClick},

			// DSD open document
			'buydsddocopen': {show: this.handheldScannerHandler},
			'buydsddocopen #closeBtn': {tap: this.dsdDocOpenCloseBtnClick},
			'buydsddocopen *[name=FindVendor]' : {keyup: this.dsdDocOpenSearchKeyUp},
			'buydsddocopen #resultGrid': {itemtap: this.dsdDocOpenGridItemClick},

			// DSD doc new
			'buydsddocnew': {show: this.handheldScannerHandler},
			'buydsddocnew #closeBtn': {tap: this.dsdDocNewCloseBtnClick},
			'buydsddocnew *[name=FindVendor]' : {keyup: this.dsdDocNewSearchKeyUp},
			'buydsddocnew #resultGrid': {itemtap: this.dsdDocNewGridItemClick},

			// DSD Header
			'buydsdhdr': {show: this.handheldScannerHandler},
			'buydsdhdr #closeBtn': {tap: this.dsdHdrCloseBtnClick},

			// DSD item start
			'buydsditmstart': {show: this.handheldScannerHandler},
			'buydsditmstart #closeBtn': {tap: this.dsdItmStartCloseBtnClick},
			'buydsditmstart #formatBtn': {tap: this.dsdItmStartFormatBtnClick},
			'buydsditmstart #menuBtn': {tap: this.dsdItmStartMenuBtnClick},

			// DSD dept start
			'buydsddptstart': {show: this.handheldScannerHandler},
			'buydsddptstart #closeBtn': {tap: this.dsdDptCloseBtnClick},
			'buydsddptstart #deleteBtn': {tap: this.dsdDptDeleteBtnClick},

			// DSD Item Deals
			'buydsdlindeals': {show: this.handheldScannerHandler},
			'buydsdlindeals #closeBtn': {tap: this.dsdLinDealsCloseBtnClick},

			// DSD Lines
			'buydsdlinquickresult': {show: this.handheldScannerHandler},
			'buydsdlinquickresult #closeBtn': {tap: this.dsdLinQuickResultCloseBtnClick},
			'buydsdlinquickresult #resultGrid': {itemtap: this.dsdLinQuickGridItemClick},

			// DSD TTL
			'buydsdttltotal': {show: this.handheldScannerHandler},
			'buydsdttltotal #closeBtn': {tap: this.dsdTotalCloseBtnClick},
			'buydsdttltotal #menuBtn': {tap: this.dsdTotalMenuBtnClick},
			'buydsdttltotal #adjustDownBtn': {tap: this.dsdAdjustDownBtnClick},
			'buydsdttltotal #adjustUpBtn': {tap: this.dsdAdjustUpBtnClick},

			// ORDER ////////////////////////////////////////////

			// ORDER START
			'buyordstart': {show: this.handheldScannerHandler},
			'buyordstart #menuBtn': {tap: this.ordStartMenuBtnClick},
			'buyordstart #currentItmBtn': {tap: this.ordStartCurrentItmBtnClick},
			'buyordstart #suspendDocBtn': {tap: this.ordStartSuspendDocBtnClick},

			// ORDER DOC OPEN
			'buyorddocopen': {show: this.handheldScannerHandler},
			'buyorddocopen #closeBtn': {tap: this.ordDocOpenCloseBtnClick},
			'buyorddocopen *[name=FindVendor]' : {keyup: this.ordDocOpenSearchKeyUp},
			'buyorddocopen #resultGrid': {itemtap: this.ordDocOpenGridItemClick},

			// ORDER DOC NEW
			'buyorddocnew': {show: this.handheldScannerHandler},
			'buyorddocnew #closeBtn': {tap: this.ordDocNewCloseBtnClick},
			'buyorddocnew *[name=FindVendor]' : {keyup: this.ordDocNewSearchKeyUp},
			'buyorddocnew #resultGrid': {itemtap: this.ordDocNewGridItemClick},

			// ORDER HEADER
			'buyordhdr': {show: this.handheldScannerHandler},
			'buyordhdr #closeBtn': {tap: this.ordHdrCloseBtnClick},

			// ORDER ITEM START
			'buyorditmstart': {show: this.handheldScannerHandler},
			'buyorditmstart #closeBtn': {tap: this.ordItmStartCloseBtnClick},
			'buyorditmstart #formatBtn': {tap: this.ordItmStartFormatBtnClick},
			'buyorditmstart #menuBtn': {tap: this.ordItmStartMenuBtnClick},

			// ORDER LINES
			'buyordlinquickresult': {show: this.handheldScannerHandler},
			'buyordlinquickresult #closeBtn': {tap: this.ordLinQuickResultCloseBtnClick},
			'buyordlinquickresult #resultGrid': {itemtap: this.ordLinQuickGridItemClick},

			// REPORT DATE
			'buyorditmdatesearch': {
				initialize: this.itmDateSearchInitialize,
				show: this.handheldScannerHandler
			},
			'buyorditmdatesearch *[name=F1031]': {change: this.itmDateSearchPeriodChange},
			'buyorditmdatesearch #closeBtn': {tap: this.itmDateSearchCloseBtnClick},
			'buyorditmdatesearch #pastDateBtn': {tap: this.itmDateSearchPastDateBtnClick},
			'buyorditmdatesearch #futureDateBtn': {tap: this.itmDateSearchFutureDateBtnClick},
			'buyorditmdatesearch #launchBtn': {tap: this.itmDateSearchLaunchBtnClick},

			'buyorditmdateresult': {
				show: this.handheldScannerHandler,
				smsrefresh: this.itmDateResultView
			},
			'buyorditmdateresult #closeBtn': {tap: this.itmDateResultCloseBtnClick},

			// RECV /////////////////////////////////////////////////

			// RECV START
			'buyrecstart': {show: this.handheldScannerHandler},
			'buyrecstart #dptBtn': {tap: this.recStartDptBtnClick},
			'buyrecstart #menuBtn': {tap: this.recStartMenuBtnClick},
			'buyrecstart #currentItmBtn': {tap: this.recStartCurrentItmBtnClick},
			'buyrecstart #listItmBtn': {tap: this.recStartListLinItemsBtnClick},
			'buyrecstart #suspendDocBtn': {tap: this.recStartSuspendDocBtnClick},

			// RECV DOC OPEN
			'buyrecdocopen': {show: this.handheldScannerHandler},
			'buyrecdocopen #closeBtn': {tap: this.recDocOpenCloseBtnClick},
			'buyrecdocopen *[name=FindVendor]' : {keyup: this.recDocOpenSearchKeyUp},
			'buyrecdocopen #resultGrid': {itemtap: this.recDocOpenGridItemClick},

			// RECV DOC NEW
			'buyrecdocnew': {show: this.handheldScannerHandler},
			'buyrecdocnew #closeBtn': {tap: this.recDocNewCloseBtnClick},
			'buyrecdocnew *[name=FindVendor]' : {keyup: this.recDocNewSearchKeyUp},
			'buyrecdocnew #resultGrid': {itemtap: this.recDocNewGridItemClick},

			// RECV HEADER
			'buyrechdr': {show: this.handheldScannerHandler},
			'buyrechdr #closeBtn': {tap: this.recHdrCloseBtnClick},

			// RECV ITEM START
			'buyrecitmstart': {show: this.handheldScannerHandler},
			'buyrecitmstart #closeBtn': {tap: this.recItmStartCloseBtnClick},
			'buyrecitmstart #formatBtn': {tap: this.recItmStartFormatBtnClick},
			'buyrecitmstart #menuBtn': {tap: this.recItmStartMenuBtnClick},

			// RECV DEPT START
			'buyrecdptstart': {show: this.handheldScannerHandler},
			'buyrecdptstart #closeBtn': {tap: this.recDptCloseBtnClick},
			'buyrecdptstart #deleteBtn': {tap: this.recDptDeleteBtnClick},

			// RECV LINES QUICK
			'buyreclinquickresult': {show: this.handheldScannerHandler},
			'buyreclinquickresult #closeBtn': {tap: this.recLinQuickResultCloseBtnClick},
			'buyreclinquickresult #resultGrid': {itemtap: this.recLinQuickGridItemClick},

			// RECV LINES SHORT
			'buyreclinshortresult': {show: this.handheldScannerHandler},
			'buyreclinshortresult #closeBtn': {tap: this.recLinShortResultCloseBtnClick},
			'buyreclinshortresult #resultGrid': {itemtap: this.recLinShortGridItemClick},

			// RECV LINES UNSCANNED
			'buyreclinunscannedresult': {show: this.handheldScannerHandler},
			'buyreclinunscannedresult #closeBtn': {tap: this.recLinUnscannedResultCloseBtnClick},
			'buyreclinunscannedresult #resultGrid': {itemtap: this.recLinUnscannedGridItemClick},

			// CONFIG
			'buyconfig': {show: this.handheldScannerHandler},
			'buyconfig #saveBtn': {tap: this.configSaveBtnClick}

		});
	},

	launch: function() {
		BuyCtrl = this;
	},

/// COMMON TOOLS /////////////////////////////////////////////////////////////////////////////////////////////

	// HOST RENDER
	hostInitialize: function(win) {
		BaseCtrl.applyRights(win);
		BaseCtrl.applyEvents(win);
	},

	handheldScannerHandler: function (form) {
		var listForm = ["buydsddocnew", "buydsdstart", "buydsditmstart", "buyorddocnew", "buyordstart", "buyorditmstart", "buyrecstart", "buyrecitmstart", "buyrecdocnew"]; 

		//Deactivate the handheld scanner
		DeviceCtrl.disableHandheldScanners(form,listForm);	

		//Acctivate handheld scanner only for forms using code value
		if (listForm.indexOf(form.xtype) != -1)
			DeviceCtrl.enableHandheldScanners(form, listForm, BuyCtrl.itmDeviceScannerCallback);
	},

	itmDeviceScannerCallback: function(form,code) {
		if (!code || code == BaseCtrl.hotPoolGet('F01'))
			return;

		//Add item to Inventory document
		//btn a determiner, utiliser form ou search field
		if (form.xtype == "buydsddocnew")
			ExecCtrl.entrySendUrl('cgi=mFloor_xml_hook.xml&ExtGridUsp=mFloor_buy_doc_new&ExtGridAlias=BuyDsdDocNew&F1068=DSD&FindVendor=' + code);
		else if (form.xtype == "buyorddocnew")
			ExecCtrl.entrySendUrl('cgi=mFloor_xml_hook.xml&ExtGridUsp=mFloor_buy_doc_new&ExtGridAlias=BuyOrdDocNew&F1068=ORDER&FindVendor='+ code);	
		else if (form.xtype == "buyrecdocnew")
			ExecCtrl.entrySendUrl('cgi=mFloor_xml_hook.xml&ExtGridUsp=mFloor_buy_doc_new&ExtGridAlias=BuyRecDocNew&F1068=RECV&FindVendor=' + code);	
		else {
			//var search = form.down('searchfield[name=FindVendor]');
			BuyCtrl.buyCodeEntry(null, code);
		}
			
			
	},

	// TASKBAR CLICK
	buyTaskbarBtnClick: function(btn) {
		var win = Ext.Viewport.down('#taskbar');
		Ext.Viewport.setActiveItem(win);
	},

	// TOOLBTN TOGGLE
	buyToolBtnToggle: function(segBtn, btn, isPressed,eOpt) {
		ExecCtrl.windowToolBtnToggle(segBtn, btn, isPressed, eOpt);
	},

	// WARNING HOOK
	buyWarningHook: function(nodehook) {
		var node = Ext.DomQuery.selectNode("data record", nodehook);
		var warning = Ext.DomQuery.selectNode("warning", node).firstChild.nodeValue;

		// ALREADY EXIST
		if (warning == 'EXIST') {
			Ext.Msg.show({
				title: BuyWarningHookTitle,
				message: BuyWarningHookMsg,
				buttons: [{text: BuyWarningHookNo, itemId: '0'}, {text: BuyWarningHookYes, itemId: '1'}],
				cls: 'sms-popup-warning',
				fn: function (btn) {
					var url = '';
					if (btn==1) {
						url = 'FCT=3510';
						url += '&BUY_WARNING=';
						url += '&GotoExist=0';
						url += '&Hot=1';
						ExecCtrl.entrySendUrl(url);
					}
					else {
						url = 'FCT=3510';
						url += '&BUY_WARNING=';
						url += '&GotoExist=1';
						url += '&Hot=1';
						ExecCtrl.entrySendUrl(url);
					}
				}
			});
		}
	},

/// MANAGE INVOICE PICTURE ////////////////////////////////////////////////////

	// Initialize the form for picture capture
	InitPictureForm: function(form) {
		var camera = form.down('#cameraBtn');
		if (camera) camera.setHidden(!globalCameraEnabled);

		// Get highest count
		var count = 0;
		var recCnt = 0;
		var grid = form.down('dataview');
		if (grid) {
			var store = grid.getStore();
			for (var rx = 0; rx<store.getCount(); rx++) {
				var record = store.getAt(rx);
				if (record.get('Count')>count) count = record.get('Count');
				if (record.get('RecCnt')>count) recCnt = record.get('RecCnt');
			}
		}

		BaseCtrl.hotPoolAdd('BillCount', count);
		BaseCtrl.hotPoolAdd('BillRecCnt', recCnt);

		// Set capture submit url
		var capture = form.down('capturepicture');
		if (capture) {
			capture.smsSubmitUrl = appServerSms + '/scripts/trs.exe?' + BaseCtrl.sessionCur().getSessionStr() +
				'&' + BuyCtrl.billImgCollectData('mFloor_buy_bill_img_list.xml') + '&RECORD_ADD=1';
			consoleLog('capture image: ' + capture.smsSubmitUrl);
		}
	},

	// SHOW PICTURE IN FORM
	setPictureForm: function (pic, image) {
		var url = 'cgi=mFloor_buy_bill_img_base64.xml&image='+image;
		ExecCtrl.entrySendUrl(url,null,null,pic);
	},

	setPictureHook: function(node,pic) {
		var tags = node.getElementsByTagName("base");
		pic.setImage(tags[0].innerHTML);

		pic.img.dom.onload = function () {
			// Set Image Height to it's original value
			pic.img.dom.height = pic.img.dom.naturalHeight;
			// Set image height to a maximum of 200
			if (pic.img.dom.height > 200) pic.img.dom.height = 200;
		}
	},

	// Set URL send with paramters
	billImgCollectData: function (cgi) {
		var url = '';
		if (cgi) {
			var count = BaseCtrl.hotPoolGet('BillCount');
			var recCnt = BaseCtrl.hotPoolGet('BillRecCnt');
			if (typeof (count) === 'undefined' || count === '') count = '0';
			if (typeof (recCnt) === 'undefined' || recCnt === '') recCnt = '0';

			url += 'cgi=' + cgi;
			url += '&HOT_IDX_F1032=' + BaseCtrl.hotPoolGet('F1032');
			url += '&F1056=' + BaseCtrl.hotPoolGet('F1056');
			url += '&F1057=' + BaseCtrl.hotPoolGet('F1057');
			url += '&Count=' + count;
			url += '&RecCnt=' + recCnt;
		}
		return url;
	},

	// TAKE PHOTO BUTTON
	billImgPhotoBtnClick: function (btn) {
		var url = BuyCtrl.billImgCollectData('mFloor_buy_bill_img_list.xml');
		url += '&RECORD_ADD=1';
		DeviceCtrl.takePicture(url,2);
	},

	billImgHook: function (node, append) {
		ItmCtrl.resultCommonHook(node, 'buybillimg', 'SMS.store.BuyItmBill');
		var form = Ext.Viewport.down('buybillimg');

		//Disable the Capture button and remove the text
		if (globalDeviceName == 'Zebra') {
			document.querySelector('.icon-camera').parentElement.lastChild.textContent = '';
			document.querySelector('.icon-camera').parentElement.nextSibling.hidden = true;
		}

		BuyCtrl.InitPictureForm(form);
	},

	// GRID ITEM CLICK
	billImgResultGridItemTap: function (list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		var form = Ext.Viewport.down('buybillimg');
		if (form) {
			var pic = form.down('#captureImg');
			BuyCtrl.setPictureForm(pic, record.get('imageSrc'));
		}
	},

	// ORDER BILL CLOSE
	billImgCloseBtnClick: function (btn) {
		ExecCtrl.windowClose('buybillimg');
	},

	// DELETE BILL IMAGE
	billImgDeleteBtnClick: function (view,record) {
		var url = 'cgi=mFloor_buy_bill_img_list.xml&RECORD_DEL=1&COUNT='+record.get('Count');
		ExecCtrl.entrySendUrl(url);
	},

/// COMMON HOOK /////////////////////////////////////////////////////////////////////////////

	// BUY ITEM COMMON HOOK
	buyItmStartHook: function(nodehook,widget,model) {
		var flds, fld;
		var focus = '';
		
		var node = Ext.DomQuery.selectNode('skipFocus',node);
		if (node && node.firstChild) focus= node.firstChild.nodeValue;

		node = Ext.DomQuery.selectNode("data record", nodehook);
		var form = ExecCtrl.windowAdd(widget);

		if (!form.store) BaseCtrl.formNewStore(form,'SMS.store.'+model);
		form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.'+model)));
		var record = form.getRecord();

		// Refresh hot idx
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);

		// set image
		flds = form.query('image');
		for (var y=0; y<flds.length; y++) {
			flds[y].setSrc(record.get('imageSrc'));
		}

		// multi-formats
/*		var formatBtn = form.down('#formatBtn');
		if (record.get('FORMAT_COUNT') > 1)
			formatBtn.setHidden(false); else
			formatBtn.setHidden(true);
*/
		// warnings
		var text = form.down('#messageText');
		if (record.get('warningMsg') != null && record.get('warningMsg') != '') {
			text.setHidden(false);
			text.setHtml(record.get('warningMsg'));
		}
		else {
			text.setHidden(true);
			text.setHtml('');
		}

		// split code
		fld = form.down('textfield[name=F220]');
		if (fld)
			if (record.get('F220') && record.get('F220') != '')
				fld.up().setHidden(false); else
				fld.up().setHidden(true);

		//Input field
/*		var uom = record.get('F1887');

		fld = form.down('textfield[name=REC_REG-F70]');
		if (uom.indexOf('U') == -1)
			fld.setHidden(true); 
		else {
			fld.setHidden(false);
		}

		fld = form.down('textfield[name=REC_REG-F1003]');
		if ((uom.indexOf('C') == 1) && (uom != ''))
			fld.setHidden(true); 
		else {
			fld.setHidden(false);
		}
		
		fld = form.down('textfield[name=REC_REG-F270]');
		if (uom.indexOf('W') == -1)
			fld.setHidden(true); 
		else {
			fld.setHidden(false);
		}
*/
		// set image
		flds = form.query('image');
		for (var z=0; z<flds.length; z++) {
			flds[z].setSrc(record.get('imageSrc'));
		}

		if (focus!='1') Ext.Viewport.fireEvent('appItemAfterChangeEvent', form);
	},

//// DSD ////////////////////////////////////////////////////////////////////////////////////////////////////

//// DSD  OPEN DOCUMENT ////////////////////////////////////////////////////////////////////////////////////

	dsdDocOpen: function(btn) {
		var url = 'cgi=mFloor_xml_hook.xml';
		url += '&ExtGridUsp=mFloor_buy_doc_list';
		url += '&ExtGridAlias=BuyDsdDocOpen';
		url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
		url += '&F1068=DSD';
		ExecCtrl.entrySendUrl(url);
	},

	dsdDocOpenHook: function(node,append) {
		ItmCtrl.resultCommonHook(node,'buydsddocopen','SMS.store.BuyDocList');
	},

	// DSD OPEN CLOSE
	dsdDocOpenCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buydsddocopen','buystart');
	},

	// DSD OPEN VENDOR KEYUP
	dsdDocOpenSearchKeyUp: function(search,e) {
		if (e.event.keyCode == 13) {
			ItmCtrl.commonSearchKeyUp(search,['FindVendor'],[search.getValue()]);
		}
	},

	// DSD OPEN GRID CLICK
	dsdDocOpenGridItemClick: function(list, index, target, record, e, eOpts) {
		ExecCtrl.entrySendUrl('FCT=3120&HDRRECF1068=DSD&ENTRY='+record.get('F1032'));
	},

/// DSD NEW DOCUMENT //////////////////////////////////////////////////////////////////////////////////////

	dsdDocNew: function(btn) {
		var url = 'cgi=mFloor_xml_hook.xml';
		url += '&ExtGridUsp=mFloor_buy_doc_new';
		url += '&ExtGridAlias=BuyDsdDocNew';
		url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
		url += '&F1068=DSD';
		ExecCtrl.entrySendUrl(url);
	},

	dsdDocNewHook: function(node,append) {
		ItmCtrl.resultCommonHook(node,'buydsddocnew','SMS.store.BuyDocNew');
	},

	// DSD NEW CLOSE
	dsdDocNewCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buydsddocnew','buydsddocopen');
	},

	// DSD NEW RESULT KEYUP
	dsdDocNewSearchKeyUp: function(search,e) {
		if (e.event.keyCode == 13) {
			ItmCtrl.commonSearchKeyUp(search,['FindVendor'],[search.getValue()]);
		}
	},

	// DSD NEW GRID CLICK
	dsdDocNewGridItemClick: function(list, index, target, record, e, eOpts) {
		ExecCtrl.entrySendUrl('FCT=3110&HDRRECF1068=DSD&ENTRY='+ record.get('F27'));
	},

//// DSD START //////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// DSD START HOOK
	dsdStartHook: function(nodehook) {
		var node = Ext.DomQuery.selectNode("data record", nodehook);
		var form = ExecCtrl.windowAdd('buydsdstart');

		if (!form.store) BaseCtrl.formNewStore(form,'SMS.store.BuyViewSum');
		form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.BuyViewSum')));

		var record = form.getRecord();
		BaseCtrl.hotPoolAdd('F1032',record.get('F1032')); // trans
		BaseCtrl.hotPoolAdd('F1101',record.get('F1101')); // line
		BaseCtrl.hotPoolAdd('F27',record.get('F27')); // vendor
		BaseCtrl.hotPoolAdd('F1068',record.get('F1068')); // type
		BaseCtrl.hotPoolAdd('F1056', record.get('F1056'));
		BaseCtrl.hotPoolAdd('F1057', record.get('F1057'));
	},

	// DSD SHOW CURRENT LINE
	dsdStartCurrentItmBtnClick: function(btn) {
		var url = 'FCT=3652';
		url += '&ENTRY=' + BaseCtrl.hotPoolGet('F1101');
		ExecCtrl.entrySendUrl(url);
	},

	// DSD SUSPEND
	dsdStartSuspendDocBtnClick: function(btn) {
		ExecCtrl.entrySendUrl('FCT=3140');
	},

	// DSD START CONTEXT MENU
	dsdStartMenuBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn,
			[
				{text: msgBuydsdStartMenuList, value: 'LIST_ITEM'},
				{text: msgBuydsdStartMenuHdr, value: 'HEADER'},
				{text: msgBuydsdStartMenuPrtRpt, value: 'PRINT_REPORT'},
				{text: msgBuydsdStartMenuBmp, value: 'PICTURE' },
				{text: msgBuydsdStartMenuCancel, value: 'CANCEL'},
				{text: msgBuydsdStartMenuSuspend, value: 'SUSPEND'},
				{text: msgBuydsdStartMenuTotal, value: 'TOTAL'}
			],
			function(value) {
				if (value == 'LIST_ITEM') {
					var url = 'cgi=mFloor_xml_hook.xml';
					url += '&ExtGridUsp=mFloor_buy_rec_lin_list';
					url += '&ExtGridAlias=BuyDsdLinQuickResult';
					url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
					url += '&F1032=' + BaseCtrl.hotPoolGet('F1032');
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'HEADER') ExecCtrl.entrySendUrl('cgi=mFloor_buy_dsd_hdr.xml');
				else if (value == 'PRINT_REPORT') ExecCtrl.entrySendUrl('cgi=mFloor_buy_dsd_start.xml&PRINT=1');
				else if (value == 'PICTURE') {
					url = 'cgi=mFloor_buy_bill_img_list.xml';
					url += '&HOT_IDX_F1032=' + BaseCtrl.hotPoolGet('F1032');
					url += '&HOT_IDX_F1056=' + BaseCtrl.hotPoolGet('F1056');
					url += '&HOT_IDX_F1057=' + BaseCtrl.hotPoolGet('F1057');
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'CANCEL') ExecCtrl.entrySendUrl('FCT=3190');
				else if (value == 'SUSPEND') ExecCtrl.entrySendUrl('FCT=3140');
				else if (value == 'TOTAL') ExecCtrl.entrySendUrl('cgi=mFloor_buy_dsd_ttl.xml');
			}
		);
	},

//// DSD HEADER //////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// DSD HEADER HOOK
	dsdHdrHook: function(nodehook) {
		var node = Ext.DomQuery.selectNode("data record", nodehook);
		var form = Ext.Viewport.down('buydsdhdr');
		if (!form) form = ExecCtrl.windowAdd('buydsdhdr');

		if (!form.store) BaseCtrl.formNewStore(form,'SMS.store.BuyRecHdr');
		form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.BuyRecHdr')));
	},

	// DSD HEADER CLOSE
	dsdHdrCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buydsdhdr','buydsdstart');
	},

//// DSD ITEM /////////////////////////////////////////////////////////////////////////////////////////////

	// DSD ITEM HOOK
	dsdItmStartHook: function(node) {
		this.buyItmStartHook(node,'buydsditmstart','BuyRecReg');
	},

	// DSD ITEM CONTEXT MENU
	dsdItmStartMenuBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn,
			[
				{text: msgBuydsdItmStartMenuProduct, value: 'PRODUCT'},
				{text: msgBuydsdItmStartMenuQuick, value: 'QUICK'},
				{text: msgBuydsdItmStartMenuMinus, value: 'MINUS'},
				{text: msgBuydsdItmStartMenuItmRefresh, value: 'ITEM_REFRESH'},
				{text: msgBuydsdItmStartMenuDel, value: 'DELETE'}
			],
			function(value) {
				var url= '';
				if (value == 'PRODUCT') {
					var win = Ext.Viewport.down('itmhost');
					if (win) {
						var form = Ext.Viewport.down('itmstart');
						if (form)
							Ext.Viewport.setActiveItem(form);
					}					
					ExecCtrl.windowAdd('itmstart');
					url = 'cgi=mFloor_itm_info.xml&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
					ExecCtrl.entrySendUrl(url);
				}
				if (value == 'QUICK') {
					url = 'cgi=mFloor_xml_hook.xml';
					url += '&ExtGridUsp=mFloor_buy_rec_lin_list';
					url += '&ExtGridAlias=BuyDsdLinQuickResult';
					url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
					url += '&F1032=' + BaseCtrl.hotPoolGet('F1032');
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'MINUS') ExecCtrl.entrySendUrl('cgi=mFloor_buy_dsd_lin_deals.xml');
				else if (value == 'ITEM_REFRESH') ExecCtrl.entrySendUrl('FCT=3655');
				else if (value == 'DELETE') ExecCtrl.entrySendUrl('FCT=3650');
			}
		);
	},

	// DSD ITEM CLOSE
	dsdItmStartCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buydsditmstart','buydsdstart');
	},

	// DSD ITEM FORMAT
	dsdItmStartFormatBtnClick: function(btn) {
		var url = 'jsPop=list,jsUsp=mFloor_buy_rec_format';
		url += '&F01=' + BaseCtrl.hotPoolGet('F01');
		url += '&F27=' + BaseCtrl.hotPoolGet('F27');
		url += ',jsSrc=FORMAT_COUNT,jsAction=run';
		var options = {};
		options.smsCallback = BuyCtrl.dsdItmStartFormatCallBack;
		ExecCtrl.entryExecPrm(btn,url,options);
	},

	// DSD ITEM FORMAT CALLBACK
	dsdItmStartFormatCallBack: function(source,selection) {
		var value = '';
		if (selection.length>0) value = selection[0].get('data');
		BaseCtrl.hotPoolAdd('F1184',value);

		var url = 'FCT=3655';
		url += '&FORMAT=' + value;
		url += '&F01=' + BaseCtrl.hotPoolGet('F01') ;
		url += '&F27=' + BaseCtrl.hotPoolGet('F27');
		ExecCtrl.entrySendUrl(url);
	},

//// DSD DEPT ////////////////////////////////////////////////////////////////////////////////////////////////

	// DSD START DEPT
	dsdStartDptBtnClick: function(btn) {
		Ext.Msg.show({
			title: msgBuydsdStartDptTitle,
			message: msgBuydsdStartDptMsg,
			buttons: Ext.MessageBox.OKCANCEL,
			prompt : {
				xtype : 'textfield',
				maxlength : 180,
				autocapitalize : true,
				clearIcon : false,
				listeners: {
					keyup: {
						fn: function (fld, e) {
							if (e.event.keyCode == 13) {
								e.stopEvent();
								Ext.Msg.onClick(Ext.Msg.buttonsToolbar.getItems().getByKey('ok'));
							}
						}
					}
				}
			},
			fn: function (buttonId, value) {
				var url = '';
				if (buttonId == 'ok' && value != '') {
					url = 'FCT=3555&ITM=' + value;
					url += '&HOT_IDX_F03=' + value;
					url += '&RETPAGE=cgi=mFloor_buy_dsd_dpt.xml';
					ExecCtrl.entrySendUrl(url);
				} else if (buttonId == 'cancel') {
					ExecCtrl.entrySendUrl('cgi=mFloor_buy_dsd_start.xml&SKIPFOCUS=1');
				}
			},
			cls: 'sms-popup-prompt'
		});
		Ext.Msg.down( 'textfield' ).focus();
	},

	// DSD DEPT HOOK
	dsdDptStartHook: function(nodehook) {
		var node = Ext.DomQuery.selectNode("data record", nodehook);
		var form = ExecCtrl.windowAdd('buydsddptstart');

		if (!form.store) BaseCtrl.formNewStore(form,'SMS.store.BuyRecReg');
		form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.BuyRecReg')));
		var record = form.getRecord();

		var text = form.down('#messageText');
		if (record.get('warningMsg') != null && record.get('warningMsg') != '') {
			text.setHidden(false);
			text.setHtml(record.get('warningMsg'));
		}
		else {
			text.setHidden(true);
			text.setHtml('');
		}
	},

	// DSD DEPT CLOSE
	dsdDptCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buydsddptstart','buydsdstart');
	},

	// DSD DEPT DELETE
	dsdDptDeleteBtnClick: function(btn) {
		ExecCtrl.entrySendUrl('FCT=3650&keep=0');
	},


//// DSD DEAL ////////////////////////////////////////////////////////////////////////////////////

	// DSD DEAL HOOK
	dsdLinDealsHook: function(nodehook) {
		var node = Ext.DomQuery.selectNode("data record", nodehook);
		var form = Ext.Viewport.down('buydsdlindeals');
		if (!form) form = ExecCtrl.windowAdd('buydsdlindeals');

		if (!form.store) BaseCtrl.formNewStore(form,'SMS.store.BuyViewDeals');
		form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.BuyViewDeals')));
		var record = form.getRecord();

		var fld = form.down('textfield[name=F26]');
		if (record.get('F26'))
			fld.setHidden(false); else
			fld.setHidden(true);
	},

	// DSD DEAL CLOSE
	dsdLinDealsCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buydsdlindeals','buydsditmstart');
	},


//// DSD LINES ///////////////////////////////////////////////////////////////////////////////////////

	// DSD LINES HOOK
	dsdLinQuickResultHook: function(node,append) {
		ItmCtrl.resultCommonHook(node,'buydsdlinquickresult','SMS.store.BuyViewLines');
	},

	// DSD LINES CLOSE
	dsdLinQuickResultCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buydsdlinquickresult','buydsdstart');
	},

	// DSD LINES ITEM CLICK
	dsdLinQuickGridItemClick: function(list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		var url = 'FCT=3652&ENTRY=' + record.get('F1101');
		ExecCtrl.entrySendUrl(url);
	},

//// DSD TOTAL ////////////////////////////////////////////////////////////////////////////////////////////

	// DSD TOTAL HOOK
	dsdTtlTotalHook: function(nodehook) {
		var node = Ext.DomQuery.selectNode("data record", nodehook);
		var form = Ext.Viewport.down('buydsdttltotal');
		if (!form) form = ExecCtrl.windowAdd('buydsdttltotal');

		if (!form.store) BaseCtrl.formNewStore(form,'SMS.store.BuyRecTtl');
		form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.BuyRecTtl')));

		var record = form.getRecord();
		var fldLbl = form.down('textfield[name=TAX1]');
		if (record.get('TAX1') || record.get('TAX2') ||
			record.get('SHIPPING_FEE') || 
			record.get('LABEL_FEE') || 
			record.get('ADJUST_UP')) {
			if (record.get('TAX1'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);

			fldLbl = form.down('textfield[name=TAX2]');
			if (record.get('TAX2'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);

			fldLbl = form.down('textfield[name=SHIPPING_FEE]');
			if (record.get('SHIPPING_FEE'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);

			fldLbl = form.down('textfield[name=LABEL_FEE]');
			if (record.get('LABEL_FEE'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);

			fldLbl = form.down('textfield[name=ADJUST_UP]');
			if (record.get('ADJUST_UP'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);
		}
		else {
			fldLbl.up().setHidden(true);
		}

		fldLbl = form.down('textfield[name=BOTTLE_RETURN]');
		if (record.get('BOTTLE_RETURN') ||
			record.get('GLOBAL_ALLOWANCE') ||
			record.get('GLOBAL_DISCOUNT') ||
			record.get('GLOBAL_REBATE') ||
			record.get('ADJUST_DOWN')) {
			if (record.get('BOTTLE_RETURN'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);

			fldLbl = form.down('textfield[name=GLOBAL_ALLOWANCE]');
			if (record.get('GLOBAL_ALLOWANCE'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);

			fldLbl = form.down('textfield[name=GLOBAL_DISCOUNT]');
			if (record.get('GLOBAL_DISCOUNT'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);

			fldLbl = form.down('textfield[name=GLOBAL_REBATE]');
			if (record.get('GLOBAL_REBATE'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);

			fldLbl = form.down('textfield[name=ADJUST_DOWN]');
			if (record.get('ADJUST_DOWN'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);
		}
		else {
			fldLbl.up().setHidden(true);
		}

		fldLbl = form.down('textfield[name=DROP_PAIMENT]');
		if (record.get('DROP_PAIMENT') || record.get('CHARGE_PAIMENT') || record.get('CASH_PAIMENT') || record.get('CHECK_PAIMENT')) {
			if (record.get('DROP_PAIMENT'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);

			fldLbl = form.down('textfield[name=CHARGE_PAIMENT]');
			if (record.get('CHARGE_PAIMENT'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);

			fldLbl = form.down('textfield[name=CASH_PAIMENT]');
			if (record.get('CASH_PAIMENT'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);

			fldLbl = form.down('textfield[name=CHECK_PAIMENT]');
			if (record.get('CHECK_PAIMENT'))
				fldLbl.setHidden(false); else
				fldLbl.setHidden(true);
		}
		else {
			fldLbl.up().setHidden(true);
		}
	},

	// DSD TOTAL CLOSE
	dsdTotalCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buydsdttltotal','buydsdstart');
	},

	// DSD TOTAL ADJUST DOWN
	dsdAdjustDownBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn,
			[
				{text: msgBuydsdAdjustDownBottle, value: 'BOTTLE_RETURN'},
				{text: msgBuydsdAdjustDownAllowance, value: 'GLOBAL_ALLOWANCE'},
				{text: msgBuydsdAdjustDownDiscount, value: 'GLOBAL_DISCOUNT'},
				{text: msgBuydsdAdjustDownRebate, value: 'GLOBAL_REBATE'},
				{text: msgBuydsdAdjustDownAjustDown, value: 'ADJUST_DOWN'}
			],
			function(value) {
				var url= '';
				if (value == 'BOTTLE_RETURN') ExecCtrl.entrySendUrl('FCT=3810');
				else if (value == 'GLOBAL_ALLOWANCE') ExecCtrl.entrySendUrl('FCT=3820');
				else if (value == 'GLOBAL_DISCOUNT') ExecCtrl.entrySendUrl('FCT=3822');
				else if (value == 'GLOBAL_REBATE') ExecCtrl.entrySendUrl('FCT=3824');
				else if (value == 'ADJUST_DOWN') ExecCtrl.entrySendUrl('FCT=3890');
			}
		);
	},

	// DSD TOTAL ADJUST UP
	dsdAdjustUpBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn,
			[
				{text: msgBuydsdAdjustDownTax1, value: 'TAX1'},
				{text: msgBuydsdAdjustDownTax2, value: 'TAX2'},
				{text: msgBuydsdAdjustDownShip, value: 'SHIPPING_FEE'},
				{text: msgBuydsdAdjustDownLblFee, value: 'LABEL_FEE'},
				{text: msgBuydsdAdjustDownAjustUp, value: 'ADJUST_UP'}
			],
			function(value) {
				var url= '';
				if (value == 'TAX1') ExecCtrl.entrySendUrl('FCT=3701');
				else if (value == 'TAX2') ExecCtrl.entrySendUrl('FCT=3702');
				else if (value == 'SHIPPING_FEE') ExecCtrl.entrySendUrl('FCT=3710');
				else if (value == 'LABEL_FEE') ExecCtrl.entrySendUrl('FCT=3720');
				else if (value == 'ADJUST_UP') ExecCtrl.entrySendUrl('FCT=3790');
			}
		);
	},

	// DSD TOTAL MENU
	dsdTotalMenuBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var record = form.getRecord();
		var blc = record.get('BALANCE').replace(/[^-0-9\.]+/g, "");

		Ext.ux.menu.Menu.open(
			btn,
			[
				{text: msgBuydsdTotalMenuDrop, value: 'DROP'},
				{text: msgBuydsdTotalMenuCharge, value: 'CHARGE'},
				{text: msgBuydsdTotalMenuCash, value: 'CASH'},
				{text: msgBuydsdTotalMenuCheck, value: 'CHECK'},
				{text: msgBuydsdTotalMenuClose, value: 'CLOSE'}
			],
			function(value) {
				var url= '';
				if (value == 'DROP') BuyCtrl.dsdPaymentMethodPrompt('FCT=3910', 'Drop payment', blc);
				else if (value == 'CHARGE') BuyCtrl.dsdPaymentMethodPrompt('FCT=3920', 'Charge to account', blc);
				else if (value == 'CASH') BuyCtrl.dsdPaymentMethodPrompt('FCT=3950', 'Cash payment', blc);
				else if (value == 'CHECK') BuyCtrl.dsdPaymentMethodPrompt('FCT=3960', 'Check payment', blc);
				else if (value == 'CLOSE') ExecCtrl.entrySendUrl('sqi=mFloor_rec_doc_close');
			}
		);
	},

	// DSD PROMPT PAYMENT METHOD
	dsdPaymentMethodPrompt: function (fct, msg, blc) {
	
		Ext.Msg.show({
			title: msgExecEntryPrompt,
			message: (blc && blc > 0 ) ? msg + ' ($' + blc + ')?': msg + '?',
			buttons: [{text: msgBuydsdPaymentMethodPromptCancel, itemId: '0'}, {text: msgBuydsdPaymentMethodPromptOk, itemId: '1'}],
			prompt: { 
				maxlength: 180,
				autocapitalize: true,
				placeHolder: blc,
				listeners: {
					keyup: {
						fn: function (fld, e) {
							if (e.event.keyCode == 13) {
								e.stopEvent();
								ExecCtrl.entrySendUrl(fct + '&ENTRY='+ fld.getValue());
								Ext.Msg.onClick(Ext.Msg.buttonsToolbar.getItems().getByKey(msgBuydsdPaymentMethodPromptOk));
							}//if
						}//fn
					}//keyup
				}//listeners
			},
			fn: function (btn, value) {
				if (btn==1) {
					ExecCtrl.entrySendUrl(fct + '&ENTRY='+ value);
				}
			},
			value: blc,
			cls: 'sms-popup-prompt'
		});
		Ext.Msg.down( 'textfield' ).focus();
	},

//// ORDER /////////////////////////////////////////////////////////////////////////////////

//// ORDER OPEN ////////////////////////////////////////////////////////////////////////////

	ordDocOpen: function(btn) {
		var url = 'cgi=mFloor_xml_hook.xml';
		url += '&ExtGridUsp=mFloor_buy_doc_list';
		url += '&ExtGridAlias=BuyOrdDocOpen';
		url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
		url += '&F1068=ORDER';
		ExecCtrl.entrySendUrl(url);
	},

	ordDocOpenHook: function(node,append) {
		ItmCtrl.resultCommonHook(node,'buyorddocopen','SMS.store.BuyDocList');
	},

	// ORDER START CLOSE
	ordDocOpenCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyorddocopen','buystart');
	},

	// ORDER START QUEICK RESULT KEYUP
	ordDocOpenSearchKeyUp: function (search, e) {
		if (e.event.keyCode == 13) {
			ItmCtrl.commonSearchKeyUp(search,['FindVendor'],[search.getValue()]);
		}
	},

	// ORDER GRID ITEM CLICK
	ordDocOpenGridItemClick: function(list, index, target, record, e, eOpts) {
		ExecCtrl.entrySendUrl('FCT=3120&HDRRECF1068=ORDER&ENTRY='+record.get('F1032'));
	},

//// ORDER NEW ////////////////////////////////////////////////////////////////////////////////////////////////////////

	ordDocNew: function(btn) {
		var url = 'cgi=mFloor_xml_hook.xml';
		url += '&ExtGridUsp=mFloor_buy_doc_new';
		url += '&ExtGridAlias=BuyOrdDocNew';
		url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
		url += '&F1068=ORDER';
		ExecCtrl.entrySendUrl(url);
	},

	ordDocNewHook: function(node,append) {
		ItmCtrl.resultCommonHook(node,'buyorddocnew','SMS.store.BuyDocNew');
	},

	// ORDER NEW CLOSE
	ordDocNewCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyorddocnew','buyorddocopen');
	},

	// ORDER NEW RESULT KEYUP
	ordDocNewSearchKeyUp: function(search,e) {
		if (e.event.keyCode == 13) {
			ItmCtrl.commonSearchKeyUp(search,['FindVendor'],[search.getValue()]);
		}
	},

	// ORDER NEW GRID CLICK
	ordDocNewGridItemClick: function(list, index, target, record, e, eOpts) {
		ExecCtrl.entrySendUrl('FCT=3110&HDRRECF1068=ORDER&ENTRY='+ record.get('F27'));
	},

//// ORDER MENU ////////////////////////////////////////////////////////////////////////////////////////////////

	// ORDER START HOOK
	ordStartHook: function(nodehook) {
		var node = Ext.DomQuery.selectNode("data record", nodehook);
		var form = ExecCtrl.windowAdd('buyordstart');

		if (!form.store) BaseCtrl.formNewStore(form,'SMS.store.BuyViewSum');
		form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.BuyViewSum')));

		var record = form.getRecord();
		BaseCtrl.hotPoolAdd('F1032',record.get('F1032'));
		BaseCtrl.hotPoolAdd('F1101',record.get('F1101')); // line
		BaseCtrl.hotPoolAdd('F27',record.get('F27'));
		BaseCtrl.hotPoolAdd('F1068', record.get('F1068'));
		BaseCtrl.hotPoolAdd('F1056', record.get('F1056'));
		BaseCtrl.hotPoolAdd('F1057', record.get('F1057'));
	},

	// ORDER CURRENT ITEM
	ordStartCurrentItmBtnClick: function(btn) {
		var url = 'FCT=3652';
		url += '&ENTRY=' + BaseCtrl.hotPoolGet('F1101');
		ExecCtrl.entrySendUrl(url);
	},

	// ORDER SUSPEND
	ordStartSuspendDocBtnClick: function(btn) {
		ExecCtrl.entrySendUrl('FCT=3140');
	},

	// ORDER CONTEXT MENU
	ordStartMenuBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn,
			[
				{text: msgBuyordStartMenuList, value: 'LIST_ITEM' },
				{text: msgBuyordStartMenuHdr, value: 'HEADER'},
				{text: msgBuyordStartMenuPrtRpt, value: 'PRINT_REPORT'},
				{ text: msgBuyordStartMenuBmp, value: 'PICTURE' },
				{text: msgBuyordStartMenuCancel, value: 'CANCEL'},
				{text: msgBuyordStartMenuSuspend, value: 'SUSPEND'},
				{text: msgBuyordStartMenuClose, value: 'CLOSE'}
			],
			function(value) {
				var url;
				if (value == 'LIST_ITEM') {
					url = 'cgi=mFloor_xml_hook.xml';
					url += '&ExtGridUsp=mFloor_buy_rec_lin_list';
					url += '&ExtGridAlias=BuyOrdLinQuickResult';
					url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
					url += '&F1032=' + BaseCtrl.hotPoolGet('F1032');
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'HEADER') ExecCtrl.entrySendUrl('cgi=mFloor_buy_ord_hdr.xml');
				else if (value == 'PRINT_REPORT') ExecCtrl.entrySendUrl('cgi=mFloor_buy_ord_start.xml&PRINT=1');
				else if (value == 'PICTURE') {
					url = 'cgi=mFloor_buy_bill_img_list.xml';
					url += '&HOT_IDX_F1032=' + BaseCtrl.hotPoolGet('F1032');
					url += '&HOT_IDX_F1056=' + BaseCtrl.hotPoolGet('F1056');
					url += '&HOT_IDX_F1057=' + BaseCtrl.hotPoolGet('F1057');
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'CANCEL') ExecCtrl.entrySendUrl('FCT=3190');
				else if (value == 'SUSPEND') ExecCtrl.entrySendUrl('FCT=3140');
				else if (value == 'CLOSE') {
					var form = btn.up('formpanel');
					var record = form.getRecord();
					var f1032= record.get('F1032');
					var emailVdn= record.get('F2603');
					
					if (emailVdn) {
						Ext.Msg.show({
							title: msgBuyOrderDocCloseWarningTitle,
							message: msgBuyOrderDocCloseWarningMsg + emailVdn,
							buttons:
							[
								{itemId: 'ok', id: 'ok', text: msgBuyOrderDocCloseWarningOK},
								{itemId: 'cancel', id: 'cancel', text: msgBuyOrderDocCloseWarningCancel}
							],
							cls: 'sms-popup-warning',
							fn: function (btn) {
								if (btn == 'ok') {
									//close doc and send email
									url = 'sqi=mFloor_rec_export_mail';
									url += '&F1032=' + f1032;
									url += '&F2603=' + emailVdn;
									ExecCtrl.entrySendUrl(url);
								} else if (btn == 'cancel') {
									//close doc
									ExecCtrl.entrySendUrl('sqi=mFloor_rec_export_close');
								}
							}
						});
					} else {
						//No email to send doc
						//close doc
						ExecCtrl.entrySendUrl('sqi=mFloor_rec_export_close');
					}
				}
			}
		);
	},

//// ORDER HEADER ///////////////////////////////////////////////////

	// ORDER HEADER HOOK
	ordHdrHook: function(nodehook) {
		var node = Ext.DomQuery.selectNode("data record", nodehook);
		var form = Ext.Viewport.down('buyordhdr');
		if (!form) form = ExecCtrl.windowAdd('buyordhdr');

		if (!form.store) BaseCtrl.formNewStore(form,'SMS.store.BuyRecHdr');
		form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.BuyRecHdr')));
	},

	// ORDER HEADER CLOSE
	ordHdrCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyordhdr','buyordstart');
	},

//// ORDER ITEM ////////////////////////////////////////////////////

// ORDER ITEM HOOK
	ordItmStartHook: function(node) {
		this.buyItmStartHook(node,'buyorditmstart','BuyRecReg');

		var form = Ext.Viewport.down('buyorditmstart');
		if (form) {
			var record = form.getRecord();
			var fld;

			if (!record.get('OPER1')) {
				fld = form.down('textfield[name=OPER1]');
				fld.up().up().setHidden(true);
			}

			if (!record.get('OPER2')) {
				fld = form.down('textfield[name=OPER2]');
				fld.up().setHidden(true);
			}

			if (!record.get('MOV_DATE1')) {
				fld = form.down('datepickerfield[name=MOV_DATE1]');
				fld.up().setHidden(true);
			}

			if (!record.get('MOV_DATE2')) {
				fld = form.down('datepickerfield[name=MOV_DATE2]');
				fld.up().setHidden(true);
			}

			if (!record.get('MOV_DATE3')) {
				fld = form.down('datepickerfield[name=MOV_DATE3]');
				fld.up().setHidden(true);
			}

			if (!record.get('MOV_DATE4')) {
				fld = form.down('datepickerfield[name=MOV_DATE4]');
				fld.up().setHidden(true);
			}
		}
	},

	// ORDER ITEM CONTEXT MENU
	ordItmStartMenuBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn,
			[
				{text: msgBuyordItmStartMenuProduct, value: 'PRODUCT'},
				{text: msgBuyordItmStartMenuMov, value: 'MOVEMENT'},
				{text: msgBuyordItmStartMenuList, value: 'LIST_ITEM'},
				{text: msgBuyordItmStartMenuItmRefresh, value: 'ITEM_REFRESH'},
				{text: msgBuyordItmStartMenuDel, value: 'DELETE'}
			],
			function(value) {
				var url = '';
				if (value == 'PRODUCT') {
					var win = Ext.Viewport.down('itmhost');
					if (win) {
						var form = Ext.Viewport.down('itmstart');
						if (form)
							Ext.Viewport.setActiveItem(form);
					}					
					ExecCtrl.windowAdd('itmstart');
					url = 'cgi=mFloor_itm_info.xml&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'MOVEMENT') {
					ExecCtrl.windowAdd('buyorditmdatesearch');
				}
				else if (value == 'LIST_ITEM') {
					url = 'cgi=mFloor_xml_hook.xml';
					url += '&ExtGridUsp=mFloor_buy_rec_lin_list';
					url += '&ExtGridAlias=BuyOrdLinQuickResult';
					url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
					url += '&F1032=' + BaseCtrl.hotPoolGet('F1032');
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'ITEM_REFRESH') ExecCtrl.entrySendUrl('FCT=3655');
				else if (value == 'DELETE') ExecCtrl.entrySendUrl('FCT=3650');
			}
		);
	},

	// ORDER ITEM CLOSE
	ordItmStartCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyorditmstart','buyordstart');
	},

	// ORDER ITEM FORMATS
	ordItmStartFormatBtnClick: function(btn) {
		var url = 'jsPop=list,jsUsp=mFloor_buy_rec_format';
		url += '&F01=' + BaseCtrl.hotPoolGet('F01');
		url += '&F27=' + BaseCtrl.hotPoolGet('F27');
		url += ',jsSrc=FORMAT_COUNT,jsAction=run';
		var options = {};
		options.smsCallback = BuyCtrl.dsdItmStartFormatCallBack;
		ExecCtrl.entryExecPrm(btn,url,options);
	},

	// ORDER ITEM FORMATS CALLBACK
	ordItmFormatCallBack: function(source,selection) {
		var value = '';
		if (selection.length>0) value = selection[0].get('data');
		BaseCtrl.hotPoolAdd('F1184',value);

		var url = 'FCT=3655';
		url += '&FORMAT=' + value;
		url += '&F01=' + BaseCtrl.hotPoolGet('F01') ;
		url += '&F27=' + BaseCtrl.hotPoolGet('F27');
		ExecCtrl.entrySendUrl(url);
	},

	//// ORDER ITEM LIST ////////////////////////////////////////////////////////////////////

	// ORDER LIST INIT
	ordLinQuickResultHook: function(node,append) {
		ItmCtrl.resultCommonHook(node,'buyordlinquickresult','SMS.store.BuyViewLines');
	},

	// ORDER LIST CLOSE
	ordLinQuickResultCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyordlinquickresult','buyordstart');
	},

	// ORDER LIST GRID ITEM CLICK
	ordLinQuickGridItemClick: function(list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		var url = 'FCT=3652&ENTRY=' + record.get('F1101');
		ExecCtrl.entrySendUrl(url);
	},


//// REPORT DATE SEARCH /////////////////////////////////////////////////////////////////////////////////////

	itmDateSearchInitialize: function(form) {
		BaseCtrl.sessionCur().getFormConfig(form,'mFloor_BuyOrdItmDate');
		var start=form.down('*[name=D254]');
		var stop=form.down('*[name=E254]');
		if (start) setTimeout(function(){start.setValue(BaseCtrl.getDateInterval(BaseCtrl.sessionCur().getConfig('mFloor_BuyOrdItmDate','F1031','W')+'D',new Date()));},200);
		if (stop) setTimeout(function(){stop.setValue(BaseCtrl.getDateInterval(BaseCtrl.sessionCur().getConfig('mFloor_BuyOrdItmDate','F1031','W')+'F',new Date()));},200);
		setTimeout(function () { BaseCtrl.sessionCur().setFormConfig(form, 'mFloor_BuyOrdItmDate'); }, 250);
	},

	itmDateSearchPeriodChange: function(combo) {
		var form=combo.up('formpanel');
		var start=form.down('*[name=D254]');
		var stop=form.down('*[name=E254]');
		if (start) setTimeout(function(){start.setValue(BaseCtrl.getDateInterval(BaseCtrl.sessionCur().getConfig('mFloor_BuyOrdItmDate','F1031','W')+'D',new Date()));},500);
		if (stop) setTimeout(function(){stop.setValue(BaseCtrl.getDateInterval(BaseCtrl.sessionCur().getConfig('mFloor_BuyOrdItmDate','F1031','W')+'F',new Date()));},500);
		setTimeout(function(){BaseCtrl.sessionCur().setFormConfig(form,'mFloor_BuyOrdItmDate');},550);
	},
	
	// REPORT SEARCH CLOSE
	itmDateSearchCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyorditmdatesearch');
	},

	// REPORT PAST DATE
	itmDateSearchPastDateBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var start=form.down('*[name=D254]');
		var stop=form.down('*[name=E254]');
		if (start) start.setValue(BaseCtrl.getDatePast(BaseCtrl.sessionCur().getConfig('mFloor_BuyOrdItmDate','F1031','D'),start.getValue()));
		if (stop) stop.setValue(BaseCtrl.getDatePast(BaseCtrl.sessionCur().getConfig('mFloor_BuyOrdItmDate','F1031','D'),stop.getValue()));
		BaseCtrl.sessionCur().setFormConfig(form,'mFloor_BuyOrdItmDate');
	},

	// REPORT FUTURE DATE
	itmDateSearchFutureDateBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var start=form.down('*[name=D254]');
		var stop=form.down('*[name=E254]');
		if (start) start.setValue(BaseCtrl.getDateFuture(BaseCtrl.sessionCur().getConfig('mFloor_BuyOrdItmDate','F1031','D'),start.getValue()));
		if (stop) stop.setValue(BaseCtrl.getDateFuture(BaseCtrl.sessionCur().getConfig('mFloor_BuyOrdItmDate','F1031','D'),stop.getValue()));
		BaseCtrl.sessionCur().setFormConfig(form,'mFloor_BuyOrdItmDate');
	},

	// REPORT LAUNCH
	itmDateSearchLaunchBtnClick: function (btn) {
		BuyCtrl.itmDateResultView(btn);
	},

//// REPORT DATE RESULT  ///////////////////////////////////////////////////////////////////////////

	itmDateResultView: function(src,code,obj,evt) {
		var url = ItmCtrl.itemCommonView(src,evt,'mFloor_xml_hot.xml&ExtGridUsp=mFloor_ItmRptDate&ExtGridAlias=BuyOrdItmDateResult','buyorditmdateresult',code);
		url += BaseCtrl.replaceParamStore(BaseCtrl.sessionCur().getUrlConfig('mFloor_BuyOrdItmDate'), "mFloor_BuyOrdItmDate/");
		ExecCtrl.entrySendUrl(url);
	},

	// REPORT DATE RESULT HOOK
	itmDateResultHook: function(node) {
		var form = ExecCtrl.windowAdd('buyorditmdateresult');
		var grid = form.down('dataview');
		var store = BaseCtrl.gridNewStore('SMS.store.ItmRptDate');
		grid.setStore(store);
		BaseCtrl.gridFromNode(node,store);

		var edit = form.down('#searchEdit');
		if (edit) edit.setValue(ItmCtrl.itmLastCode);
	},

	// REPORT DATE RESULT CLOSE
	itmDateResultCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyorditmdateresult');
	},
	
//// RECV ////////////////////////////////////////////////////////////////////////////////////////////////////////

//// RECV OPEN ///////////////////////////////////////////////////////////////////////////////////////////////////

	recDocOpen: function(btn) {
	
	
	
	
		ExecCtrl.entrySendUrl('sqi=mFloor_buy_rec_new');
	},

	recDocOpenHook: function(node,append) {
		ItmCtrl.resultCommonHook(node,'buyrecdocopen','SMS.store.BuyDocList');
	},

	// RECV DOC CLOSE
	recDocOpenCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyrecdocopen','trsstart');
	},

	// RECV DOC VENDOR KEYUP
	recDocOpenSearchKeyUp: function(search,e) {
		if (e.event.keyCode == 13) {
			ItmCtrl.commonSearchKeyUp(search,['FindVendor'],[search.getValue()]);
		}
	},

	// RECV DOC GRID ITEM CLICK
	recDocOpenGridItemClick: function(list, index, target, record, e, eOpts) {
		var url = 'FCT=3120&ENTRY='+record.get('F1032');
		if (record.get('F1068')=='ORDER')
			url += '&HDRRECF1068=ORDER&HDRRECF1068NEW=RECV'; else
			url += '&HDRRECF1068=RECV';
		ExecCtrl.entrySendUrl(url);
	},

//// RECV NEW ///////////////////////////////////////////////////////////////////////////////////////

	recDocNew: function(btn) {
		var url = 'cgi=mFloor_xml_hook.xml';
		url += '&ExtGridUsp=mFloor_buy_doc_new';
		url += '&ExtGridAlias=BuyRecDocNew';
		url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
		url += '&F1068=ORDER';
		ExecCtrl.entrySendUrl(url);
	},

	recDocNewHook: function(node,append) {
		ItmCtrl.resultCommonHook(node,'buyrecdocnew','SMS.store.BuyDocNew');
	},

	// RECV NEW CLOSE
	recDocNewCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyrecdocnew','buyrecdocopen');
	},

	// RECV NEW VENDOR KEYUP
	recDocNewSearchKeyUp: function(search,e) {
		if (e.event.keyCode == 13) {
			ItmCtrl.commonSearchKeyUp(search,['FindVendor'],[search.getValue()]);
		}
	},

	// RECV NEW GRID ITEM CLICK
	recDocNewGridItemClick: function(list, index, target, record, e, eOpts) {
		var url = 'FCT=3110&HDRRECF1068=RECV';
		url += '&ENTRY='+ record.get('F27');
		ExecCtrl.entrySendUrl(url);
	},


//// RECV START //////////////////////////////////////////////////////////

	//RECV START HOOK
	recStartHook: function(nodehook) {
		var node = Ext.DomQuery.selectNode("data record", nodehook);
		var form = ExecCtrl.windowAdd('buyrecstart');

		if (!form.store) BaseCtrl.formNewStore(form,'SMS.store.BuyViewSum');
		form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.BuyViewSum')));

		var record = form.getRecord();
		BaseCtrl.hotPoolAdd('F1032',record.get('F1032'));
		BaseCtrl.hotPoolAdd('F1101',record.get('F1101')); // line
		BaseCtrl.hotPoolAdd('F27',record.get('F27'));
		BaseCtrl.hotPoolAdd('F1068',record.get('F1068'));
	},

	//RECV ITEM CURRENT
	recStartCurrentItmBtnClick: function(btn) {
		var url = 'FCT=3652';
		url += '&ENTRY=' + BaseCtrl.hotPoolGet('F1101');
		ExecCtrl.entrySendUrl(url);
	},

	recStartListLinItemsBtnClick: function(btn){
		url = 'cgi=mFloor_xml_hook.xml';
		url += '&ExtGridUsp=mFloor_buy_rec_lin_list';
		url += '&ExtGridAlias=BuyRecLinQuickResult';
		url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
		url += '&F1032=' + BaseCtrl.hotPoolGet('F1032');
		ExecCtrl.entrySendUrl(url);

	},

	//RECV START SUSPEND
	recStartSuspendDocBtnClick: function(btn) {
		ExecCtrl.entrySendUrl('sqi=mFloor_buy_rec_close');
		//ExecCtrl.windowClose('buyrecstart');
		DeviceCtrl.disableHandheldScanners();
		ExecCtrl.windowClose('buyrecstart','trsstart');

/*		var form = Ext.Viewport.down('buystart');
		if (!form) {
			ExecCtrl.windowClose('buystart');

		}

		var card = Ext.Viewport.down('trshost');
		if (!card) ExecCtrl.windowAdd('trshost');
		ExecCtrl.windowAdd('trsstart'); 
*/		
	},

	// Displaying the context menu for modify screens
	recStartMenuBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn,
			[
				{text: msgBuyrecStartMenuQuick, value: 'QUICK'},
				{text: msgBuyrecStartMenuUnScan, value: 'UNSCANNED'},
				{text: msgBuyrecStartMenuShort, value: 'SHORT'},
				{text: msgBuyrecStartMenuHdr, value: 'HEADER'},
				{text: msgBuyrecStartMenuPrtRpt, value: 'PRINT_REPORT'},
				{text: msgBuyrecStartMenuBmp, value: 'PICTURE'},
				{text: msgBuyrecStartMenuCancel, value: 'CANCEL'},
				{text: msgBuyrecStartMenuSUspend, value: 'SUSPEND'},
				{text: msgBuyrecStartMenuClose, value: 'CLOSE'}
			],
			function(value) {
				var url= '';
				if (value == 'QUICK') {
					url = 'cgi=mFloor_xml_hook.xml';
					url += '&ExtGridUsp=mFloor_buy_rec_lin_list';
					url += '&ExtGridAlias=BuyRecLinQuickResult';
					url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
					url += '&F1032=' + BaseCtrl.hotPoolGet('F1032');
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'UNSCANNED') {
					url = 'cgi=mFloor_xml_hook.xml';
					url += '&ExtGridUsp=mFloor_buy_rec_lin_unscanned';
					url += '&ExtGridAlias=BuyRecLinUnscannedResult';
					url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
					url += '&F1032=' + BaseCtrl.hotPoolGet('F1032');
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'SHORT') {
					url = 'cgi=mFloor_xml_hook.xml';
					url += '&ExtGridUsp=mFloor_buy_rec_lin_short';
					url += '&ExtGridAlias=BuyRecLinShortResult';
					url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
					url += '&F1032=' + BaseCtrl.hotPoolGet('F1032');
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'HEADER') {
					url = 'cgi=mFloor_buy_rec_hdr.xml';
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'PRINT_REPORT') {
					url = "cgi=mFloor_buy_rec_start.xml&PRINT=1";
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'PICTURE') {
					url = 'cgi=mFloor_buy_bill_img_list.xml';
					url += '&HOT_IDX_F1032=' + BaseCtrl.hotPoolGet('F1032');
					url += '&HOT_IDX_F1056=' + BaseCtrl.hotPoolGet('F1056');
					url += '&HOT_IDX_F1057=' + BaseCtrl.hotPoolGet('F1057');
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'CANCEL') {
					ExecCtrl.entrySendUrl('FCT=3190');
				}
				else if (value == 'SUSPEND') {
					ExecCtrl.entrySendUrl('FCT=3140');
				}
				else if (value == 'CLOSE') {
					url = 'sqi=mFloor_rec_doc_close&CONFIRM_CLOSE=1';
					ExecCtrl.entrySendUrl(url);
				}
			}
		);
	},

//// RECV HEADER ///////////////////////////////////////////////////////////////////////////////////////

	//RECV HEADER HOOK
	recHdrHook: function(nodehook) {
		var node = Ext.DomQuery.selectNode("data record", nodehook);
		var form = Ext.Viewport.down('buyrechdr');
		if (!form) form = ExecCtrl.windowAdd('buyrechdr');

		if (!form.store) BaseCtrl.formNewStore(form,'SMS.store.BuyRecHdr');
		form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.BuyRecHdr')));
	},

	//RECV HEADER CLOSE
	recHdrCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyrechdr','buyrecstart');
	},

//// RECV ITEM /////////////////////////////////////////////////////////

	//RECV ITEM HOOK
	recItmStartHook: function(node) {
		this.buyItmStartHook(node,'buyrecitmstart','BuyRecReg');
	},

	//RECV ITEM CONTEXT MENU
	recItmStartMenuBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn,
			[
				{text: msgBuyrecStartMenuProduct, value: 'PRODUCT'},
				{text: msgBuyrecStartMenuQuick, value: 'QUICK'},
				{text: msgBuyrecStartMenuItmRefresh, value: 'ITEM_REFRESH'},
				{text: msgBuyrecStartMenuDel, value: 'DELETE'}
			],
			function(value) {
				var url= '';
				if (value == 'PRODUCT') {
					var win = Ext.Viewport.down('itmhost');
					if (win) {
						var form = Ext.Viewport.down('itmstart');
						if (form)
							Ext.Viewport.setActiveItem(form);
					}					
					ExecCtrl.windowAdd('itmstart');
					url = 'cgi=mFloor_itm_info.xml&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
					ExecCtrl.entrySendUrl(url);
				}
				if (value == 'QUICK') {
					url = 'cgi=mFloor_xml_hook.xml';
					url += '&ExtGridUsp=mFloor_buy_rec_lin_list';
					url += '&ExtGridAlias=BuyRecLinQuickResult';
					url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
					url += '&F1032=' + BaseCtrl.hotPoolGet('F1032');
					ExecCtrl.entrySendUrl(url);
				}
				else if (value == 'ITEM_REFRESH') ExecCtrl.entrySendUrl('FCT=3655');
				else if (value == 'DELETE') ExecCtrl.entrySendUrl('FCT=3650');
			}
		);
	},

	//RECV ITEM CLOSE
	recItmStartCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyrecitmstart','buyrecstart');
	},

	//RECV ITEM FORMAT
	recItmStartFormatBtnClick: function(btn) {
		var url = 'jsPop=list,jsUsp=mFloor_buy_rec_format';
		url += '&F01=' + BaseCtrl.hotPoolGet('F01');
		url += '&F27=' + BaseCtrl.hotPoolGet('F27');
		url += ',jsSrc=FORMAT_COUNT,jsAction=run';
		var options = {};
		options.smsCallback = BuyCtrl.dsdItmStartFormatCallBack;
		ExecCtrl.entryExecPrm(btn,url,options);
	},

	//RECV ITEM FORMAT CALLBACK
	buyRecItmFormatCallBack: function(source,selection) {
		var value = '';
		if (selection.length>0) value = selection[0].get('data');
		BaseCtrl.hotPoolAdd('F1184',value);

		var url = 'FCT=3655';
		url += '&FORMAT=' + value;
		url += '&F01=' + BaseCtrl.hotPoolGet('F01') ;
		url += '&F27=' + BaseCtrl.hotPoolGet('F27');
		ExecCtrl.entrySendUrl(url);
	},

//// RECV DEPT //////////////////////////////////////////////////////////

	//RECV START DEPT
	recStartDptBtnClick: function(btn) {
		Ext.Msg.show({
			title: msgBuyrecStartDptTitle,
			message: msgBuyrecStartDptMsg,
			buttons: Ext.MessageBox.OKCANCEL,
			prompt : {
				xtype : 'textfield',
				maxlength : 180,
				autocapitalize : true,
				clearIcon : false,
				listeners: {
					keyup: {
						fn: function (fld, e) {
							if (e.event.keyCode == 13) {
								e.stopEvent();
								Ext.Msg.onClick(Ext.Msg.buttonsToolbar.getItems().getByKey('ok'));
							}
						}
					}
				}
			},
			fn: function (buttonId, value) {
				var url = '';
				if (buttonId == 'ok' && value != '') {
					url = 'FCT=3555&ITM=' + value;
					url += '&HOT_IDX_F03=' + value;
					url += '&RETPAGE=cgi=mFloor_buy_rec_dpt.xml';
					ExecCtrl.entrySendUrl(url);
				} else if (buttonId == 'cancel') {
					ExecCtrl.entrySendUrl('cgi=mFloor_buy_rec_start.xml&SKIPFOCUS=1');
				}
			},
			cls: 'sms-popup-prompt'
		});
		Ext.Msg.down( 'textfield' ).focus();
	},

	//RECV DEPT HOOK
	recDptStartHook: function(nodehook) {
		var node = Ext.DomQuery.selectNode("data record", nodehook);
		var form = ExecCtrl.windowAdd('buyrecdptstart');

		if (!form.store) BaseCtrl.formNewStore(form,'SMS.store.BuyRecReg');
		form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.BuyRecReg')));
		var record = form.getRecord();

		// set message
		var text = form.down('#messageText');
		if (record.get('warningMsg') != null && record.get('warningMsg') != '') {
			text.setHidden(false);
			text.setHtml(record.get('warningMsg'));
		} else {
			text.setHidden(true);
			text.setHtml('');
		}

		var fld = form.down('textfield[name=F1041]');
		var fldTotal = form.down('textfield[name=F65]');
		if (record.get('F1041') != null && record.get('F1041') != '') {
			fld.up().setHidden(false);
			fldTotal.up().setHidden(false);
		} else {
			fld.up().setHidden(true);
			fldTotal.up().setHidden(true);
		}
	},

	//RECV DEPT DELETE
	recDptDeleteBtnClick: function(btn) {
		ExecCtrl.entrySendUrl('FCT=3650&keep=0');
	},

	//RECV DEPT CLOSE
	recDptCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyrecdptstart','buyrecstart');
	},

//// RECV LIST /////////////////////////////////////////////////////////////////////////////////////////

	// RECV LIST INIT
	recLinQuickResultHook: function(node,append) {
		ItmCtrl.resultCommonHook(node,'buyreclinquickresult','SMS.store.BuyViewLines');
	},

	//RECV LIST RESULT CLOSE
	recLinQuickResultCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyreclinquickresult','buyrecstart');
	},

	//RECV LIST GRID ITEM CLICK
	recLinQuickGridItemClick: function(list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		var url = 'FCT=3652&ENTRY=' + record.get('F1101');
		ExecCtrl.entrySendUrl(url);
	},

//// RECV SHORTS ////////////////////////////////////////////////////////////////////////////////////

	// RECV LIST INIT
	recLinShortResultHook: function(node,append) {
		ItmCtrl.resultCommonHook(node,'buyreclinshortresult','SMS.store.BuyViewShort');
	},

	// RECV SHORTS CLOSE
	recLinShortResultCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyreclinshortresult','buyrecstart');
	},

	// RECV SHORT GRID ITEM CLICK
	recLinShortGridItemClick: function(list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		var url = 'FCT=3652&ENTRY=' + record.get('F1101');
		ExecCtrl.entrySendUrl(url);
	},


//// RECV UNSCANNED //////////////////////////////////////////////////////////////////////////////

	// RECV UNSCANNED RESULT INIT
	recLinUnscannedResultHook: function(node,append) {
		ItmCtrl.resultCommonHook(node,'buyreclinunscannedresult','SMS.store.BuyViewUnscanned');
	},

	// RECV UNSCANNED RESULT CLOSE
	recLinUnscannedResultCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyreclinunscannedresult','buyrecstart');
	},

	// RECV UNSCANNED GRID ITEM CLICK
	recLinUnscannedGridItemClick: function(list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		var url = 'FCT=3652&ENTRY=' + record.get('F1101');
		ExecCtrl.entrySendUrl(url);
	},


/// BUY QUICK ///////////////////////////////////////////////////////////////////////////////////////////

	itmQuickResult: function (btn) {
		var url = 'cgi=mFloor_xml_hook.xml';
		url += '&ExtGridUsp=mFloor_buy_itm_search';
		url += '&ExtGridAlias=BuyItmQuickResult';
		url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
		url += '&F27='+ BaseCtrl.hotPoolGet('F27');
		ExecCtrl.entrySendUrl(url);
	},

	itmQuickResultHook: function(node) {
		ItmCtrl.resultCommonHook(node,'buyitmquickresult','SMS.store.BuyItmList');
	},

	// BUY QUICK CLOSE
	itmQuickResultCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('buyitmquickresult');
	},

	// BUY QUICK VENDOR KEYUP
	itmQuickResultFindVendorKeyUp: function(search,e) {
		if (e.event.keyCode == 13) {
			ItmCtrl.commonSearchKeyUp(search,['FindVendor','F27'],[search.getValue(),BaseCtrl.hotPoolGet('F27')]);
		}
	},

	// BUY QUICK GRID ITEM CLICK
	itmResultGridItemTap: function(list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		ItmCtrl.itmLastCode=null;

		var url = 'FCT=3510';
		url += '&HOT_IDX_F01='+record.get('F01');
		url += '&HOT_IDX_F1184=' + record.get('F1184');
		url += '&HOT_IDX_F27=' + BaseCtrl.hotPoolGet('F27');
		url += '&HOT=1' ;

		// Format provided
		var mode = BaseCtrl.hotPoolGet('F1068');
		var uom = record.get('F1887');
		if (uom) {
			if (uom == 'U') url += '&UNIT=1'; else 
			if (uom == 'W') url += '&WEIGHT=1';
			else url += '&CASE=1';
		}
		// Default quantity
		else {
			if (mode == 'ORDER') url += '&QTY=' + BaseCtrl.sessionCur().getConfig('mFloor_BuyConfig','ordItmQty','1');
			else if (mode == 'RECV') url += '&QTY=' + BaseCtrl.sessionCur().getConfig('mFloor_BuyConfig','recItmQty','1');
			else if (mode == 'DSD') url += '&QTY=' + BaseCtrl.sessionCur().getConfig('mFloor_BuyConfig','dsdItmQty','1');
		}

		// Default gotoexist
		if (mode == 'ORDER') url += '&GOTOEXIST=' + BaseCtrl.sessionCur().getConfig('mFloor_BuyConfig','ordItmGotoExist','0');
		else if (mode == 'RECV') url += '&GOTOEXIST=' + BaseCtrl.sessionCur().getConfig('mFloor_BuyConfig','recItmGotoExist','0');
		else if (mode == 'DSD') url += '&GOTOEXIST=' + BaseCtrl.sessionCur().getConfig('mFloor_BuyConfig','dsdItmGotoExist','0');

		ExecCtrl.entrySendUrl(url);
	},

//// ITEM LOOKUP CODE //////////////////////////////////////////////////////

	// SEARCH CODE FIELD
	buySearchEditKeyUp: function(search,evt,eOpts) {
		var data = search.getValue();
		if (!evt || (evt.event.keyCode==13 && data.length>0)) {
			data = DeviceCtrl.scannerDecode(data);
			BuyCtrl.buyCodeEntry(search,data);
		}
	},

	// SCANNER BUTTON
	buyScanCamBtnClick: function(btn) {
		DeviceCtrl.scannerCamBtnClick(btn,BuyCtrl.buyCodeEntry);
	},

	// Manual code entry
	buyCodeEntry: function(btn,code) {
		var record = Ext.create('SMS.model.BuyItmList');
		ItmCtrl.itmLastCode = code;
		var GoToExist;

		var url = 'FCT=3510';
		url += '&HOT_IDX_F01$SCAN_MFLOOR='+ code;
		url += '&HOT_PRM_F01=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig','hot_prm','1');
		url += '&HOT_IDX_F27=' + BaseCtrl.hotPoolGet('F27');
		url += '&HOT=1';

		// Default config
		var mode = BaseCtrl.hotPoolGet('F1068');
		if (mode == 'ORDER') {
			url += '&QTY=' + BaseCtrl.sessionCur().getConfig('mFloor_BuyConfig', 'ordItmQty', '1');
			GoToExist = BaseCtrl.sessionCur().getConfig('mFloor_BuyConfig', 'ordItmGotoExist', '0');
			url += '&GOTOEXIST=' + GoToExist;
		}
		else if (mode == 'RECV') {
			url += '&QTY=' + BaseCtrl.sessionCur().getConfig('mFloor_BuyConfig','recItmQty','1');
			GoToExist = BaseCtrl.sessionCur().getConfig('mFloor_BuyConfig', 'recItmGotoExist', '0');
			url += '&GOTOEXIST=' + GoToExist;
		}
		else if (mode == 'DSD') {
			url += '&QTY=' + BaseCtrl.sessionCur().getConfig('mFloor_BuyConfig','dsdItmQty','1');
			GoToExist = BaseCtrl.sessionCur().getConfig('mFloor_BuyConfig', 'dsdItmGotoExist', '0');
			url += '&GOTOEXIST=' + GoToExist;
		}
		if ((GoToExist == '1') || (GoToExist == '0'))
			url += '&BUY_WARNING=';	

		ExecCtrl.entrySendUrl(url);
	},


//// ITEM CHANGE EVENT /////////////////////////////////////////////////////////

	// BEFORE CHANGE EVENT
	itemBeforeChangeEvent: function(record) {
		consoleLog('BuyHost.itemBeforeChangeEvent');
		if (record) {
			var fields = record.getFields();
			fields.each(function(field) {
				var name = field._name;
				var value = record.get(name);
				if (value != null) {
					if (name == 'F01') BaseCtrl.hotPoolAdd('F01',value);
					else if (name == 'REC_REG-F03') BaseCtrl.hotPoolAdd('F03',value);
					else if (name == 'F03') BaseCtrl.hotPoolAdd('F03',value);
					else if (name == 'F27') BaseCtrl.hotPoolAdd('F27',value);
					else if (name == 'F1032') BaseCtrl.hotPoolAdd('F1032',value);
					else if (name == 'F1068') BaseCtrl.hotPoolAdd('F1068',value);
					else if (name == 'F1184') BaseCtrl.hotPoolAdd('F1184',value);
					else if (name == 'F1101') BaseCtrl.hotPoolAdd('F1101',value);
				}
			});
		}
	},

	// AFTER CHANGE EVENT
	itemAfterChangeEvent: function(src) {
		consoleLog('BuyHost.itemAfterChangeEvent');
		var hostcmp = Ext.Viewport.down('buyhost');
		if (!hostcmp) return;

		var card;
		var url;
		var edit;
		var carditems = hostcmp.down('#cards').getInnerItems();

		// refresh all cards
		for (var cx=carditems.length-1; cx>-1; cx--) {
			card = carditems[cx];
			if (card!=src) {

				// set search edit
				edit = card.down('#searchEdit');
				if (edit) edit.setValue(ItmCtrl.itmLastCode);

				card.fireEvent('smsrefresh',src,null);
			}
		}
	},

/// CONFIG ////////////////////////////////////////////////////////////////////////////////////////////////////

	configBtnClick: function(btn) {
		TrsCtrl.configDisplay('buyconfig','BuyConfig');
	},

	configSaveBtnClick: function(btn) {
		var form  = btn.up('formpanel');
		TrsCtrl.configSave(form,'buyconfig','BuyConfig');
	}

});
