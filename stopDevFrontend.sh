#!/usr/bin/bash
ps -ef | grep vue-cli-service | grep node | awk '{print $2}' | xargs -r kill -9