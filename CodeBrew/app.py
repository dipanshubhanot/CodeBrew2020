# app.py

# Required Imports
import os, json, base64
from flask import Flask, request, jsonify, render_template
from firebase_admin import credentials, firestore, initialize_app
from flask_bcrypt import Bcrypt

# Initialize Flask App
app = Flask(__name__)
bcrypt = Bcrypt(app)

# Initialize Firestore DB
cred = credentials.Certificate("key.json")
default_app = initialize_app(cred)
db = firestore.client()
accounts = db.collection('Accounts')


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login',methods=['POST','GET'])
def login():
    email = request.json['email']
    
    return render_template('index.html')

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


@app.route('/profile', methods=['GET','POST'])
def profile():
    print("in profile")
    if request.method == 'POST':
        try:
            # Check if ID was passed to URL query
            #accID = request.json['accountID']
            #print(request.json)
            accID = 'vaishnavi@gmail.com'  
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
        accID = "vaishnavi@gmail.com"
        try:
            accountDetails = accounts.document(accID).get().to_dict()
            print(accountDetails["profiles"])
            return jsonify(accountDetails["profiles"]), 200
            
        except Exception as e:
            return f"An Error Occured: {e}"


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


def genProfileID(accID,profileCount):
    unhashedID = accID + '-' + str(profileCount) #replace 2 with counter based on no. of profiles
    hashedID = bcrypt.generate_password_hash(unhashedID)
    return hashedID.decode("utf-8").replace('/','')


port = int(os.environ.get('PORT', 8080))
if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=port, debug=True)