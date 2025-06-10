var ItmCtrl;

var msgItemWarningHookWarning = "CREATE";
var msgItemWarningHookTitle = "Confirmation";
var msgItemWarningHookMsg1 = "Item ";
var msgItemWarningHookMsg2 = " does not exist!<br>Do you want to create?";
var msgItemPromptLikeCodeConfrim = "Confirmation";
var msgItemPromptLikeCodeMsg = "This item has like codes,<br>do you want to update them?";
var msgItemPromptLikeCodeBtnNo = "No";
var msgItemPromptLikeCodeBtnYes = "Yes";
var msgItemPromptLikeCodeBtnNever = "Never";
var msgItemPromptLikeCodeBtnAlways = "Always";
var msgItemCardsMenuLup = "Verify";
var msgItemCardsMenuObj = "Main Item";
var msgItemCardsMenuPos = "Pos";
var msgItemCardsMenuPrice = "Price";
var msgItemCardsMenuCost = "Cost";
var msgItemCardsMenuLoc = "Shelf Location";
var msgItemCardsMenuAlt = "Alternate Code";
var msgItemCardsMenuBmp = "Item pictures";
var msgItemTasksMenuDplChg = "Deploy Change";
var msgItemTasksMenuLblInst = "Batch Label";
var msgItemTasksMenuLblPrt = "Print Label";
var msgItemTasksMenuRptDate = "Report by Date";
var msgItemTasksMenuRptBatch = "Report by Batch";
var msgItmTasksCaptionBuy = "Buying";
var msgItmTasksCaptionInv = "Inventory";
var msgItmTasksCaptionSell = "Selling";
var msgItmTasksCaptionMenu = "Main Menu";
var msgItemInfoMenuBtn = "View Price Levels";
var msgItemModAltAddBtnPrompt = "Enter the alternate code.";
var msgItemAltMenuLook = "View All Alternates";
var msgItemAltMenuAdd = "Add New Alternate";
var msgItemAltMenuDel = "Delete Alternate Code";
var msgItemAltMenuConfirm = "Confirmation";
var msgItemAltMenuMsg = "Do you want to delete the alternate code?";
var msgItemAltMenuBtnNo = "No";
var msgItemAltMenuBtnYes = "Yes";
var msgItemBmpMenuConfirm = "Confirmation";
var msgItemBmpMenuMsg = "Do you want to delete the item record?";
var msgItemBmpMenuBtnNo = "No";
var msgItemBmpMenuBtnYes = "Yes";
var msgItemBmpMenuAdd = "Add new image";
var msgItemBmpMenuDel = "Delete image";
var msgItemCostMenuLook = "View Vendors and Formats";
var msgItemCostMenuAdd = "Add vendor or format";
var msgItemCostMenuDel = "Delete Vendor and Format";
var msgItemCostMenuConfirm = "Confirmation";
var msgItemCostMenuMsg = "Do you want to delete the cost record?";
var msgItemCostMenuBtnNo = "No";
var msgItemCostMenuBtnYes = "Yes";
var msgItemLocMenuLook = "View All Locations";
var msgItemLocMenuAdd = "Add Location";
var msgItemLocMenuDel = "Delete Location";
var msgItemLocMenuConfirm = "Confirmation";
var msgItemLocMenuMsg = "Do you want to delete the location?";
var msgItemLocMenuBtnNo = "No";
var msgItemLocMenuBtnYes = "Yes";
var msgItemObjMenuConfirm = "Confirmation";
var msgItemObjMenuMsg = "Do you want to delete the item record?";
var msgItemObjMenuBtnNo = "No";
var msgItemObjMenuBtnYes = "Yes";
var msgItemPriceMenuLook = "View price levels";
var msgItemPriceMenuAdd = "Add price level";
var msgItemPriceMenuDel = "Delete price level";
var msgItemPriceMenuConfirm = "Confirmation";
var msgItemPriceMenuMsg = "Do you want to delete the price record?";
var msgItemPriceMenuBtnNo = "No";
var msgItemPriceMenuBtnYes = "Yes";
var msgItemresultCommonHookMore = "MORE";


