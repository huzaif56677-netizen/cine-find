from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("OMDB_API_KEY")
app = Flask(__name__)
CORS(app)

OMDB_URL = "https://www.omdbapi.com/"

@app.route("/favicon.ico")
def favicon():
    return "", 204

@app.route("/")
def hero():
    return render_template("index.html")

@app.route("/movies",methods=["GET","POST"])
def get_movies():
    title = request.args.get("title","").strip()
    page = request.args.get("page",1,type=int)

    if not title:
        return jsonify({"error": "Enter a movie name", "Response": "False"}), 200
    if page < 1 or page > 100:
        return jsonify({
            "error": "Page must be between 1 and 100",
            "Response": "False"
        }), 400
    params = {
        "apikey": API_KEY,
        "s": title,
        "page":1
    }
    try:
        response = requests.get(OMDB_URL,params=params,timeout=10)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException:
        return jsonify({"error": "Could not reach OMDb", "Response": "False"}), 502

    if data.get("Response") == "False":
        return jsonify({"error": data.get("Error", "Movie not found"), "Response": "False"}), 200

    return jsonify(data), 200

@app.route("/movies/details")
def get_details():
    imdbId = request.args.get("imdbID","")
    if not imdbId :
        return jsonify({"error":'imdbID required'}),400
    params = {
        "apikey":API_KEY,
        "i":imdbId
    }

    try:
        detail_response = requests.get(OMDB_URL,params=params,timeout=10)
        detail_response.raise_for_status()
        detialed_obj = detail_response.json()

    except  requests.RequestException:
        return jsonify({"error":"Could not reach OMDB","Response":"False"}),502
    if detialed_obj.get("Response") == "False":
            return jsonify({"error": detialed_obj.get("Error", "Movie not found"), "Response": "False"}), 404
        
    return jsonify(detialed_obj),200

if __name__ == "__main__":
    app.run(debug=True)
