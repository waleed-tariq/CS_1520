function setup() {
	pollerCats();
	pollerPurch();
	document.getElementById("catButton").addEventListener("click", makeCat,true);
	document.getElementById("purchButton").addEventListener("click",makePurch,true);
	
}


function makeCat() {
	const catName = document.getElementById("catName").value;
	const budget = document.getElementById("budget").value;
	const amt_spent = document.getElementById("amt_spent").value;
	console.log("Top of post");
	fetch("/cats", {
		method:'POST',
		headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: `catName=${catName}&budget=${budget}&amt_spent=${amt_spent}`
	})
	.then((response) => {
		return response.json();
	})
	.then((result) => {
		console.log(`Got this response inside of POST for categories: ${JSON.stringify(result)}`);
		// updateTable(result);
		pollerCats();
		clearInput();
	})
	.catch((err) => {
		console.log(`Error polling for new todos: ${err}`);
	});
}

function makePurch() {
	const purchName = document.getElementById("purchName").value;
	const purchCat = document.getElementById("purchCat").value;
	const purchAmt = document.getElementById("purchAmt").value;
	const purchDate = document.getElementById("purchDate").value;
	console.log("Top of post for purchases");
	fetch("/purchases", {
		method:'POST',
		headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: `purchName=${purchName}&purchCat=${purchCat}&purchAmt=${purchAmt}&purchDate=${purchDate}`
	})
	.then((response) => {
		return response.json();
	})
	.then((result) => {
		console.log(`Got this response inside of POST for purchases: ${JSON.stringify(result)}`);
		// updateTable(result);
		pollerPurch();
		clearInput();
		pollerCats();
	})
	.catch((err) => {
		console.log(`Error polling for new todos: ${err}`);
	});
}

function pollerCats() {
	console.log("Polling for Categories");
	fetch("/cats", {
		method:"get"
	})
	.then((response) => {
		return response.json();
	})
	.then((response) => {
		console.log(`Got this response inside of GET for categories: ${JSON.stringify(response)}`);
		// return(JSON.stringify(response));
		updateTable(response);
		// Should repopulate the list
	})
	.catch((err) => {
		console.log(`Error polling for new todos: ${err}`);
	});
}

function pollerPurch() {
	console.log("Polling for Purchases");
	fetch("/purchases", {
		method:"get"
	})
	.then((response) => {
		return response.json();
	})
	.then((response) => {
		console.log(`Got this response inside of GET for purchases: ${JSON.stringify(response)}`);
		// return(JSON.stringify(response));
		updatePurchTable(response);
		// Should repopulate the list
	})
	.catch((err) => {
		console.log(`Error polling for new todos: ${err}`);
	});
}

function updateTable(result) {

	const tab = document.getElementById("categories");
	if (Object.keys(result).length > 0) {
		while (tab.rows.length > 0) {
			tab.deleteRow(0);
		}
		for (cat in result) {
			addRow(cat, result[cat]["budget"], result[cat]["amt_spent"]);
		}
	}
	else {
		while (tab.rows.length > 0) {
			tab.deleteRow(0);
		}
	}

}

function addRow(row1,row2,row3) {
	const tableRef = document.getElementById("categories");
	const newRow = tableRef.insertRow();

	const newCell = newRow.insertCell();
	const newText1 = document.createTextNode(row1+": $");
	newCell.appendChild(newText1);
	const newText3 = document.createTextNode(row3+"/$");
	newCell.appendChild(newText3);
	const newText2 = document.createTextNode(row2);
	newCell.appendChild(newText2);
	var deleteBtn = document.createElement("BUTTON");
	deleteBtn.innerText = "Delete Category";
	deleteBtn.setAttribute('id',`delete${row1}`);
	deleteBtn.addEventListener("click",() => deleteCat(row1),true);
	newCell.appendChild(deleteBtn);
	
}


function updatePurchTable(result) {

	const tab = document.getElementById("purchases");
	if (Object.keys(result).length > 0) {
		while (tab.rows.length > 0) {
			tab.deleteRow(0);
		}
		for (purch in result) {
			addPurchRow(purch, result[purch]["purchCat"], result[purch]["purchAmt"], result[purch]["purchDate"]);
		}
	}

}
function addPurchRow(row1,row2,row3,row4) {
	const tableRef = document.getElementById("purchases");
	const newRow = tableRef.insertRow();

	const newCell = newRow.insertCell();
	const newText1 = document.createTextNode(row2+": ");
	newCell.appendChild(newText1);
	const newText3 = document.createTextNode(row1+": $");
	newCell.appendChild(newText3);
	const newText2 = document.createTextNode(row3+ " Date: ");
	newCell.appendChild(newText2);
	const newText4 = document.createTextNode(row4);
	newCell.appendChild(newText4);
	
}

function deleteCat(catName) {
	console.log("Deleting category " +catName);

	fetch("/cats/"+catName, {
		method: "delete"
	})
	.then((response) => {
		pollerCats();
	})
	.catch((err) => {
		console.log(`Error TRYING TO DELETE: ${err}`);
	});
}

function clearInput() {
	document.getElementById("catName").value = "";
	document.getElementById("budget").value = "";
	document.getElementById("amt_spent").value = "";

	document.getElementById("purchName").value = "";
	document.getElementById("purchAmt").value = "";
	document.getElementById("purchDate").value = "";
	document.getElementById("purchCat").value = "";

}

window.addEventListener("load", setup);