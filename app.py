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
    if not title:
        return jsonify({"error": "Enter a movie name", "Response": "False"}), 200
    params = {
        "apikey": API_KEY,
        "t": title
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

if __name__ == "__main__":
    app.run(debug=True)
