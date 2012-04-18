<%@page contentType="text/cache-manifest" pageEncoding="UTF-8"%>CACHE MANIFEST

# Explicitly cached 'master entries'.
CACHE:
${request.getContextPath()}/favicon.ico
${request.getContextPath()}/app/home
${request.getContextPath()}/dss/*
${request.getContextPath()}/script/*

# Resources that require the user to be online.
NETWORK:
${request.getContextPath()}/app/login

# static.html will be served if main.py is inaccessible
# offline.jpg will be served in place of all images in images/large/
# offline.html will be served in place of all other .html files
#FALLBACK:
#/main.py /static.html
#images/large/ images/offline.jpg
#*.html /offline.html/app/home