var TasksCtrl;

Ext.define('SMS.controller.Tasks', {
	extend: 'Ext.app.Controller',

	requires: [
		'Ext.Label',
		'Ext.form.FieldSet',
		'Ext.data.reader.Xml',
		'Ext.data.writer.Xml',
		'Ext.dataview.List',
		'Ext.carousel.Carousel',
		'Ext.field.DatePicker',
		'Ext.field.Radio',
		'Ext.field.Search'
	],

	init: function() {
		var me=this;
		Ext.Viewport.on({
			scope: this,

			appTasksLabelInstantHook: this.labelInstantHook,
			appTasksLabelPrintHook: this.labelPrintHook,
			appTasksScanVerifyHook: this.scanVerifyHook,
			
			appItmLupRptSumResultHook: this.lupRptSumResultHook,
			appItmRptDateResultHook: this.rptDateResultHook,
			appItmRptBatchResultHook: this.rptBatchResultHook
		});

		this.control({
			// TASK HOST
			'taskshost #scanCamBtn' : {tap: this.tasksScanCamBtnClick},

			// TASKS INSTANT LABEL
			'taskslabelinstant': {
				show: this.handheldScannerHandler,
				smsrefresh: this.labelInstantView
			},
			'taskslabelinstant #closeBtn': {tap: this.labelInstantCloseBtnClick},
			'taskslabelinstant #deleteBtn': {tap: this.labelInstantDeleteBtnClick},
			'taskslabelinstant #printBtn': {tap: this.labelInstantPrintBtnClick},

			// TASKS PRINT LABEL
			'taskslabelprint': {
				show: this.handheldScannerHandler,
				smsrefresh: this.labelPrintView
			},
			'taskslabelprint #closeBtn': {tap: this.labelPrintCloseBtnClick},
			'taskslabelprint #printBtn': {tap: this.labelPrintBtnClick},

			// TASKS SET STORE SCAN
			'tasksscanset': {initialize: this.scanSetInitialize},
			'tasksscanset #closeBtn': {tap: this.scanSetCloseBtnClick},

			// TASKS SCAN VERIFY FOR SET STORE SCAN
			'tasksscanverify': {
				show: this.handheldScannerHandler,
				smsrefresh: this.scanVerifyView
			},
			'tasksscanverify #closeBtn': {tap: this.scanVerifyCloseBtnClick},
			'tasksscanverify #saveBtn': {tap: this.scanVerifySaveBtnClick},
			'tasksscanverify #addBtn': {tap: this.scanVerifyAddBtnClick},
			'tasksscanverify #deleteBtn': {tap: this.scanVerifyDelBtnClick},

			// REPORT DATE
			'itmrptdatesearch': {
				initialize: this.rptDateSearchInitialize,
				show: this.handheldScannerHandler
			},
			'itmrptdatesearch *[name=F1031]': {change: this.rptDateSearchPeriodChange},
			'itmrptdatesearch #closeBtn': {tap: this.rptDateSearchCloseBtnClick},
			'itmrptdatesearch #pastDateBtn': {tap: this.rptDateSearchPastDateBtnClick},
			'itmrptdatesearch #futureDateBtn': {tap: this.rptDateSearchFutureDateBtnClick},
			'itmrptdatesearch #launchBtn': {tap: this.rptDateSearchLaunchBtnClick},

			'itmrptdateresult': {
				show: this.handheldScannerHandler,
				smsrefresh: this.rptDateResultView
			},
			'itmrptdateresult #closeBtn': {tap: this.rptDateResultCloseBtnClick},

			// REPORT BATCH
			'itmrptbatchsearch': {
				initialize: this.rptDateSearchInitialize,
				show: this.handheldScannerHandler
			},
			'itmrptbatchsearch *[name=F1031]': {change: this.rptDateSearchPeriodChange},
			'itmrptbatchsearch #closeBtn': {tap: this.rptBatchSearchCloseBtnClick},
			'itmrptbatchsearch #pastDateBtn': {tap: this.rptDateSearchPastDateBtnClick},
			'itmrptbatchsearch #futureDateBtn': {tap: this.rptDateSearchFutureDateBtnClick},
			'itmrptbatchsearch #launchBtn': {tap: this.rptBatchSearchLaunchBtnClick},

			'itmrptbatchresult': {
				show: this.handheldScannerHandler,
				smsrefresh: this.rptBatchResultView
			},
			'itmrptbatchresult #closeBtn': {tap: this.rptBatchResultCloseBtnClick},

			// REPORT SUM
			'itmluprptsumsearch': {
				initialize: this.rptDateSearchInitialize,
				show: this.handheldScannerHandler
			},
			'itmluprptsumsearch *[name=F1031]': {change: this.rptDateSearchPeriodChange},
			'itmluprptsumsearch #closeBtn': {tap: this.lupRptSumSearchCloseBtnClick},
			'itmluprptsumsearch #pastDateBtn': {tap: this.rptDateSearchPastDateBtnClick},
			'itmluprptsumsearch #futureDateBtn': {tap: this.rptDateSearchFutureDateBtnClick},
			'itmluprptsumsearch #launchBtn': {tap: this.lupRptSumSearchLaunchBtnClick},

			'itmluprptsumresult': {	show: this.handheldScannerHandler},
			'itmluprptsumresult #closeBtn': {tap: this.lupRptSumResultCloseBtnClick},
			'itmluprptsumresult #resultGrid': {itemtap: this.lupRptSumResultGridItemTap}
			
		});
	},

	launch: function() {
		TasksCtrl = this;
	},

/// COMMON TOOLS /////////////////////////////////////////////////////////////////////////////////////////////

	handheldScannerHandler: function (form) {
		var listForm = ["taskslabelinstant", "taskslabelprint", "tasksscanverify", "itmluprptsumresult","itmrptdateresult","itmrptbatchresult"]; 

		//Deactivate the handheld scanner
		DeviceCtrl.disableHandheldScanners(form,listForm);	

		//Acctivate handheld scanner only for forms using code value
		if (listForm.indexOf(form.xtype) != -1)
			DeviceCtrl.enableHandheldScanners(form,listForm,ItmCtrl.itmDeviceScannerCallback);
	},

	// SCANNER BUTTON
	tasksScanCamBtnClick: function(btn) {
		DeviceCtrl.scannerCamBtnClick(btn,TasksCtrl.taskCodeEntry);
	},

//// LABEL INSTANT /////////////////////////////////////////////////////////////////////////////////////////

	labelInstantView: function(src,code,obj,evt) {
		var widget = 'taskslabelinstant';
		var validCode = (BaseCtrl.hotPoolGet('F01')) ? true : false;
		validCode = (code) ? true : validCode;
		if (validCode) {
			var url = ItmCtrl.itemCommonView(src,evt,'mFloor_tasks_label_instant.xml',widget,code);

			// Auto label
			if (BaseCtrl.sessionCur().getConfig('mFloor_TasksLabelInstant', 'LabelOnScan') == '1') {
				url += '&RECORD_ACT=1';
				url += BaseCtrl.replaceParamStore(BaseCtrl.sessionCur().getUrlConfig('mFloor_TasksLabelInstant'), "mFloor_TasksLabelInstant/");
			}
			ExecCtrl.entrySendUrl(url);
		} else {
			ExecCtrl.entryError('You must scan an item first!');
		}
	},

	// LABEL INSTANT HOOK
	labelInstantHook: function(node,append) {
		var focus= '';
		var snode = Ext.DomQuery.selectNode('skipFocus',node);
		if (snode && snode.firstChild) focus= snode.firstChild.nodeValue;

		var form;
		if (focus!='1') 
			form = ExecCtrl.windowAdd('taskslabelinstant'); 
		else {
			form = Ext.Viewport.down('taskslabelinstant');
			if (!form) form = ExecCtrl.windowAdd('taskslabelinstant');
		}

		var data = Ext.DomQuery.selectNode('data record', node);
		if (data) {
			form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.TasksLabelInstant')));
			var record = form.getRecord();

			// refresh hot idx
			Ext.Viewport.fireEvent('appItemBeforeChangeEvent',record);

			// Show TPR
			var fldLbl = form.down('textfield[name=F181]');
			if (record.get('F181'))
				fldLbl.up().setHidden(false); else
				fldLbl.up().setHidden(true);
	
			// Show Sale
			fldLbl = form.down('textfield[name=F136]');
			if (record.get('F136'))
				fldLbl.up().setHidden(false); else
				fldLbl.up().setHidden(true);
	
			// Show Instore
			fldLbl = form.down('textfield[name=F1133]');
			if (record.get('F1133'))
				fldLbl.up().setHidden(false); else
				fldLbl.up().setHidden(true);
		}

		var lblFmt = record.get('LabelFormat');
		var lblTpl = BaseCtrl.sessionCur().getConfig('mFloor_TasksLabelInstant', 'LabelFormat');
		if (lblFmt != '') {
			BaseCtrl.sessionCur().setConfig('mFloor_TasksLabelInstant','LabelFormat',lblFmt);
		} else if (lblTpl != '') {
			BaseCtrl.sessionCur().setConfig('mFloor_TasksLabelInstant','LabelFormat',lblTpl);
		}

		if (BaseCtrl.sessionCur().getConfig('mFloor_TasksLabelInstant', 'LabelPrinter') == '')
			BaseCtrl.sessionCur().setConfig('mFloor_TasksLabelInstant','LabelPrinter',record.get('LabelPrinter'));

		// Load configs
		BaseCtrl.sessionCur().getFormConfig(form,'mFloor_TasksLabelInstant');

		if (focus!='1') Ext.Viewport.fireEvent('appItemAfterChangeEvent', form);
	},

	// LABEL INSTANT CLOSE
	labelInstantCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('taskslabelinstant','itmstart');

		var form = Ext.Viewport.down('itminfo');
		if (!form) {
			DeviceCtrl.disableHandheldScanners();
			ExecCtrl.windowClose('itmstart');

			var card = Ext.Viewport.down('trshost');
			if (!card) ExecCtrl.windowAdd('trshost');
			ExecCtrl.windowAdd('trsstart'); 
		}
	},

	// LABEL INSTANT DELETE
	labelInstantDeleteBtnClick: function(btn) {
		var form  = btn.up('formpanel');
		var url = 'cgi=mFloor_tasks_label_instant.xml&RECORD_DEL=1&SKIPFOCUS=1';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		url += BaseCtrl.formGetAll(form);
		ExecCtrl.entrySendUrl(url);
	},

	// LABEL INSTANT ADD
	labelInstantPrintBtnClick: function(btn) {
		var form  = btn.up('formpanel');
		var url = 'cgi=mFloor_tasks_label_instant.xml&SKIPFOCUS=1&RECORD_ACT=1';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		url += BaseCtrl.formGetAll(form);
		ExecCtrl.entrySendUrl(url);
	},

//// LABEL PRINT //////////////////////////////////////////////////////////////////////////////////////

	labelPrintView: function(src,code,obj,evt) {
		// Auto label
		if (BaseCtrl.sessionCur().getConfig('mFloor_TasksLabelPrint', 'LabelOnScan') == '1') {
			url = ItmCtrl.itemCommonView(null, null, 'mFloor_tasks_label_print.sqi', 'taskslabelprint', code);
			url += '&RECORD_ACT=1';
			url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
			url += BaseCtrl.replaceParamStore(BaseCtrl.sessionCur().getUrlConfig('mFloor_TasksLabelPrint'), "mFloor_TasksLabelPrint/");
		} else {
			url = ItmCtrl.itemCommonView(src,code,'mFloor_tasks_label_print.xml','taskslabelprint',code);
		}

		ExecCtrl.entrySendUrl(url);
	},

	// LABEL PRINT HOOK
	labelPrintHook: function(node,append) {
		var focus= '';
		var snode = Ext.DomQuery.selectNode('skipFocus',node);
		if (snode && snode.firstChild) focus= snode.firstChild.nodeValue;

		var form;
		if (focus!='1') 
			form = ExecCtrl.windowAdd('taskslabelprint'); 
		else {
			form = Ext.Viewport.down('taskslabelprint');
			if (!form) form = ExecCtrl.windowAdd('taskslabelprint');
		}

		var data = Ext.DomQuery.selectNode('data record', node);
		if (data) {
			form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.TasksLabelPrint')));
			var record = form.getRecord();

			// refresh hot idx
			Ext.Viewport.fireEvent('appItemBeforeChangeEvent',record);
		}

		// Load configs
		BaseCtrl.sessionCur().getFormConfig(form,'mFloor_TasksLabelPrint');

		if (focus != '1') Ext.Viewport.fireEvent('appItemAfterChangeEvent', form);
	},

	// LABEL PRINT CLOSE
	labelPrintCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('taskslabelprint','itmstart');
	},

	// LABEL PRINT GO
	labelPrintBtnClick: function(btn) {
		var form  = btn.up('formpanel');
		var url = 'sqi=mFloor_tasks_label_print&SKIPFOCUS=1&RECORD_ACT=1';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		url += BaseCtrl.formGetAll(form);
		ExecCtrl.entrySendUrl(url);
	},

