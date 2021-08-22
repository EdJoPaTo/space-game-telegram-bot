#!/usr/bin/env bash
set -e

rm -rf static
mkdir static

cp -r ../space-game-typings/static/{typings.ts,*.json} static/
