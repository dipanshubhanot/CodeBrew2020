from flask import Flask, render_template, Blueprint, request, session, redirect, url_for
#from app import db


main = Blueprint("main", __name__)

@main.route("/login",methods=["GET","POST"])
def login():
    

    return render_template("index.html")