Ext.define('SMS.model.TasksLabelInstant', {
	extend: 'Ext.data.Model',

	config: {
		fields: [

			{name: 'F01', type:'string', persist:false}, // Code
			{name: 'F02', type:'string', persist:false}, // POS Description

			{name: 'F30', type:'auto', persist:false}, //M Regular price
			{name: 'F31', type:'auto', persist:false}, //F Regular quantity

			{name: 'F181', type:'auto', persist:false}, //M TPR price
			{name: 'F182', type:'auto', persist:false}, //F TPR Qty

			{name: 'F136', type:'auto', persist:false}, //M SALE price
			{name: 'F135', type:'auto', persist:false}, //F SALE Qty

			{name: 'F1133', type:'auto', persist:false}, //M INSTORE Price
			{name: 'F1134', type:'auto', persist:false}, //F INSTORE Qty

			{name: 'LABEL_TAB-F113', type:'string', persist:false}, // Label source
			
			{name: 'LabelOnScan', type:'string'},
			{name: 'LabelFormat', type:'string'},
			{name: 'LabelPrinter', type:'string'},
			{name: 'LabelDescField', type:'string'},
			{name: 'LabelQuantity', type:'string'},
			{name: 'LabelPriceType', type:'auto'}
		]
	}
});