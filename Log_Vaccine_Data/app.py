import datetime

import firebase_admin
from firebase_admin import auth, credentials, firestore
from flask import Flask, request, jsonify

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


@app.errorhandler(InvalidUID)
def handle_invalid_uid(error):
    """
    handling Invlaid UID exception
    :param error: Invalid UID exception
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


if __name__ == '__main__':
    app.run()
