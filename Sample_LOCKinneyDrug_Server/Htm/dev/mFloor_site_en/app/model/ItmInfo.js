Ext.define('SMS.model.ItmInfo', {
	extend: 'Ext.data.Model',

	config: {
		idProperty: 'F01',

		fields: [
			{name: 'F01', type:'string'}, // Code
			{name: 'F02', type:'string'}, // Desc
			{name: 'F126', type:'auto'}, // Price level

			{name: 'F902', type:'string'}, // Batch ID
			{name: 'F04', type:'auto'}, // Sub dept.
			{name: 'F05', type:'auto'}, // Bottle Deposit
			{name: 'F122', type:'auto'}, // Like Code
			{name: 'F17', type:'auto'}, // Category
			{name: 'F16', type:'auto'}, // Family code
			{name: 'F18', type:'auto'}, // Report code

			{name: 'F113', type:'string'}, // Source
			{name: 'F1006', type:'auto'}, // Active price qty
			{name: 'F1007', type:'float'}, // Active price
			{name: 'F1008', type:'date', dateFormat:'m/d/Y'}, // Active date

			{name: 'F1011', type:'string'}, // Source
			{name: 'F1012', type:'auto'}, // Next price qty
			{name: 'F1013', type:'float'}, // Next price
			{name: 'F1220', type:'float'}, // Discount $
			{name: 'F1221', type:'auto'}, // Discount %
			{name: 'F1220PL2', type:'float'}, // Discount $ Price Level 2
			{name: 'F1221PL2', type:'auto'}, // Discount % Price Level 2
			{name: 'F1014', type:'date', dateFormat:'m/d/Y'}, //Next date
			{name: 'F31', type:'auto'}, // Regular Qty
			{name: 'F31s', type:'auto',
				convert: function(value,record) {
					price = record.get('F30');
					if (price) return 1;
					else return value;
				}
			}, // Regular Qty
			{name: 'F30', type:'float'}, // Regular Price
			{name: 'F1133', type:'auto'}, // INSTORE Qty
			{name: 'F1134', type:'float'}, // INSTORE Price

			{name: 'F181', type:'float'}, // TPR Price
			{name: 'F182', type:'auto'}, // TPR Qty
			{name: 'F183', type:'date', dateFormat:'m/d/Y'}, //Start date
			{name: 'F184', type:'date', dateFormat:'m/d/Y'}, //end date
			{name: 'F183S', type:'auto',
				convert: function(value,record) {
					value = record.get('F183');
					if (value) return Ext.Date.format(value,'m/d');
				}
			},
			{name: 'F184S', type:'auto',
				convert: function(value,record) {
					value = record.get('F184');
					if (value) return Ext.Date.format(value,'m/d');
				}
			},
			{name: 'F139', type:'float'}, // Sale Package Price
			{name: 'F143', type:'auto'}, // Sale Package Qty
			{name: 'F139PL2', type:'float'}, // Sale Package Price Level 2
			{name: 'F143PL2', type:'auto'}, // Sale Package Qty Price Level 2
			{name: 'F135PL2', type:'auto'},
			{name: 'F136PL2', type:'float'},
			{name: 'F137PL2', type:'date', dateFormat:'m/d/Y'}, //Start date
			{name: 'F138PL2', type:'date', dateFormat:'m/d/Y'}, //end date
			{name: 'F135', type:'auto'},
			{name: 'F136', type:'float',
				convert: function(value,record) {
					var startDate = record.get('F137');
					var endDate = record.get('F138');
					var curDate = new Date().getTime();
					if (value) {
						var packagePrice = record.get('F139');
							if (packagePrice){
								return packagePrice;
							} else {
								if (startDate && endDate) {
									if (curDate > startDate.getTime() && curDate < endDate.getTime()) {
										var price = parseFloat(value.replace('$','')).toFixed(2);
										var discount = record.get('F1220');
										var qty = record.get('F135');
										var discountPercent = record.get('F1221');
										if (qty) price = parseFloat((price/qty).toFixed(2));
										if (discount) return parseFloat(price -(discount/qty)).toFixed(2);
										else if(discountPercent) return parseFloat(price - (price*discountPercent/100)).toFixed(2);
										else return price;
									} else return ''; 
								}
							}
					}
					return value;
				}
			}, // SALE Price
			{name: 'F135S', type:'auto',
				convert: function(value, record) {
					var packagePrice = record.get('F139');
					var packageQty = record.get('F143');
					var discount = record.get('F1220');
					var discountPercent = record.get('F1221');
					value = record.get('F135');
					var startDate = record.get('F137');
					var endDate = record.get('F138');
					var curDate = new Date().getTime();
					if (startDate && endDate) {
						if (curDate > startDate.getTime() && curDate < endDate.getTime()) {
							if (packagePrice) {
								return packageQty;
							} else if (discount || discountPercent) return 1;
							else return 1;
						}
					}
				}
			}, // SALE Qty
			{name: 'F137', type:'date', dateFormat:'m/d/Y'}, //Start date
			{name: 'F138', type:'date', dateFormat:'m/d/Y'}, //end date
			{name: 'F137S', type:'auto',
				convert: function(value,record) {
					value = record.get('F137');
					if (value) return Ext.Date.format(value,'m/d');
				}
			},
			{name: 'F138S', type:'auto',
				convert: function(value,record) {
					value = record.get('F138');
					if (value) return Ext.Date.format(value,'m/d');
				}
			},
			{name: 'F1120', type:'auto'}, // POS Tab Others
			// Sale Thrive Price
			{name: 'STP', type:'float',
				convert: function(value,record) {
					value = record.get('F136PL2');
					if (value) {
						var startDate = record.get('F137PL2');
						var endDate = record.get('F138PL2');
						var curDate = new Date().getTime();
						if (startDate && endDate) {
							if (curDate > startDate.getTime() && curDate < endDate.getTime()) {
								var packagePrice = record.get('F139PL2');
								if (packagePrice){
									return packagePrice;
								} else {
									var price = value;
									var discount = record.get('F1220PL2');
									var qty = record.get('F135PL2');
									var discountPercent = record.get('F1221PL2');
									if (qty) price = parseFloat(price/qty).toFixed(2);
									if (discount) return parseFloat(price -(discount/qty)).toFixed(2);
									else if(discountPercent) return parseFloat(price - (price*discountPercent/100)).toFixed(2);
									else return price;
								}
							}
						}
					}	
				}
			}, // Sale Thrive Price
			{name: 'STPQty', type:'auto',
				convert: function(value,record) {
					var packagePrice = record.get('F139PL2');
					var packageQty = record.get('F143PL2');
					var discount = record.get('F1220PL2');
					var discountPercent = record.get('F1221PL2');
					value = record.get('F135PL2');
					var startDate = record.get('F137PL2');
					var endDate = record.get('F138PL2');
					var curDate = new Date().getTime();
					if (startDate && endDate) {
							if (curDate > startDate.getTime() && curDate < endDate.getTime()) {
								if (packagePrice) {
									return packageQty;
								} else if (discount || discountPercent) return 1;
								else return 1;	
							}
					}
				}
			}, // Sale Thrive Qty	
			{name: 'F1033', type:'auto'},
			{name: 'F82', type:'boolean'}, // SCL
			{name: 'F79', type:'boolean'}, // FS
			{name: 'F80', type:'boolean'}, // FSA
			{name: 'F178', type:'boolean'}, // WIC
			{name: 'F86', type:'boolean'}, // Not for sale
			{name: 'F170', type:'auto'},// Restriction code
			{name: 'F171', type:'auto'},// Age

			{name: 'F81', type:'boolean'}, //C1 TAX1
			{name: 'F96', type:'boolean'}, //C1 TAX2
			{name: 'F97', type:'boolean'}, //C1 TAX3
			{name: 'F98', type:'boolean'}, //C1 TAX4
			{name: 'F99', type:'boolean'}, //C1 TAX5
			{name: 'F100', type:'boolean'}, //C1 TAX6
			{name: 'F101', type:'boolean'}, //C1 TAX7
			{name: 'F81S', type:'auto',
				convert: function(value,record) {
					var strTax = '';
					if (record.get('F81')==true) strTax += '1';
					if (record.get('F96')==true) strTax += '2'; 
					if (record.get('F97')==true) strTax += '3';
					if (record.get('F98')==true) strTax += '4';
					if (record.get('F99')==true) strTax += '5';
					if (record.get('F100')==true) strTax += '6';
					if (record.get('F101')==true) strTax += '7';
					if (record.get('F79')==true) strTax += 'F';
					if (record.get('F80')==true) strTax += 'S';
					if (record.get('F178')==true) strTax += 'W';
					return strTax;
				}
			},

			{name: 'F27', type:'auto'}, // Vendor id
			{name: 'F196', type:'float'}, // Net cost
			{name: 'F19', type:'auto'}, // Case size

			{name: 'F117', type:'auto'}, // Shelf Id
			{name: 'F1030', type:'auto'}, // Facing position

			{name: 'imageSrc', type:'auto'}, // Item image
			{name: 'imageAlt', type:'auto'}, // alt text
			{name: 'UnitPrice', type:'float',
				convert: function(value,record) {
					var qty = record.get('F31');
					var price = record.get('F30');
					if (qty > 0) return parseFloat(price/qty).toFixed(2);	
					else return price;					
				}
			}
		]
	}

});