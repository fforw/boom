#!/bin/bash
cd $(dirname $0)

montage $(ls tiles/*.png) -geometry 101x171+0+0 -tile 8x7 -background transparent ../src/main/webapp/image/sheet.png
