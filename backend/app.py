from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

data = [
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"}
]

@app.route('/')
def home():
    return "Welcome to the Flask API!"


@app.route('/api/items', methods=['GET'])
def get_items():
    return jsonify(data)

@app.route('/api/items', methods=['POST'])
def add_item():
    new_item = request.get_json()
    data.append(new_item)
    return jsonify(new_item), 201



if __name__ == '__main__':
    app.run(debug=True)