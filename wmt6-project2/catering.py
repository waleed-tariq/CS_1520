from flask import Flask, request, abort, url_for, redirect, session, render_template, flash
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///catering.db'
# feature we don't need that is being deprecated upstream by sqlaclchemy
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class User(db.Model):
	user_id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(80), unique=True)
	password = db.Column(db.String(120), unique=True)
	events = db.relationship('Event', backref='user',lazy='dynamic')

	def __init__(self, username, password):
		self.username = username
		self.password = password
		
	def __repr__(self):
		return '%r' % self.username

staffs = db.Table('staffs',
			db.Column('staff_id',db.Integer,db.ForeignKey('staff.staff_id')),
			db.Column('event_id',db.Integer,db.ForeignKey('event.event_id'))
)

class Staff(db.Model):
	staff_id = db.Column(db.Integer, primary_key=True)
	usernameStaff = db.Column(db.String(80), unique=True)
	passwordStaff = db.Column(db.String(120), unique=True)	

	def __init__(self, usernameStaff, passwordStaff):
		self.usernameStaff = usernameStaff
		self.passwordStaff = passwordStaff
		
	def __repr__(self):
		return '%r' % self.usernameStaff

class Event(db.Model):
	event_id = db.Column(db.Integer, primary_key=True)
	eventName = db.Column(db.String(50))
	eventDate = db.Column(db.String(50))
	user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
	staffs = db.relationship('Staff',secondary=staffs, backref=db.backref('events',lazy='dynamic'))

	def __init__(self, eventName, eventDate):
		self.eventName = eventName
		self.eventDate = eventDate


def displayResult(num, res):
	print("\nQ{}:\n".format(num), res, "\n\n")

@app.cli.command('initdb')
def initdb_command():
	"""Reinitializes the database"""
	db.drop_all()
	db.create_all()
	db.session.add(User("owner","pass"))

	db.session.commit()
	print('Initialized database')

@app.cli.command('check')
def check():
	newlist = ["hi", "goodbye"]
	print(newlist)
	print(newlist[0])
	if 'hi' in newlist:
		print("hi")
	else:
		print("goodbye")

	waleed = User("waleed","w")
	db.session.add(waleed)
	waleed.events.append(Event("wedding","2021-03-22"))
	newEvent = Event("grad party 2.0","2021-03-25")
	db.session.add(newEvent)
	newEvent.user = waleed

	tariq = User("tariq","t")
	db.session.add(tariq)
	tariq.events.append(Event("party","2021-03-29"))
	newEvent2 = Event("grad party3.0","2021-03-25")
	db.session.add(newEvent)
	newEvent2.user = tariq

	staff1 = Staff("staff1","staff")
	staff2 = Staff("staff2","staff2")

	newEvent.staffs.append(staff1)
	newEvent.staffs.append(staff2)

	staff1.events.append(newEvent2)

	staff2.events.append(newEvent2)

	db.session.commit()

	waleedId = waleed.user_id
	print(waleedId)

	db.session.commit()

	stafferJakowski = Staff.query.filter_by(usernameStaff="staff1").first()

	for a in waleed.events:
		print("\taddresses:")
		print("\t\t", a.eventName)
		print("\t\t", a.eventDate)
		print("\t\t", a.staffs)
		if stafferJakowski in a.staffs:
			print("winner winner chicken dinner")
	for a in tariq.events:
		print("\taddresses:")
		print("\t\t", a.eventName)
		print("\t\t", a.eventDate)
		print("\t\t", a.staffs)
		if stafferJakowski in a.staffs:
			print("winner winner chicken dinner")

	print("\n\nStaff:")
	pages = Staff.query.all()
	for p in pages:
		print("\tname:", p.usernameStaff)
		for t in p.events:
			print("\t\tevents:  ", t.eventName)

	staffer = Staff.query.filter_by(usernameStaff="staff1").first()
	for p in staffer.events:
		print(p.eventName)

	print(len(newEvent.staffs))


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


@app.route("/loginStaff/", methods=["GET", "POST"])
def loginStaff():
	if request.method == 'POST':
		staff = Staff.query.filter_by(usernameStaff=request.form['user']).first()
		if staff is None:
			error = "Invalid username"
		elif not (staff.passwordStaff == request.form["pass"]):
			error = "Invalid Password"
		else:
			flash("You are logged in")
			session["usernameStaff"] = staff.usernameStaff
			return redirect(url_for('staffProfile', username=session["usernameStaff"]))
	return render_template('loginPageStaff.html')


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