//// SCAN SET ///////////////////////////////////////////////////////////////////////////////////////

	scanSetInitialize: function(form) {
		BaseCtrl.sessionCur().getFormConfig(form,'mFloor_TasksScanSet');
		TasksCtrl.handheldScannerHandler(form);
	},

	// SCAN BTN RUN
	scanSetBtnRun: function (btn) {
		var form = Ext.Viewport.down('tasksscanset');
		BaseCtrl.sessionCur().setFormConfig(form, 'mFloor_TasksScanSet');
		ExecCtrl.windowAdd('tasksscanverify');
	},

	// SCAN SET OPEN
	scanSetOpenBtnClick: function(btn) {
		ExecCtrl.windowAdd('tasksscanset');
	},

	// SCAN SET CLOSE
	scanSetCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('tasksscanset','itmstart');
	},

//// SCAN VERIFY //////////////////////////////////////////////////////////////////////////////

	scanVerifyView: function(src,code,obj,evt) {
		var url = ItmCtrl.itemCommonView(src, evt, 'mFloor_tasks_scan_verify.xml', 'tasksscanverify', code);
		BaseCtrl.sessionCur().setConfig('mFloor_TasksScanSet', 'LOC_TAB-F1030', 1 + eval(BaseCtrl.sessionCur().getConfig('mFloor_TasksScanSet', 'LOC_TAB-F1030')));
		url += BaseCtrl.replaceParamStore(BaseCtrl.sessionCur().getUrlConfig('mFloor_TasksScanSet'), "mFloor_TasksScanSet/");
		ExecCtrl.entrySendUrl(url);
	},

	// SCAN VERIFY HOOK
	scanVerifyHook: function(node,append) {
		var focus= '';
		var snode = Ext.DomQuery.selectNode('skipFocus',node);
		if (snode && snode.firstChild) focus = snode.firstChild.nodeValue;
		
		var form;
		if (focus!='1') 
			form = ExecCtrl.windowAdd('tasksscanverify');
		else {
			form = Ext.Viewport.down('tasksscanverify');
			if (!form) form = ExecCtrl.windowAdd('tasksscanverify');
		}

		var data = Ext.DomQuery.selectNode('data record', node);
		if (data) {
			form.setRecord(BaseCtrl.formFieldsFromNode(node,Ext.create('SMS.model.TasksScanVerify')));
			var record = form.getRecord();

			// refresh hot idx
			Ext.Viewport.fireEvent('appItemBeforeChangeEvent',record);

			// set image
			var flds = form.query('image');
			for (var y=0; y<flds.length; y++) {
				flds[y].setSrc(record.get('imageSrc'));
			}
	
			var addbtn = form.down('#addBtn');
			var delbtn = form.down('#deleteBtn');
			var savebtn = form.down('#saveBtn');
			if (record.get('F902')) {
				form.down('textfield[name=FINSTORE_BAT-F1133]').up().up().setHidden(false);
				if (record.get('FINSTORE_BAT-F01')) {
					addbtn.setHidden(true);
					savebtn.setHidden(false);
					delbtn.setHidden(false);
				} else {
					addbtn.setHidden(false);
					savebtn.setHidden(true);
					delbtn.setHidden(true);
				}
			} else {
				form.down('textfield[name=FINSTORE_BAT-F1133]').up().up().setHidden(true);
				addbtn.setHidden(true);
				savebtn.setHidden(true);
				delbtn.setHidden(true);
			}

			if (record.get('LOC_TAB-F1030')>0) {
				BaseCtrl.sessionCur().setConfig('mFloor_TasksScanSet','LOC_TAB-F1030',record.get('LOC_TAB-F1030'));
			}
		}
		
		BaseCtrl.sessionCur().getFormConfig(form,'mFloor_TasksScanVerify');

		if (focus!='1') Ext.Viewport.fireEvent('appItemAfterChangeEvent', form);
	},

	// SCAN VERIFY CLOSE
	scanVerifyCloseBtnClick: function(btn) {
		var form = Ext.Viewport.down('#tasksscanset');
		if (form)
			ExecCtrl.windowClose('tasksscanverify','tasksscanset'); else
			ExecCtrl.windowClose('tasksscanverify');
	},

	// SCAN VERIFY SAVE
	scanVerifySaveBtnClick: function(btn) {
		var form  = btn.up('formpanel');
		var url = 'cgi=mFloor_tasks_scan_verify.xml';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		url += BaseCtrl.formGetAll(form);
		url += '&SKIPFOCUS=1';
		url += BaseCtrl.replaceParamStore(BaseCtrl.sessionCur().getUrlConfig('mFloor_TasksScanSet'), "mFloor_TasksScanSet/");
		ExecCtrl.entrySendUrl(url);
	},

	// SCAN VERIFY ADD BATCH
	scanVerifyAddBtnClick: function(btn) {
		var form  = btn.up('formpanel');
		var url= 'cgi=mFloor_tasks_scan_verify.xml';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		url += '&SKIPFOCUS=1' ;
		url += BaseCtrl.formGetAll(form);
		url += '&RECORD_ADD=1';
		url += BaseCtrl.replaceParamStore(BaseCtrl.sessionCur().getUrlConfig('mFloor_TasksScanSet'), "mFloor_TasksScanSet/");
		ExecCtrl.entrySendUrl(url);
	},

	// SCAN VERIFY DEL BATCH
	scanVerifyDelBtnClick: function(btn) {
		var url= 'cgi=mFloor_tasks_scan_verify.xml';
		url += '&HOT_IDX_F01=' + BaseCtrl.hotPoolGet('F01');
		url += '&SKIPFOCUS=1';
		url += '&RECORD_DEL=1';
		url += BaseCtrl.replaceParamStore(BaseCtrl.sessionCur().getUrlConfig('mFloor_TasksScanSet'), "mFloor_TasksScanSet/");
		ExecCtrl.entrySendUrl(url);
	},


