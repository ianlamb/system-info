#!/bin/sh
scp -r ./build/* root@ianlamb.com:/var/www/app/device
echo 'Deploy successful! \o/'