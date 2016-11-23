#!/bin/bash
cd client
npm install
npm run build
cd ..
cp -a ./client/build/. ./integrationServer/client_build/