//// REPORT DATE SEARCH /////////////////////////////////////////////////////////////////////////////////////

	rptDateSearchInitialize: function(form) {
		var frmConfig = 'mFloor_ItmRptDate';
		if (form.alias == 'widget.itmrptbatchsearch')
			frmConfig = 'mFloor_ItmRptBatch';			
		
		BaseCtrl.sessionCur().getFormConfig(form,frmConfig);
		var start=form.down('*[name=D254]');
		var stop = form.down('*[name=E254]');
		if (start) setTimeout(function(){start.setValue(BaseCtrl.getDateInterval(BaseCtrl.sessionCur().getConfig(frmConfig,'F1031','W')+'D',new Date()));},200);
		if (stop) setTimeout(function(){stop.setValue(BaseCtrl.getDateInterval(BaseCtrl.sessionCur().getConfig(frmConfig,'F1031','W')+'F',new Date()));},200);
		setTimeout(function () { BaseCtrl.sessionCur().setFormConfig(form, frmConfig); }, 250);
	},

	rptDateSearchPeriodChange: function(combo) {
		var form=combo.up('formpanel');

		var frmConfig = 'mFloor_ItmRptDate';
		if (form.alias == 'widget.itmrptbatchsearch')
			frmConfig = 'mFloor_ItmRptBatch';			

		var start=form.down('*[name=D254]');
		var stop=form.down('*[name=E254]');

		if (start) setTimeout(function(){start.setValue(BaseCtrl.getDateInterval(BaseCtrl.sessionCur().getConfig(frmConfig,'F1031','W')+'D',new Date()));},500);
		if (stop) setTimeout(function(){stop.setValue(BaseCtrl.getDateInterval(BaseCtrl.sessionCur().getConfig(frmConfig,'F1031','W')+'F',new Date()));},500);
		setTimeout(function(){BaseCtrl.sessionCur().setFormConfig(form,frmConfig);},550);
	},
	
	// REPORT SEARCH CLOSE
	rptDateSearchCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmrptdatesearch');
	},

	// REPORT PAST DATE
	rptDateSearchPastDateBtnClick: function(btn) {
		var form = btn.up('formpanel');

		var frmConfig = 'mFloor_ItmRptDate';
		if (form.alias == 'widget.itmrptbatchsearch')
			frmConfig = 'mFloor_ItmRptBatch';			

		var start=form.down('*[name=D254]');
		var stop=form.down('*[name=E254]');
		if (start) start.setValue(BaseCtrl.getDatePast(BaseCtrl.sessionCur().getConfig(frmConfig,'F1031','D'),start.getValue()));
		if (stop) stop.setValue(BaseCtrl.getDatePast(BaseCtrl.sessionCur().getConfig(frmConfig,'F1031','D'),stop.getValue()));
		BaseCtrl.sessionCur().setFormConfig(form,frmConfig);
	},

	// REPORT FUTURE DATE
	rptDateSearchFutureDateBtnClick: function(btn) {
		var form = btn.up('formpanel');

		var frmConfig = 'mFloor_ItmRptDate';
		if (form.alias == 'widget.itmrptbatchsearch')
			frmConfig = 'mFloor_ItmRptBatch';			

		var start=form.down('*[name=D254]');
		var stop=form.down('*[name=E254]');
		if (start) start.setValue(BaseCtrl.getDateFuture(BaseCtrl.sessionCur().getConfig(frmConfig,'F1031','D'),start.getValue()));
		if (stop) stop.setValue(BaseCtrl.getDateFuture(BaseCtrl.sessionCur().getConfig(frmConfig,'F1031','D'),stop.getValue()));
		BaseCtrl.sessionCur().setFormConfig(form,frmConfig);
	},

	// REPORT LAUNCH
	rptDateSearchLaunchBtnClick: function (btn) {
		TasksCtrl.rptDateResultView(btn);
	},

