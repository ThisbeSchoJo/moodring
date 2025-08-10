# Standard library imports
from datetime import datetime, timedelta, timezone
import os
import uuid

# Remote library imports
from flask import request, make_response, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from flask_restful import Resource
from flask_jwt_extended.exceptions import JWTExtendedException
from werkzeug.utils import secure_filename


# Local imports
from config import app, db, api
from sqlalchemy import select