Ext.define('SMS.controller.Itm', {
	extend: 'Ext.app.Controller',

	requires: [
		'Ext.Label',
		'Ext.form.FieldSet',
		'Ext.data.reader.Xml',
		'Ext.data.writer.Xml',
		'Ext.dataview.List',
		'Ext.carousel.Carousel',
		'Ext.field.DatePicker',
		'Ext.field.Search'
	],

	goBackCard: null,
	itmLastCode: null,

	init: function() {
		var me = this;

		Ext.Viewport.on({
			scope: this,
			appItemBeforeChangeEvent: this.itemBeforeChangeEvent,
			appItemAfterChangeEvent: this.itemAfterChangeEvent,

			appItmLupGeneralResultHook: this.lupGeneralResultHook,
			appItmLupQuickResultHook: this.lupQuickResultHook,

			appItmWarningHook: this.itmWarningHook,
			appItmInfoHook: this.infoHook,

			appItmModBmpHook: this.modBmpHook,
			appItmModPosHook: this.modPosHook,
			appItmModAltHook: this.modAltHook,
			appItmModCostHook: this.modCostHook,
			appItmModLocHook: this.modLocHook,
			appItmModObjHook: this.modObjHook,
			appItmModPriceHook: this.modPriceHook,

			appItmModAltLupHook: this.modAltLupHook,
			appItmModCostLupHook: this.modCostLupHook,
			appItmModLocLupHook: this.modLocLupHook,
			appItmModPriceLupHook: this.modPriceLupHook
		});

		this.control({

			// All textfield
			'textfield': {initialize: this.itmTextfieldInitialize},
			'searchfield': {initialize: this.itmTextfieldInitialize},

			// host
			'itmhost': {initialize: this.hostInitialize},
			'itmhost #tasksBtn': {tap: this.itmTasksBtnClick},
			'itmhost #cardsBtn': {tap: this.itmCardsBtnClick},
			'itmhost #scanCamBtn': {tap: this.itmScanCamBtnClick},
			'itmhost #searchEdit': {keyup: this.itmSearchEditKeyUp},
			'itmhost #tools': {toggle: this.itmToolBtnToggle},

			// start card
			'itmstart': {show: this.handheldScannerHandler},
			'itmstart #closeBtn': {tap: this.itmStartCloseBtnClick},
			'itmstart #taskbarBtn': {tap: this.itmTaskbarBtnClick},
			'itmstart #quickSearchBtn': { tap: this.itmStartQuickSearchBtnClick },
			'itmstart #configBtn': {tap: this.configBtnClick},

			// Item General Search & Result
			'itmlupgeneralsearch': {show: this.handheldScannerHandler},
			'itmlupgeneralsearch #resetBtn': {tap: this.lupGeneralSearchResetBtnClick},
			'itmlupgeneralsearch #searchRunBtn': {tap: this.lupGeneralSearchRunBtnClick},
			'itmlupgeneralsearch #closeBtn': {tap: this.lupGeneralSearchCloseBtnClick},
			'itmlupgeneralresult #closeBtn': {tap: this.lupGeneralResultCloseBtnClick},

			// Item Quick Result
			'itmlupquickresult': {show: this.handheldScannerHandler},
			'itmlupquickresult #closeBtn': {tap: this.lupQuickResultCloseBtnClick},
			'itmlupquickresult *[name=F02]' : {keyup: this.lupQuickResultF02KeyUp},

			// ItmInfo Scanning button
			'itminfo': {
				show: this.handheldScannerHandler,
				smsrefresh: this.infoView
			},
			'itminfo #menuBtn': {tap: this.infoMenuBtnClick},
			'itminfo #closeBtn': {tap: this.infoCloseBtnClick},

			// Itm Modification ALT_TAB
			'itmmodalt': {
				show: this.handheldScannerHandler,
				smsrefresh: this.modAltView
			},
			'itmmodalt #closeBtn': {tap: this.modAltCloseBtnClick},
			'itmmodalt #addBtn': {tap: this.modAltAddBtnClick},
			'itmmodalt #cancelBtn': {tap: this.modAltCancelBtnClick},
			'itmmodalt #saveBtn': {tap: this.modAltSaveBtnClick},
			'itmmodalt #menuBtn': {tap: this.modAltMenuBtnClick},

			'itmmodaltlup': {show: this.handheldScannerHandler},
			'itmmodaltlup #closeBtn': {tap: this.modAltLupCloseBtnClick},
			'itmmodaltlup #resultGrid': {itemtap: this.modAltLupGridItemTap},

			// Itm Modification BMT_TAB
			'itmmodbmp': {
				show: this.handheldScannerHandler,
				smsrefresh: this.modBmpView
			},
			'itmmodbmp #closeBtn': {tap: this.modBmpCloseBtnClick},
			'itmmodbmp #cancelBtn': {tap: this.modBmpCancelBtnClick},
			'itmmodbmp #saveBtn': {tap: this.modBmpSaveBtnClick},
			'itmmodbmp #menuBtn': {tap: this.modBmpMenuBtnClick},
			'itmmodbmp #captureImg': {tap: this.modBmpCatpureImgBtnClick},
			'itmmodbmp #cameraBtn': {tap: this.modBmpPhotoBtnClick},			

			// Itm Modification COST_TAB
			'itmmodcost': {
				show: this.handheldScannerHandler,
				smsrefresh: this.modCostView
			},
			'itmmodcost #closeBtn': {tap: this.modCostCloseBtnClick},
			'itmmodcost #addBtn': {tap: this.modCostAddBtnClick},
			'itmmodcost #cancelBtn': {tap: this.modCostCancelBtnClick},
			'itmmodcost #saveBtn': {tap: this.modCostSaveBtnClick},
			'itmmodcost #menuBtn': {tap: this.modCostMenuBtnClick},

			'itmmodcostlup': {show: this.handheldScannerHandler},
			'itmmodcostlup #closeBtn': {tap: this.modCostLupCloseBtnClick},
			'itmmodcostlup #resultGrid': {itemtap: this.modCostLupGridItemTap},

			// Itm Modification LOC_TAB
			'itmmodloc': {
				show: this.handheldScannerHandler,
				smsrefresh: this.modLocView
			},
			'itmmodloc #closeBtn': {tap: this.modLocCloseBtnClick},
			'itmmodloc #addBtn': {tap: this.modLocAddBtnClick},
			'itmmodloc #cancelBtn': {tap: this.modLocCancelBtnClick},
			'itmmodloc #saveBtn': {tap: this.modLocSaveBtnClick},
			'itmmodloc #menuBtn': {tap: this.modLocMenuBtnClick},

			'itmmodloclup': {show: this.handheldScannerHandler},
			'itmmodloclup #closeBtn': {tap: this.modLocLupCloseBtnClick},
			'itmmodloclup #resultGrid': {itemtap: this.modLocLupGridItemTap},

			// ITM MODIFICATION OBJ_TAB
			'itmmodobj': {
				show: this.handheldScannerHandler,
				smsrefresh: this.modObjView
			},
			'itmmodobj #closeBtn': {tap: this.modObjCloseBtnClick},
			'itmmodobj #cancelBtn': {tap: this.modObjCancelBtnClick},
			'itmmodobj #saveBtn': {tap: this.modObjSaveBtnClick},
			'itmmodobj #deleteBtn': {tap: this.modObjDeleteBtnClick},
			'itmmodobj #menuBtn': {tap: this.modObjMenuBtnClick},

			// ITM MODIFICATION POS_TAB
			'itmmodpos': {
				show: this.handheldScannerHandler,
				smsrefresh: this.modPosView
			},
			'itmmodpos #closeBtn': {tap: this.modPosCloseBtnClick},
			'itmmodpos #cancelBtn': {tap: this.modPosCancelBtnClick},
			'itmmodpos #saveBtn': {tap: this.modPosSaveBtnClick},

			// ITM MODIFICATION PRICE_TAB
			'itmmodprice': {
				show: this.handheldScannerHandler,
				smsrefresh: this.modPriceView
			},
			'itmmodprice #closeBtn': {tap: this.modPriceCloseBtnClick},
			'itmmodprice #addBtn': {tap: this.modPriceAddBtnClick},
			'itmmodprice #cancelBtn': {tap: this.modPriceCancelBtnClick},
			'itmmodprice #saveBtn': {tap: this.modPriceSaveBtnClick},
			'itmmodprice #regDataDelBtn': {tap: this.modPriceDelDateRegBtnClick},
			'itmmodprice #tprDataDelBtn': {tap: this.modPriceDelDateTprBtnClick},
			'itmmodprice #salDataDelBtn': {tap: this.modPriceDelDateSalBtnClick},
			'itmmodprice #instorDataDelBtn': {tap: this.modPriceDelDateInstoreBtnClick},
			'itmmodprice #menuBtn':{tap: this.modPriceMenuBtnClick},

			'itmmodpricelup': {show: this.handheldScannerHandler},
			'itmmodpricelup #closeBtn': {tap: this.modPriceLupCloseBtnClick},
			'itmmodpricelup #resultGrid': {itemtap: this.modPriceLupGridItemTap},

			// CONFIG
			'itmconfig': {show: this.handheldScannerHandler},
			'itmconfig #saveBtn': {tap: this.configSaveBtnClick}

		});
	},

	launch: function() {
		ItmCtrl = this;
	},

/// COMMON TOOLS /////////////////////////////////////////////////////////////////////////////////////////////

	/// HOST RENDER
	hostInitialize: function(win) {
		BaseCtrl.applyRights(win);
		BaseCtrl.applyEvents(win);
	},

	handheldScannerHandler: function (form) {
		
		//Application views
		var listForm = ["itmstart", "itminfo", "itmmodobj", "itmmodpos", "itmmodprice", "itmmodcost", "itmmodloc", "itmmodalt", "itmmodbmp"];

		//Deactivate the handheld scanner
		DeviceCtrl.disableHandheldScanners(form,listForm);	

		//Activate handheld scanner only for forms using code value
		if (listForm.indexOf(form.xtype) != -1)
			DeviceCtrl.enableHandheldScanners(form,listForm,ItmCtrl.itmDeviceScannerCallback);
	},

	itmDeviceScannerCallback: function(form,code) {
		if (!code || code == BaseCtrl.hotPoolGet('F01'))
			return;

		if ((form.xtype == 'itmstart') || (form.xtype == 'itmluprptsumresult'))
			ItmCtrl.itemChangeExec(null, code);
		else if (form.xtype == 'batchdocopen')
			ExecCtrl.entrySendUrl('cgi=mFloor_xml_hook.xml&ExtGridUsp=mFloor_batch_doc_list&ExtGridAlias=BatchDocOpen&F01$SCAN_MFLOOR=' + code);	
		else
			ItmCtrl.itemChangeExec(form, code);
	},

	itmTaskbarBtnClick: function(btn) {
		var win = Ext.Viewport.down('#taskbar');
		Ext.Viewport.setActiveItem(win);
	},

	itmToolBtnToggle: function(segBtn, btn, isPressed,eOpt) {
		ExecCtrl.windowToolBtnToggle(segBtn, btn, isPressed, eOpt);
	},

	// ALWAYS SELECT FIELD
	itmTextfieldInitialize: function(fld) {
// Make this configurable.
//		if (fld.xtype == 'textareafield') return;
//		fld.element.on({
//			tap : function(evt) {
//				var input=this.select('input');
//				setTimeout(function(){input.elements[0].select();},100);
//			}
//		});
	},

	// WARNING
	itmWarningHook: function(nodehook) {
		var node = Ext.DomQuery.selectNode("data record", nodehook);
		var warning = Ext.DomQuery.selectNode("warning", node).firstChild.nodeValue;
		var code = Ext.DomQuery.selectNode("F01", node).firstChild.nodeValue;

		if (warning == msgItemWarningHookWarning) {
			Ext.Msg.show({
				title: msgItemWarningHookTitle,
				message: msgItemWarningHookMsg1 + code + msgItemWarningHookMsg2,
				buttons: Ext.MessageBox.OKCANCEL,
				cls: 'sms-popup-prompt',
				fn: function(btn) {
					if (btn == 'ok') {
						var url= 'cgi=mFloor_itm_mod_obj.xml&NEWITEM=1';
						url += '&HOT_ADD=OBJ_TAB;POS_TAB;PRICE_TAB';
						url += '&HOT_IDX_F01='+ code;
						ExecCtrl.entrySendUrl(url);
					}
				}
			});
		}
	},

	// PROMPT FOR LIKE CODE
	itmPromptLikeCode: function(url) {
		var like = BaseCtrl.hotPoolGet('ModifyLikeCode');
		if (like && like>1) {
			if (like==3) url += '&ModifyLikeCode=1';
			ExecCtrl.entrySendUrl(url);
		}
		else {
			Ext.Msg.show({
				title: msgItemPromptLikeCodeConfrim,
				message: msgItemPromptLikeCodeMsg,
				buttons: [{text: msgItemPromptLikeCodeBtnNo, itemId: '0'}, {text: msgItemPromptLikeCodeBtnYes, itemId: '1', ui: 'action'},{text: msgItemPromptLikeCodeBtnNever, itemId: '2'},{text: msgItemPromptLikeCodeBtnAlways, itemId: '3'}],
				cls: 'sms-popup-prompt',
				fn: function(btn) {
					BaseCtrl.hotPoolAdd('ModifyLikeCode',btn);
					if (btn==1 || btn==3) url += '&ModifyLikeCode=1';
					ExecCtrl.entrySendUrl(url);
				}
			});
		}
	},

//// START ///////////////////////////////////////////////////////////////////////////////////

	// Quick Search
	itmStartQuickSearchBtnClick: function (btn) {
		var url = 'cgi=mFloor_xml_hook.xml';
		url += '&ExtGridUsp=mFloor_itm_searchGeneral';
		url += '&ExtGridAlias=ItmLupQuickResult';
		url += '&ExtMaxRecords=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
		ExecCtrl.entrySendUrl(url);
	},

	// CLOSE APP
	itmStartCloseBtnClick: function (btn) {
		DeviceCtrl.disableHandheldScanners();
		ExecCtrl.windowClose('itmstart');
	},

//// MENU CONTEXT ////////////////////////////////////////////////////////////////////////////

	// Modify menu
	itmCardsBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn, [
				{text: msgItemCardsMenuLup, value: 'LUP'},
				{text: msgItemCardsMenuObj, value: 'OBJ_TAB'},
				{text: msgItemCardsMenuPos, value: 'POS_TAB'},
				{text: msgItemCardsMenuPrice, value: 'PRICE_TAB'},
				{text: msgItemCardsMenuCost, value: 'COST_TAB'},
				{text: msgItemCardsMenuLoc, value: 'LOC_TAB'},
				{text: msgItemCardsMenuAlt, value: 'ALT_TAB'},
				{text: msgItemCardsMenuBmp, value: 'BMP_TAB'}
			],
			function(value) {
				var url= '';
				if (value == 'LUP') ItmCtrl.infoView(btn); else
				if (value == 'OBJ_TAB') ItmCtrl.modObjView(btn); else
				if (value == 'POS_TAB') ItmCtrl.modPosView(btn); else
				if (value == 'PRICE_TAB') ItmCtrl.modPriceView(btn); else
				if (value == 'COST_TAB') ItmCtrl.modCostView(btn); else
				if (value == 'LOC_TAB') ItmCtrl.modLocView(btn); else
				if (value == 'ALT_TAB') ItmCtrl.modAltView(btn); else
				if (value == 'BMP_TAB') ItmCtrl.modBmpView(btn);
			}
		);
	},

	// Task menu
	itmTasksBtnClick: function(btn) {
		var caption, action;

		// Jump back to transaction
		if (ExecCtrl.smsTrsMode=='REC') {
			caption= msgItmTasksCaptionBuy;
			action='BUY';
		} else if (ExecCtrl.smsTrsMode=='INV') {
			caption= msgItmTasksCaptionInv;
			action='INV';
		} else if (ExecCtrl.smsTrsMode=='CLT') {
			caption= msgItmTasksCaptionSell;
			action='CLT';
		} else {
			caption= msgItmTasksCaptionMenu;
			action='TRS';
		}

		Ext.ux.menu.Menu.open(
			btn, [
				{text: msgItemTasksMenuLblInst, value: 'LABEL_INSTANT'},
				{text: msgItemTasksMenuLblPrt, value: 'LABEL_PRINT'}			],
			function(value) {
				var url= '';
				var win;
				if (value == 'DEPLOY_CHANGE') {
					ExecCtrl.entrySendUrl('CGI=mFloor_itm_dpl_chg.xml');
				}

				if (value == 'LABEL_INSTANT')
					TasksCtrl.labelInstantView(btn);
				else if (value == 'LABEL_PRINT')
					TasksCtrl.labelPrintView(btn);
				else if (value == 'RptDate') {
					ItmCtrl.goBackCard='itmrptdateresult';
					ExecCtrl.windowAdd('itmrptdatesearch');
				}  else if (value == 'BUY') {
					win = Ext.Viewport.down('buyhost');
					Ext.Viewport.setActiveItem(win);
				} else if (value == 'CLT') {
					win = Ext.Viewport.down('sellhost');
					Ext.Viewport.setActiveItem(win);
				} else if (value == 'INV') {
					win = Ext.Viewport.down('invhost');
					Ext.Viewport.setActiveItem(win);
				} else if (value == 'TRS') {
					win = Ext.Viewport.down('trshost');
					Ext.Viewport.setActiveItem(win);
				}
			}
		);
	},