//// REPORT DATE RESULT  ///////////////////////////////////////////////////////////////////////////

	rptDateResultView: function (src, code, obj, evt) {
		var newcode;

		if (typeof (code) == 'undefined')
			newcode = BaseCtrl.hotPoolGet('F01');
		else 
			newcode = code;

		var url = ItmCtrl.itemCommonView(src, evt, 'mFloor_xml_hot.xml&ExtGridUsp=mFloor_ItmRptDate&ExtGridAlias=ItmRptDateResult&F01=' + newcode, 'itmrptdateresult', newcode);
		url += '&HOT_PRM_F01=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig','hot_prm','1');
		url += '&HOT_IDX_F01$SCAN_MFLOOR='+newcode;
		url += BaseCtrl.replaceParamStore(BaseCtrl.sessionCur().getUrlConfig('mFloor_ItmRptDate'), "mFloor_ItmRptDate/");
		ExecCtrl.entrySendUrl(url);
	},

	// REPORT DATE RESULT HOOK
	rptDateResultHook: function(node) {
		var form = ExecCtrl.windowAdd('itmrptdateresult');
		var grid = form.down('dataview');
		var store = BaseCtrl.gridNewStore('SMS.store.ItmRptDate');
		grid.setStore(store);
		BaseCtrl.gridFromNode(node,store);

		var edit = form.down('#searchEdit');
		if (edit) edit.setValue(ItmCtrl.itmLastCode);
	},

	// REPORT DATE RESULT CLOSE
	rptDateResultCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmrptdateresult');
	},
	
