import hashlib
import datetime

import jwt
from flask import Flask, render_template, request, jsonify, redirect, url_for
app = Flask(__name__)

from pymongo import MongoClient
import certifi

ca = certifi.where()

client = MongoClient('mongodb+srv://test:sparta@cluster0.i3cxp.mongodb.net/Cluster0?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.test


SECRET_KEY = '5B369D323AAFB548EFA77E38B3922'

def objectIdDecoder(list):
    for document in list:
        document['_id'] = str(document['_id'])

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/main')
def main():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.urliveUsers.find_one({'id': payload['id']})
        return render_template('main.html', id=user_info["id"])
    except jwt.ExpiredSignatureError:
        return redirect(url_for("home"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("home"))

@app.route('/api/register', methods=['POST'])
def api_register():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    user = db.urliveUsers.find_one({'id': id_receive})
    if user is None:
        db.urliveUsers.insert_one({'id': id_receive, 'pw': pw_hash,})
        check = 1
    else:
        check = 0
    return jsonify({'result': 'success', 'check': check})

@app.route('/api/login', methods=['POST'])
def api_login():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    result = db.urliveUsers.find_one({'id':id_receive, 'pw': pw_hash})
    if result is not None:
        payload = {
            'id': id_receive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }
        # 서버에서 실행시 디코딩 필요
        # token = jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode('utf-8')
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        return jsonify({'result': 'success', 'token': token})
    else:
        return jsonify(({'result' : 'fail', 'msg': '아이디, 비밀번호가 일치하지 않습니다.'}))

@app.route('/api/post', methods=['POST'])
def api_post():
    userId_receive = request.form['userId_give']
    url_receive = request.form['url_give']
    title_receive = request.form['title_give']
    artist_receive = request.form['artist_give']
    content_receive = request.form['content_give']
    doc = {
        'userId': userId_receive,
        'url': url_receive,
        'title': title_receive,
        'artist': artist_receive,
        'content': content_receive,
    }
    db.urliveContents.insert_one(doc)
    return jsonify({'msg': '등록되었습니다!'})

@app.route('/api/get', methods=['GET'])
def api_get():
    content_list = list(db.urliveContents.find({}))
    objectIdDecoder(content_list)
    return jsonify({'contents': content_list})

@app.route("/main/comment", methods=["GET"])
def post_get():
    urlivePost = list(db.urliveContents.find({}, {'_id': False}))
    return jsonify({'urlivePosts': urlivePost})


@app.route('/main/comment', methods=['POST'])
def comment_post():
    userId_receive = request.form['userId_give']
    comment_receive = request.form['comment_give']
    num = db.urliveContents.select_one['objectId']
    doc = {
        'num': num,
        'userId': userId_receive,
        'comment': comment_receive,
    }
    db.urliveComment.insert_one(doc)
    return redirect("/main/comment")


# 숫자를 받아오면 바꿔주어야 함
@app.route("/main/comment", methods=["GET"])
def comment_get():
    urliveComment = list(db.urliveComment.find({}, {'_id': False}))
    return jsonify({'urliveComments': urliveComment})



if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)