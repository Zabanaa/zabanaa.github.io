---
layout: post
title: How to use Flask to upload files to Amazon s3
---

In this article, we'll be covering how to upload files to an Amazon S3 bucket
using the Flask web framework for python.

## Step 1: Connect to Amazon 3

Before we can start uploading our files, we need a way to connect to s3 and
fetch the correct bucket.
Log in to your AWS management console and under your name (on the top right,
select "My security credentials" then open the "Access Keys (Access Key ID and
Access Key Secret)" tab and finally click "Create New Access Key".

_Take note of those as you'll need both to connect to the service later on_

Now that we have our credentials, we need to install the necessary packages for
our project.

```bash
pip install flask boto3
```
boto3 is the newest version of the AWS SDK, it provides a high level interface
to interact with their API.

## Step 2: Create a Basic Flask App

```python
# app.py

from flask import Flask, render_template

app     = Flask(__name__)
app.config.from_object("config")

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run()
```

```python
# config.py

S3_LOCATION               = 'http://your-amazon-site.amazonaws.com/'

S3_BUCKET                 = "Your bucket name"
S3_KEY                    = 'Your AWS Access Key Id'
S3_SECRET                 = 'Your AWS Secret Access Key'

SECRET_KEY                = "FLASK_SECRET_KEY"
DEBUG                     = True
PORT                      = 5000
```
This is the step where you need to put in your AWS credentials.

_Note: This is just an example, in real life you'd store your credentials in
environment variables for more security_

```html
<!-- templates/index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>

    <h1>Upload Your Files Bro</h1>

    <form action="/" method="POST" enctype="multipart/form-data">

        <label for="user_file">Upload Your File</label>
        <br></br>
        <input type="file" name="user_file">
        <br></br>
        <button type="submit">Upload</button>

    </form>

</body>

</html>
```
We've now created a barebones flask application with a single GET route that
renders our upload form. We've also set the basic config settings for the app.

## Step 3: Connect to AWS

In your project, create a `helpers.py` file. We'll use boto3 to establish a
connection to the S3 service.

```python
import boto3, botocore
from config import S3_KEY, S3_SECRET, S3_BUCKET

s3 = boto3.client(
   "s3",
   aws_access_key_id=S3_KEY,
   aws_secret_access_key=S3_SECRET
)
```

## Step 4: Upload a file to S3

Now that we are successfully connected to S3, we need to create a function that
will send the user's files directly into our bucket.
We'll use boto3's `Client.upload_fileobj` method for this. Our function will
accept three arguments: a `file object`, a `bucket name` and an optional acl
keyword argument (set to "public-read" by default).

```python

def upload_file_to_s3(file, bucket_name, acl="public-read"):

    try:

        s3.upload_fileobj(
            file,
            bucket_name,
            file.filename,
            ExtraArgs={"ACL": acl}
        )

    except Exception as e:
        # This is a catch all exception, edit this part to fit your needs.
        print("Something Happened: ", e)
        return e

```

As you can see, we're calling the `upload_fileobj` method with the file, and the
bucket name. We also pass in the actual filename along with the acl keyword
argument inside a simple try except block.

## Step 5: Generate a presigned URL for each file.

A presigned URL is a url to the uploaded file for other users to access. We can
easily generate one like so:

```python

url = s3.generate_presigned_url(
    ClientMethod="get_object",
    Params={
        "Bucket": S3_BUCKET,
        "Key": file.filename
    },
    ExpiresIn=10000 # Expiration date of the link, in seconds.
)
```

This is what the final function looks like:

```python
def upload_file_to_s3(file, bucket_name, acl="public-read"):

    """
    Docs: http://boto3.readthedocs.io/en/latest/guide/s3.html
    """

    try:

        s3.upload_fileobj(
            file,
            bucket_name,
            file.filename,
            ExtraArgs={"ACL": acl}
        )

    except Exception as e:
        print("Something Happened: ", e)
        return e

    file_url = s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket": S3_BUCKET,
            "Key": "psql_todo.md"
        },
        ExpiresIn=10000
    )

    return file_url
```

## Step 6: Upload files to our bucket

Now that we have a function to upload a file to S3, we need a piece of logic to
send the file from the user's computer to the bucket.
First we need to set up a new POST route for that (I like to keep my routes
separate even if they share the same endpoint. I think it's more clear and
modular that way but feel free to do it however you want)

```python
from flask import flask, render_template, redirect, request
from werkzeug.security import secure_filename
from helpers import upload_file_to_s3, allowed_file

@app.route("/", methods=["POST"])
def upload_file():

	# A
    if "user_file" not in request.files:
        return "No user_file key in request.files"

	# B
    file    = request.files["user_file"]

    """
        These attributes are also available

        file.filename               # The actual name of the file
        file.content_type
        file.content_length
        file.mimetype

    """

	# C.
    if file.filename == "":
        return "Please select a file"

	# D.
    if file and allowed_file(file.filename):
        file.filename = secure_filename(file.filename)
        output   	  = upload_file_to_s3(file, app.config["S3_BUCKET"])
        return str(output)

    else:
        return redirect("/")
```

A. We check the request.files object for a `user_file` key. (`user_file` is the
name of the file input on our form). If it's not there, we return an error message.

B. If the key is in the object, we save it in a variable called `file`

C. We check the filename attribute on the object and if it's empty, it means the
user sumbmitted an empty form, so we return an error message.

D. Finally we check that there is a file **and** that it has an allowed
filetype (this is what the `allowed_file` function does, you can [check it out in
the flask docs][0]).

If both tests pass, we sanitize the filename using the
`secure_filename` helper function provided by the `werkzeurg.security` module.
Next, we upload the file to our s3 bucket using our own helper function, we store
the return value (ie the generated presigned url for the file) in a variable o
called `output`. We end by returning the generated url to the user.

_Note: if one of the tests fail, we just redirect the user to the home page,
similar to a refresh_

## Other nuggets

### Get all buckets attached to your account

```python
buckets         = s3.list_buckets()
```

### List all objects (files) in a bucket

```python
# Both are valid
objects         = s3.list_objects(Bucket=S3_BUCKET)
objects         = s3.list_objects_v2(Bucket=S3_BUCKET)
```

### Access the files in a bucket

```python
all_files       = objects["Contents"]
```

### Get the total number of files in a bucket

```python
# If you used client.list_objects_v2
number_of_files = objects["KeyCount"]

# Else
number_of_files = len(all_files)
```

### Extract all file names

```python
file_names      = [file["Key"] for file in objects["Contents"]]
```

## Conclusion

There you have it people ! This is pretty much how you can upload files
directly to Amazon S3 using Flask. S3 in an amazing service, you should totally
take advantage of it. Plus it has a free tier so why not give it a try, you
won't be disappointed.
If you spot any typo, mistakes or know a better way to achieve the same thing,
please give me a shout on [twitter](https://twitter.com/zabanaa_).
Stay cyber, stay punk and happy hacking.
