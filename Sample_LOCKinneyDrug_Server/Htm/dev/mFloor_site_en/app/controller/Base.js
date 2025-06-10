consoleLog('Base.load.start');

var BaseCtrl;
var BaseSession;
var BaseRights;
var BaseCombos;
var BaseFields;
var BaseServerSmsOrg;
var PICTUREWIDTH = 'auto';
var PICTUREHEIGHT = 'auto';

var msgBaseFieldReadOnly = "This field is read only.";
var msgBaseInvalidNumber = "Invalid number format, should have no more than 1 decimal.";
var msgBaseServerFailure = "Server response timeout.";
var msgBaseDoLocalOverrides = "Select picture locally";

var xml_special_to_escaped_one_map = {
	'&': '&amp;',
	'"': '&quot;',
	'<': '&lt;',
	'>': '&gt;'
};

var escaped_one_to_xml_special_map = {
	'&amp;': '&',
	'&quot;': '"',
	'&lt;': '<',
	'&gt;': '>'
};


Ext.define('SMS.controller.Base', {
	extend: 'Ext.app.Controller',

	requires: [
		'Ext.field.Select',
		'Ext.dataview.component.Container',
		'Ext.SegmentedButton'
	],

	init: function() {
		consoleLog('Base init');
		Ext.Viewport.on({
			scope: this,
			appBaseRightsHook: this.baseRightsHook
		});
	},

	launch: function() {
		consoleLog('Base launch');

		// create sessions
		BaseSession = Ext.create('SMS.store.BaseSession');
		BaseRights = Ext.create('SMS.store.BaseRights');
		BaseCombos = Ext.create('SMS.store.BaseCombos');
		BaseFields = Ext.create('SMS.store.BaseFields');

		// run overrides
		Ext.Loader.setConfig({enabled: true});
		this.DoLocalOverrides();

		// start application
		BaseCtrl = this;
		if (ExecCtrl && AppCtrl) ExecCtrl.startLoad();
		if (DeviceCtrl && AppCtrl) DeviceCtrl.startLoad();

	},

	// GET SESSION
	sessionCur: function() {
		return BaseSession;
	},

/// VALIDATION DATA //////////////////////////////////////////////////////////////////
	validateEmail: function (email) {
		var exReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		return exReg.test(String(email).toLowerCase());
	},
	
/// DATE ROUTINE /////////////////////////////////////////////////////////////////////

	/**
	 * Move the component field into a visible
	 * area when virtual keyboard pops up on Android
	 * mobile devices.
	**/	
	setFocusOnVirtualKeyboard: function (obj) {
		if (Ext.os.is.Android) {
			if (!obj.getReadOnly()) {
				var isObj = false;
				
				//Get the component's' offset position based on
				// the scrollable container 
				var offset = 0;
				var element = obj.element.dom;
				if (typeof (element) == 'undefined'){
					//Set trace for external JavaScript debugger
					consoleLog('BaseCtrl.setFocusOnVirtualKeyboard(): element = false');
					return;
				} else {
					while (element && element.className.indexOf('x-scroll-view') == -1) {
						offset += element.offsetTop;
						element = element.offsetParent;
						isObj = true;
					}
				}

				//Get the scrollable container parent  
				//to the selected input field.
				var parent = obj.getParent();
				if (!isObj || typeof (parent) == 'undefined'){
					//Set trace for external JavaScript debugger
					consoleLog('BaseCtrl.setFocusOnVirtualKeyboard(): parent = false');
					return;
				} else {
					isObj = false;
					while (parent && parent.config && !parent.config.scrollable) {
						parent = parent.getParent();
						if (!parent){
							consoleLog('BaseCtrl.setFocusOnVirtualKeyboard(): parent = false');
							isObj = false;
							return;
						}
						isObj = true;
					}

					//position the input field on the screen starting from 
					//the top of the scrollable container
					if (isObj) {
						parent.getScrollable().getScroller().scrollTo(0, offset);
					} else {
						//Set trace for external JavaScript debugger
						if (parent.getScrollable()){
							if (!parent.getScrollable().getScroller())
								consoleLog('BaseCtrl.setFocusOnVirtualKeyboard(): parent.getScrollable().getScroller()=false');
						} else {
							consoleLog('BaseCtrl.setFocusOnVirtualKeyboard(): parent.getScrollable=false');
						}
					}
				}
			}	
		}
	},	

	//Convert a UPC-E into a UPC code
	UPCConvertUpcE: function (upc) {
		switch (upc[5]) {
			case '0':
			case '1':
			case '2': upc = '0' + upc[0] + upc[1] + upc[5] + '0000' + upc[2] + upc[3] + upc[4];
				break;
			case '3': upc = '0' + upc[0] + upc[1] + upc[2] + '00000' + upc[3] + upc[4];
				break;
			case '4': upc = '0' + upc[0] + upc[1] + upc[2] + upc[3] + '00000' + upc[4];
				break;
			case '5':
			case '6':
			case '7':
			case '8':
			case '9': upc = '0' + upc[0] + upc[1] + upc[2] + upc[3] + upc[4] + '0000' + upc[5];
				break;
		}
		return upc;
	},

	getDateInterval: function (per, date) {
		if (per=='WD') {
			var dw = date.getDay();
			date=Ext.Date.add(date,Ext.Date.DAY,-dw);
		}
		else if (per=='WF') {
			var dw = date.getDay();
			date=Ext.Date.add(date,Ext.Date.DAY,-dw+6);
		}
		else if (per=='MD') date=Ext.Date.getFirstDateOfMonth(date);
		else if (per=='MF') date=Ext.Date.getLastDateOfMonth(date);
		else if (per=='YD') {
			var dy=Ext.Date.getDayOfYear(date);
			date=Ext.Date.add(date,Ext.Date.DAY,-dy);
		}
		else if (per=='YF') {
			var dy=Ext.Date.getDayOfYear(date);
			date=Ext.Date.add(Ext.Date.add(date,Ext.Date.DAY,-dy-1),Ext.Date.YEAR,1);
		}
		return date;
	},

	getDatePast: function(per,date) {
		if (per=='W') date=Ext.Date.add(date,Ext.Date.DAY,-7);
		else if (per=='M') date=Ext.Date.add(date,Ext.Date.MONTH,-1);
		else if (per=='Y') date=Ext.Date.add(date,Ext.Date.YEAR,-1);
		else date=Ext.Date.add(date,Ext.Date.DAY,-1);
		return date;
	},

	getDateFuture: function(per,date) {
		if (per=='W') date=Ext.Date.add(date,Ext.Date.DAY,7);
		else if (per=='M') date=Ext.Date.add(date,Ext.Date.MONTH,1);
		else if (per=='Y') date=Ext.Date.add(date,Ext.Date.YEAR,1);
		else date=Ext.Date.add(date,Ext.Date.DAY,1);
		return date;
	},

/// BASE ROUTINES ////////////////////////////////////////////////////////////////////

	// GET PARAM FROM LINE
	paramGet: function(prms,prmName) {
		if (!prms) return;
		var aParam = prms.split(',');
		for (var x=0; x<aParam.length; x++) {
			var name = aParam[x].split('=')[0];
			if (name == prmName)
				return aParam[x].substr(name.length+1);
		}
		return null;
	},

	//Replace or strip all occurrence depending of the content of prmValue 
	replaceParamStore: function (prm,prmName,prmValue) {
		var index = prmName.length; 
		var url = '';
		var tmp = '';
		while (prm != '') {
			if (prm.length >= index) {
				url += prm.substr(0, prm.indexOf(prmName));
				tmp = prm.substr(prm.indexOf(prmName), index);
				prm = prm.substr(prm.indexOf(prmName) + index);

				url += (typeof (prmValue) != 'undefined') ? tmp.replace(prmName, prmValue) : tmp.replace(prmName, "");

				if (prm.indexOf(prmName) == -1) {
					url += prm;
					prm = '';
				}
			}
		}
		return url;
	},

	// GET PARAM FROM URL
	urlGet: function(url,prmName) {
		var prms = url.split('?');
		if (prms.length>1) url = prms[1];
		prms = url.split('&');
		for (var x=0; x<prms.length; x++) {
			var name = prms[x].split('=')[0];
			if (name == prmName)
				return prms[x].substr(name.length+1);
		}
		return null;
	},

	// FILTER URL
	urlFilter: function (url, except) {
		// if url is empty
		if (!url) return;
		
		var px = url.indexOf('?'); 
		var prms = url.substr(px + 1).split('&');
		var name;

		url = (px != -1) ? url.substr(0, px + 1) : '';
		for (px = 0; px < prms.length; px++) {
			name = prms[px].split('=')[0];
			if (except.indexOf(name) == -1) url += prms[px]+'&';
		}
		return url.substr(0,url.length-1);
	},

	// PROTECT STRING FOR XML
	encodeXml: function(string) {
		return string.replace(/([\&"<>])/g,
			function(str, item) {
				return xml_special_to_escaped_one_map[item];
			}
		);
	},

	// UNPROTECT STRING FROM XML
	decodeXml: function(string) {
		return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
			function(str, item) {
				return escaped_one_to_xml_special_map[item];
			}
		);
	},

	left: function(str, n) {
		if (n <= 0)	return ""; else
		if (n > String(str).length)return str; else
			return String(str).substring(0,n);
	},

	right: function(str, n) {
		if (n <= 0) return ""; else
		if (n > String(str).length) return str;
		else {
			var iLen = String(str).length;
			return String(str).substring(iLen, iLen - n);
		}
	},

/// HOT IDX POOL /////////////////////////////////////////////////////////////////////////////

	// GET HOT_IDX POOL
	hotPoolGet: function(sName,iView) {
		if (iView==null) iView=0;
		sName=sName.toLowerCase();
		if (!gaHotPool[iView]) return '';
		for (var x=0; x<gaHotPool[iView].length; x++)
			if (sName == gaHotPool[iView][x][0])
				return gaHotPool[iView][x][1];
		return '';
	},

	// REPLACE HOT_IDX POOL
	hotPoolAdd: function(sName,sValue,iView) {
		if (iView==null) iView=0;
		sName=sName.toLowerCase();
		if (!gaHotPool[iView]) gaHotPool[iView] = new Array();
		for (var y=0; y<gaHotPool[iView].length; y++)
			if (gaHotPool[iView][y][0] == sName) {
				gaHotPool[iView][y][1] = sValue;
				return true;
			}
		gaHotPool[iView][gaHotPool[iView].length]=new Array(sName,sValue);
	},

	// SET HOT_IDX POOL
	hotPoolSet: function(sName,sValue,iView) {
		if (iView==null) iView=0;
		sName=sName.toLowerCase();
		if (!gaHotPool[iView]) gaHotPool[iView] = new Array();
		for (var y=0; y<gaHotPool[iView].length; y++)
			if (gaHotPool[iView][y][0] == sName) {
				if (gaHotPool[iView][y][1] == '')
					gaHotPool[iView][y][1] = sValue;
				return true;
			}
		gaHotPool[iView][gaHotPool[iView].length]=new Array(sName,sValue);
	},

	// CLEAR HOT_IDX POOL
	hotPoolClear: function(sName,sValue,iView) {
		if (iView==null) iView=0;
		sName=sName.toLowerCase();
		if (!gaHotPool[iView]) return false;
		for (var y=0; y<gaHotPool[iView].length; y++)
			if (gaHotPool[iView][y][0] == sName) {
				gaHotPool[iView].splice(y,1);
				return true;
			}
		return false;
	},

	// RESET HOT_IDX POOL
	hotPoolReset: function(iView) {
		if (iView==null) iView=0;
		gaHotPool[iView]=null;
	},

/// PARAM POOL /////////////////////////////////////////////////////////////////////////////

	// GET PRM POOL
	prmPoolGet: function(sName,iView) {
		if (iView==null) iView=0;
		if (!gaPrmPool[iView]) return '';
		for (var x=0; x<gaPrmPool[iView].length; x++)
			if (sName == gaPrmPool[iView][x][0])
				return gaPrmPool[iView][x][1];
		return '';
	},

	// REPLACE PRM POOL
	prmPoolAdd: function(sName,sValue,iView) {
		if (iView==null) iView=0;
		if (!gaPrmPool[iView]) gaPrmPool[iView] = new Array();
		for (var y=0; y<gaPrmPool[iView].length; y++)
			if (gaPrmPool[iView][y][0] == sName) {
				gaPrmPool[iView][y][1] = sValue;
				return true;
			}
		gaPrmPool[iView][gaPrmPool[iView].length]=new Array(sName,sValue);
	},

	// CLEAR PRM POOL
	prmPoolClear: function(sName,sValue,iView) {
		if (iView==null) iView=0;
		if (!gaPrmPool[iView]) return false;
		for (var y=0; y<gaPrmPool[iView].length; y++)
			if (gaPrmPool[iView][y][0] == sName) {
				gaPrmPool[iView].splice(y,1);
				return true;
			}
		return false;
	},

	// RESET PRM POOL
	prmPoolReset: function(iView) {
		if (iView==null) iView=0;
		gaPrmPool[iView] = [];
	},

	prmPoolCount: function(iView) {
		if (iView==null) iView=0;
		return 	gaPrmPool[iView].length;
	},

	prmPoolName: function(iIndex,iView) {
		if (iView==null) iView=0;
		return 	gaPrmPool[iView][iIndex][0];
	},

	prmPoolValue: function(iIndex,iView) {
		if (iView==null) iView=0;
		return 	gaPrmPool[iView][iIndex][1];
	},

/// APPLY ////////////////////////////////////////////////////////////////////////////////////////////

	/// APPLY ALL WINDOWS EVENTS ///

	applyEvents: function(win) {

		// set all combo store
		var combos = win.query('selectfield');
		for (var cx=0; cx<combos.length; cx++) 
			if (combos[cx].xtype!='datepickerfield') {
				var store = combos[cx].getStore();
				// get from server
				if (!combos[cx].getOptions() && store && store.getStoreId().substr(0,4)!='ext-') {
					store.getProxy().setUrl(BaseCtrl.sessionCur().getUrl(store.getProxy().config.url));
					store.load();
				}
				// get from BaseCombos
				else
				if (!combos[cx].getOptions()) {
					var help = combos[cx].config.smsCombo;
					if (!help) help = combos[cx]._name;
	
					BaseCombos.clearFilter();
					BaseCombos.filter([{property: "cmp", value: help, exactMatch : true}]);
					var store = Ext.create('Ext.data.ArrayStore', {model: 'SMS.model.BaseCombo'});
					store.setData(BaseCombos.getRange());
					combos[cx].setStore(store);
				}
	
				if (combos[cx].config.smsComboDefault)
					combos[cx].setValue(combos[cx].config.smsComboDefault);

				// field function
				if (combos[cx].config.smsExec) {
					combos[cx].addListener('change', function(edit,newval,oldval,eOpts ) {
						var mask = Ext.Viewport.getMasked();
						if (mask.getHidden())
							setTimeout(function(){ExecCtrl.entryExecPrm(edit,edit.config.smsExec+newval);},200);
					});
				}

			}

		// attach all buttons with smsExec to entryButtonTap
		var cmps = win.query('button,menuitem');
		for (var cx=0; cx<cmps.length; cx++)
			if (cmps[cx].config.smsExec)
				cmps[cx].on('tap',ExecCtrl.entryButtonTap,ExecCtrl);

		// TEXT FIELD
		var cmps = win.query('textfield,textareafield');
		for (var cx=0; cx<cmps.length; cx++) {
			// search field
			if (cmps[cx].getPlaceHolder() == '**')
				cmps[cx].on({keyup: {fn: BaseCtrl.textfieldKeyup, scope: cmps[cx]}});

			// field exec
			if (cmps[cx].config.smsExec) {
				cmps[cx].addListener('keyup', function(edit,evt,eOpts ) {
					if (evt.event.keyCode==13) {
						var value = edit.getValue();
						if (value && edit.xtype == 'currencyfield')
							var value = value.toFixed(4);
						ExecCtrl.entryExecPrm(edit,edit.config.smsExec+value);
					}
				});
			}
		}

		// DATE FIELD
		var cmps = win.query('datepickerfield');
		for (var cx=0; cx<cmps.length; cx++) {
			var fld = cmps[cx];

			// init picker
			var picker = Ext.widget('pickerdatenull',{
				yearFrom: new Date().getFullYear()-5,
				yearTo: new Date().getFullYear()+5,
				listeners: {
					show: function(pick) {
						if (pick.getValue()==null || pick.getValue().getFullYear()==2008) pick.setValue(new Date());
					}
				}
			});

			// field exec
			if (fld.config.smsExec) {
				picker.smsSource=fld;
				picker.addListener('change', function(pick,value,eOpts ) {
					var mask = Ext.Viewport.getMasked();
					if (mask.getHidden()) {
						var edit=pick.smsSource;
						if (edit.config.smsExec.indexOf('FCT=')==-1)
							ExecCtrl.entryExecPrm(edit,edit.config.smsExec+Ext.Date.format(value,'m/d/Y')); else
							ExecCtrl.entryExecPrm(edit,edit.config.smsExec+Ext.Date.format(value,'mdY'));
					}
				});
			}
			fld.setPicker(picker);
		}

		// CHECKBOX EXEC
		var cmps = win.query('checkboxfield');
		for (var cx=0; cx<cmps.length; cx++) {
			if (cmps[cx].config.smsExec) {
				var dom = cmps[cx].element.dom;
				dom.smsSource = cmps[cx];
				dom.onclick=function(chk) {
					var cmp=chk.currentTarget.smsSource;
					if (cmp.getChecked())
						ExecCtrl.entryExecPrm(cmp,cmp.config.smsExec+'1'); else
						ExecCtrl.entryExecPrm(cmp,cmp.config.smsExec+'0');
				}
			}
		}

		// RADIO EXEC
		var cmps = win.query('radiofield');
		for (var cx=0; cx<cmps.length; cx++) {
			if (cmps[cx].config.smsExec) {
				var dom = cmps[cx].element.dom;
				dom.smsSource = cmps[cx];
				dom.onclick=function(chk) {
					var cmp=chk.currentTarget.smsSource;
					ExecCtrl.entryExecPrm(cmp,cmp.config.smsExec+cmp.getValue());
				}
			}
		}

		// SWIPE LEFT/RIGHT
// Make this configurable
//		if (win.config.smsHost)
//			win.element.on('swipe',function(evt) {BaseCtrl.TouchSwipeEvent(win,evt);});
	},

	TouchSwipeEvent: function(card,evt) {
		var host = card.up(card.config.smsHost);
		var cards = card.up('#cards');
		var card=cards.getActiveItem();
		var items = cards.getInnerItems();
		var idx = items.indexOf(card);
		if (evt.direction=="right") {
			consoleLog('right:'+card.config.smsHost);
			if (idx>0) idx--;
		}
		else {
			consoleLog('left:'+card.config.smsHost);
			if (idx<items.length-1) idx++;
		}

		var tools = host.down('#tools');
		var btn = tools.down('#'+items[idx].xtype);
		if (btn) tools.setPressedButtons(btn);

	},

	// APPLY USER RIGHT SETTERS ///
	applyRights: function(win) {
		var name = win.xtype;
		var level = BaseCtrl.sessionCur().getLevel()

		BaseRights.clearFilter();
		BaseRights.filterBy(function filter(record) {
			return (name.indexOf(record.get('win'))!=-1 || !record.get('win'));
		});

		for (var cx=0; cx<BaseRights.getCount(); cx++) {
			// lookup components
			var record = BaseRights.getAt(cx);
			var cmp = win.query(record.get('query'));
			var dis = (level < record.get('level'));
			// apply hide
			if (record.get('action') == 'hide') {
				for (var cy=0; cy<cmp.length; cy++)
					if (!cmp[cy].smsProtect && !cmp[cy].config.smsProtect) {
						cmp[cy].setHidden(dis);
						if (dis) {
							cmp[cy].setStyle('display:none');
							cmp[cy].setStyle('visibility: hidden');
						}
					}
			}
			else
			// apply read
			if (record.get('action') == 'read') {
					for (var cy=0; cy<cmp.length; cy++)
					if (!cmp[cy].smsProtect && !cmp[cy].config.smsProtect)
					cmp[cy].setReadOnly(dis);
			}
			// apply disable
			else
			for (var cy=0; cy<cmp.length; cy++)
			if (!cmp[cy].smsProtect && !cmp[cy].config.smsProtect)
			cmp[cy].setDisabled(dis);
		}
		BaseRights.clearFilter();
	},

	// ADD RIGHTS FROM SERVER
	baseRightsHook: function(node, cmp, options) {
		BaseCtrl.gridFromNode(node,BaseRights,true);
	},

	// GENERAL PROCESS FOR TRIGGER FIELDS
	popupTriggerCallBack: function(source,selection) {
		if (source.getReadOnly() == true)
			this.entryError(msgBaseFieldReadOnly); 
		else {
			var value = '';
			var text ='';
			for (var x=0; x<selection.length; x++) {
				value += selection[x].get('data');
				text += selection[x].get('caption');
			}
			var option =[{text: text, value: value}];
			source.setOptions(option);
			source.setValue(value);
		}
	},

	textfieldKeyup: function(edit) {
		if (edit.getValue().length == 1 && edit.getValue() !='*') {
			edit.setValue('*'+edit.getValue()+'*');
			// set cursor position
			var dom = edit.element.dom;
			var el = Ext.DomQuery.selectNode('input',dom);
			var pos = 2;
			if (typeof(el.selectionStart) === "number") {
				el.focus();
				el.setSelectionRange(pos, pos);
			}
			else
			if (el.createTextRange) {
				var range = el.createTextRange();
				range.move("character", pos);
				range.select();
			}
			else {
				throw 'setCursorPosition() not supported';
			}
		}
	},

/// FIELDS ////////////////////////////////////////////////////////////////////////

	schemaDescSave: null,
	schemaDesc: function(sFld,ret) {
		if (!ret) ret = 'desc';
		var sfs = sFld.split('-');
		var sf;
		if (sfs[1] == null) sf = sfs[0]; else sf = sfs[1];
		if (!this.schemaDescSave || this.schemaDescSave.get('fld') != sf)
			this.schemaDescSave = BaseFields.findRecord('fld',sf,null,null,false,true);
		if (this.schemaDescSave) sf = this.schemaDescSave.get(ret);
		if (sf == '' && ret == 'desc') sf = sFld;
		return sf;
	},

/// GRID ////////////////////////////////////////////////////////////////////////

	gridNewStore: function(name,options) {
		return Ext.create(name,options);
	},

	gridRunQuery: function(grid,url,options) {
		var store = grid.getStore();
		store.getProxy().setUrl(BaseCtrl.sessionCur().getUrl(url));
		store.load(options);
	},

	gridFromNode: function(node,store,append) {
		if (!append) {
			store.removeAll();
			store.currentPage=1;
		}
		// loop records
		var data = Ext.DomQuery.selectNode("data", node);
		var recs = data.childNodes;
		for (var rx=recs.length-1; rx>0; rx--) {
			var values = recs[rx].childNodes;
			if (values.length>0) {
					model = Ext.create(store.getModel());
					BaseCtrl.formFieldsFromNode(recs[rx],model);
					if (append)
						store.add(model); else
						store.insert(0,model);
			}
		}
	},

	paramsFromNode: function (node) {
		var data = Ext.DomQuery.selectNode("params", node);
		var prms = data.childNodes;
		var nodChild, url = '';
		
		for (var rx = 0; rx < prms.length; rx++) {
			nodChild = prms[rx].firstChild;
			url += '&'+prms[rx].nodeName+'='+ ((nodChild)? nodChild.nodeValue : ''); 
		}
		url = url.substr(1);
		return url;
	},

	paramFromNode: function(node,name) {
		var data = Ext.DomQuery.selectNode("params "+name, node);
		if (data && data.firstChild)
			return data.firstChild.nodeValue;
	},

	getFormDataImage: function(file,fileName) {
		
		//Build data to send
		var formData = new FormData();
		var fileName = BaseCtrl.hotPoolGet('F01') + '.jpg';
		formData.append('file',file, fileName);	
	},

/// FORM ////////////////////////////////////////////////////////////////////////

	formNewStore: function(form,name) {
		form.store = Ext.create(name);
	},

	formLoadStore: function(form,url,options) {
		form.store.getProxy().setUrl(BaseCtrl.sessionCur().getUrl(url));
		form.store.load(options);
	},

	// POPULATE MODEL FROM NODE
	formFieldsFromNode: function(node,model) {
		var flds = model.getFields();
		flds.each(function(f) {
			var child = Ext.DomQuery.selectNode(f.getName(),node);
			if (child && child.firstChild)
				model.set(f.getName(),child.firstChild.nodeValue); else
				model.set(f.getName(),'');
		});
		return model;
	},

	// FORM CLEAR
	formClear: function(form) {
		var cmps = form.query('textfield,emailfield,selectfield');
		for (var x=0; x<cmps.length; x++) cmps[x].setValue(null);

		var cmps = form.query('checkboxfield');
		for (var x=0; x<cmps.length; x++) cmps[x].uncheck();

		var cmps = form.query('datepickerfield');
		for (var x=0; x<cmps.length; x++) {
			cmps[x].setValue(null);
			var picker = cmps[x].getPicker();
			picker.setValue(new Date(2008,0,1));
		}
	},
	
	// FORM BUILD URL WITH CHANGES
	formGetChanges: function(form,modelId) {
		var record=form.getRecord();
		var values=form.getValues();
		if (modelId) {
			var model = Ext.create(modelId);
			var baseflds = model.getFields();
		}
		
		// build url
		var fields=record.fields;
		var name;
		var url='';
		var date = new Date(2008,0,1).toString();
		fields.each(function(fld) {
			name=fld._name;
			if (name in values) {
				var pos=name.indexOf('-');
				var newvalue=values[name];
				var oldvalue=record.get(name);

				// compare date as string because object are always different
				if (fld.getType()==Ext.data.Types.DATE) {
					if (newvalue==null || newvalue=='' || newvalue.toString()===date)
						val=''; else
						val=Ext.Date.format(newvalue,'m/d/Y');
					if (oldvalue==null || oldvalue=='')
						old=''; else
						old=Ext.Date.format(oldvalue,'m/d/Y');
					if (val!=old) {
						if (pos==-1)
							url=url+'&'+name+'='+val; else
							url=url+'&'+name.substr(0,pos)+'['+name.substr(pos+1)+']='+val;
					}
				}
				// Any other field
				else {
					if (fld.getType()==Ext.data.Types.BOOL) {
						if (newvalue==true) newvalue = '1';
					}
					if (!oldvalue) oldvalue='';
					if (!newvalue) newvalue='';
					if (newvalue!=oldvalue && (newvalue!='' || oldvalue!='')) {

						// need to find out if integer or number
						if (newvalue && Ext.isNumber(newvalue)) {
							var fld;
							if (modelId) {
								baseflds.each(function(f) {
									if (f._name==name) {
										fld = f;
									}
								});
							}
							if (fld && fld.config.smsType=='int') 
								var newvalue = newvalue.toFixed(); else
								var newvalue = newvalue.toFixed(4);
						}
						
						if (pos==-1)
							url=url+'&'+name+'='+escape(newvalue); else
							url=url+'&'+name.substr(0,pos)+'['+name.substr(pos+1)+']='+escape(newvalue);
					}
				}
			}
		});
		return url;
	},

	// BUILD URL FROM ALL FORM FIELDS
	formGetAll: function(form) {

		var record=form.getRecord();
		var values=form.getValues();

		// build url
		var fields=record.fields;
		var name;
		var url='';
		for (var fx=0; fx<fields.length; fx++) {

			var fld = fields.getAt(fx);
			name=fld._name;
			if (name in values && fld.getPersist()) {
				var pos=name.indexOf('-');
				var value=values[name];

				// Date
				if (fld.getType()==Ext.data.Types.DATE) {
					if (value==null) val=''; else val=Ext.Date.format(value,'m/d/Y');
					if (pos==-1)
						url=url+'&'+name+'='+val; else
						url=url+'&'+name.substr(0,pos)+'['+name.substr(pos+1)+']='+val;
				}
				// String
				else {
					if (value==null) val=''; else val=value;
					if (pos==-1)
						url=url+'&'+name+'='+escape(val); else
						url=url+'&'+name.substr(0,pos)+'['+name.substr(pos+1)+']='+escape(val);
				}
			}
		}
		return url;
	},

	// BUILD URL UPDATE FORM FIELDS
	formSmsUpdate: function(form,url,refresh,callback,xml) {
		if (refresh == null) refresh = true;
		Ext.Viewport.setMasked({xtype: 'loadmask',message: 'wait...'});
		var method = 'GET';
		if (xml) method = 'POST';
		Ext.Ajax.request({
			url: appServerSms+'/scripts/trs.exe',
			method: method,
			params: url+'&'+this.sessionCur().getSessionStr(),
			xmlData: xml,

			failure: function(response) {
				consoleLog('REQUEST TIMEOUT: id='+response.requestId+' url='+response.request.options.url+response.request.options.params+' status='+response.status);
				ExecCtrl.entryError(msgBaseServerFailure);
			},

			success: function(response) {

				// Detect auto logout
				var node = Ext.DomQuery.selectNode("root hooks hook type", response.responseXML);
				if (node) {
					var type = node.firstChild.nodeValue;
					if (type=='popupLogin') {
						ExecCtrl.desktopCloseAll();
						BaseCtrl.sessionCur().sessionLogout();
						BaseCtrl.hotPoolReset();
						ExecCtrl.windowAdd('startmenu');
						return false;
					}
				}

				// Update error
				var success = Ext.DomQuery.selectNode('root data success', response.responseXML);
				if (success && success.firstChild.nodeValue == 'false') {
					var msg = Ext.DomQuery.selectNode("message", response.responseXML);
					if (msg) ExecCtrl.entryError(msg.firstChild.nodeValue);
				}
				// Update successful
				else
				if (refresh && form) {

					Ext.Viewport.setMasked(false);
					form.store.removeAll();
					form.reset();

					// Reload store
					var child = Ext.DomQuery.selectNode("record", response.responseXML);
					if (child) {
						var fields = child.childNodes;
						var rec = {};
						for (i=0; i<fields.length; i++) {
							var values = fields[i].childNodes;
							if (values.length>0)
								rec[fields[i].nodeName] = values[0].nodeValue;
						}
						form.store.add(rec);
					}

					// Refresh form
					if (form.store.getCount() != 0) {
						form.setRecord(form.store.getAt(0));
						if (callback) callback(form,1)
					}
					else {
						var rec = Ext.create(form.store.getModel(), {});
						form.setRecord(rec);
						if (callback) callback(form,0)
					}
				}
				else
				if (callback) callback(form,response.responseXML)
			}
		});
	},


	// BUILD URL FROM ALL FORM FIELDS
	winGetAll: function(win) {

		// build all params and header
		var uc = win.query('textfield,emailfield,selectfield,datepickerfield,hiddenfield,checkboxfield');
		var url = '';

		for (var x=0; x<uc.length; x++) {

			var name = uc[x].getName();
			var value = (uc[x].xtype === 'checkboxfield') ? 'true' : uc[x].getValue();

			if ((name && value) || (uc[x].originalValue && uc[x].originalValue != '')) {
				if (uc[x].getValue() == ' ') {
					url += '&'+name+'=';
				}
				else
				if (uc[x].xtype == 'checkboxfield') {
					url += (uc[x].getChecked()) ? '&' + name + '=1' : '';
				}
				else
				if (uc[x].xtype == 'datepickerfield') {
					url += (Ext.Date.format(value,'m/d/Y') != '01/01/2008') ? '&'+name+'='+Ext.Date.format(value,'m/d/Y') : '';
				}
				else
				if (uc[x].xtype == 'selectfield') {
					url += (value != '') ? '&'+name+'='+value : '';
				}
				else {
					if (value != '') value = value.replace(/\*/g, '%');
					url += (value != '') ? '&'+name+'='+escape(value) : '';
				}
			}
		}
		return url;
	},

/// OVERRIDES /////////////////////////////////////////////////////////////////////////

	DoLocalOverrides: function() {
		Ext.define('SMS.field.Input', {
			override :'Ext.field.Input',
			initElement: function () {
				this.callParent(arguments);
				this.updateFieldAttribute('enterKeyHint','go');
				if (this.initialConfig.type === 'number') this.updateFieldAttribute('inputmode','numeric');
			}
		});
		// CHROME 43 BUG!
		Ext.override(Ext.util.SizeMonitor, {
			constructor: function(config) {
				var namespace = Ext.util.sizemonitor;

				if (Ext.browser.is.Firefox) {
					return new namespace.OverflowChange(config);
				} else if (Ext.browser.is.WebKit) {
					if (!Ext.browser.is.Silk && Ext.browser.engineVersion.gtEq('535') && !Ext.browser.engineVersion.ltEq('537.36')) {
						return new namespace.OverflowChange(config);
					} else {
						return new namespace.Scroll(config);
					}
				} else if (Ext.browser.is.IE11) {
				   return new namespace.Scroll(config);
				} else {
				   return new namespace.Scroll(config);
				}
			}
		});

		Ext.override(Ext.util.PaintMonitor, {
		   constructor: function(config) {
			   if (Ext.browser.is.Firefox || (Ext.browser.is.WebKit && Ext.browser.engineVersion.gtEq('536') && !Ext.browser.engineVersion.ltEq('537.36') && !Ext.os.is.Blackberry)) {
				   return new Ext.util.paintmonitor.OverflowChange(config);
			   }
			   else {
				   return new Ext.util.paintmonitor.CssAnimation(config);
			   }
		   }
		});

		// ISSUE WITH MESSAGE BOX GETTING STUCK WHEN PRESS OK
		Ext.Msg.defaultAllowedConfig.showAnimation = false;

		// TEMPORARY BUG FIX FOR DATEPICKER SO WE CAN SET NULL

		Ext.define("SMS.picker.DateNull", {
			extend: "Ext.picker.Date",
			xtype: 'pickerdatenull',
			getValue: function(useDom) {
				if (this._value && this._value.day === null && !useDom) {
					return null;
				}
				return this.callParent([useDom]);
			},
			setValue: function(value) {
				if (value) this.callParent([value]);
			}
		});

		// CAPTURE PICTURE

		Ext.define('SMS.view.CapturePicture', {
			extend: 'Ext.Component',
			xtype: 'capturepicture',

			config: {
				captured: false,
				width: 140,
				height: 100,
				cls: 'picture-capture',
				itemId: 'captureImg',
				html: [
					'<div class="icon"><i class="icon-camera"></i>' +  msgBaseDoLocalOverrides +  '</div>',
					'<input type="file" capture="camera" accept="image/*" />',
					'<img width="' + PICTUREWIDTH + '" height="' + PICTUREHEIGHT + '" class="image-tns" />'
				].join('')
			},

			initialize: function() {
				this.callParent(arguments);

				this.file = this.element.down('input[type=file]');
				this.img = this.element.down('img');
				this.file.on('change', this.setPicture, this);

				//FIX for webkit
				window.URL = window.URL || window.webkitURL;
			},

			setPicture: function(event) {
				var files = event.target.files;
				if (files.length === 1 && files[0].type.indexOf("image/") === 0) {

					// Display image
					var me = this;
					me.img.setStyle('display', 'block');
					var reader = new FileReader();
					reader.onload = function(event) {
						me.img.set({
							src: event.target.result
						});
						me.img.dom.height = me.img.dom.naturalHeight;
						if (me.img.dom.height > 200) me.img.dom.height = 200;
					}
					reader.readAsDataURL(files[0]);

					if (me.smsSubmitUrl) {
						// Upload  image
						var progressIndicator = Ext.create("Ext.ProgressIndicator",{
							loadingText: "Uploading: {percent}%"
						});

						var request = {
							url: me.smsSubmitUrl,
							method: 'POST',
							headers: {'Content-Type':'image/jpeg'},
							xhr2: true,
							binaryData: files[0],
							progress: progressIndicator,
							success: function(response) {
								ExecCtrl.processXmlHooks(null,response.responseXML);
							},
							failure: function(form, response) {
								alert('Image not supported!');
							}
						};
						Ext.Ajax.request(request);
					}
				}
			},

			setImage: function(pic) {
				if (pic) {
					this.img.setStyle('display', 'block');
					this.img.set({
						src: pic
					});
					this.setCaptured(true);
				}
			},

			reset: function() {
				this.img.setStyle('display', 'none');
				this.img.set({
					src: ''
				});
				this.setCaptured(false);
			},

			getImageDataUrl: function() {
				var img = this.img.dom,
					imgCanvas = document.createElement("canvas"),
					imgContext = imgCanvas.getContext("2d");

				if (this.getCaptured()) {
					// Make sure canvas is as big as the picture
					imgCanvas.width = img.width;
					imgCanvas.height = img.height;

					// Draw image into canvas element
					imgContext.drawImage(img, 0, 0, img.width, img.height);

					// Return the image as a data URL
					return imgCanvas.toDataURL("image/jpeg");
				}
			}
		});

		Ext.override(Ext.form.Panel, {

			getElementConfig: function() {
				var config = this.callParent();
				config.tag = "div";
				// Added a submit input for standard form submission. This cannot have "display: none;" or it will not work
				config.children.push({
					tag: 'input',
					type: 'submit',
					style: 'visibility: hidden; width: 0; height: 0; position: absolute; right: 0; bottom: 0;'
				});

				return config;
			}
		});

		Ext.define('Ext.ux.field.NumText', {
			extend: 'Ext.field.Text',
			xtype: 'numtextfield',

			initialize: function() {
				var me = this;
				var cmp = this.getComponent();
				var input = cmp.input;
				input.set({
					pattern : '[0-9]*'
				});
				me.callParent(arguments);
			}
		});

		// ADD ABILITY TO SET CURSOR POSTION

		Ext.override(Ext.field.Text, {
			setCursorPosition: function(pos) {
				var el = this.element.dom;
				if (typeof(el.selectionStart) === "number") {
					el.focus();
					el.setSelectionRange(pos, pos);
				}
				else
				if (el.createTextRange) {
					var range = el.createTextRange();
					range.move("character", pos);
					range.select();
				}
				else {
					throw 'setCursorPosition() not supported';
				}
			},

			onFocus: function(e) {
				this.fireAction('focus', [e], 'doFocus');
				if (!this.isNumberField) this.fireAction('focus', [e], 'select');
			}
		});

		// OVERRIDE GET DATA TO DETECT LOGIN MESSAGE

		Ext.override(Ext.data.reader.Xml, {

			getResponseData: function(response) {

				var node = Ext.DomQuery.selectNode("root hooks hook type", response.responseXML);
				if (node) {
					var type = node.firstChild.nodeValue;
					if (type=='popupLogin') {
						ExecCtrl.desktopCloseAll();
						BaseCtrl.sessionCur().sessionLogout();
						BaseCtrl.hotPoolReset();
						ExecCtrl.windowAdd('startmenu');
					}
				}
				return this.callParent(arguments);
			}
		});

		// ADD THE ABILITY TO ADD THE CURRENT ENTRY IN THE SELECT MENU

		Ext.override(Ext.field.Select, {

			applyValue: function(value) {
				var record = value,
				index, store;

				//we call this so that the options configruation gets intiailized, so that a store exists, and we can
				//find the correct value
				this.getOptions();
				store = this.getStore();
				if ((value != undefined && !value.isModel) && store) {

					//Override to set the value of the store if it's still loading
					if(store.isLoaded()==false && store.isLoading() && value!=null) {
						//Set a single event to set the value of the store once it's loaded
						store.on('load',function(s,r) {this.setValue(value);},this,{single:true});
					}
					else {
						index = store.find(this.getValueField(), value, null, null, null, true);
						if (index == -1) index = store.find(this.getDisplayField(), value, null, null, null, true);
						if (index == -1) {
							var record = Ext.create(store.getModel());
							record.set(this.getDisplayField(),value);
							record.set(this.getValueField(),value);
						}
						else record = store.getAt(index);
					}
				}

				return record;
			}

		});

		// EXTEND SELECTFIELD TO SHOW POPUP

		Ext.define('Ext.ux.field.SelectPopup', {
			extend: 'Ext.field.Select',
			alias: 'widget.selectpopup',

			initialize: function() {
				var me = this;
				Ext.apply(me, {
					smsPop: this.initialConfig.smsPop,
					smsCallback: this.initialConfig.smsCallback
				});
				me.callParent(arguments);
			},

			onMaskTap : function() {
				if (this.smsPop) {
					this.setOptions(null);
					var options = {};
					if (this.smsCallback) options['smsCallback']=eval(this.smsCallback);
					ExecCtrl.entryExecPrm(this,this.smsPop,options);
				}
				return false;
			}

		});

		//****** ADD TEXT FIELD ********************

		Ext.define('Ext.ux.field.TextField', {
			extend: 'Ext.field.Text', //Extending the TextField
			alias: 'widget.textfield', //Defining the xtype,

			onFocus: function (obj, e, eOpts) {
				BaseCtrl.setFocusOnVirtualKeyboard(this);
				return this.callSuper(arguments);
			}

		});

		//****** ADD TEXTAREA FIELD ****************

		Ext.define('Ext.ux.field.TextAreaField', {
			extend: 'Ext.field.TextArea', //Extending the TextAreaField
			alias: 'widget.textareafield', //Defining the xtype,

			onFocus: function (obj, e, eOpts) {
				BaseCtrl.setFocusOnVirtualKeyboard(this);
				return this.callSuper(arguments);
			}

		});

		//****** ADD CURRENCY FIELD ****************


		Ext.define('Ext.ux.field.CurrencyField', {
			extend: 'Ext.field.Text', //Extending the TextField
			alias: 'widget.currencyfield', //Defining the xtype,

			isNumberField: true,

			setValue : function(num,raw) {
				num = typeof num == 'number' ? num : parseFloat(num);
				var str = '';
				if (!isNaN(num)) {
					str = String(num);
					var pos = str.indexOf('.');
					if (pos == -1) str += '.00'
					else if (pos == str.length-2) str += '0';
					else if (pos == str.length-1) str += '00';
					if (!raw) str = '$' + str;
				}
				return this.callSuper([str]);
			},

			getValue : function(raw) {
				var str = this.callSuper();
				if (raw) 
					return str;
				else {
					num=parseFloat(str.replace(/[^\d\.-]/g,''));
					num = isNaN(num) ? '' : num
					return num;
				}
			},

			onBlur : function(obj, e, eOpts ) {
				var str = this.getValue(1);
				num = typeof str == 'number' ? str : parseFloat(str.replace(/[^\d\.-]/g,''));
				var pos = str.indexOf('.');
				if (pos == -1) num = num / 100;
				this.setValue(num);
				return this.callSuper(arguments);
			},

			onFocus: function (obj, e, eOpts) {
				this.setValue(this.getValue(), 1);
				this.getComponent().input.dom.setAttribute("inputmode", "decimal");
				this.getComponent().input.dom.setAttribute("enterKeyHint", "go");
				
				var input = this.getComponent().element.dom.querySelector('input');
				setTimeout(function(){input.select();},50);
				
				BaseCtrl.setFocusOnVirtualKeyboard(this);
				return this.callSuper(arguments);
			}

		});


		//****** ADD NUMBER FIELD ****************

		Ext.define('Ext.ux.field.NumberField', {
			extend: 'Ext.field.Text', //Extending the TextField
			alias: 'widget.numberfield', //Defining the xtype,
			
			isNumberField: true,

			config: {
				component: {
					type: 'number'
				},
				ui: 'number'
			},	
			initialize: function() {
				var me = this;
				me.callParent();
				this.getComponent().setType('text');
			},
			
			setValue : function(num,skip) {
				if (skip)
					var str = String(num);
				else {
					num = typeof num == 'number' ? num : parseFloat(num);
					var str = '';
					if (!isNaN(num)) {
						str = String(num);
					}
				}
				return this.callSuper([str]);
			},

			getValue : function() {
				var str = this.callSuper();
				num=parseFloat(str.replace(/[^\d\.-]/g,''));
				num = isNaN(num) ? '' : num
				return num;
			},
			
			onFocus: function(e) {
				this.setValue(this.getValue(), 1);
				var input = this.getComponent().element.dom.querySelector('input');
				setTimeout(function () {if (input) {input.select();	}}, 10);
				
				BaseCtrl.setFocusOnVirtualKeyboard(this);
				this.callParent(arguments);
			},
			onBlur: function(e) {
				this.callParent(arguments);
			}
		});

		/**
		* Usage:
		*	 var button = Ext.getCmp('ext-something-1');
		*	 Ext.ux.menu.Menu.open(
		*	 button, // the anchor
		*	 [
		*		 { text: 'Item 1', value: 'value1' },
		*		 { text: 'Item 2', value: 'value2' },
		*		 { text: 'Item 3', value: 'value3' }
		*	 ],
		*	 function(value) { // callback (called after the menu is closed)
		*		 // The value will be 'value1', 'value2', or 'value3'.
		*		 // If you close the menu by tapping on the mask, it becomes null.
		*	 }
		*	 );
		*/

		Ext.define('Ext.ux.menu.Menu', {
			extend: 'Ext.ActionSheet',
			xtype: 'menu',
			requires: [
				'Ext.ActionSheet'
			],

			statics: {
				open: function(owner, items, callback) {
					var menu = Ext.Viewport.add({
						xtype: 'menu',
						defaults: {
							xtype: 'button',
							ui: 'plain',
							handler: function(button) {
								menu.hide();
								callback(button.config.value);
							}
						},
						items: items,
						listeners: {
							hide: function() {
								Ext.Viewport.remove(menu);
							}
						}
					});
					menu.prepare();
					menu.showBy(owner);
				}
			},

			config: {
				cls: Ext.baseCSSPrefix + 'popup-menu',
				hideOnMaskTap: true,
				showAnimation: {
					type: 'fadeIn',
					duration: 200,
					easing: 'ease-out'
				},
				hideAnimation: {
					type: 'fadeOut',
					duration: 200,
					easing: 'ease-out'
				},
				extraSidePadding: 50
			},

			prepare: function() {
				var me = this;
				var buttons = this.query('button');
				var sidePadding = this.element.getWidth() - buttons[0].element.getWidth();
				var maxWidth = 0;
				buttons.forEach(function(button) {
					var width = me.getTextWidth(button.textElement);
					if (width > maxWidth)
					maxWidth = width;
				});
				this.setWidth(maxWidth + sidePadding + this.config.extraSidePadding);

				// The height of the panel is enough to show all contents by defaylt.
				// Before it is expanded automatically, I save the calculated height.
				this.setHeight(this.element.getHeight());
			},

			// Text labels in buttons are defined as <span style="display:block">text</span>
			// so I have to calculate actual width of the text with inserted elements.
			getTextWidth: function(span) {
				var leftAnchor = Ext.dom.Element.create({
					tag: 'span',
					style: 'display: inline !important;',
					html: '!'
				});
				span.insertFirst(leftAnchor);
				var rightAnchor = Ext.dom.Element.create({
					tag: 'span',
					style: 'display: inline !important;',
					html: '!'
				});
				span.append(rightAnchor);
				var left = leftAnchor.getX();
				var right = rightAnchor.getX();
				span.removeChild(leftAnchor);
				span.removeChild(rightAnchor);
				return Math.abs(right - left);
			}
		});
	}

});

/// CURRENCY FORMAT FOR SENCHA TOUCH ////////////////////////////////////////////////////////////////

(function() {
	var I18NFormatCleanRe, formatCleanRe, nl2brRe, stripScriptsRe, stripTagsRE;

	stripTagsRE = /<\/?[^>]+>/g;
	stripScriptsRe = /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/g;
	nl2brRe = /\r?\n/g;
	formatCleanRe = /[^\d\.]/g;
	I18NFormatCleanRe = void 0;

	Ext.define('SMS.util.Format', {
		statics: {
			thousandSeparator: ',',
			decimalSeparator: '.',
			currencyPrecision: 2,
			currencySign: '$',
			currencyAtEnd: false,

			usMoney: function(v) {
				return SMS.util.Format.currency(v, '$', 2);
			},

			// CURRENCY
			currency: function(v, currencySign, decimals, end) {
				var format, i, negativeSign;
				negativeSign = "";
				format = ",0";
				i = 0;
				v = v - 0;
				if (v < 0) {
					v = -v;
					negativeSign = "-";
				}

				decimals = decimals || SMS.util.Format.currencyPrecision;
				format += format + (decimals > 0 ? "." : "");
				while (i < decimals) {
					format += "0";
					i++;
				}
				v = SMS.util.Format.number(v, format);

				if ((end || SMS.util.Format.currencyAtEnd) === true) {
					return Ext.String.format("{0}{1}{2}", negativeSign, v, currencySign || SMS.util.Format.currencySign);
				} else {
					return Ext.String.format("{0}{1}{2}", negativeSign, currencySign || SMS.util.Format.currencySign, v);
				}
			},

			// NUMBER
			number: function(v, formatString) {
				var cnum, comma, dec, fnum, hasComma, i, i18n, j, m, n, neg, parr, psplit;
				if (!formatString) return v;
				v = Ext.Number.from(v, NaN);
				if (isNaN(v)) return "";
				comma = SMS.util.Format.thousandSeparator;
				dec = SMS.util.Format.decimalSeparator;
				i18n = false;
				neg = v < 0;
				hasComma = void 0;
				psplit = void 0;
				v = Math.abs(v);
				if (formatString.substr(formatString.length - 2) === "/i") {
					if (!I18NFormatCleanRe) {
						I18NFormatCleanRe = new RegExp("[^\\d\\" + Ext.util.Format.decimalSeparator + "]", "g");
					}
					formatString = formatString.substr(0, formatString.length - 2);
					i18n = true;
					hasComma = formatString.indexOf(comma) !== -1;
					psplit = formatString.replace(I18NFormatCleanRe, "").split(dec);
				} else {
					hasComma = formatString.indexOf(",") !== -1;
					psplit = formatString.replace(formatCleanRe, "").split(".");
				}
				if (1 < psplit.length) {
					v = v.toFixed(psplit[1].length);
				} else if (2 < psplit.length) {
					Ext.Error.raise({
						sourceClass: "Ext.util.Format",
						sourceMethod: "number",
						value: v,
						formatString: formatString,
						msg: msgBaseInvalidNumber
					});
				} else {
					v = v.toFixed(0);
				}
				fnum = v.toString();
				psplit = fnum.split(".");
				if (hasComma) {
					cnum = psplit[0];
					parr = [];
					j = cnum.length;
					m = Math.floor(j / 3);
					n = cnum.length % 3 || 3;
					i = void 0;
					i = 0;
					while (i < j) {
						if (i !== 0) n = 3;
						parr[parr.length] = cnum.substr(i, n);
						m -= 1;
						i += n;
					}
					fnum = parr.join(comma);
					if (psplit[1]) fnum += dec + psplit[1];
				} else {
					if (psplit[1]) fnum = psplit[0] + dec + psplit[1];
				}
				if (neg) neg = fnum.replace(/[^1-9]/g, "") !== "";
				return (neg ? "-" : "") + formatString.replace(/[\d,?\.?]+/, fnum);
			}

		}
	});

}).call(this);
consoleLog('Base.load.done');
