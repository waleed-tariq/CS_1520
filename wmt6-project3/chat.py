import json
from flask import Flask, request, abort, url_for, redirect, session, render_template, flash, g
from flask_sqlalchemy import SQLAlchemy
import time
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
# feature we don't need that is being deprecated upstream by sqlaclchemy
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class User(db.Model):
	user_id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(80), unique=True)
	password = db.Column(db.String(120), unique=True)
	messages = db.relationship('Message', backref='user',lazy='dynamic')
	rooms = db.relationship('Room', backref='user',lazy='dynamic')

	def __init__(self, username, password):
		self.username = username
		self.password = password

messages = db.Table('messages',
			db.Column('message_id',db.Integer,db.ForeignKey('message.message_id')),
			db.Column('room_id',db.Integer,db.ForeignKey('room.room_id'))
)

class Message(db.Model):
	message_id = db.Column(db.Integer, primary_key=True)
	message = db.Column(db.String(150))
	user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
	room_id = db.Column(db.Integer, db.ForeignKey('room.room_id'))

	def __init__(self, message):
		self.message = message

		
class Room(db.Model):
	room_id = db.Column(db.Integer, primary_key=True)
	roomName = db.Column(db.String(150))
	user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
	messages = db.relationship('Message',secondary=messages, backref=db.backref('rooms',lazy='dynamic'))

	def __init__(self, roomName):
		self.roomName = roomName

@app.cli.command('initdb')
def initdb_command():
	"""Reinitializes the database"""
	db.drop_all()
	db.create_all()

	db.session.commit()
	print('Initialized database')


@app.cli.command('check')
def check():
	waleed = User("waleed","w")
	db.session.add(waleed)
	tariq = User("tariq","t")
	db.session.add(tariq)
	waleed.messages.append(Message("hey guys!"))
	newMessage = Message("How is everyone doing?")
	db.session.add(newMessage)
	newMessage.user = waleed
	room1 = Room("room 1")
	db.session.add(room1)
	room2 = Room("room 2")
	db.session.add(room2)
	waleed.rooms.append(room1)
	room1.messages.append(newMessage)
	# room1.messages.append(Message("what up boi"))
	newMessage2 = Message("hiya")
	db.session.add(newMessage2)
	tariq.messages.append(newMessage2)
	room2.messages.append(newMessage2)
	newMessage3 = Message("hey waleed")
	tariq.messages.append(newMessage3)
	room1.messages.append(newMessage3)

	db.session.commit()

	r = Room.query.filter_by(roomName="room 1").first()
	for t in r.messages:
		print(t.message)

	print("\n\nChatRooms:")
	rooms = Room.query.all()
	for p in rooms:
		print("\tRoomName:", p.roomName)
		for t in p.messages:
			idofUser = t.user_id
			user = User.query.filter_by(user_id=idofUser).first()
			print("\t\t",user.username,": ",t.message)
			# print("\t\tMessages: ", t.message)


def get_user_id(username):
	"""Convenience method to look up the id for a username."""
	rv = User.query.filter_by(username=username).first()
	return rv.user_id if rv else None


@app.route('/')
def default():
	return render_template("base.html");