/// REPORT BATCH //////////////////////////////////////////////////////////////////////////////////

	rptBatchSearchInitialize: function(form) {
		BaseCtrl.sessionCur().getFormConfig(form,'mFloor_ItmRptBatch');
		var start=form.down('*[name=D254]');
		var stop=form.down('*[name=E254]');
		if (start) setTimeout(function(){start.setValue(BaseCtrl.getDateInterval(BaseCtrl.sessionCur().getConfig('mFloor_ItmRptBatch','F1031','W')+'D',new Date()));},200);
		if (stop) setTimeout(function(){stop.setValue(BaseCtrl.getDateInterval(BaseCtrl.sessionCur().getConfig('mFloor_ItmRptBatch','F1031','W')+'F',new Date()));},200);
		setTimeout(function(){BaseCtrl.sessionCur().setFormConfig(form,'mFloor_ItmRptBatch');},250);
	},

	rptBatchResultView: function(src,code,obj,evt) {
		var newcode;

		if (typeof (code) == 'undefined')
			newcode = BaseCtrl.hotPoolGet('F01');
		else 
			newcode = code;

		var url = ItmCtrl.itemCommonView(src,evt,'mFloor_xml_hot.xml&ExtGridUsp=mFloor_ItmRptBatch&ExtGridAlias=ItmRptBatchResult&F01=' + newcode,'itmrptbatchresult',newcode);
		url += '&HOT_PRM_F01=' + BaseCtrl.sessionCur().getConfig('mFloor_MainConfig','hot_prm','1');
		url += '&HOT_IDX_F01$SCAN_MFLOOR='+newcode;
		url += BaseCtrl.replaceParamStore(BaseCtrl.sessionCur().getUrlConfig('mFloor_ItmRptBatch'), "mFloor_ItmRptBatch/");
		ExecCtrl.entrySendUrl(url);
	},

	// REPORT BATCH SEARCH CLOSE
	rptBatchSearchCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmrptbatchsearch');
	},

	// REPORT BATCH LAUNCH
	rptBatchSearchLaunchBtnClick: function (btn) {
		var form = btn.up('formpanel');
		var url='cgi=mFloor_xml_hot.xml,ExtGridUsp=mFloor_ItmRptBatch,ExtGridAlias=ItmRptBatchResult';
		url += ',F01='+BaseCtrl.hotPoolGet('F01');
		url += BaseCtrl.winGetAll(form);
		ExecCtrl.entryExecPrm(btn,url);
	},
	
	// MOVEMENT BUILDER HOOK
	rptBatchResultHook: function(node) {
		var form = ExecCtrl.windowAdd('itmrptbatchresult');
		var grid = form.down('dataview');
		var store = BaseCtrl.gridNewStore('SMS.store.ItmRptBatch');
		grid.setStore(store);
		BaseCtrl.gridFromNode(node,store);

		var edit = form.down('#searchEdit');
		if (edit) edit.setValue(ItmCtrl.itmLastCode);
	},

	// MOVEMENT RESULT CLOSE
	rptBatchResultCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmrptbatchresult');
	},
	
