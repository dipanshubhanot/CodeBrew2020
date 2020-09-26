# app.py

# Required Imports
import os, json, base64
from flask import Flask, request, jsonify, render_template
from firebase_admin import credentials, firestore, initialize_app, auth
from flask_bcrypt import Bcrypt
from datetime import datetime

# Initialize Flask App
app = Flask(__name__)
bcrypt = Bcrypt(app)

# Initialize Firestore DB
cred = credentials.Certificate("key.json")
default_app = initialize_app(cred)
db = firestore.client()
accounts = db.collection('Accounts')
appointments = db.collection('Appointments')

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
        global current_user
        current_user = auth.get_user(data['uid'], default_app)
        email = get_user_info(current_user)['email']
        
        #add account document to db if not present
        if not accountCheck(email):
            nameDict = {}
            nameDict["name"] = get_user_info(current_user)['name']
            nameDict["profile_count"] = 0
            nameDict["profiles"] = []
            accounts.document(email).set(nameDict)
         
        print(get_user_info(current_user))
        return {
            "message": "Request Successful",
            "status_code": 500
        }
    else:
        raise InvalidUID("The provided UID is invalid")

def accountCheck(email):
    email = get_user_info(current_user)['email']
    return accounts.document(email).get().exists()


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

            print(json.dumps(profileDict))
            accounts.document(accID).update({u"profiles": firestore.ArrayUnion([profileDict])})

            accounts.document(accID).update({"profile_count": firestore.Increment(1)})

            return jsonify({"success": True}), 200
        except Exception as e:
            print("ERRORR!!")
            return f"An Error Occured: {e}"

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
            if request.json["requirement"] == "profile":
                if appointment_dict["profileID"] == request.json["profileID"]:
                    appointment_list.append(appointment_dict)

            # return all the pending appointments
            if request.json["requirement"] == "pending":
                if appointment_dict["status"] == "pending":
                    appointment_list.append(appointment_dict)

            # return all the COVID - test appointments
            if request.json["requirement"] == "test":
                if appointment_dict["type"] == "test":
                    appointment_list.append(appointment_dict)

            # return all the COVID - vaccine appointments
            if request.json["requirement"] == "vaccine":
                if appointment_dict["type"] == "vaccine":
                    appointment_list.append(appointment_dict)

        return jsonify(json.dumps(appointment_list)), 200



def genProfileID(accID, profileCount):
    unhashedID = accID + '-' + str(profileCount)  # replace 2 with counter based on no. of profiles
    hashedID = bcrypt.generate_password_hash(unhashedID)
    return hashedID.decode("utf-8").replace('/', '')


port = int(os.environ.get('PORT', 8080))
if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=port, debug=True)