@app.route("/login/", methods=["GET", "POST"])
def login():
	if request.method == 'POST':
		user = User.query.filter_by(username=request.form['user']).first()
		if user is None:
			error = "Invalid username"
		elif not (user.password == request.form["pass"]):
			error = "Invalid Password"
		else:
			flash("You are logged in")
			session["username"] = user.username
			return redirect(url_for('profile', username=session["username"]))
	return render_template('loginPage.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
	flash("inside register")
	if request.method == 'POST':
		if not request.form['username']:
			error = 'You have to enter a username'
		elif not request.form['password']:
			error = 'You have to enter a password'
		elif request.form['password'] != request.form['password2']:
			flash('The two passwords do not match')
		elif get_user_id(request.form['username']) is not None:
			error = 'The username is already taken'
		else:
			db.session.add(User(request.form['username'], request.form['password']))
			db.session.commit()
			flash('You were successfully registered and can login now')
			return redirect(url_for('login'))
	return render_template('register.html')


@app.route("/profile/<username>", methods=['GET', 'POST'])
def profile(username=None):
	users = User.query.all()
	userEvent = User.query.filter_by(username=username).first()
	timeline_ids = [userEvent.user_id]


	if request.method == 'POST':
		newRoom = Room(request.form["roomName"])
		newRoom.user = userEvent
		db.session.add(newRoom)
		db.session.commit()
		allRooms = Room.query.all()
		rooms = Room.query.filter(Room.user_id.in_(timeline_ids)).all()
		return render_template("profile.html",username=session["username"],rooms=rooms,per=users,allRooms=allRooms)
	if not username:
		return redirect(url_for("default"))
	elif "username" in session:
		if session["username"] == username:
			allRooms = Room.query.all()
			rooms = Room.query.filter(Room.user_id.in_(timeline_ids)).all()
			return render_template("profile.html",username=session["username"],rooms=rooms,per=users,allRooms=allRooms)
	else:
		abort(404)


@app.route("/profile/<username>/<rID>/delete")
def deleteRoom(rID=None,username=None):
	r = Room.query.filter_by(room_id=rID).first()
	msgs = r.messages;
	for m in msgs:
		Message.query.filter_by(message=m.message).delete()
	Room.query.filter_by(room_id=rID).delete()
	db.session.commit()
	return redirect(url_for('profile',username=username))


@app.route("/<username>/<roomName>")
def chatRoom(username=None,roomName=None):
	try:
		room = Room.query.filter_by(roomName=roomName).first()
		
		session["roomName"] = room.roomName
		msgs = room.messages

		return render_template("chatRoom.html",username=username,room=roomName,messages=msgs)
	except:
		return redirect(url_for("room_deleted",username=username))

@app.route("/new_item", methods=["POST"])
def add():
	r = Room.query.filter_by(roomName=session["roomName"]).first()
	m = session["username"] + ": " + request.form["a"] 
	message = Message(m)
	u = User.query.filter_by(username=session["username"]).first()
	u.messages.append(message)
	
	r.messages.append(message)
	db.session.commit()

	liMessages = []
	for t in r.messages:
		liMessages.append(t.message)

	return json.dumps(liMessages)


@app.route("/items")
def get_items():
	try:
		r = Room.query.filter_by(roomName=session["roomName"]).first()
		liMessages = []
		for t in r.messages:
			liMessages.append(t.message)
		return json.dumps(liMessages)
	except:
		return redirect(url_for("room_deleted",username=session["username"]))


@app.route("/<username>/roomDeletion", methods=['GET', 'POST'])
def room_deleted(username=None):
	users = User.query.all()
	userEvent = User.query.filter_by(username=username).first()
	timeline_ids = [userEvent.user_id]
	if request.method == 'POST':
		newRoom = Room(request.form["roomName"])
		newRoom.user = userEvent
		db.session.add(newRoom)
		db.session.commit()
		allRooms = Room.query.all()
		rooms = Room.query.filter(Room.user_id.in_(timeline_ids)).all()
		return render_template("profile.html",username=session["username"],rooms=rooms,per=users,allRooms=allRooms)

	users = User.query.all()
	userEvent = User.query.filter_by(username=username).first()
	timeline_ids = [userEvent.user_id]
	allRooms = Room.query.all()
	rooms = Room.query.filter(Room.user_id.in_(timeline_ids)).all()
	error = "Room Deleted!"
	return render_template("profile.html",username=username,rooms=rooms,per=users,allRooms=allRooms,error=error)

@app.route("/logout/")
def unlogger():

	# note, here were calling the .clear() method for the python dictionary builtin
	session.clear()
	return render_template("base.html")

app.secret_key = "this is a terrible secret key"
			
if __name__ == "__main__":
	app.run()

