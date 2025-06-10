<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:xs="http://www.w3.org/2001/XMLSchema" 
xmlns="http://www.w3.org/TR/xhtml1/strict" 
xmlns:ns1="http://schemas.xmlsoap.org/soap/envelope/" 
xmlns:ns2="http://www.techrx.com/trexone/1_0" 
xmlns:msxsl="urn:schemas-microsoft-com:xslt"
xmlns:js="urn:locsoftware">

<xsl:output indent="yes" method="xml" encoding="utf-8" omit-xml-declaration="yes"/>

<msxsl:script language="Javascript" implements-prefix="js">
function GetText(sTxt)
{
    return sTxt.replace(/\(/gi,"[").replace(/\)/gi,"]");
}

function GetAmount(sTxt)
{
    return sTxt.replace("$","");
}

function GetPhoneNumber(sTxt)
{
var sPhone
    if(sTxt.length>0)
	{
	sPhone='-'+sTxt.substring(0,3)+'-'+sTxt.substring(3,7);
	}
	else
	{
	sPhone='';
	}
	return sPhone;
}

</msxsl:script>

<xsl:template match="/">
  <xsl:apply-templates select="ns1:Envelope/ns1:Body/ns2:RecentFillsResponse/ns2:RxFound"/>
  <xsl:apply-templates select="ns1:Envelope/ns1:Body/ns2:RecentFillsResponse/ns2:RxNotFound"/>
  <xsl:apply-templates select="ns1:Envelope/ns1:Body/ns2:GenericFailureRsp"/>
  <xsl:apply-templates select="ns1:Envelope/ns1:Body/ns1:Fault"/>
  <input type="hidden" id="LINETTL" name="LINETTL" value="@rptttl(LINE,#)"/>
</xsl:template>

<xsl:template match="ns1:Fault">
  <tr>
    <td colspan="2">
      <div class="PatHdr">Error #<xsl:value-of select="faultcode" />. Please contact support</div>
    </td>
  </tr>
</xsl:template>

<xsl:template match="ns2:RxNotFound">
  <tr>
    <td colspan="2">
      <div class="PatHdr"><xsl:value-of select="@Message" /></div>
    </td>
  </tr>
</xsl:template>

<xsl:template match="ns2:RxFound">
<xsl:apply-templates select="ns2:PatientInfo/ns2:AddressList/ns2:PatientAddress/ns2:Address"/>
<xsl:apply-templates select="ns2:PrescriptionInfo"/>
</xsl:template>

<xsl:template match="ns2:PatientInfo/ns2:AddressList/ns2:PatientAddress/ns2:Address">
<xsl:param name="PatientID" select="../../../@ExternalPatientID"/>
<xsl:param name="FirstName" select="../../../@FirstName"/>
<xsl:param name="LastName" select="../../../@LastName"/>
<xsl:param name="DateOfBirth" select="../../../@DateOfBirth"/>
<xsl:param name="Address" select="@Line1"/>
<xsl:param name="City" select="@City"/>
<xsl:param name="State" select="@State"/>

<xsl:if test="@Usage='Home1'">
@FMT(CMP,@WIZGET(CREATE_RXTBL)=1,"®MACSIL(INSERT INTO TMP_MCKRX®MACSHORT(STORE)®MACSHORT(TER)S®DBHOT(CNCURRENT)_Patient (F1401,F1411,F1402,F1403) VALUES ('@FMT(2QUOT,<xsl:value-of select="$FirstName" />), @FMT(2QUOT,<xsl:value-of select="$LastName" />)','<xsl:value-of select="$DateOfBirth" />','@FMT(2QUOT,<xsl:value-of select="$Address" />)','@FMT(2QUOT,<xsl:value-of select="$City" />), <xsl:value-of select="$State" />'))")
@DBHOT(HOT_WIZ,RPLT,MCK_RxPatientID,<xsl:value-of select="$PatientID" />)
  <tr>
    <td colspan="2">
      <table id="@rptttl(1,,LINE)LINE@rptttl(LINE,#)" class="Header">
        <tr>
          <td class="LookRx"><xsl:value-of select="$FirstName" />, <xsl:value-of select="$LastName" /></td>
          <td class="LookAmt"><xsl:value-of select="$DateOfBirth" /></td>
        </tr>
        <tr>
          <td class="LookDesc"><xsl:value-of select="$Address" /></td>
        </tr>	
        <tr>
          <td class="LookDesc"><xsl:value-of select="$City" />, <xsl:value-of select="$State" /></td>
        </tr>				  
      </table>
    </td>
  </tr>
</xsl:if>
</xsl:template>

<xsl:template match="ns2:PrescriptionInfo">
<xsl:param name="CounselingAccepted" select="@CounselingAccepted"/>
<xsl:param name="DEAClass" select="@DEAClass"/>
<xsl:param name="MCK_SIGNATURE_EASYCAP" select="@EasyCapSigCapture"/>
<xsl:param name="MCK_PARTIALFILLSEQ" select="@PartialFillNumber"/>
<xsl:param name="MCK_PRICE" select="@Price"/>
<xsl:param name="ProductName" select="js:GetText(string(@ProductName))"/>
<xsl:param name="MCK_REFILLNO" select="@RefillNumber"/>
<xsl:param name="MCK_RXNO" select="@RxNumber"/>
<xsl:param name="StoreNumber" select="@StoreNumber"/>
<xsl:param name="TotalTaxAmountDue" select="@TotalTaxAmountDue"/>
<xsl:param name="Status" select="@WorkflowStatus"/>
<xsl:param name="MCK_3RDPARTYAMT" select="ns2:ThirdPartyPayors"/>
<xsl:param name="MCK_SIGNATURE_RXACK" select="'true'"/>
<xsl:param name="MCK_SIGNATURE_HIPAA" select="../ns2:PatientInfo/@HIPAASigCapture"/>
<xsl:param name="MCK_RxPatientID" select="../ns2:PatientInfo/@ExternalPatientID"/>