//// ITEM LOOKUP (VERIDICATION) //////////////////////////////////////////////////////////////

	infoView: function(src,code,obj,evt) {
		var url = ItmCtrl.itemCommonView(src,evt,'mFloor_itm_info.xml','itminfo',code);
		ExecCtrl.entrySendUrl(url);
	},

	infoHook: function(node) {
		ItmCtrl.itemCommonHook(node,'itminfo','SMS.model.ItmInfo');
	},

	// LUP MENU
	infoMenuBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn, [
				{text:msgItemInfoMenuBtn, value: 'LOOK'}
			],
			function(value) {
				var url= '';
				if (value == 'LOOK') {
					url = 'cgi=mFloor_xml_hook.xml&ExtGridUsp=mFloor_itm_price_list';
					url += '&F01=' +BaseCtrl.hotPoolGet('F01');
					url += '&ExtGridAlias=ItmModPriceLup';
					ExecCtrl.entrySendUrl(url);
				}
			}
		);
	},

	// CLOSE APP
	infoCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itminfo');

		var form = Ext.Viewport.down('taskslabelinstant');
		if (!form) {
			DeviceCtrl.disableHandheldScanners();
			ExecCtrl.windowClose('itmstart');

			var card = Ext.Viewport.down('trshost');
			if (!card) ExecCtrl.windowAdd('trshost');
			ExecCtrl.windowAdd('trsstart'); 
		}
	},


//// ALT_TAB FUNCTIONS ///////////////////////////////////////////////////////////////////////

	modAltView: function(src,code,obj,evt) {
		var url = ItmCtrl.itemCommonView(src,evt,'mFloor_itm_mod_alt.xml','itmmodalt',code);
		url += '&HOT_IDX_F154=' + BaseCtrl.hotPoolGet('F154');
		ExecCtrl.entrySendUrl(url);
	},

	// ALT Hook
	modAltHook: function(node,append) {
		ItmCtrl.itemCommonHook(node,'itmmodalt','SMS.model.ItmModAlt');
	},

	// ALT Close
	modAltCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmmodalt');
	},

	// ALT Add
	modAltAddBtnClick: function(btn) {
		var url = 'cgi=mFloor_itm_mod_alt.xml&RECORD_ADD=1';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		ExecCtrl.entryPrompt(msgItemModAltAddBtnPrompt, url);
	},

	// ALT Cancel
	modAltCancelBtnClick: function(btn) {
		var url = 'cgi=mFloor_itm_mod_alt.xml';
		url += '&HOT_CLOSE=ALT_TAB';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F154=' + BaseCtrl.hotPoolGet('F154');
		ExecCtrl.entrySendUrl(url);
	},

	// ALT Save
	modAltSaveBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var url= 'cgi=mFloor_itm_mod_alt.xml';
		url += '&HOT_IDX_F01='+ BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F154='+ BaseCtrl.hotPoolGet('F154');
		url += BaseCtrl.formGetChanges(form,'SMS.model.ItmModAlt');
		ExecCtrl.entrySendUrl(url);
	},

	// ALT Menu
	modAltMenuBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn, [
				{text: msgItemAltMenuLook, value: 'LOOK'},
				{text: msgItemAltMenuAdd, value: 'ADD'},
				{text: msgItemAltMenuDel, value: 'DELETE'}
			],
			function(value) {
				var url= '';
				// View alt records
				if (value == 'LOOK') {
					url = 'cgi=mFloor_xml_hook.xml&ExtGridUsp=mFloor_itm_alt_list';
					url += '&F01=' +BaseCtrl.hotPoolGet('F01');
					url += '&ExtGridAlias=ItmModAltLup';
					ExecCtrl.entrySendUrl(url);
				}
				// Delete alt record
				else if (value == 'DELETE') {
					Ext.Msg.show({
						title: msgItemAltMenuConfirm,
						message: msgItemAltMenuMsg,
						buttons: [{text: msgItemAltMenuBtnNo, itemId: '0'}, {text: msgItemAltMenuBtnYes, itemId: '1'}],
						cls: 'sms-popup-prompt',
						fn: function(btn) {
							if (btn==1) {
								url= 'cgi=mFloor_itm_mod_alt.xml&RECORD_DEL=1';
								url += '&HOT_IDX_F01='+ BaseCtrl.hotPoolGet('F01');
								url += '&HOT_IDX_F154='+ BaseCtrl.hotPoolGet('F154');
								ExecCtrl.entrySendUrl(url);
							}
						}
					});
				}
				// Add alt record
				else if (value == 'ADD') {
					ItmCtrl.modAltAddBtnClick(btn);
				}
			}
		);
	},

	modAltLupHook: function(node,append) {
		var card = ExecCtrl.windowAdd('itmmodaltlup');
		var grid = card.down('dataview');
		var store = Ext.create('SMS.store.ItmModAltLup');
		grid.setStore(store);
		BaseCtrl.gridFromNode(node,store);
	},

	// ALT LIST close
	modAltLupCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmmodaltlup');
	},

	// ALT LIST item tap
	modAltLupGridItemTap: function(list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		var form = ExecCtrl.windowClose('itmmodaltlup','itmmodalt');
		this.itemChangeExec(form);
	},