@app.route("/<username>/registerStaff", methods=['GET', 'POST'])
def registerStaff(username=None):
	if request.method == 'POST':
		if not request.form['usernameStaff']:
			error = 'You have to enter a username'
		elif not request.form['passwordStaff']:
			error = 'You have to enter a password'
		elif request.form['passwordStaff'] != request.form['password2Staff']:
			flash('The two passwords do not match')
		elif get_user_id(request.form['usernameStaff']) is not None:
			error = 'The username is already taken'
		else:
			db.session.add(Staff(request.form['usernameStaff'], request.form['passwordStaff']))
			db.session.commit()
			flash('You were successfully registered and can login now')
			return redirect(url_for('profile',username=session["username"]))
	return render_template("registerStaff.html",username=session["username"])


@app.route("/profile/<username>/<eID>/delete")
def deleteEvent(eID=None,username=None):
	Event.query.filter_by(event_id=eID).delete()
	db.session.commit()
	return redirect(url_for('profile',username=username))


@app.route("/admin", methods=['GET', 'POST'])
def adminProfile(username=None):
	if request.method == 'POST':
		per = User.query.all()
		return render_template("adminProfile.html",username=session["username"],per=per)
	if not username:
		return redirect(url_for("default"))
	elif "username" in session:
		if session["username"] == username:
			per = User.query.all()
			return render_template("adminProfile.html",username=session["username"],per=per)
	elif "usernameStaff" in session:
		if session["usernameStaff"] == username:
			per = User.query.all()
			return render_template("staffProfile.html",username=session["usernameStaff"],per=per)
	else:
		abort(404)


@app.route("/staff/<username>", methods=['GET', 'POST'])
def staffProfile(username=None):
	staffer = Staff.query.filter_by(usernameStaff=username).first()
	if request.method == 'POST':
		per = User.query.all()
		return render_template("staffProfile.html",username=session["usernameStaff"],per=per,userNm=staffer)
	if not username:
		return redirect(url_for("default"))
	elif "username" in session:
		if session["username"] == username:
			return render_template("adminProfile.html",username=session["username"],per=per)
	elif "usernameStaff" in session:
		if session["usernameStaff"] == username:
			per = User.query.all()
			staffName = Staff.query.all()
			return render_template("staffProfile.html",username=session["usernameStaff"],per=per,userNm=staffer)
	else:
		abort(404)


@app.route("/staff/<username>/<eventID>/adding")
def addEvent(username=None,eventID=None):
	staffMember = Staff.query.filter_by(usernameStaff=username).first()
	eventNew = Event.query.filter_by(event_id=eventID).first()
	staffMember.events.append(eventNew)
	db.session.commit()
	return redirect(url_for('staffProfile',username=session["usernameStaff"]))


@app.route("/profile/<username>", methods=['GET', 'POST'])
def profile(username=None):
	users = User.query.all()
	
	userEvent = User.query.filter_by(username=username).first()
	timeline_ids = [userEvent.user_id]
	if request.method == 'POST':
		if not request.form['eventName']:
			per = User.query.all()
			messages = Event.query.filter(Event.user_id.in_(timeline_ids)).all()
			return render_template("curProfile.html",username=session["username"],messages=messages)
		else:
			# CHECK TO MAKE SURE THE DATES ARE NOT ALREADY IN THE DATABASE
			# GET LIST OF ALL DATES FROM QUERY AND THEN MAKE A SET AND THEN CHECK TO SEE IF SET CONTAINS NEW DATE

			per = User.query.all()
			for p in per:			
				for a in p.events:
					if a.eventDate == request.form['eventDate']:
						error = 'There is already an event on this date'
						timeline_ids = [userEvent.user_id]
						messages = Event.query.filter(Event.user_id.in_(timeline_ids)).order_by(Event.eventDate).all()
						return render_template("curProfile.html",error=error,username=session["username"],messages=messages)
			
			newEvent = Event(request.form['eventName'], request.form['eventDate'])
			newEvent.user = userEvent
			db.session.add(newEvent)
			db.session.commit()
			
			messages = Event.query.filter(Event.user_id.in_(timeline_ids)).all()
			return render_template("curProfile.html",username=session["username"],messages=messages)
	if not username:
		return redirect(url_for("default"))
	elif "username" in session:
		if session["username"] == username:
			if username=="owner":
				per = User.query.all()
				return render_template("adminProfile.html",username=session["username"],per=per)
			messages = Event.query.filter(Event.user_id.in_(timeline_ids)).all()
			return render_template("curProfile.html",username=session["username"],messages=messages)
	elif "usernameStaff" in session:
		if session["usernameStaff"] == username:
			return render_template("curProfile.html",username=session["usernameStaff"])
	else:
		abort(404)


@app.route("/logout/")
def unlogger():

	# note, here were calling the .clear() method for the python dictionary builtin
	session.clear()
	return render_template("base.html")


# needed to use sessions
# note that this is a terrible secret key
app.secret_key = "this is a terrible secret key"
			
if __name__ == "__main__":
	app.run()