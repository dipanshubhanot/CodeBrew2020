# app.py

# Required Imports
import os, json, base64
from flask import Flask, request, jsonify, render_template
from firebase_admin import credentials, firestore, initialize_app, auth
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime

# Initialize Flask App
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Initialize Firestore DB
cred = credentials.Certificate("key.json")
default_app = initialize_app(cred)
db = firestore.client()
accounts = db.collection('Accounts')
appointments = db.collection('Appointments')


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

@app.errorhandler(API_KEY_EXCEPTION)
def handle_invalid_api(error):
    """
    handling Invlaid API exception
    :param error: Invalid API exception
    :return: Response for the error
    """
    response = jsonify(error.payload)
    return response

@app.errorhandler(InvalidUID)
def handle_invalid_uid(error):
    """
    handling Invlaid UID exception
    :param error: Invalid UID exception
    :return: Response for the error
    """
    response = jsonify(error.payload)
    return response


@app.route('/login', methods=['POST'])
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
        current_user = auth.get_user(data['uid'], default_app)
        email = get_user_info(current_user)['email']
        
        print(email)
        #add account document to db if not present
        if not accountCheck(current_user):
            nameDict = {}
            nameDict["name"] = get_user_info(current_user)['name']
            nameDict["profile_count"] = 0
            nameDict["profiles"] = []
            accounts.document(email).set(nameDict)
         
        print(get_user_info(current_user))
        return {
            "message": "Request Successful",
            "status_code": 200
        }
    else:
        raise InvalidUID("The provided UID is invalid")

def accountCheck(current_user):
    email = get_user_info(current_user)['email']
    return accounts.document(email).get().exists


@app.route('/')
def index():
    return render_template('index.html')


'''
@app.route('/register', methods=['POST'])
def register():
    """
        create() : Add document to Firestore collection with request body
        Ensure you pass a custom ID as part of json body in post request
        e.g. json={'id': '1', 'title': 'Write a blog post'}
    """
    try:
        id = request.json['id']
        todo_ref.document(id).set(request.json)
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"
'''


@app.route('/profile', methods=['GET', 'POST'])
def profile():
    print("in profile")
    uID = request.headers['uid']
    print(uID)
    current_user = auth.get_user(uID, default_app)
    accID = get_user_info(current_user)['email']
    if request.method == 'POST':
        try:
            # Check if ID was passed to URL query
            #accID = get_user_info(current_user)['email']
            #print(request.json)
            #accID = 'vaishnavi@gmail.com'  

            profileCount = accounts.document(accID).get().to_dict()["profile_count"]
            profileID = genProfileID(accID, profileCount)
            print(profileID)
            profileDict = {}
            profileDict[profileID] = request.json

            # print(json.dumps(profileDict))
            accounts.document(accID).update({u"profiles": firestore.ArrayUnion([profileDict])})

            accounts.document(accID).update({"profile_count": firestore.Increment(1)})

            return jsonify({"success": True}), 200
        except Exception as e:
            print("ERRORR!!")
            print(e)
            return jsonify({"success": False}), 500
            return;

    if request.method == "GET":
        try:
            accountDetails = accounts.document(accID).get().to_dict()
            print(accountDetails["profiles"])
            return jsonify(accountDetails["profiles"]), 200

        except Exception as e:
            return f"An Error Occured: {e}"


'''
@app.route('/list', methods=['GET'])
def read():
    """
        read() : Fetches documents from Firestore collection as JSON
        todo : Return document that matches query ID
        all_todos : Return all documents

    """
    try:
        # Check if ID was passed to URL query
        todo_id = request.args.get('id')    
        if todo_id:
            todo = todo_ref.document(todo_id).get()
            return jsonify(todo.to_dict()), 200
        else:
            all_todos = [doc.to_dict() for doc in todo_ref.stream()]
            return jsonify(all_todos), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/update', methods=['POST', 'PUT'])
def update():
    """
        update() : Update document in Firestore collection with request body
        Ensure you pass a custom ID as part of json body in post request
        e.g. json={'id': '1', 'title': 'Write a blog post today'}
    """
    try:
        id = request.json['id']
        todo_ref.document(id).update(request.json)
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/delete', methods=['GET', 'DELETE'])
def delete():
    """
        delete() : Delete a document from Firestore collection

    """
    try:
        # Check for ID in URL query
        todo_id = request.args.get('id')
        todo_ref.document(todo_id).delete()
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"
'''


@app.route('/appointment', methods=["POST", "GET"])
def appointment():
    if request.method == "POST":
        date_time = datetime.now()
        appointments.document(str(date_time)).set(request.json)
        return jsonify({"success": True}), 200

    if request.method == "GET":
        appointment_list = []
        appointment_documents = appointments.get() 

        for appointment_doc in appointment_documents:
            appointment_dict = appointment_doc.to_dict()

            # return the appointments associated with the requested profileID
            if request.args.get('requirement') == "profile":
                if "id" in appointment_dict:
                    if appointment_dict["id"] == request.args.get('profileId'):
                        appointment_list.append(appointment_dict)

            # return all the pending appointments
            if request.args.get('requirement') == "pending":
                if appointment_dict["status"] == "pending":
                    appointment_list.append(appointment_dict)

            # return all the pending appointments
            if request.args.get('requirement') == "everything":
                if appointment_dict["status"] == "complete":
                    appointment_list.append(appointment_dict)

            # return all the COVID - test appointments
            if request.args.get('requirement') == "test":
                if appointment_dict["type"] == "test":
                    appointment_list.append(appointment_dict)

            # return all the COVID - vaccine appointments
            if request.args.get('requirement') == "vaccine":
                if appointment_dict["type"] == "vaccine":
                    appointment_list.append(appointment_dict)

        return jsonify(json.dumps(appointment_list)), 200

#for scanner
@app.route('/scanner/qrscan',methods=["GET"])
def qrScan():
    if request.method == "GET":
        try:
            appointmentID = request.json['aID']
            appointment = appointments.document(appointmentID).get().to_dict()
            return jsonify(appointment), 200
        except Exception as e:
            print("An Error Occured: {e}")

#for medical practitioner
@app.route('/medical_practitioner/updatetestresults',methods=["POST"])
def updateTestStatus():
    if request.method == "POST":
        try:
            appointmentID = request.json["aid"]
            status = request.json["status"]
            result = request.json["result"]
            appointment_ref = appointments.document(appointmentID)
            
            #update status
            appointment_ref.update({"status": status})

            #update result
            appointment_ref.update({"result": result})
            
            return jsonify({"success": True}), 200

        except Exception as e:
            print("An Error Occured: {e}")

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


def genProfileID(accID, profileCount):
    unhashedID = accID + '-' + str(profileCount)  # replace 2 with counter based on no. of profiles
    hashedID = bcrypt.generate_password_hash(unhashedID)
    return hashedID.decode("utf-8").replace('/', '')


port = int(os.environ.get('PORT', 8080))
if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=port, debug=True)
