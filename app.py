from flask import Flask, render_template, request, redirect
from flask import send_from_directory
from flask_cors import CORS
import argparse

app = Flask(__name__)

parser = argparse.ArgumentParser(description="Simple script with IP and port arguments")

parser.add_argument(
    "--ip",
    type=str,
    default="127.0.0.1",
    required=False,
    help="IP address to bind the server (default: 127.0.0.1)"
)

parser.add_argument(
    "--port",
    type=int,
    default=5000,
    required=False,
    help="Port number to run the server (default: 5000)"
)

args = parser.parse_args()
ip, port = args.ip, args.port

CORS(app, resources={r"/*": {"origins": f"http://{ip}:{port}"}})

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')

@app.route("/about")
def about():
    return render_template('about.html')

@app.route("/tutorial")
def tutorial():
    return render_template('tutorial.html')

@app.route("/setup")
def setup():
    return render_template('setup.html')

@app.route("/eeg_reader")
def eeg_reader():
    return render_template('EEG_Reader.html')

# @app.route("/download")
# def download_redirect():
#     return redirect('/setup/test.txt')

app.config["DOWNLOAD_FOLDER"]="static/download"
# 
@app.route("/downloader")
def downloader():
    return send_from_directory(app.config["DOWNLOAD_FOLDER"], 
                               "EEG_Reader.zip",
                               as_attachment=True)

if __name__ == '__main__':
    app.run(ip, port, debug=True)