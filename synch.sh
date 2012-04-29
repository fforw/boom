#!/bin/bash
cd $(dirname $0)
mvn clean install && rsync -av ./target/boom-0.0.1-SNAPSHOT/ newweb:/opt/tomcat/current/webapps/boom