//// BMP_TAB FUNCTIONS ///////////////////////////////////////////////////////////////////////

	modBmpView: function(src,code,obj,evt) {
		var form = Ext.Viewport.down('itmmodbmp');
		var url = ItmCtrl.itemCommonView(src,evt,'mFloor_itm_mod_bmp.xml','itmmodbmp',code);
		ExecCtrl.entrySendUrl(url);
	},

	// BMP Hook
	modBmpHook: function(node,append) {
		ItmCtrl.resultCommonHook(node,'itmmodbmp','SMS.store.ItmModBmp');
		var form = Ext.Viewport.down('itmmodbmp');

		var camera = form.down('#cameraBtn');
		if (camera) {
			if (!globalCameraEnabled) {
				camera.setHidden(true);
			} else {
				camera.setHidden(false);
			}
		}

		var grid = form.down('dataview');
		if (grid) {
			var store = grid.getStore();
			var record = store.getAt(0);
			if (record) {
				var f01  = record.get('F01');
				var edit = form.down('#searchEdit');
				if (edit) edit.setValue(f01);
		
				edit = form.down('textfield[name=F01]');
				if (edit)
					edit.setValue(f01);
		
		
				var f2926 = form.down('selectfield[name=F2926]');
				var f2927 = form.down('selectfield[name=F2927]');
				var f2928 = form.down('selectfield[name=F2928]');
				var f2929 = form.down('selectfield[name=F2929]');

				if (f2926) f2926.setValue(record.get('F2926'));
				if (f2927) f2927.setValue(record.get('F2927'));
				if (f2928) f2928.setValue(record.get('F2928'));
				if (f2929) BaseCtrl.msgBaseDoLocalOverrides = record.get('F2929');
	
				var pic = form.down('#captureImg');
				if (pic) {
					pic.reset();
					ItmCtrl.setPictureForm(pic, record.get('imageSrc'));

					pic.img.dom.onload = function () {
						/* Set Image Height to it's original value */
						pic.img.dom.height= pic.img.dom.naturalHeight;
						
						/* Set image height to a maximum of 200 */
						if(pic.img.dom.height > 200) {
							pic.img.dom.height = 200;
						}
					}
				}
			}
		}
	},

	// RESULT ITEM CLICK
	itmModBmpResultGridItemTap: function(list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		
		var form = Ext.Viewport.down('itmmodbmp');
		if (form) {
			var f2926 = form.down('selectfield[name=F2926]');
			var f2927 = form.down('selectfield[name=F2927]');
			var f2928 = form.down('selectfield[name=F2928]');
			var f2929 = form.down('selectfield[name=F2929]');

			if (f2926) f2926.setValue(record.get('F2926'));
			if (f2927) f2927.setValue(record.get('F2927'));
			if (f2928) f2928.setValue(record.get('F2928'));
			if (f2929) BaseCtrl.msgBaseDoLocalOverrides = record.get('F2929');

			var pic = form.down('#captureImg');
			if (pic) {
				pic.reset();
				ItmCtrl.setPictureForm(pic, record.get('imageSrc'));

				pic.img.dom.onload = function () {
					/* Set Image Height to it's original value */
					pic.img.dom.height= pic.img.dom.naturalHeight;
					
					/* Set image height to a maximum of 200 */
					if(pic.img.dom.height > 200) {
						pic.img.dom.height = 200;
					}
				}
			}
		}
	},

	modBmpCatpureImgBtnClick: function(btn){
		btn.reset();
	},

	// BMP Close
	modBmpCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmmodbmp');
	},

	// Bmp Add record
	modBmpAddBtnClick: function(btn) {
		var form = btn.up('formpanel');

		var f2926 = form.down('selectfield[name=F2926]');
		var f2927 = form.down('selectfield[name=F2927]');
		var f2928 = form.down('selectfield[name=F2928]');

		var strF2926 = (f2926) ? f2926.getValue() : null;
		var strF2927 = (f2927) ? f2927.getValue() : null;
		var strF2928 = (f2928) ? f2928.getValue() : null;

		var url = 'cgi=mFloor_itm_mod_Bmp.xml&RECORD_ADD=1';
		url += '&HOT_IDX_F01='+ BaseCtrl.hotPoolGet('F01');
		url += '&F01='+ BaseCtrl.hotPoolGet('F01');
		url += '&F2926='+ strF2926;
		url += '&F2927='+ strF2927;
		url += '&F2928='+ strF2928;
		ExecCtrl.entrySendUrl(url);
	},

	// Bmp Delete record
	modBmpDelBtnClick: function(btn) {
		var form = Ext.Viewport.down('itmmodbmp');

		var f2926 = form.down('selectfield[name=F2926]');
		var f2927 = form.down('selectfield[name=F2927]');
		var f2928 = form.down('selectfield[name=F2928]');

		var strF2926 = (f2926) ? f2926.getValue() : null;
		var strF2927 = (f2927) ? f2927.getValue() : null;
		var strF2928 = (f2928) ? f2928.getValue() : null;

		var url = 'cgi=mFloor_itm_mod_Bmp.xml&RECORD_DEL=1';
		url += '&HOT_IDX_F01='+ BaseCtrl.hotPoolGet('F01');
		url += '&F01='+ BaseCtrl.hotPoolGet('F01');
		url += '&F2926='+ strF2926;
		url += '&F2927='+ strF2927;
		url += '&F2928='+ strF2928;
		ExecCtrl.entrySendUrl(url);
	},

	// Bmp Cancel
	modBmpCancelBtnClick: function(btn) {
		var url = 'cgi=mFloor_itm_mod_Bmp.xml';
		url += '&HOT_CLOSE=BMP_TAB';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		ExecCtrl.entrySendUrl(url);
	},

	// Bmp Save
	modBmpSaveBtnClick: function(btn) {
		var form = btn.up('formpanel');

		var f2926 = form.down('selectfield[name=F2926]');
		var f2927 = form.down('selectfield[name=F2927]');
		var f2928 = form.down('selectfield[name=F2928]');

		var strF2926 = (f2926) ? f2926.getValue() : null;
		var strF2927 = (f2927) ? f2927.getValue() : null;
		var strF2928 = (f2928) ? f2928.getValue() : null;

		var url = 'cgi=mFloor_itm_mod_Bmp.xml&RECORD_DEL=1&RECORD_ADD=1';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		url += '&F01=' + BaseCtrl.hotPoolGet('F01');
		url += '&F2926=' + strF2926;
		url += '&F2927=' + strF2927;
		url += '&F2928=' + strF2928;

		// save picture
		var pic = form.down('#captureImg');
		if (pic && url) {
			DeviceCtrl.uploadPicture(pic, url);
		}
	},

	modBmpPhotoBtnClick: function(btn) {
		var form = btn.up('formpanel');

		var f2926 = form.down('selectfield[name=F2926]');
		var f2927 = form.down('selectfield[name=F2927]');
		var f2928 = form.down('selectfield[name=F2928]');

		var strF2926 = (f2926) ? f2926.getValue() : null;
		var strF2927 = (f2927) ? f2927.getValue() : null;
		var strF2928 = (f2928) ? f2928.getValue() : null;

		var url = 'cgi=mFloor_itm_mod_Bmp.xml&RECORD_DEL=1&RECORD_ADD=1';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		url += '&F01=' + BaseCtrl.hotPoolGet('F01');
		url += '&F2926=' + strF2926;
		url += '&F2927=' + strF2927;
		url += '&F2928=' + strF2928;

		// save picture
		var pic = form.down('#captureImg');
		if (pic && url) {
			DeviceCtrl.takePicture(url);
		}
	},
	
	// PRICE Menu
	modBmpMenuBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn, [
				{text: msgItemBmpMenuAdd, value:'ADD'},
				{text: msgItemBmpMenuDel, value: 'DELETE'}
			],
			function(value) {
				if (value == 'ADD') {
					ItmCtrl.modBmpAddBtnClick(btn);
				} else if (value == 'DELETE') {
					Ext.Msg.show({
						title: msgItemBmpMenuConfirm,
						message: msgItemBmpMenuMsg,
						buttons: [{text: msgItemBmpMenuBtnNo, itemId: '0'}, {text: msgItemBmpMenuBtnYes, itemId: '1'}],
						cls: 'sms-popup-prompt',
						fn: function(btn) {
							if (btn==1) {
								ItmCtrl.modBmpDelBtnClick(btn);
							}
						}
					});
				}
			}
		);
	},

	setPictureForm: function (pic, image) {
		var dcD = new Date();
		var dcdStr = dcD.getYear() + '' + dcD.getMonth() + '' + dcD.getDay() + '' + dcD.getHours() + '' + dcD.getMinutes() + '' + dcD.getSeconds() + '' + dcD.getMilliseconds();
		pic.setImage(image + '?_dc=' + dcdStr);
	},

