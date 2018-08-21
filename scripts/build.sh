#!/usr/bin/env bash

rm -r dist/*
babel -d dist src
cp package.json dist
