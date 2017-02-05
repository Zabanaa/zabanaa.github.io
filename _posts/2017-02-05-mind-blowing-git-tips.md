---
layout: post
title: Mind blowing git tips
---

As developers, we all (hopefully) use git. It's not extremely hard nor time
consuming to get started using it and you will surely thank your future self for investing the time to learn it. Now that was for the rather cringy intro.

What I really want to share in this post, is a list of tricks I've learned during the past 2 1/2 years of using git. Some of it might seem trivial to seasoned developers but if you're just getting started, stick with me because this might just blow your mind. (Like seriously)

## The difference between git fetch and pull

`git fetch` only updates the tracking remote branches. If you actually want to
update the local repo, you need to merge the local branch with the remote
tracking branch using `git merge`.

**remote branches are prefixed by the name of the remote and a slash:
origin/branchname**

git pull on the other hand, will execute both commands for you so when you issue
a `git pull` in a branch it will fetch that branch from the remote repo and
merge it with yours.

To list all remote branches, `git branch -r` is your friend.

## Merge conflicts

When you are faced with a merge conflict, essentially what this means is that
git noticed that a file was modified on both branches and it does not know which
version is correct. It leaves it to you to decide which one you want to push.

if you open the file you will see a HEAD part prefixed with `<<<<` signs and a
    second part containing the code on the branch you're trying to merge. Both
    sections are separated with an equal sign.

The part at the top that says HEAD, is the version of the code as it currently
is on the branch you're in. The other shows you what the code looks
like on the other branch you're trying to merge from.

To resolve the conflict just delete the part you don't want. Save the file and
commit it again.

Note that as a safety measure it's always a good practice to do a git pull to
see if you don't have remaining merge conflicts. If not you can just push your code and voila!

`git merge --abort` will clean up the current working directory and go back to
the last version before the merge happened (it pretty much nullfies the merge)

`git merge --squash` is an interesting one as it will bring the changes you made
in the feature branch and create a new commit on your current branch without
mixing the two histories (whatever that means).

## Dealing with files

Now this one's tricky !

To remove a file from **both** the working directory and version control, you
can use `git rm <filename>` but if you already deleted a file in the cli like I (and almost everyone) usually do then just run `git rm <path to the file>` and it will stage it as deleted so you can commit.

But what if you ramrafed (`rm -rf`) a bunch of files in your working directory ?
You don't really want to manually stage every file for deletion do you ? (DO YOU ?) So what do you do in that case ? Well you just run `git add -u` (u for update the working tree) and all of your deleted files will be staged so you can commit and push.

"Karim, what if man accidentally tracked a file and man don't want it deleted
from the index ?" I hear you say with an exquisite South London accent. Well my
G, just run `git rm --cached <name of the file>`, and you're done. Efficience
ting.

Another thing that happens quite often, is moving / renaming files (which is
essentially the same thing on linux systems, as the path or address of the file
changed). Here's an example: imagine you have a file called index.html that you
want to rename to home.html. you can use `gtt mv` which takes a source and a
destination:

`git mv index.html home.html`

if you want to move **and** rename just run

`git mv index.html path/to/home.html`

However if you moved / renamed the file manually on the command line, running
`git status` will tell you that index.html was deleted and home.html is untracked.

To fix this you will have to run two commands
`git rm index.html` (aka the file you moved/renamed)
`git add home.html` (aka the file with the new name x path)

Running git status again will mark the file as renamed.

Note that this also works if you don't rename the file. For example if you just
want to move index.html to src/index.html. The same commands will apply
(`git mv index.html src/index.html`).

The other way of achieving this is `git add -A` which will pick up the changes
and automatically stage them for commit.

So there you go, I hope you learned something useful in this article. If you know
other mind blowing tips and tricks for git, [ @ me on twitter
](https://twitter.com/zabanaa_).

