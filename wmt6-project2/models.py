from flask import Flask
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class User(db.Model):
	__tablename__ = 'user'
	user_id = db.Column(db.Integer,primary_key=True)
	username = db.Column(db.String(24))
	password = db.Column(db.String(24))
	#events = db.relationship("Event", backref="user",lazy="dynamic")

	def __init__(self,user_id,username,password):
		self.user_id = user_id
		self.username = username
		self.password = password


class Event(db.Model):
	__tablename__ = 'events'
	event_id = db.Column(db.Integer, primary_key=True)
	customer_id = db.Column(db.Integer,db.ForeignKey('user.user_id'))
	eventName = db.Column(db.String(50))

	def __init__(self, event_id,customer_id,eventName):
		self.event_id = event_id
		self.customer_id = customer_id
		self.eventName = eventName

