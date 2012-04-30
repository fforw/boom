<%@page pageEncoding="UTF-8"%><%@
taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%><%@
taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %><%@
taglib tagdir="/WEB-INF/tags" prefix="boom"%><boom:page title="home" baseScriptsOnly="true">
<jsp:attribute name="head">
<script src="../../script/effect/palette.js"></script>
<script src="../../script/effect/sphere.js"></script>
</jsp:attribute>
<jsp:body>
<div id="container">
<canvas id="teh_canvas"><p>This only works with browsers supporting canvas.</p></canvas>
</div>
</jsp:body>
</boom:page>