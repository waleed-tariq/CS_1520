import json
from flask import Flask, request, abort, url_for, redirect, session, render_template, flash, g
from datetime import date

app = Flask(__name__)

CATS = {}


PURCHASES = {}

@app.route("/")
def set_app():
	return render_template("home.html")

@app.route("/cats", methods=["GET"])
def cats_get():
	# Flask automatically jsonify's dictionaries
	return CATS

@app.route("/cats", methods=["POST"])
def cats_post():

	CATS[request.form["catName"]]={"budget":request.form["budget"],"amt_spent":request.form["amt_spent"]}
	return {request.form['catName']: CATS[request.form['catName']]}, 201

@app.route("/cats/<cat_id>", methods=["DELETE"])
def single_delete_cats(cat_id=None):
	del CATS[cat_id]

	return "", 204

@app.route("/purchases", methods=["GET"])
def purchases_get():
	# Flask automatically jsonify's dictionaries
	return PURCHASES

@app.route("/purchases", methods=["POST"])
def purchases_post():

	PURCHASES[request.form["purchName"]] = {"purchCat":request.form["purchCat"],"purchAmt":request.form["purchAmt"],"purchDate":request.form["purchDate"]}

	###### CHECK TO SEE IF PURCHCAT IS EQUAL TO NONE AND THEN ADD TO UNCATEGORIZED/MISC #######

	# update the CATS json
	amt = int(request.form["purchAmt"])
	purchDate = request.form['purchDate']
	today = date.today()
	currentDate = today.strftime("%Y-%m-%d")

	currentMonthArr = currentDate.split('-')
	currentMonth = currentMonthArr[1]
	currentYear = currentMonthArr[0]
	monthPurchArr = purchDate.split('-')
	monthPurch = monthPurchArr[1]
	yearPurch = monthPurchArr[0]

	if currentMonth != monthPurch or currentYear != yearPurch:
		return {request.form['purchName']: PURCHASES[request.form['purchName']]}, 201

	found = False;
	for a in CATS:
		print(a)
		if a == request.form['purchCat']:
			amt_spent = int(CATS[a]['amt_spent'])
			newPrice = amt+amt_spent
			CATS[a]['amt_spent'] = newPrice
			found = True;
			break
	if not found:
		CATS['Uncategorized']={"budget":"unlimited","amt_spent":amt}

	return {request.form['purchName']: PURCHASES[request.form['purchName']]}, 201


if __name__ == "__main__":
	app.run(debug=True)