@WIZRPL(MCK_REFILLNO=<xsl:value-of select="$MCK_REFILLNO" />)
@FMT(CMP,@WIZGET(MCK_REFILLNO)=0,"®WIZRPL(MCK_REFILLNO=)")

@WIZRPL(MCK_PARTIALFILLSEQ=<xsl:value-of select="$MCK_PARTIALFILLSEQ" />)
@FMT(CMP,@WIZGET(MCK_PARTIALFILLSEQ)=,"®WIZRPL(MCK_PARTIALFILLSEQ=0)")

@WIZRPL(MCK_SIGNATURE_RXACK=1)
@WIZRPL(MCK_SIGNATURE_EASYCAP=<xsl:value-of select="$MCK_SIGNATURE_EASYCAP" />)
@WIZRPL(MCK_SIGNATURE_EASYCAP=@FMT(CMP,@WIZGET(MCK_SIGNATURE_EASYCAP)=TRUE,1,0))
@WIZRPL(MCK_SIGNATURE_HIPAA=<xsl:value-of select="$MCK_SIGNATURE_HIPAA" />)
@WIZRPL(MCK_SIGNATURE_HIPAA=@FMT(CMP,@WIZGET(MCK_SIGNATURE_HIPAA)=TRUE,1,0))

@RPTTTL(@DBHOT(SAL_REG_FIND,F1081 LIKE '%MCK_RXNO=<xsl:value-of select="$MCK_RXNO" />%' AND F1081 LIKE '%MCK_REFILLNO=@WIZGET(MCK_REFILLNO)%' AND F1069='0',F1101,#),,=MCK_LN)
@FMT(CMP,@WIZGET(CREATE_RXTBL)=1,"®MACSIL(INSERT INTO TMP_MCKRX®MACSHORT(STORE)®MACSHORT(TER)S®DBHOT(CNCURRENT)_Rx (F1401,F1431,F1301,F1402,F1403,F1432,F1302,F1433,F1434,F1435) VALUES ('<xsl:value-of select="$MCK_RXNO" />','@WIZGET(MCK_REFILLNO)','@FMT(#,<xsl:value-of select="$MCK_PRICE"/>)','@FMT(2QUOT,<xsl:value-of select="$ProductName"/>)','<xsl:value-of select="$Status"/>','@WIZGET(MCK_PARTIALFILLSEQ)','@FMT(#,<xsl:value-of select="$MCK_3RDPARTYAMT" />)','@WIZGET(MCK_SIGNATURE_RXACK)','@WIZGET(MCK_SIGNATURE_HIPAA)','@WIZGET(MCK_SIGNATURE_EASYCAP)'))")
  <tr>
    <td colspan="2">
      <table id="@rptttl(1,,LINE)LINE@rptttl(LINE,#)" class="@FMT(CMP,@rptttl(MCK_LN,#:0)=0,Rx{$Status},RxInTrs)" onclick="ClickOnRx('{$MCK_RXNO}','{$MCK_REFILLNO}','{$MCK_PARTIALFILLSEQ}','{$MCK_PRICE}','{$MCK_3RDPARTYAMT}','{$MCK_SIGNATURE_RXACK}','{$MCK_SIGNATURE_EASYCAP}','{$MCK_SIGNATURE_HIPAA}')">
        <tr>
          <td class="LookRx">Rx/Fill <xsl:value-of select="$MCK_RXNO"/>/<xsl:value-of select="$MCK_REFILLNO" /></td>
          <td class="LookAmt">@FMT($:2,<xsl:value-of select="$MCK_PRICE"/>)</td>
        </tr>			 
        <tr>
          <td class="LookDesc"><xsl:value-of select="$ProductName"/></td>
          <td class="LookAmt"><xsl:value-of select="$Status"/></td>
        </tr>
        <tr>
          <td class="LookDesc"></td>
          <td class="LookAmt">@WIZGET(MCK_PARTIALFILLSEQ)</td>
        </tr>
        <tr>
        <xsl:attribute name="style">
        <xsl:value-of select="'@FMT(CMP,@RPTTTL(MCK_LN,#:0)=0,display:none)'" />
        </xsl:attribute>
          <td class="RxInTrs">In current trs line #@RPTTTL(MCK_LN,#:0)</td>
          <td class="LookAmt"></td>
        </tr>
      </table>
    </td>
  </tr>
</xsl:template>

<xsl:template match="ns2:GenericFailureRsp">
	<tr>
		<td colspan="2">
			<div class="PatHdr">Error #<xsl:value-of select="faultcode" />. Please contact support</div>
		</td>
	</tr>
</xsl:template>

</xsl:stylesheet>

