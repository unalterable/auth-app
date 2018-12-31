rm -rf .git/
git init
git add -A
git commit -m "Initial Commit"
git remote add origin $1
git push --set-upstream origin master