/// REPORT SUMMARY //////////////////////////////////////////////////////////////////////////////////

	// REPORT SUMMARY SEARCH CLOSE
	lupRptSumSearchCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmluprptsumsearch');
	},

	// REPORT SUMMARY LAUNCH
	lupRptSumSearchLaunchBtnClick: function (btn) {
		var form = btn.up('formpanel');
		var url='cgi=mFloor_xml_hook.xml,ExtGridUsp=mFloor_ItmLupRptSum,ExtGridAlias=ItmLupRptSumResult';
		url += BaseCtrl.winGetAll(form);
		ExecCtrl.entryExecPrm(btn,url);
	},

	// MOVEMENT BUILDER HOOK
	lupRptSumResultHook: function(node) {
		var form = ExecCtrl.windowAdd('itmluprptsumresult');
		var grid = form.down('dataview');
		var store = BaseCtrl.gridNewStore('SMS.store.ItmLupRptSum');
		grid.setStore(store);
		BaseCtrl.gridFromNode(node,store);

		var edit = form.down('#searchEdit');
		if (edit) edit.setValue(ItmCtrl.itmLastCode);
	},

	// MOVEMENT RESULT CLOSE
	lupRptSumResultCloseBtnClick: function(btn) {
		ExecCtrl.windowClose('itmluprptsumresult');
	},

	// MOVEMENT RECLUST CLICK
	lupRptSumResultGridItemTap: function(list, index, target, record, e, eOpts) {
		Ext.Viewport.fireEvent('appItemBeforeChangeEvent', record);
		ItmCtrl.itemChangeExec();
	}

});
