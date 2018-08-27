---
layout: post
title: "How to setup a virtual private server from scratch"
---

I recently purchased 2 VPS instances to host my personal projects. One will be
used as a staging environment and the other will be my production machine. When
you buy a VPS, all you get is an email containing your credentials and login
information. When you first login, you're presented with a blank shell with
almost no programs installed (not even git, in my case), just a barebones linux
machine connected to the internet.

So where do you go from there ? In this article, I will walk you through the
process of properly setting up your new instance so you can get started working
and experimenting as quickly as possible.

## Setting up your ssh keys
This is the first order of business. SSH is what's used to login to your remote
machine(s).
To be able to use SSH you need to generate what's called an SSH keypair (that
consists of a private and a public key). The idea is simple, the remote machine
stores your public key in its file system (usually under
`.ssh/authorized_keys`), and when logging in, you provide the matching identity
file (aka your private key).

To generate a keypair, it's as easy as running the following command on your
host machine (your laptop or desktop).

```bash
ssh-keygen -b 4096 -c "yourname@youremail.com"
```
you will be prompted to enter a name and a passphrase for the keys. I recommend
using the default options (it will make the process easier, but you can provide
custom names and keyphrases if you want).

Once it's done, you can inspect the content of the `~/.ssh` directory. It
should contain both your public and private keys, respectively named `id_rsa`
and `id_rsa.pub` (you can tell them apart simply by looking at the extension,
the `.pub` is your public key).

## Add keys to the ssh agent
Now that we have created our keys, we need to notify the ssh agent about them.
To do this, simply run:

```bash
ssh-agent add ~/.ssh/id_rsa
```

## Create a non root user

It's considered (and rightfully so) bad practice to perform actions as root,
espectially when they can potentially impact the users of your applications /
services. To remedy this, we need to create a non root user that will have to
ask for sudo priveleges before doing major actions.

For this, you first need to login to your server as root. This procedure may
differ depending on your provider, I invite you to check their documentation
for specific instructions. In my case (I use scaleway as my provider),
all I have to do is:

```bash
ssh -i /path/to/my/private_key root@my_ip_address
```

Now that you are logged in as root, you can create a new user by simply
executing the command below:

```bash
adduser <new_user_name>
```
You will be prompted to add a first name, lastname and other bits of
information, you can skip all of it by just pressing enter when asked for input.

Ok, so now you have a new user on the system, it's time to upgrade their
permissions. By this I mean adding them to the `sudo` group. There are multiple
ways to do this, you can edit the `/etc/sudoers` file and add them manually or
you can run

```bash
usermod -aG sudo <new_user_name>
```
## Upload your public key to your server

_Note: you might (like me) have to copy your public key and add it to your list
of allowed keys in your provider's website (kind of like github)_

On your host machine (laptop/desktop), you can upload your public key by using
the `ssh-copy-id` command.

```bash
ssh-copy-id -i /path/to/your/public_key user@ip
```

If you try and login now, you should be prompted to enter your password. If
everything went well, you should now be logged in as the newly created user.

## (Optional) Enable passwordless authentication

Passwordless authentication can be really handy security wise, because you no
longer have to type your password, therefore reducing the chances of it being
intercepted or cracked by malicious programs / individual.

Enabling this form of authentication is not as complicated as it may seem. Open
up your ssh configuration file located in `/etc/ssh/sshd_confid` (you can use
whatever text editor you want, VPS usually come pre-installed with vim and
nano).

- Find the `PasswordAuthentication` option and uncomment it by removing the # sign
at the beginning of the line. Set the option to no if it's not already.
- Find the `UsePam` and `ChallengeResponseAuthentication` options and set them
both to `no`.

The options should look like this:

```
PasswordAuthentication no
ChallengeResponseAuthentication no
UsePam no
```

Save the file and quit your editor.

### Restart the ssh service:

```bash
sudo sytemctl restart ssh
```

Log out and log back in. You should now be able to access your VPS without using
a password.

_Note: if your generated ssh keys have a custom name, you will have to provide
the exact path to your private key when logging back in using the `-i` flag,
like so:_

```bash
ssh -i /path/to/your/custom_private_key user@ip
```

## (Optional 2) Create an ssh connection config file

If you don't want to keep typing `user@ip` everytime and potentially pass your
custom private key everytime you want to login, it's possible to store your
login information in file simply called config that will live under your
`~/.ssh` directory (remember, this is the folder where your key pairs are also
stored).

If you don't already have it, you can create the file using the `touch` command
in your terminal (in your local machine):

```bash
touch ~/.ssh/config
```

Then, using whatever text editor you want open the file and edit its content
using the follwing pattern

```config
Host myserver
    Hostname your_ip_address
    User <your_user_name>
    Port 22 (or whatever other port you chose)
    PubKeyAuthentication yes
    IdentityFile /path/to/your/private_key
    IdentitiesOnly yes
```

Save the file, open a new terminal and run `ssh myserver` ... and Bam ! You're
logged in to your server, no more remembering ip addresses, and usernames, and
private key file paths, one command and you're good to go !

## Conclusion

Now that you're all setup, it's time to have fun and experiment with your new
box. If you have any comment, suggestions or remarks of any sort, you can ping
me on twitter [@zabanaa\_](http://www.twitter.com/zabanaa_) !
