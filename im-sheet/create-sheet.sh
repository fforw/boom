#!/bin/bash
cd $(dirname $0)

montage $(ls tiles/*.png) -geometry 101x171+0+0 -tile 8x8 -background transparent ../src/main/webapp/image/sheet.png

cd tiles
cnt=-1
for i in *.png; do cnt=$(($cnt + 1));  echo "var BLOCK_$(echo $i | tr "[:lower:]" "[:upper:]" | sed -e "s/\.PNG//g") = $cnt;"; done