//// COST_TAB FUNCTIONS //////////////////////////////////////////////////////////////////////

	modCostView: function(src,code,obj,evt) {
		var url = ItmCtrl.itemCommonView(src,evt,'mFloor_itm_mod_cost.xml','itmmodcost',code);
		url += '&HOT_IDX_F27='+BaseCtrl.hotPoolGet('F27') ;
		url += '&HOT_IDX_F1184='+BaseCtrl.hotPoolGet('F1184') ;
		ExecCtrl.entrySendUrl(url);
	},

	// COST Hook
	modCostHook: function(node,append) {
		ItmCtrl.itemCommonHook(node,'itmmodcost','SMS.model.ItmModCost');
	},

	// COST Close
	modCostCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmmodcost');
	},

	// COST ADD
	modCostAddBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var options = {};
		options.smsCallback = ItmCtrl.modCostAddCallBack;
		ExecCtrl.entryExecPrm(form,'jsPop=list,jsUsp=mFloor_itm_pop_F27,jsAction=run',options);
	},

	// COST ADD Callback
	modCostAddCallBack: function(form,selection) {
		if (selection.length==0) return false;
		var vnd = selection[0].get('data');
		BaseCtrl.hotPoolAdd('F27',vnd);
		var url = 'cgi=mFloor_itm_mod_cost.xml&RECORD_ADD=1';
		url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F27='+vnd;
		ExecCtrl.entrySendUrl(url);
	},

	// COST CANCEL
	modCostCancelBtnClick: function(btn) {
		var url = 'cgi=mFloor_itm_mod_cost.xml';
		url += '&HOT_CLOSE=COST_TAB';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F27='+BaseCtrl.hotPoolGet('F27') ;
		url += '&HOT_IDX_F1184='+BaseCtrl.hotPoolGet('F1184') ;
		ExecCtrl.entrySendUrl(url);
	},

	// COST SAVE
	modCostSaveBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var record = form.getRecord();
		var url= 'cgi=mFloor_itm_mod_cost.xml';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F27='+BaseCtrl.hotPoolGet('F27') ;
		url += '&HOT_IDX_F1184='+BaseCtrl.hotPoolGet('F1184') ;
		url += BaseCtrl.formGetChanges(form,'SMS.model.ItmModCost');
		ExecCtrl.entrySendUrl(url);
	},

	// COST MENU
	modCostMenuBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn, [
				{text: msgItemCostMenuLook, value: 'LOOK'},
				{text: msgItemCostMenuAdd, value: 'ADD'},
				{text: msgItemCostMenuDel, value: 'DELETE'}
			],
			function(value) {
				if (value == 'LOOK') {
					var url= 'cgi=mFloor_xml_hook.xml&ExtGridUsp=mFloor_itm_cost_list';
					url += '&F01=' + BaseCtrl.hotPoolGet('F01');
					url += '&ExtGridAlias=ItmModCostLup';
					ExecCtrl.entrySendUrl(url);
				} else if (value == 'DELETE') {
					Ext.Msg.show({
						title: msgItemCostMenuConfirm,
						message: msgItemCostMenuMsg,
						buttons: [{text: msgItemCostMenuBtnNo, itemId: '0'}, {text: msgItemCostMenuBtnYes, itemId: '1'}],
						cls: 'sms-popup-prompt',
						fn: function(btn) {
							if (btn==1) {
								var url= 'cgi=mFloor_itm_mod_cost.xml&RECORD_DEL=1';
								url += '&HOT_IDX_F01='+ BaseCtrl.hotPoolGet('F01');
								url += '&HOT_IDX_F27='+ BaseCtrl.hotPoolGet('F27');
								url += '&HOT_IDX_F1184='+ BaseCtrl.hotPoolGet('F1184');
								ExecCtrl.entrySendUrl(url);
							}
						}
					});
				} else if (value == 'ADD') {
					ItmCtrl.modCostAddBtnClick(btn);
				}
			}
		);
	},

	modCostLupHook: function(node,append) {
		var card = ExecCtrl.windowAdd('itmmodcostlup');
		var grid = card.down('dataview');
		var store = Ext.create('SMS.store.ItmModCostLup');
		grid.setStore(store);
		BaseCtrl.gridFromNode(node,store);
	},

	// COST LIST close
	modCostLupCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmmodcostlup');
	},

	// COST LIST Item tap
	modCostLupGridItemTap: function(list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		var form = ExecCtrl.windowClose('itmmodcostlup','itmmodcost');
		this.itemChangeExec(form);
	},


//// LOC_TAB /////////////////////////////////////////////////////////////////////////////////

	modLocView: function(src,code,obj,evt) {
		var url = ItmCtrl.itemCommonView(src,evt,'mFloor_itm_mod_loc.xml','itmmodloc',code);
		url += '&HOT_IDX_F117='+ BaseCtrl.hotPoolGet('F117') ;
		ExecCtrl.entrySendUrl(url);
	},

	// LOC Hook
	modLocHook: function(node,append) {
		ItmCtrl.itemCommonHook(node,'itmmodloc','SMS.model.ItmModLoc');
	},

	// LOC CLose
	modLocCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmmodloc');
	},

	// LOC Add
	modLocAddBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var options = {};
		options.smsCallback = ItmCtrl.modLocAddCallBack;
		ExecCtrl.entryExecPrm(form,'jsPop=list,jsUsp=mFloor_itm_pop_F117,jsAction=run',options);
	},

	// LOC Add Callback
	modLocAddCallBack: function(source,selection) {
		if (selection.length==0) return false;
		var loc = selection[0].get('data');
		BaseCtrl.hotPoolAdd('F117',loc);
		var url = 'cgi=mFloor_itm_mod_loc.xml&RECORD_ADD=1';
		url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F117='+loc;
		ExecCtrl.entrySendUrl(url);
	},

	// LOC Cancel
	modLocCancelBtnClick: function(btn) {
		var url = 'cgi=mFloor_itm_mod_loc.xml';
		url += '&HOT_CLOSE=LOC_TAB';
		url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F117='+BaseCtrl.hotPoolGet('F117') ;
		ExecCtrl.entrySendUrl(url);
	},

	// LOC Save
	modLocSaveBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var url= 'cgi=mFloor_itm_mod_loc.xml';
		url += '&HOT_IDX_F01='+ BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F117='+ BaseCtrl.hotPoolGet('F117') ;
		url += BaseCtrl.formGetChanges(form,'SMS.model.ItmModLoc');
		ExecCtrl.entrySendUrl(url);
	},

	// LOC Menu
	modLocMenuBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn,
			[
				{text: msgItemLocMenuLook, value: 'LOOK'},
				{text: msgItemLocMenuAdd, value: 'ADD'},
				{text: msgItemLocMenuDel, value: 'DELETE'}
			],
			function(value) {
				var url= '';
				if (value == 'LOOK') {
					url = 'cgi=mFloor_xml_hook.xml&ExtGridUsp=mFloor_itm_loc_list';
					url += '&F01=' +BaseCtrl.hotPoolGet('F01');
					url += '&ExtGridAlias=ItmModLocLup';
					ExecCtrl.entrySendUrl(url);
				} else if (value == 'DELETE') {
					Ext.Msg.show({
						title: msgItemLocMenuConfirm,
						message: msgItemLocMenuMsg,
						buttons: [{text: msgItemLocMenuBtnNo, itemId: '0'}, {text: msgItemLocMenuBtnYes, itemId: '1'}],
						cls: 'sms-popup-prompt',
						fn: function(btn) {
							if (btn==1) {
								url= 'cgi=mFloor_itm_mod_loc.xml&RECORD_DEL=1';
								url += '&HOT_IDX_F01='+ BaseCtrl.hotPoolGet('F01');
								url += '&HOT_IDX_F117='+ BaseCtrl.hotPoolGet('F117');
								ExecCtrl.entrySendUrl(url);
							}
						}
					});
				} else if (value == 'ADD') {
					ItmCtrl.modLocAddBtnClick(btn);
				}
			}
		);
	},

	modLocLupHook: function(node,append) {
		var card = ExecCtrl.windowAdd('itmmodloclup');
		var grid = card.down('dataview');
		var store = Ext.create('SMS.store.ItmModLocLup');
		grid.setStore(store);
		BaseCtrl.gridFromNode(node,store);
	},

	// LOC LIST Close
	modLocLupCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmmodloclup');
	},

	// LOC List item tap
	modLocLupGridItemTap: function(list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		var form = ExecCtrl.windowClose('itmmodloclup','itmmodloc');
		this.itemChangeExec(form);
	},

