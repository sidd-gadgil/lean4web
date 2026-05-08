#!/usr/bin/env bash

PROJECTS_BASE_PATH=${PROJECTS_BASE_PATH:-"Projects"}

cd "$(dirname $0)/../$PROJECTS_BASE_PATH"

# Iterate over subfolders in Projects and look for a build file `leanweb-build.sh`
for folder in "."/*; do
  if [ -d "$folder" ]; then
    config_file="$folder/leanweb-config.json"
    build_script="$folder/leanweb-build.sh"

    if [ -f "$config_file" ] && node -e "process.exit(require(process.argv[1]).hidden === true ? 0 : 1)" "$config_file"; then
      echo "Skipping $folder: project is hidden"
      continue
    fi

    if [ -f "$build_script" ]; then
      SECONDS=0
      echo "Start building $folder"
      echo "Start building $folder" | logger -t lean4web

      "$build_script"

      duration=$SECONDS
      echo "Finished $folder in $(($duration / 60)):$(($duration % 60)) min"
      echo "Finished $folder in $(($duration / 60)):$(($duration % 60)) min" | logger -t lean4web
    else
      echo "Skipping $folder: leanweb-build.sh missing"
    fi

  fi
done
