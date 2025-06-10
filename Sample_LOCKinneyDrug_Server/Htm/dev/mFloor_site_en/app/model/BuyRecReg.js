Ext.define('SMS.model.BuyRecReg', {
	extend: 'Ext.data.Model',

	config: {
		idProperty: 'F1101',

		fields: [
			{name: 'F1032', type:'auto'}, // trans#
			{name: 'F1101', type:'auto'}, // line#
			{name: 'F01', type:'string', persist:false}, // Code

			{name: 'F113', type:'auto', persist:false}, // dated price source
			{name: 'F1007', type:'auto', persist:false}, // dated price
			{name: 'F1006', type:'auto', persist:false}, // dated price qty
			{name: 'F30', type:'auto', persist:false}, // reg price
			{name: 'F31', type:'auto', persist:false}, // reg qty

			{name: 'FORMAT_COUNT', type:'auto', persist:false},
			{name: 'TOTAL_COUNT', type:'auto', persist:false},
			{name: 'INVENTORY', type:'auto', persist:false},
			{name: 'AVG_REG', type:'auto', persist:false},
			{name: 'AVG_SAL', type:'auto', persist:false},
			{name: 'ORD_TTL', type:'auto', persist:false},

			
			//Last orders
			{name: 'ORD_LAST', type:'auto', persist:false},
			{name: 'LAST_ORD1', type:'auto'},
			{ name: 'LAST_OPER1', type:'auto'},
			{ name: 'LAST_USER1', type:'auto'},
			{name: 'OPER1', type:'auto',
				convert: function(value,record) {
					var opnum = record.get('LAST_OPER1');
					var opname = record.get('LAST_USER1');
					var oper = '';

					if (opnum && opnum != 'n/a')
						oper += opnum;

					if (opnum && opnum != 'n/a' && opname && opname != 'n/a')
						oper += ' - ' + opname;
					
					return oper;
				}
			},
			{ name: 'LAST_DATE1', type:'date', dateFormat:'m/d/Y'},
			{ name: 'LAST_ORD2', type:'auto'},
			{ name: 'LAST_OPER2', type:'auto'},
			{ name: 'LAST_USER2', type:'auto'},
			{name: 'OPER2', type:'auto',
				convert: function(value,record) {
					var opnum = record.get('LAST_OPER2');
					var opname = record.get('LAST_USER2');
					var oper = '';

					if (opnum && opnum != 'n/a')
						oper += opnum;

					if (opnum && opnum != 'n/a' && opname && opname != 'n/a')
						oper += ' - ' + opname;
					
					return oper;
				}
			},
			{name: 'DATE_LAST2', type:'date', dateFormat:'m/d/Y'},

			{ name: 'MOV_DATE1', type: 'date', dateFormat: 'm/d/Y' },
			{ name: 'MOV_ORD1', type: 'auto' },
			{ name: 'MOV_RCV1', type: 'auto' },
			{ name: 'MOV_SOLD1', type: 'auto' },
			{ name: 'MOV_INV1', type: 'auto' },
			{ name: 'MOV_DATE2', type: 'date', dateFormat: 'm/d/Y' },
			{ name: 'MOV_ORD2', type: 'auto' },
			{ name: 'MOV_RCV2', type: 'auto' },
			{ name: 'MOV_SOLD2', type: 'auto' },
			{ name: 'MOV_INV2', type: 'auto' },
			{ name: 'MOV_DATE3', type: 'date', dateFormat: 'm/d/Y' },
			{ name: 'MOV_ORD3', type: 'auto' },
			{ name: 'MOV_RCV3', type: 'auto' },
			{ name: 'MOV_SOLD3', type: 'auto' },
			{ name: 'MOV_INV3', type: 'auto' },
			{ name: 'MOV_DATE4', type: 'date', dateFormat: 'm/d/Y' },
			{ name: 'MOV_ORD4', type: 'auto' },
			{ name: 'MOV_RCV4', type: 'auto' },
			{ name: 'MOV_SOLD4', type: 'auto' },
			{ name: 'MOV_INV4', type: 'auto' },

			{name: 'F151', type:'auto', persist:false}, // Next cost net
			{name: 'F1140', type:'auto', persist:false}, // Unit net cost
			{name: 'F1887', type:'auto', persist:false}, // UOM
			{name: 'F220', type:'auto', persist:false}, // split code
			{name: 'F1795', type:'auto', persist:false}, // split qty
			{name: 'F64', type:'auto', persist:false}, // Total quantity

			{name: 'F75', type:'auto', persist:false}, // case order
			{name: 'F1266', type:'auto', persist:false}, // Unit order
			{name: 'F1267', type:'auto', persist:false}, // Weight order

			{name: 'REC_REG-F26', type:'string'}, // Vnd code
			{name: 'REC_REG-F1041', type:'string'}, // Desc
			{name: 'REC_REG-F1976', type:'string'}, // Cost comment
			{name: 'REC_REG-F1691', type:'string'}, // Note
			{name: 'REC_REG-F82', type:'boolean'}, // Scalable
			{name: 'REC_REG-F08', type:'string'}, // Status
			{name: 'REC_REG-F03', type:'string'}, // Department
			{name: 'REC_REG-F1793', type:'auto'}, // delevry days

			{name: 'REC_REG-F1184', type:'auto', persist:false}, // Buying Format
			{name: 'REC_REG-F38', type:'auto', persist:false}, // Base cost
			{name: 'REC_REG-F19', type:'auto', persist:false}, // Case size
			{name: 'REC_REG-F1003', type:'auto', persist:false}, // Case quantity
			{name: 'REC_REG-F70', type:'auto', persist:false}, // Unit quantity
			{name: 'REC_REG-F270', type:'auto', persist:false}, // Weight quantity
			{name: 'REC_REG-F65', type:'auto', persist:false}, // Total amt
			{name: 'REC_REG-F1248', type:'boolean', persist:false}, // Refund
			{name: 'REC_REG-F1247', type:'boolean', persist:false}, // Free

			{name: 'REC_REG-F201', type:'auto', persist:false}, // Allow $
			{name: 'REC_REG-F1657', type:'auto', persist:false}, // Allow %
			{name: 'REC_REG-F156', type:'string', persist:false}, // Qualifier
			{name: 'REC_REG-F223', type:'auto', persist:false}, // Off invoice
			{name: 'REC_REG-F1977', type:'auto', persist:false}, // min
			{name: 'REC_REG-F202', type:'date', dateFormat:'m/d/Y', persist:false}, // start
			{name: 'REC_REG-F203', type:'date', dateFormat:'m/d/Y', persist:false}, // end

			{name: 'REC_REG-F1658', type:'auto', persist:false}, // Disc $
			{name: 'REC_REG-F228', type:'auto', persist:false}, // Disc %
			{name: 'REC_REG-F233', type:'auto', persist:false}, // Rebate $
			{name: 'REC_REG-F237', type:'auto', persist:false}, // Rebate %

			{name: 'warningMsg', type:'auto'}, // WARNING MSG
			{name: 'imageSrc', type:'auto'}, // Item image
			{name: 'imageAlt', type:'auto'} // alt text
		]
	}

});