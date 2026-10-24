#!/bin/bash
set -e
cd "$(dirname "$0")"
exec bash "Build macOS App.command"
