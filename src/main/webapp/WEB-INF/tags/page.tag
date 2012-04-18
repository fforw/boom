<%@tag description="page layout"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="authz" uri="/WEB-INF/tags/authz.tld"%>
<%@attribute name="head" fragment="true"%>
<%@attribute name="title" required="true" type="java.lang.String"%>
<!DOCTYPE HTML>

<html<%-- manifest="/manifest.jsp"--%>>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>${title} -- boom!</title>
<script src="../../script/json2.js"></script>
<script src="../../script/jquery-1.7.2.min.js"></script>
<script src="../../script/boom.js"></script>

<link rel="stylesheet" type="text/css" href="../../dss/style/boom.dss" />
<jsp:invoke fragment="head" />
</head>
<body>
<div id="top">
    <em>boom!</em>
</div>
<div id="content">
<jsp:doBody />
</div>
</body>
</html>


