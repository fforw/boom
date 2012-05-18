<%@tag description="page layout"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="authz" uri="/WEB-INF/tags/authz.tld"%>
<%@attribute name="head" fragment="true"%>
<%@attribute name="title" required="true" type="java.lang.String"%>
<%@attribute name="baseScriptsOnly" type="java.lang.Boolean"%>
<!DOCTYPE HTML>

<html<%-- manifest="/manifest.jsp"--%>>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>${title} -- boom!</title>

<script src="../../script/json2.js"></script>
<script src="../../script/requestAnimationFrame.js"></script>
<script src="../../script/jquery-1.7.2.min.js"></script>
<script src="../../script/loader.js"></script>
<script src="../../script/Class.js"></script>
<c:if test="${!baseScriptsOnly}">
<script src="../../script/boom-init.js"></script>
<script src="../../script/control.js"></script>
<script src="../../script/Player.js"></script>
<script src="../../script/tileset.js"></script>
<script src="../../script/blocks.js"></script>
<script src="../../script/level.js"></script>
<script src="../../script/palette.js"></script>
<script src="../../script/effect/common.js"></script>
<script src="../../script/effect/spell-fx.js"></script>
<script src="../../script/effect/blast-fx.js"></script>
<script src="../../script/Spell.js"></script>
<script src="../../script/blocks.js"></script>
<script src="../../script/boom.js"></script>
</c:if>

<link rel="stylesheet" type="text/css" href="../../dss/style/boom.dss" />
<jsp:invoke fragment="head" />
</head>
<body>
<div id="top">
    <em>boom!</em>
    <a href="../test/">test</a>
    <a id="newLevel" href="#new">new</a>
</div>
<div id="content">
<jsp:doBody />
</div>
</body>
</html>