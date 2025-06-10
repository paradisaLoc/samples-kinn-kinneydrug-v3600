DELETE FROM HOOK_TAB WHERE F1702='PDA';

CREATE VIEW Hook_load AS SELECT F1700,F1701,F1702,F1703,F1704,F1705 FROM HOOK_TAB;

INSERT INTO Hook_load VALUES
('CLT','NON','PDA','EVT=CLOSE','None','cgi=pda_menu'),
('REC','NON','PDA','USR=RECSTART','None','cgi=pda_rec_menu'),
('REC','REC','PDA','EVT=HDR','None','cgi=pda_rec_hdr'),
('REC','REC','PDA','EVT=ITM','None','cgi=pda_rec_itm_mod'),
('REC','REC','PDA','EVT=DPT','None','cgi=pda_rec_dpt_mod'),
('REC','REC','PDA','EVT=START','None','cgi=pda_rec_menu'),
('REC','NON','PDA','EVT=ERROR','None','sqi=pda_error'),
('ALL','NON','PDA','EVT=MSG','None','cgi=pda_display'),
('ALL','NON','PDA','EVT=DISPLAY','None','cgi=pda_display'),
('ALL','NON','PDA','EVT=ERROR','None','cgi=pda_error'),
('ALL','NON','PDA','EVT=PROMPT','None','cgi=pda_prompt'),
('ALL','NON','PDA','EVT=WARNING','None','cgi=pda_Warning'),
('TRS','NON','PDA','EVT=FINAL','None','cgi=pda_error_final'),
('TRS','NON','PDA','EVT=LOGIN','None','cgi=pda_login'),
('TRS','NON','PDA','EVT=START','None','cgi=pda_menu'),

@UPDATE_BATCH(JOB=ADDRPL,TAR=HOOK_TAB,
KEY=F1700=:F1700 and F1701=:F1701 and F1702=:F1702 and F1703=:F1703 and F1704=:F1704,
SRC=SELECT * FROM HOOK_LOAD);

DROP TABLE Hook_load;

@WINMAIL(\\.\Mailslot\PUBLIC,SET=TABLEALL);

