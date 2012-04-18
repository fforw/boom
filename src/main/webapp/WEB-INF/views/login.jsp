<%@page pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@taglib tagdir="/WEB-INF/tags" prefix="boom"%>
<boom:page title="home">
<jsp:body>
<boom:window title="Login via OpenID">
<h3>Login with OpenID Identity</h3>
<form name='oidf' action='/boom/j_spring_openid_security_check' method='POST'>
 <table class="form">
    <tr><td><label for="identifier">Identity:</label></td><td><input id="identifier" class="text" type='text' name='openid_identifier'/></td></tr>
    <tr><td></td><td><label class="remember"><input type="checkbox" name="_spring_security_remember_me"> Remember me on this computer.</label></td></tr>
    <tr><td></td><td><input class="button" name="submit" type="submit" value="Login"/></td></tr>
  </table>
</form>
</boom:window>
</jsp:body>
</boom:page>
