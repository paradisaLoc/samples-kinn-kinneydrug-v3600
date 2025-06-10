/* Show items reg price <> sale batch having $ discount */

@dbHot(BROWSER,SELECT DISTINCT OBJ.F01,ISNULL(OBJ.F155,'') +' ' +ISNULL(OBJ.F29,'')+ ' ' + ISNULL(OBJ.F22,'') AS F29,
pri.f30 as reg, bat.f136 as sale_batch,bat.f1220 as disc
FROM OBJ_TAB OBJ  
JOIN fsprice_bat bat on obj.f01=bat.f01
join price_tab pri on bat.f01=pri.f01
WHERE pri.f1000='PAL' and bat.f136<>pri.f30 and bat.f1220>0)


