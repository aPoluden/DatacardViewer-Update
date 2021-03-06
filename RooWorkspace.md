# THttpServer 

**ThttpServer** – uses standart WEB servers such as Apache through FastCGI proxy.
That means that ROOT APP opens FastCGI port. This port listens to HTTP requests and answer them (example tutorials/http/httpserver.C).
Inside ROOT APP memory will be created a file which will be filled by histograms.
In the same way can be readed file from current memory.
[THttpServer documentation](http://root.cern.ch/root/htmldocmake guides/HttpServer/HttpServer.html)

**Minimal example:**

1. Enter ROOT
2. cp
``` cpp
TFile::Open("file.root");
THttpServer* serv = new THttpServer("http:8080/none?rw");
```

After that *File.root* containing can be viewed in browser
```
http://localhost:8080
``` 
**Example With FastCGI :**
``` cpp
TFile::Open("file.root");
THttpServer* serv = new THttpServer("fastcgi:9000/none?rw");
```
After that proxy need to be configured on Your's WEB server with appropriate port. 

Also there availability to register object for the server and do not use File.root > serv->Register("folder", obj);

## THttpServer configuration

THttpServer is present in both ROOT v5 and v6. Problem, that it is not compiled by default.
If your installation does not have THttpServer, you need to compile ROOT yourself, doing:
``` sh
./configure --enable-http
```
And than:
``` sh
[shell]make.
```
Recommend to use version from repository while significant part of new code was submitted.

Therefore do like:
``` sh
[shell] git clone http://root.cern.ch/git/root.git rootgit
[shell] cd rootgit
[shell] ./configure --enable-http
[shell] make -j8
[shell] source bin/thisroot.sh
```
### Other problems using THttpServer

If it's not available to configure THttpServer check for ROOT latest releases. Or 
problem can be caused by old C++ gcc or g++ compilers versions which don't support some features. You need to update them and enable in g++ compiler c++11 features.
[How to update C++ compiler](http://google.com)
[How to enable c++11 features](http://stackoverflow.com/questions/17378969/how-to-change-gcc-compiler-to-c11-on-ubuntu)

# THttpServer and RooFit
As it is now, THttpServer could not be used with RooFit.
Seems to be, not all RooFit classes are supported in TBufferJSON, used to convert object into JSON format.

General comment - RooWorkspace by no means supported in ROOT JavaScript graphics.
Probably, one could support some histograms and graphs from RooFit.

Main problem with RooFit classes - they are full of custom streamers.
To be able convert such object into JSON, one need to equipt all these custom streamers with special function calls.

Another much powerful solution - provide special TRootSniffer class, which should be able to scan all kinds of RooFit objects and extract information,
which could be presented by the web server.

## Just to conclude about RooFit package with THttpServer.

For THttpServer need to be provided TRootSniffer class, which can be extended for RooFit case that
THttpServer get idea that can be extracted from RooWorkspace (or any other RooFit class)
and correctly represented on the web page.

Another, very simple solution - you run RooFit and creates histograms/graphs/canvases out of it.
All these objects can be registered to the server with
THttpServer::Register() call. 

## Help 

*Sergey Linev* - person who provided THttpServer class. email: S.Linev@gsi.de