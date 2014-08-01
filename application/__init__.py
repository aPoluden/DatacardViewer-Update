from flask import Flask

# Initialize the Flask application
app = Flask(__name__)

# Read configuration file
app.config.from_object('config')

from application import views
from application import datacards