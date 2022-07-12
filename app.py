import hashlib
import datetime

import jwt
from flask import Flask, render_template, request, jsonify, redirect, url_for
app = Flask(__name__)

from bson import ObjectId
from pymongo import MongoClient
import certifi

ca = certifi.where()

client = MongoClient('mongodb+srv://test:sparta@cluster0.i3cxp.mongodb.net/Cluster0?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.test


SECRET_KEY = '5B369D323AAFB548EFA77E38B3922'

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
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        content_list = list(db.urliveContents.find({}))
        for document in content_list:
            document['_id'] = str(document['_id'])
            document["count_heart"] = db.urliveLikes.count_documents({"post_id": document["_id"], "type": "heart"})
            document["heart_by_me"] = bool(db.urliveLikes.find_one({"post_id": document["_id"], "type": "heart", "id": payload['id']}))
        return jsonify({'contents': content_list})
    except jwt.ExpiredSignatureError:
        return redirect(url_for("home"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("home"))
# 좋아요 기능
@app.route('/api/likes', methods=['POST'])
def update_like():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.urliveUsers.find_one({"id": payload["id"]})
        post_id_receive = request.form["post_id_give"]
        type_receive = request.form["type_give"]
        action_receive = request.form["action_give"]
        doc = {
            "post_id": post_id_receive,
            "id": user_info["id"],
            "type": type_receive
        }
        if action_receive == "like":
            db.urliveLikes.insert_one(doc)
        else:
            db.urliveLikes.delete_one(doc)
        count = db.urliveLikes.count_documents({"post_id": post_id_receive, "type": type_receive})
        return jsonify({"result": "success", 'msg': 'updated', "count": count})
    except jwt.ExpiredSignatureError:
        return redirect(url_for("home"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("home"))

# 카드 삭제 기능
@app.route('/api/delete', methods=['POST'])
def api_delete():
    id_receive = request.form['id_give']
    userId_receive = request.form['userId_give']
    content = db.urliveContents.find_one({'_id': ObjectId(id_receive)})
    print(userId_receive)
    if content['userId'] == userId_receive:
        db.urliveContents.delete_one({'_id': ObjectId(id_receive)})
        msg = "삭제되었습니다!"
        check = 1
    else:
        msg = "본인이 작성한 글이 아닙니다."
        check = 0
    return jsonify({'msg': msg, 'check': check})


@app.route('/main/comment', methods=['POST'])
def comment_post():
    userId_receive = request.form['userId_give']
    comment_receive = request.form['comment_give']
    num= request.form['objectId_give']

    doc = {
        'num': num,
        'userId': userId_receive,
        'comment': comment_receive,
    }

    db.urliveComment.insert_one(doc)
    return jsonify({'msg':'등록 완료'})


# 숫자를 받아오면 바꿔주어야 함
@app.route("/main/comment", methods=["GET"])
def comment_get():
    comment_list = list(db.urliveComment.find({}))
    for document in comment_list:
        document['_id'] = str(document['_id'])
    return jsonify({'urliveComments': comment_list})

@app.route('/comment/delete', methods=['POST'])
def comment_delete():
    objectId_receive = request.form['objectId_give']
    user_id_receive = request.form['userId_give']
    comment_info = db.urliveComment.find_one({'_id': ObjectId(objectId_receive)})
    print(user_id_receive)
    if comment_info['userId'] == user_id_receive:
        db.urliveComment.delete_one({'_id': ObjectId(objectId_receive)})
        msg = "삭제 완료"
        check = 1
    else:
        msg = "본인이 작성한 글이 아닙니다."
        check = 0
    return jsonify({'msg': msg, 'check': check})

# 댓글 순 정렬
@app.route('/api/getByComment', methods=['GET'])
def api_get_by_comment():
    content_list = list(db.urliveContents.find({}))
    print(content_list)
    result = []
    for document in content_list:
        document['_id'] = str(document['_id'])
        document['comment_count'] = db.urliveComment.count_documents({"num": str(document['_id'])})
        result.append(document)
    result.sort(key=lambda content: content["comment_count"],reverse=True)
    print(result)
    return jsonify({'contents': result})




if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)