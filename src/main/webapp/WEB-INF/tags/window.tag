<%@tag description="page layout"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="authz" uri="/WEB-INF/tags/authz.tld"%>
<%@attribute name="title" required="true" type="java.lang.String"%>
<div class="window">

<div class="title">
    ${title}]
    <a class="close" href="#">x</a>
</div>
<div class="body">
<jsp:doBody />
</div>
</div>