//// OBJ_TAB /////////////////////////////////////////////////////////////////////////////////

	modObjView: function(src,code,obj,evt) {
		var url = ItmCtrl.itemCommonView(src,evt,'mFloor_itm_mod_obj.xml','itmmodobj',code);
		ExecCtrl.entrySendUrl(url);
	},

	// OBJ Hook
	modObjHook: function(node) {
		var form = ItmCtrl.itemCommonHook(node,'itmmodobj','SMS.model.ItmModObj');
		var pic = form.down('#captureImg');
		if (pic) pic.reset();
	},

	// OBJ Close
	modObjCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmmodobj');
	},

	// OBJ Cancel
	modObjCancelBtnClick: function(btn) {
		var url = 'cgi=mFloor_itm_mod_obj.xml';
		url += '&HOT_CLOSE=OBJ_TAB';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		ExecCtrl.entrySendUrl(url);
	},

	// OBJ Save
	modObjSaveBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var record = form.getRecord();
 
		// save picture
		var pic = form.down('#captureImg');
		if (pic) {
			DeviceCtrl.uploadPicture(pic);
		}

		// save record
		var record = form.getRecord();
		var url = 'cgi=mFloor_itm_mod_obj.xml';
		url += '&HOT_IDX_F01='+ record.get('F01');
		url += BaseCtrl.formGetChanges(form,'SMS.model.ItmModObj');
		ExecCtrl.entrySendUrl(url);
	},

	modObjDeleteBtnClick: function(btn){
		var url= '';
		Ext.Msg.show({
			title: msgItemObjMenuConfirm,
			message: msgItemObjMenuMsg,
			buttons: [{text: msgItemObjMenuBtnNo, itemId: '0'}, {text: msgItemObjMenuBtnYes, itemId: '1'}],
			cls: 'sms-popup-prompt',
			fn: function(btn) {
				if (btn==1) {
					url= 'cgi=mFloor_itm_mod_obj.xml&RECORD_DEL=1';
					url += '&HOT_IDX_F01='+ BaseCtrl.hotPoolGet('F01');
					ExecCtrl.entrySendUrl(url);
				}
			}
		});
	},

//// POS_TAB /////////////////////////////////////////////////////////////////////////////////

	modPosView: function(src,code,obj,evt) {
		var url = ItmCtrl.itemCommonView(src,evt,'mFloor_itm_mod_pos.xml','itmmodpos',code);
		ExecCtrl.entrySendUrl(url);
	},

	// POS Hook
	modPosHook: function(node,append) {
		ItmCtrl.itemCommonHook(node,'itmmodpos','SMS.model.ItmModPos');
	},

	// POS Close
	modPosCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmmodpos');
	},

	// POS Cancel
	modPosCancelBtnClick: function(btn) {
		var url = 'cgi=mFloor_itm_mod_pos.xml';
		url += '&HOT_CLOSE=POS_TAB';
		url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
		ExecCtrl.entrySendUrl(url);
	},

	// POS Save
	modPosSaveBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var record = form.getRecord();
		var url = 'cgi=mFloor_itm_mod_pos.xml';
		url += '&HOT_IDX_F01='+record.get('F01');
		url += BaseCtrl.formGetChanges(form,'SMS.model.ItmModPos');
		ExecCtrl.entrySendUrl(url);
	},


