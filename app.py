from flask import Flask, render_template, request, redirect
from flask import send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5000"}})

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

@app.route("/download")
def download_redirect():
    return redirect('/setup/test.txt')

app.config["DOWNLOAD_FOLDER"]="D:\EEG HCI Project\Flask WebPage\static\download"
# 
@app.route("/downloader")
def downloader():
    return send_from_directory(app.config["DOWNLOAD_FOLDER"], 
                               "test.txt",
                               as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)