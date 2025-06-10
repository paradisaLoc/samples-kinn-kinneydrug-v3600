DELETE FROM DRIL_PAGE WHERE F1597 LIKE 'PDA%';

CREATE VIEW Dril_page_load AS SELECT F1597,F1598,F1042,F1043,F1044,F1045,F1046,F1047,F1054,F1055,F1599,F1600,F1601,F1602,F1603,F1604,F1605,F1609,F1698,F1817,F1818 FROM DRIL_PAGE;

INSERT INTO Dril_page_load VALUES
('PDAMENU',10,1,1,1,1,1,1,1,1,'','','ITEM REVIEW','',1,'','http:/scripts/trs.exe?CGI=pda_itm_lup',,,1,1),
('PDAMENU',60,0,0,1,1,1,1,0,1,'','','BACK ROOM STOCK MENU','',1,'','http:/scripts/trs.exe?sqi=pda_rec_new',,,1,1),
('PDAREC',30,1,1,1,1,1,1,1,1,'','','ADD ITEMS','',1,'1','http:/scripts/trs.exe?CGI=pda_rec_itm_add',,,1,1),
('PDAREC',90,0,0,0,0,1,1,0,0,'','','LIST LINE ITEMS','',1,'1','http:/scripts/trs.exe?CGI=pda_rec_lin_list',,,1,1),
('SkuMenu',32,1,1,1,1,1,1,1,1,'','MnuElem','Profile PDA','',,'','Http:/Scripts/trs.exe?htt=pda_profile_scan',,'Work',1,1),

@UPDATE_BATCH(JOB=ADDRPL,TAR=DRIL_PAGE,KEY=F1597=:F1597 and F1598=:F1598,
SRC=SELECT * FROM Dril_page_load);

DROP TABLE Dril_page_load;

@TOOLS(MAP_BACKUP,Dril_Page,'Load\Dril_page_load.SQL',DRIL_PAGE);
