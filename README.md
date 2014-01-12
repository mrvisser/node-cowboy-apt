# node-cowboy-exec

[![Build Status](https://travis-ci.org/mrvisser/node-cowboy-apt.png?branch=master)](https://travis-ci.org/mrvisser/node-cowboy-apt)

Cowboy module that allows you to manage aptitude packages.

## Installation

```
$ cowboy install cowboy-apt
```

## Commands

### Install

Install an aptitude package.

#### Help

```
$ cowboy cowboy-apt:install --help

Install an aptitude package.

cowboy cowboy-apt:install -- [--force-conf=old (old | new)] <package name>[=<package version>]

Example use:

cowboy cowboy-apt:install -- redis-server
cowboy cowboy-apt:install -- redis-server=2:2.6.16-3
cowboy cowboy-apt:install -- --force-conf=new redis-server

```

#### Example

```
$ cowboy cowboy-apt:install libpng3

Installing package: libpng3

 Host                      | Result
---------------------------|-----------------------------------------------------------------------
                           | 
 host_a                    | Installed: libpng3=1.2.46-3ubuntu4 (install ok installed)
 host_b                    | Installed: libpng3=1.2.46-3ubuntu4 (install ok installed)
                           | 
---------------------------|-----------------------------------------------------------------------

Summary:

  Success: 2/2

```

### Show

Show the installed version of an aptitude package.

#### Help

```
$ cowboy cowboy-apt:show --help

Show details about an aptitude package.

cowboy cowboy-apt:show -- <package name>

Example use:

cowboy cowboy-apt:show -- redis-server

```

#### Example

```
$ cowboy cowboy-apt:show libpng3

Inspecting package: libpng3

 Host                      | Result
---------------------------|-----------------------------------------------------------------------
                           | 
 host_a                    | libpng3=1.2.46-3ubuntu4 (install ok installed)
 host_b                    | libpng3=1.2.46-3ubuntu4 (install ok installed)
                           | 
---------------------------|-----------------------------------------------------------------------

Summary:

  Success: 2/2

```

## License

Copyright (c) 2014 Branden Visser

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
