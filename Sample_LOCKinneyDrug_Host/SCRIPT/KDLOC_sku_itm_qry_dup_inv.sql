/* Kinney Drug Duplicate Invoice */

@WIZRPL(FORM=KDDupInv);
@WIZRPL(TITLE=Kinney Drug Duplicate Invoice);

@WIZSET(TOP=2);
@WIZSET(LEFT=791);
@WIZSET(HEIGHT=633);
@WIZSET(WIDTH=350);

@WIZRPL(STATE=FOCUS);

@EXEC(htt=Script\KDLOC_sku_itm_qry_dup_inv.rpt);

