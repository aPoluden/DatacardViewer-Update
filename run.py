#!flask/bin/python
from application import app
import urllib2
import os

app.run(
		port = 5000,
		host = '0.0.0.0'
	)
