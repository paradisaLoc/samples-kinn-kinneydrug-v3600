/* Items in Future Sale Batch having $/% discount where price could be wrong */

@dbHot(BROWSER,
SELECT DISTINCT pri.f1000 as Target,OBJ.F01, left(OBJ.F29,10) as Descrip, left(OBJ.F22,10) as format, bat.f136-pri.f30 as diff
FROM OBJ_TAB OBJ 
join fsprice_bat bat on obj.f01=bat.f01
join price_tab pri on obj.f01=pri.f01
WHERE 
bat.f136<>pri.f30 and (bat.f1220 is not null or bat.f1221 is not null));




/* FROM OBJ_TAB OBJ WHERE  */
/* F01 IN (SELECT BAT.F01 FROM FSPRICE_BAT BAT JOIN HEADER_BAT HDR ON HDR.F902=BAT.F902 WHERE bat.f1220<>null or bat.f1221<>null)); */
