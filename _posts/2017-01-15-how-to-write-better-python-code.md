```python

# 0 - Loop over a range of numbers
# Use range instead of xrange
# Range in python 3 creates an iterator which produces the values one at a time (it's much more efficient and fast)

nums = [0,2, 34, 55, 32]
for i in range(nums):
    print i

```

```python

# 1 - Looping backwards
# Use reversed

names = ["Case", "Molly", "Armitage", "Maelcum"]
for name in reversed(names):
    print name

```

```python

# 2 - Looping over a collection and its indices
# use enumerate

names = ["Case", "Molly", "Armitage", "Maelcum"]
for index, name in enumerate(names):
    print index, name
```

```python

# 3 - Looping over two collections simultaneously
# use izip (faster than zip)

from itertools import izip

names = ["Case", "Molly", "Armitage", "Maelcum"]
ages = [23, 27, 41, 24]
for name, age in izip(names, ages):
    print name, age

```

```python

# 4 - Looping over a sorted list
# Use sorted

names = ["Case", "Molly", "Armitage", "Maelcum"]
for name in sorted(names):
    print name

```

```python
# 5 - Call a function until a sentinel value is returned
# Use iter

# Bad example: loop over a file containing a list of names
# until the loop returns an empty string,
# in which case we break out of it

names = []
while True:
    name = file.read(32)
    if name = "":
        break
    names.append(name)
```
```python

# Beautiful example
# In this case, we call a function (f.read()) until it returns the sentinal value
# passed a second argument to iter. That way we avoid having to make the unnecessary if check

for name in iter( partial(f.read(32)), ""):
    print name

```

```python

# 6 - Looping over a dictionary

# The normal way to do it
molly = { "name": "Molly Millions", "Age": 27, "Occupation": "Professional Killer"}

for key in molly:
    print key

# If you wish to mutate the data, use dict.keys() instead
molly = { "name": "Molly Millions", "Age": 27, "Occupation": "Professional Killer"}

for key in molly.keys():
    # do the mutation

```

```python

# 7 - Looping over a dictionary keys AND values

# Don't do this:
# It's slow because we have to rehash the dictionary and do a lookup everytime
molly = { "name": "Molly Millions", "Age": 27, "Occupation": "Professional Killer"}

for key in molly:
    print molly[key]

# Instead use iteritems()
molly = { "name": "Molly Millions", "Age": 27, "Occupation": "Professional Killer"}

for key, value in molly.iteritems():
    print key, value
```

```python

# 8 - Create a dictionary out of two lists
# Instantiate a new dict with two zipped lists

from itertools import izip

names = ["Case", "Molly", "Armitage", "Maelcum"]
ages = [23, 27, 41, 24]

characters = dict(izip(names, ages))

```

```python

# 9 - Use named tuples when you need to return multiple values
# (like in the case of an API response in flask)
from collections import namedtuple

Response = namedtuple('APIResponse', ['status_code', 'body', 'headers'])

@app.route('/users/1'):

    try:
        user = db.getuserbyid(1)
    except:
        return Response(404, user.notfound(), {'content-type': 'application/json'}
    else:
        return Response(200, user.json(), {'content-type': 'application/json'}
```

# Other

# - Always clarify function calls by using keyword arguments
