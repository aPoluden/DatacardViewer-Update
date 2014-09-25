#!flask/bin/python
from application import app
import urllib2
import os

app.run(
		#debug = True,
		#port = int(os.environ.get('PORT', 5000)),
		#host = urllib2.urlopen("http://myip.dnsdynamic.org/").read(), 
		port = 5000
		host='0.0.0.0'
	)
