import datetime

import firebase_admin
from firebase_admin import auth, credentials, firestore
from flask import Flask, request, jsonify, render_template
from google.auth.transport import requests
from google.oauth2 import id_token

GOOGLE_AUTH_CLIENT_ID = '587209520782-bu3g4agf41d9vok7pg9ipudfa6igpq7c.apps.googleusercontent.com'

# Setting Up Firebase
cred = credentials.Certificate("codebrew2020-firebase-adminsdk-bmi36-da4d53edf4.json")
default_app = firebase_admin.initialize_app(cred)

# Setting Up Flask
app = Flask(__name__)
app.config["DEBUG"] = True

current_user = None


def get_user_info(user):
    """
    Documentation:
    https://firebase.google.com/docs/reference/admin/python/firebase_admin.auth#firebase_admin.auth.UserRecord
    :param user: firebase_admin.auth.UserRecord Object
    :return: Dictionary of attributes for the user
    """
    if not user:
        return None
    else:
        return {
            'name': user.display_name,
            'email': user.email,
            'metadata': user.user_metadata,
            'image': user.photo_url
        }


class InvalidUID(Exception):
    """
        Exception Class to be raised if the UID provided by the request is invalid
    """

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = {
            'message': self.message,
            'status_code': 200
        }


class API_KEY_EXCEPTION(Exception):
    """
        Exception Class to be raised if the UID provided by the request is invalid
    """

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = {
            'message': self.message,
            'status_code': 200
        }


@app.errorhandler(InvalidUID)
def handle_invalid_uid(error):
    """
    handling Invlaid UID exception
    :param error: Invalid UID exception
    :return: Response for the error
    """
    response = jsonify(error.payload)
    return response


@app.errorhandler(API_KEY_EXCEPTION)
def handle_invalid_api(error):
    """
    handling Invlaid API exception
    :param error: Invalid API exception
    :return: Response for the error
    """
    response = jsonify(error.payload)
    return response


@app.route('/sendUser', methods=['POST'])
def verify_login():
    """
    Handles the senduser request which will fetch the current user from firebase
    :return:
    """
    if request.method != "POST":
        return {
            "message": "Not a Post Request"
        }

    data = request.get_json()
    if 'uid' in data:
        global current_user
        current_user = auth.get_user(data['uid'], default_app)
        print(get_user_info(current_user))
        return {
            "message": "Request Successful",
            "status_code": 500
        }
    else:
        raise InvalidUID("The provided UID is invalid")


def get_profile_id(profile):
    return "HelloWorld" + str(profile)


@app.route('/administerVaccine', methods=['POST'])
def administer_vaccine():
    if request.method != "POST":
        return {
            "message": "Not a Post Request"
        }
    data = request.get_json()
    if 'HR' in data and 'SPO2' in data and 'profileid' in data:
        record = {
            u'Date of Administration': datetime.datetime.now(),
            u'Heart Rate at Administration': data['HR'],
            u'SP02 at Administration': data['SPO2'],
        }
        docid = data['profileid']
        new_vaccine_record(docid, record)
        return "Successfully Created Vaccine Records"
    else:
        raise InvalidUID("Enough Info not provided")


def new_vaccine_record(docid, record):
    db = firestore.client()
    db.collection(u'VaccineLog').document(docid).set(record)


@app.route('/vaccine/newLog', methods=['POST'])
def add_vaccine_log():
    if request.method != "POST":
        return {
            "message": "Not a Post Request"
        }

    data = request.get_json()
    if 'HR' in data and 'SPO2' in data and 'profile_id' in data:
        record = {
            u'Date': datetime.datetime.now(),
            u'Heart Rate': data['HR'],
            u'SP02': data['SPO2'],
        }
        docid = data['profile_id']
        new_vaccine_log(docid, record)
        return "Successfully Created Vaccine Log"
    else:
        raise InvalidUID("Enough Info not provided")


def new_vaccine_log(docid, record):
    db = firestore.client()
    db.collection(u'VaccineLog').document(docid).collection(u'Logs').document(
        str(record['Date'])).set(record)
    return None


@app.route('/vaccineLogData/profile', methods=['GET'])
def give_profile_log():
    if 'profile_id' in request.headers:
        profile_id = request.headers.get('profile_id')
        return get_profile_log(profile_id)
    else:
        raise InvalidUID('Helllooo')


def get_profile_log(profile_id):
    db = firestore.client()
    profile_ref = db.collection(u'VaccineLog').document(profile_id)
    profile_data = profile_ref.get()
    user_data = dict()
    if profile_data.exists:
        user_data['VaccinationPoint'] = profile_data.to_dict()
        user_data['PrevLog'] = []
    else:
        return "Invalid Profile ID"
    for record in db.collection(u'VaccineLog').document(profile_id).collections():
        for data in record.stream():
            user_data['PrevLog'].append(data.to_dict())
    return user_data


@app.route('/api/vaccineLogData/', methods=['GET'])
def fetch_log_data():
    if 'apiKey' in request.headers:
        if validate_api_key(request.headers.get('apiKey')):
            return get_all_log()
        else:
            raise API_KEY_EXCEPTION('Invalid API Key')
    else:
        raise API_KEY_EXCEPTION('No API Key Provided')


def validate_api_key(api):
    db = firestore.client()
    doc_ref = db.collection(u'apiKeys').document(api)
    doc = doc_ref.get()
    return doc.exists


def get_all_log():
    db = firestore.client()
    docs = db.collection(u'VaccineLog').stream()
    final_data = dict()
    for doc in docs:
        current_data = doc.to_dict()
        final_data[doc.id] = current_data
        final_data['record'] = []
        for record in db.collection(u'VaccineLog').document(doc.id).collections():
            for data in record.stream():
                final_data['record'].append(data.to_dict())
    return final_data

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/google-auth-token', methods=['POST'])
def get_google_token():
    payload2 = request.get_json()
    print(payload2)
    if 'google-token' in payload2:
        token = payload2.get('google-token')
        print(token)
        if verify_google_token(token):
            return "Nice!"
        else:
            return "Not Nice"
    return "lolwa"

# (Receive token by HTTPS POST)
# ...

def verify_google_token(token):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_AUTH_CLIENT_ID)

        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')

        # If auth request is from a G Suite domain:
        # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
        #     raise ValueError('Wrong hosted domain.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']
        print(userid)
        return True
    except ValueError:
        # Invalid token
        return False


if __name__ == '__main__':
    app.run(debug=True)
