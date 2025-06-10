/* RUN PREVIOUS SP */
@TOOLS(INSTALL_SUB,Samples\@WIZGET(INSTALL_OPTION)\SP-341\,@WIZGET(INSTALL_OPTION));

/* DELETE OBSOLETE FILES */
@wizRpl(SRC_PATH=@Office\trs_pos_ecpn_apply_drivethru.sqi);
@exec(XCH=DEL);

/* DELETE OBSOLETE FILES */
@wizRpl(SRC_PATH=@Office\usere_activate_accept.sqi);
@exec(XCH=DEL);
