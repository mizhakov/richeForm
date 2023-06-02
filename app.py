from flask import Flask, request, render_template, send_from_directory ,jsonify
from flask_cors import CORS
import os
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
db = SQLAlchemy(app)

class MyData(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    market = db.Column(db.String)
    prod = db.Column(db.String)
    rateBox = db.Column(db.Integer)
    name = db.Column(db.String)
    rateProd = db.Column(db.Integer)
    pos = db.Column(db.String)
    neg = db.Column(db.String)
    rewue = db.Column(db.String)
    files = db.Column(db.String)

    def __init__(self, market, prod, rateBox, name, rateProd, pos, neg, rewue, files):
        self.market = market
        self.prod = prod
        self.rateBox = rateBox
        self.name = name
        self.rateProd = rateProd
        self.pos = pos
        self.neg = neg
        self.rewue = rewue
        self.files = files



UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')
def index():
    
    return render_template('index.html')

@app.route('/successfully')
def successfully():

    return "Hello World!"

@app.route('/upload', methods=['POST'])
def upload():
    
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']

    if file.filename == '':
        return 'No selected file'

    if file:

        now = datetime.now()
        year = now.year
        month = now.month
        day = now.day

        folder_path = os.path.join(app.config['UPLOAD_FOLDER'], str(year), str(month), str(day))
        os.makedirs(folder_path, exist_ok=True)

        file_path = os.path.join(folder_path, file.filename)
        file.save(file_path)

        return file_path
    else:
        return 'Ошибка при загрузке файла.'

@app.route('/uploads/<filename>')
def uploaded_file(filename):

    if filename.endswith(('.jpg', '.jpeg', '.png', '.gif')):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return 'File is not an image'

@app.route('/rewue_save', methods=['POST'])
def handle_post_request():

    
    data = request.get_json()
    
    market = data.get('market')
    prod = data.get('prod')
    rateBox = data.get('rateBox')
    name = data.get('name')
    rateProd = data.get('rateProd')
    pos = data.get('pos')
    neg = data.get('neg')
    rewue = data.get('rewue')
    files = str(data.get('files'))  

    my_data = MyData(
        market=market,
        prod=prod,
        rateBox=rateBox,
        name=name,
        rateProd=rateProd,
        pos=pos,
        neg=neg,
        rewue=rewue,
        files=files
    )
    
    db.session.add(my_data)
    db.session.commit()

    response = {'message': 'Данные успешно записаны в БД'}
    return jsonify(response), 200


if __name__ == '__main__':
    
    with app.app_context():
        db.create_all()

    app.run(debug=True,load_dotenv = True,host="127.0.0.1" , port="8000")
