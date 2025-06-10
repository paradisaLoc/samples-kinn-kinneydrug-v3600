/* Ad Batch Tool: Item History */

@WIZRPL(FORM=AdAnalysis);
@WIZRPL(TITLE=Ad Batch: Item History);

@WIZSET(TOP=2);
@WIZSET(LEFT=791);
@WIZSET(HEIGHT=200);
@WIZSET(WIDTH=450);

@WIZRPL(SET=Hook);
@WIZRPL(STATE=FOCUS);

@exec(htt=Script\sku_bat_KDLOC_AdBatch_Analysis); 
