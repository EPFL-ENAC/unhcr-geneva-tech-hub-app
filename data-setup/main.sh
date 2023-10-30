#!/bin/sh -xe
#
# main entry point to run s3cmd
#
# S3CMD_PATH=/opt/s3cmd/s3cmd
S3CMD_PATH=s3cmd

#
# Check for required parameters
#
if [ -z "${aws_key}" ]; then
    echo "The environment variable key is not set. Attempting to create empty creds file to use role."
    aws_key=""
fi

if [ -z "${aws_secret}" ]; then
    echo "The environment variable secret is not set."
    aws_secret=""
    security_token=""
fi

if [ -z "${cmd}" ]; then
    echo "ERROR: The environment variable cmd is not set."
    exit 1
fi

#
# Replace key and secret in the /.s3cfg file with the one the user provided
#
# echo "" >> /.s3cfg
echo "access_key=${aws_key}" >> /opt/.s3cfg
echo "secret_key=${aws_secret}" >> /opt/.s3cfg
if [ -z "${security_token}" ]; then
    echo "security_token = ${aws_security_token}" >> /opt/.s3cfg
fi

#
# Add region base host if it exist in the env vars
#
if [ "${s3_host_base}" != "" ]; then
  echo "host_base = ${s3_host_base}" >> /opt/.s3cfg
  echo "host_bucket = nginx-minio:9000/%(bucket)" >> /opt/.s3cfg
fi

# Chevk if we want to run in interactive mode or not
if [ "${cmd}" != "interactive" ]; then

  #
  # sync-s3-to-local - copy from s3 to local
  #
  if [ "${cmd}" = "sync-s3-to-local" ]; then
      echo ${src-s3}
      ${S3CMD_PATH} --config=/opt/.s3cfg  sync ${SRC_S3} /opt/dest/
  fi

  #
  # sync-local-to-s3 - copy from local to s3
  #
  if [ "${cmd}" = "sync-local-to-s3" ]; then
      ${S3CMD_PATH} --config=/opt/.s3cfg sync /opt/src/ ${DEST_S3}
  fi

  if [ "${cmd}" = "ls" ]; then
      echo ${DEST_S3}
      cat /opt/.s3cfg
      ${S3CMD_PATH} --config=/opt/.s3cfg ls ${DEST_S3}
  fi
else
  # Copy file over to the default location where S3cmd is looking for the config file
  cp /.s3cfg /root/
fi

#
# Finished operations
#

echo "Finished s3cmd operations"