//// PRICE_TAB ///////////////////////////////////////////////////////////////////////////////

	modPriceView: function(src,code,obj,evt) {
		var url = ItmCtrl.itemCommonView(src,evt,'mFloor_itm_mod_price.xml','itmmodprice',code);
		url += '&HOT_IDX_F126='+BaseCtrl.hotPoolGet('F126');
		ExecCtrl.entrySendUrl(url);
	},

	// PRICE Hook
	modPriceHook: function(node,append) {
		ItmCtrl.itemCommonHook(node,'itmmodprice','SMS.model.ItmModPrice');
	},

	// PRICE Close
	modPriceCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmmodprice');
	},

	// PRICE Add
	modPriceAddBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var options = {};
		options.smsCallback = ItmCtrl.modPriceAddCallBack;
		ExecCtrl.entryExecPrm(form,'jsPop=list,jsUsp=mFloor_itm_pop_F126,jsAction=run',options);
	},

	// PRICE Add Callback
	modPriceAddCallBack: function(source,selection) {
		if (selection.length==0) return false;
		var lvl = selection[0].get('data');
		BaseCtrl.hotPoolAdd('F126',lvl);
		var url = 'cgi=mFloor_itm_mod_price.xml&RECORD_ADD=1';
		url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F126='+lvl;
		ExecCtrl.entrySendUrl(url);
	},

	// PRICE Cancel
	modPriceCancelBtnClick: function(btn) {
		var url = 'cgi=mFloor_itm_mod_price.xml';
		url += '&HOT_CLOSE=PRICE_TAB';
		url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F126='+BaseCtrl.hotPoolGet('F126');
		ExecCtrl.entrySendUrl(url);
	},

	// PRICE Save
	modPriceSaveBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var record = form.getRecord();

		var url= 'cgi=mFloor_itm_mod_price.xml';
		url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F126='+BaseCtrl.hotPoolGet('F126');
		url += ItmCtrl.mordPriceDelPriceByField(form,record);
		url += BaseCtrl.formGetChanges(form,'SMS.model.ItmModPrice');

		if (record.get('PRICE_TAB-F122'))
			ItmCtrl.itmPromptLikeCode(url); 
		else
			ExecCtrl.entrySendUrl(url);
	},
	
	mordPriceDelPriceByField: function(form,record) {
		var url = '';

		//REGULAR Price
		var frmPrice = form.down('textfield[name=PRICE_TAB-F30]').getValue();
		var recPrice = record.get('PRICE_TAB-F30');
		if (recPrice && !frmPrice ){
			form.down('textfield[name=PRICE_TAB-F31]').setValue('');
			form.down('datepickerfield[name=PRICE_TAB-F35]').setValue('');
			form.down('datepickerfield[name=PRICE_TAB-F129]').setValue('');
			url += '&PRICE_TAB[F35]=';
			url += '&PRICE_TAB[F129]=';
		}

		//TPR Price
		frmPrice = form.down('textfield[name=PRICE_TAB-F181]').getValue();
		recPrice = record.get('PRICE_TAB-F181');
		if (recPrice && !frmPrice ){
			form.down('textfield[name=PRICE_TAB-F182]').setValue('');
			form.down('datepickerfield[name=PRICE_TAB-F183]').setValue('');
			form.down('datepickerfield[name=PRICE_TAB-F184]').setValue('');
			url += '&PRICE_TAB[F183]=';
			url += '&PRICE_TAB[F184]=';
		}

		//Sale Price
		frmPrice = form.down('textfield[name=PRICE_TAB-F136]').getValue();
		recPrice = record.get('PRICE_TAB-F136');
		if (recPrice && !frmPrice ){
			form.down('textfield[name=PRICE_TAB-F135]').setValue('');
			form.down('datepickerfield[name=PRICE_TAB-F137]').setValue('');
			form.down('datepickerfield[name=PRICE_TAB-F138]').setValue('');
			url += '&PRICE_TAB[F137]=';
			url += '&PRICE_TAB[F138]=';
		}

		//Instore Price
		frmPrice = form.down('textfield[name=PRICE_TAB-F1133]').getValue();
		recPrice = record.get('PRICE_TAB-F1133');
		if (recPrice && !frmPrice ){
			form.down('textfield[name=PRICE_TAB-F1134]').setValue('');
			form.down('datepickerfield[name=PRICE_TAB-F1216]').setValue('');
			form.down('datepickerfield[name=PRICE_TAB-F1217]').setValue('');
			form.down('checkboxfield[name=PRICE_TAB-F1194]').uncheck();
			form.down('checkboxfield[name=PRICE_TAB-F1195]').uncheck();
			url += '&PRICE_TAB[F1216]=';
			url += '&PRICE_TAB[F1217]=';
		}

		return url;
	},


	modPriceDelDateRegBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var record = form.getRecord();

		var url= 'cgi=mFloor_itm_mod_price.xml';
		url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F126='+BaseCtrl.hotPoolGet('F126');
		url += '&PRICE_TAB[F35]=';
		url += '&PRICE_TAB[F129]=';

		if (record.get('PRICE_TAB-F122'))
			ItmCtrl.itmPromptLikeCode(url); 
		else
			ExecCtrl.entrySendUrl(url);
	},

	modPriceDelDateTprBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var record = form.getRecord();

		var url= 'cgi=mFloor_itm_mod_price.xml';
		url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F126='+BaseCtrl.hotPoolGet('F126');
		url += '&PRICE_TAB[F183]=';
		url += '&PRICE_TAB[F184]=';

		if (record.get('PRICE_TAB-F122'))
			ItmCtrl.itmPromptLikeCode(url); 
		else
			ExecCtrl.entrySendUrl(url);
	},

	modPriceDelDateSalBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var record = form.getRecord();

		var url= 'cgi=mFloor_itm_mod_price.xml';
		url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F126='+BaseCtrl.hotPoolGet('F126');
		url += '&PRICE_TAB[F137]=';
		url += '&PRICE_TAB[F138]=';

		if (record.get('PRICE_TAB-F122'))
			ItmCtrl.itmPromptLikeCode(url); 
		else
			ExecCtrl.entrySendUrl(url);
	},

	modPriceDelDateInstoreBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var record = form.getRecord();

		var url= 'cgi=mFloor_itm_mod_price.xml';
		url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
		url += '&HOT_IDX_F126='+BaseCtrl.hotPoolGet('F126');
		url += '&PRICE_TAB[F1216]=';
		url += '&PRICE_TAB[F1217]=';

		if (record.get('PRICE_TAB-F122'))
			ItmCtrl.itmPromptLikeCode(url); 
		else
			ExecCtrl.entrySendUrl(url);
	},

	// PRICE Menu
	modPriceMenuBtnClick: function(btn) {
		Ext.ux.menu.Menu.open(
			btn, [
				{text: msgItemPriceMenuLook, value: 'LOOK'},
				{text: msgItemPriceMenuAdd, value: 'ADD'},
				{text: msgItemPriceMenuDel, value: 'DELETE'}
			],
			function(value) {
				var url= '';
				if (value == 'LOOK') {
					url= 'cgi=mFloor_xml_hook.xml&ExtGridUsp=mFloor_itm_price_list';
					url += '&F01=' +BaseCtrl.hotPoolGet('F01');
					url += '&ExtGridAlias=ItmModPriceLup';
					ExecCtrl.entrySendUrl(url);
				} else if (value == 'DELETE') {
					Ext.Msg.show({
						title: msgItemPriceMenuConfirm,
						message: msgItemPriceMenuMsg,
						buttons: [{text: msgItemPriceMenuBtnNo, itemId: '0'}, {text: msgItemPriceMenuBtnYes, itemId: '1'}],
						cls: 'sms-popup-prompt',
						fn: function(btn) {
							if (btn==1) {
								url= 'cgi=mFloor_itm_mod_price.xml&RECORD_DEL=1';
								url += '&HOT_IDX_F01='+ BaseCtrl.hotPoolGet('F01');
								url += '&HOT_IDX_F126='+ BaseCtrl.hotPoolGet('F126');
								ExecCtrl.entrySendUrl(url);
							}
						}
					});
				} else if (value == 'ADD') {
					ItmCtrl.modPriceAddBtnClick(btn);
				}
			}
		);
	},

	modPriceLupHook: function(node,append) {
		var card = ExecCtrl.windowAdd('itmmodpricelup');
		var grid = card.down('dataview');
		var store = Ext.create('SMS.store.ItmModPriceLup');
		grid.setStore(store);
		BaseCtrl.gridFromNode(node,store);
	},

	// PRICE LIST Close
	modPriceLupCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmmodpricelup');
	},

	// PRICE LIST Item tap
	modPriceLupGridItemTap: function(list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		var form = ExecCtrl.windowClose('itmmodpricelup','itmmodprice');
		this.itemChangeExec(form);
	},


//// ITEM QUICK RESULT ///////////////////////////////////////////////////////////////////////

	lupQuickResultHook: function (node) {
		ItmCtrl.resultCommonHook(node,'itmlupquickresult','SMS.store.ItmList');
	},

	// QUICK Close
	lupQuickResultCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmlupquickresult');
	},

	// QUICK Key press
	lupQuickResultF02KeyUp: function (search, e) {
		if (e.event.keyCode == 13) {
			this.commonSearchKeyUp(search,['F02'],[search.getValue()]);
		}
	},

//// ITEM GENERAL RESULT //////////////////////////////////////////////////////////////////////

	// GENERAL Search Close
	lupGeneralSearchCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmlupgeneralsearch');
	},

	// GENEREAL Search Reset
	lupGeneralSearchResetBtnClick: function(btn) {
		var form = btn.up('formpanel');
		BaseCtrl.formClear(form);
	},

	// GENERAL Search Run
	lupGeneralSearchRunBtnClick: function(btn) {
		var form = btn.up('formpanel');
		var url ='cgi=mFloor_xml_hook.xml,ExtGridUsp=mFloor_itm_searchGeneral,ExtGridAlias=ItmLupGeneralResult'+BaseCtrl.winGetAll(form);
		ExecCtrl.entryExecPrm(btn,url);
	},

	// GENERAL Result Hook
	lupGeneralResultHook: function(node) {
		ItmCtrl.resultCommonHook(node,'itmlupgeneralresult','SMS.store.ItmList');
	},

	// GENERAL Close
	lupGeneralResultCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmlupgeneralresult');
	},

