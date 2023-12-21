#!/usr/bin/env sh

# This script is run data-setup on docker-compose and is used to retrieve the data of this repository and upload it
# to the local s3 server

# Exit on error

# if this script does not work and you cannot retrieve manually the tar.gz at the google drive adress
# please contact enacit4research@epfl.ch 

# we have a s3_cdn_dump.tar.gz at this location https://drive.google.com/file/d/1X5b_BydW9XjppxQw4--NDnE9sp01JAxd/view?usp=sharing
# the id is '1X5b_BydW9XjppxQw4--NDnE9sp01JAxd' it contains content organized by date, that should be uploaded to the local s3 bucket
# https://drive.usercontent.google.com/download?id=1X5b_BydW9XjppxQw4--NDnE9sp01JAxd&export=download&authuser=0&confirm=t&uuid=81409203-9d26-4a30-a381-efca6c711c51&at=APZUnTU0HhVnHyI7XJF-Vf9_nzr9:1697785034390

FILENAME='s3_cdn_dump.tar.gz';
# FILEID='1X5b_BydW9XjppxQw4--NDnE9sp01JAxd';
# wget --load-cookies /tmp/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=${FILEID}' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=${FILEID}" -O ${FILENAME} && rm -rf /tmp/cookies.txt;
# // for a simpler version we can download from this url

# https://enacit4r-cdn.epfl.ch/unhcr-geneva-tech-hub-app/2023-11-23T100540Z/s3_cdn_dump.tar.gz
# checksum https://enacit4r-cdn.epfl.ch/unhcr-geneva-tech-hub-app/2023-11-23T100540Z/s3_cdn_dump.tar.gz.checksum
wget https://enacit4r-cdn.epfl.ch/unhcr-geneva-tech-hub-app/2023-11-23T100540Z/s3_cdn_dump.tar.gz -O ${FILENAME} 
wget https://enacit4r-cdn.epfl.ch/unhcr-geneva-tech-hub-app/2023-11-23T100540Z/s3_cdn_dump.tar.gz.checksum -O ${FILENAME}.checksum

sha256sum -c -s s3_cdn_dump.tar.gz.checksum
if [ $? -ne 0 ]; then
    echo "Checksum failed"
    exit 1
else
    echo "Checksum succeeded"
    tar -xvf s3_cdn_dump.tar.gz -C /opt/
    cp -a /opt/s3_cdn_dump/. /opt/src
fi
