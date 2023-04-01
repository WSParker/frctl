#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate to dist directory
cd dist

git init
git checkout -b main
git add -A
git commit -m 'deploy'

# To deploy to https://wsparker.github.io/frctl
git push -f git@github.com:WSParker/frctl.git main:gh-pages

cd -