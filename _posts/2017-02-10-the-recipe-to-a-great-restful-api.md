---
layout: post
title: The Recipe for a great RESTful API
---

Endpoints map to collections and resources
    * always use plural names

Actions on resources must be performed through HTTP verb

use dates in instead of version numbers in the URL (foursquare does exactly that)

Responses

In your responses, you should try to separate the metadata from the the actual
response and put them in two different objects.

show an example

When creating a response, always return a 201 created. Also a url to the newly
created a resource should be passed in the response with the location header.
You can also return the serialised version of the resource in the response body.
(I like to do that).


When dealing with errors, make sure to add a message detailing the reason for
the error and possibly include the solution to it.

Just like with successful requests, always include the status code in the
response. This will make life on the client side a whole lot easier as they will
be able to gracefully deal with them.

Status code

This part is subject to many passionate debates, apparently it's a very touchy
topic.

Below I will list the most common status codes, what they mean and how I use
them.

* 200 - OK - Request went well, errthang's fine.
* 201 - Resource created - The resource was successfully saved to the databse
* 400 - Bad request     - The request was badly formatted
* 401 - Unauthorized    - Authentication of the user failed, due to invalid
  credentials

* 403 - Forbidden - The user is authenticated but does not have permission to
  access the resource
* 404 - Not Found - Well, [you know what it
  is](https://www.youtube.com/watch?v=yX2vWL2b2Rc)
* 405 - Method Not Allowed - The HTTP verb you used to interact with the
  resource is not allowed. (eg: User tried to POST to a GET only endpoint)
* 409 - Conflict - The resource you're trying to POST (usually) to the server
  conflicts with an already existing one. (Now this is where things can get
  complicated, I return this status code in cases where the user sends data
  to an endpoint with a unique field consraints attached to it: Example, the
  user tries to register with an already existing email / username)

* 422 - Unprocessable Entity - Again, another controversial one. I return a 422
  usually when the user sends an incomplete payload and the endpoint and thereby
  violates the NOT NULL constraint attached to those fields.
* 429 - Too many requests - You made too many requests. (No way ?)
* 50x - Server Related Errors - Something went wrong server side.

#### A few notes on HTTP verbs

PUT requests should not be used for partial updates. For that, use PATCH instead.

### Caching

Caching is great and is a must when deploying a restful api. It helps a huge
amount with performace by reducing server load as you are not required to
perform the same action twice. You could choose to do it manually or use a
reverse proxy like nginx or even something like varnish to handle that for you.

Caching will return a 304 Not Modified if the resource hasn't changed. The great
thing about this is that it does not affect your rate limiting, so there's
literally no excuse not to implement it.


### Rate Limiting

For security and performance reasons you want limit the amount of requests made
against your API.
You must return the maximum and remaining number of request allowed for the user
in a particular time window (that you are free to determine on your own)

### CORS

You want to enable CORS to allow requests from browsers using AJAX. This can
be done by setting the following headers:

Access-Control-Allow-Origin: * (this means allow all domains to interact with
the API)
Access-Control-Allow-Headers: (Here, you want to list all the headers accepted
in the request)
