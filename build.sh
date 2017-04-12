#!/usr/bin/env bash

PACKAGE=craft-pour-house-lambda.zip
OUTPUT=dist
TMP=.tmp

mkdir $TMP
mkdir $OUTPUT
rm $OUTPUT/$PACKAGE

rsync -rv --exclude=node_modules --exclude=dist --exclude=.tmp . $TMP

pushd $TMP
npm install
zip -r ../$OUTPUT/$PACKAGE ./*
popd
