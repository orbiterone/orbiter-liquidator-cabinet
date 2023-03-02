#!/bin/bash
branch="$1"
tmpbranch=$(date +%s)

git reset --hard
git checkout -b $tmpbranch

branches=$(git branch | grep -v "$tmpbranch")
if [ "x$branches" != "x" ] ; then
    echo $branches | xargs git branch -D
fi

git fetch
git checkout $branch
git branch -D $tmpbranch