//// ITEM RESULT //////////////////////////////////////////////////////////////////////

	// RESULT COMMON HOOK
	resultCommonHook: function (node, viewId, storeId) {
		var maxRow = BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
		var card = Ext.Viewport.down(viewId);
		var grid, store, btn;
		var url = '';

		// result already exist
		if (card) {
			grid = card.down('dataview');
			store = grid.getStore();

			// next page
			if (BaseCtrl.paramFromNode(node,'EXTGRIDPAGE')) {
				var oldmax = grid.getScrollable().getScroller().getMaxPosition();
				grid.getScrollable().getScroller().on('maxpositionchange', function(scroll, max) {scroll.scrollTo(0, oldmax.y);});
				BaseCtrl.gridFromNode(node,store,true);
			}

			// reload and display
			else {
				BaseCtrl.gridFromNode(node, store);
				var win = card.up('itmhost');
				if (!win)
					win = card.up('invhost');
				if (!win)
					win = card.up('buyhost');
				if (!win)
					win = card.up('sellhost');
				if (!win)
					win = card.up('manhost');
				
				if(viewId != 'itmmodbmp') {
					var tools = win.down('#tools');
					var cards = win.down('#cards');
					if (cards && tools && card!=cards.getActiveItem()) {
						btn = tools.down('#'+card.xtype);
						if (btn)
							tools.setPressedButtons(btn);
						else
							cards.setActiveItem(card);
					}
				}
			}
		}

		// new result
		else {
			card = ExecCtrl.windowAdd(viewId);
			grid = card.down('dataview');
			store = BaseCtrl.gridNewStore(storeId);
			grid.setStore(store);
			BaseCtrl.gridFromNode(node,store);

			url=BaseCtrl.paramsFromNode(node);
			store.getProxy().setUrl(url);
			store.setPageSize(maxRow);
		}

		// Show more button
		btn = grid.down('#moreBtn');
		if (store.getCount()==store.getPageSize()*store.currentPage) {
			if (btn) btn.setHidden(false);
			else {
				btn = Ext.create('Ext.Button',{
					text: msgItemresultCommonHookMore,
					scrollDock: 'bottom',
					itemId: 'moreBtn',
					listeners: {tap: {fn: ItmCtrl.resultNextPage}}
				});
				grid.add(btn);
			}
		} else
		if (btn) btn.setHidden(true);
	},

	// RESULT NEXT PAGE
	resultNextPage: function(btn) {
		var maxRow = BaseCtrl.sessionCur().getConfig('mFloor_MainConfig', 'extMaxRecords', TrsCtrl.MaxRowPage);
		var grid = btn.up('list');
		var store = grid.getStore();
		var url = store.getProxy().getUrl();
		store.currentPage += 1;
		url = BaseCtrl.urlFilter(url, ['ExtMaxRecords','ExtGridPage']);
		url += '&ExtMaxRecords=' + maxRow;
		url += '&ExtGridPage='+(store.currentPage-1);
		ExecCtrl.entryExecPrm(grid,url);
	},

	// RESULT ITEM CLICK
	itmResultGridItemTap: function(list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		this.itemChangeExec();
	},

	// F01 SEARCH Keypress
	itmSearchEditKeyUp: function(search,evt,eOpts) {
		var data = search.getValue();
		if (!evt || (evt.event.keyCode==13 && data.length>0)) {
			data = DeviceCtrl.scannerDecode(data);
			var form = search.up('formpanel');
			if (form && form.xtype=='itmstart')
				ItmCtrl.itemChangeExec(null,data);
			else
				ItmCtrl.itemChangeExec(form,data);
		}
	},

	// COMMON FIELD SEARCH 
	commonSearchKeyUp: function (search,fld,val) {
		var form = search.up('formpanel');
		var grid = form.down('list');
		var store = grid.getStore();
		var url = store.getProxy().getUrl();
		var name, value, x, y;
		
		url = BaseCtrl.urlFilter(url,['DN','CN']);
		url = BaseCtrl.urlFilter(url,fld);
		if (fld.length == val.length) {
			for (x = 0; x < fld.length; x++) {
				name = fld[x];
				value = val[x];
				if (name && value && value.length > 0) {
					url += '&';
					url += name;
					url += '=';
					url += value;
				}
			}
		}
		store.getProxy().setUrl(url);
		ExecCtrl.entryExecPrm(search,url);
	},

	// CAM SCAN BARCODE
	itmScanCamBtnClick: function(btn) {
		consoleLog("Attempting to execute the Camera callback!");
		DeviceCtrl.scannerCamBtnClick(btn,ItmCtrl.itmScannerCamCallback);
	},

	itmScannerCamCallback: function(btn,code) {
		var form = btn.up('formpanel');
		if (form && form.xtype=='itmstart')
			ItmCtrl.itemChangeExec(null,code);
		else
			ItmCtrl.itemChangeExec(form,code);
	},

//// ITEM CHANGE EVENT /////////////////////////////////////////////////////////

	// BEFORE CHANGE EVENT
	itemBeforeChangeEvent: function(record) {
		consoleLog('ItmHost.itemBeforeChangeEvent');
		if (record) {
			var fields = record.getFields();
			fields.each(function(field) {
				var name = field._name;
				var value = record.get(name);
				if (value != null) {
					if (name == 'F01') BaseCtrl.hotPoolAdd('F01',value);
					else if (name == 'F126') BaseCtrl.hotPoolAdd('F126',value);
					else if (name == 'PRICE_TAB-F126') BaseCtrl.hotPoolAdd('F126',value);
					else if (name == 'F27') BaseCtrl.hotPoolAdd('F27',value);
					else if (name == 'COST_TAB-F27') BaseCtrl.hotPoolAdd('F27',value);
					else if (name == 'F1184') BaseCtrl.hotPoolAdd('F1184',value); // format
					else if (name == 'COST_TAB-F1184') BaseCtrl.hotPoolAdd('F1184',value); // format
					else if (name == 'F117') BaseCtrl.hotPoolAdd('F117',value); // shelf id
					else if (name == 'LOC_TAB-F117') BaseCtrl.hotPoolAdd('F117',value); // shelf id
					else if (name == 'F154') BaseCtrl.hotPoolAdd('F154',value); // alt code
					else if (name == 'ALT_TAB-F154') BaseCtrl.hotPoolAdd('F154',value); // alt code
					else if (name == 'F122') BaseCtrl.hotPoolAdd('F122',value); // like code
				}
			});

			for (var x=0; x<gaHotPool[0].length; x++)
				consoleLog('HOT_IDX: '+gaHotPool[0][x][0]+'='+gaHotPool[0][x][1]);
		}
	},

	// EXECUTE URL
	itemChangeExec: function(form,code) {

		if (!form && ItmCtrl.goBackCard) form = Ext.Viewport.down(ItmCtrl.goBackCard);

		// manual code
		if (code)
			ItmCtrl.itmLastCode=code;
		else
			ItmCtrl.itmLastCode=null;

		if (form)
			form.fireEvent('smsrefresh',form,code);
		else
			ItmCtrl.infoView(null,code);
	},

	/// COMMON REFRESH VIEW
	itemCommonView: function(src,evt,script,widget,code) {
		var url = '';

		// refresh other views
		if (evt && src.xtype!=widget) {
			url = 'cgi=' + script;
			url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
			url += '&SKIPFOCUS=1';
		}
		else if(script.indexOf('.sqi') !== -1) {
			ItmCtrl.goBackCard=widget;
			url = 'sqi=mFloor_itm_scan&RETPAGE=sqi=' + script.substring(0, script.indexOf('.sqi'));
			if (!code)
				url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
			else {
				url += '&HOT_IDX_F01$SCAN_MFLOOR='+code;
				url += '&HOT_PRM_F01=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig','hot_prm','1');
			}
		}
		// refresh active view
		else {
			ItmCtrl.goBackCard=widget;
			url = 'sqi=mFloor_itm_scan&RETPAGE=cgi=' + script;
			if (!code)
				url += '&HOT_IDX_F01='+BaseCtrl.hotPoolGet('F01');
			else {
				url += '&HOT_IDX_F01$SCAN_MFLOOR='+code;
				url += '&HOT_PRM_F01=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig','hot_prm','1');
			}
		}
		return url;
	},

	// ITEM HOOK
	itemCommonHook: function(node,widget,model) {
		// Prevent loopback
		var snode = Ext.DomQuery.selectNode('skipFocus',node);
		var form, focus = '';

		if (snode && snode.firstChild) focus= snode.firstChild.nodeValue;

		if (focus!='1')
			form = ExecCtrl.windowAdd(widget);
		else {
			form = Ext.Viewport.down(widget);
			if (!form) form = ExecCtrl.windowAdd(widget);
		}

		var edit = form.down('#searchEdit');
		if (edit) edit.setValue(ItmCtrl.itmLastCode);

		// Load record
		var data = Ext.DomQuery.selectNode('data record', node);
		if (data) {
			BaseCtrl.formClear(form);
			var record = BaseCtrl.formFieldsFromNode(data,Ext.create(model));
			form.setRecord(record);
			var record = form.getRecord();

			// refresh hot idx
			Ext.Viewport.fireEvent('appItemBeforeChangeEvent',record);

			// set image
			var flds = form.query('image');
			for (var y=0; y<flds.length; y++) {
				flds[y].setSrc(record.get('imageSrc'));
			}
		}

		if (focus!='1') Ext.Viewport.fireEvent('appItemAfterChangeEvent',form);
		return form;
	},

	// AFTER CHANGE EVENT
	itemAfterChangeEvent: function(src) {
		consoleLog('ItmHost.itemAfterChangeEvent');
		var hostcmp = Ext.Viewport.down('itmhost');
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

		// Go back to entry
// Make this configurable
//		if (src) {
//			var fld = src.down('#searchEdit');
//			if (fld) {
//				fld.focus();
//				fld.select();
//			}
//		}

	},

//// CONFIG //////////////////////////////////////////////////////////////////////////////////

	configBtnClick: function(btn) {
		TrsCtrl.configDisplay('itmconfig','ItmConfig');
	},

	configSaveBtnClick: function(btn) {
		var form  = btn.up('formpanel');
		TrsCtrl.configSave(form,'itmconfig','ItmConfig');
	}

});
