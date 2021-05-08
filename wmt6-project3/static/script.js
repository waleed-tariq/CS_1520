let timeoutID;
let timeout = 1000;

function setup() {
	document.getElementById("theButton").addEventListener("click", makePost, true);
	timeoutID = window.setTimeout(poller, timeout);
}

function makePost() {
	console.log("Sending POST request");
	const a = document.getElementById("a").value
	// var d = new Date();
	// var t = d.getTime();
	
	fetch("/new_item", {
			method: "post",
			headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
			body: `a=${a}`
		})
		.then((response) => {
			return response.json();
		})
		.then((result) => {
			updateTable(result);
			clearInput();
		})
		.catch(() => {
			console.log("Error posting new items!");
		});
}

function poller() {
	fetch("/items")
		.then((response) => {
			return response.json();
		})
		.then(updateTable)
		.catch(() => {
			console.log("Error fetching items!");
		});
}

function updateTable(result) {
	// console.log("Updating the table");
	// console.log(result);
	// var tab = document.getElementById("roomMessage");
	// var li = document.createElement('li');
	// var textNode = document.createTextNode(result)
	// tab.appendChild(li).appendChild(textNode);
	
	// timeoutID = window.setTimeout(poller, timeout);

	const tab = document.getElementById("roomMessage");
	if (result.length > 0) {
		while (tab.rows.length > 0) {
			tab.deleteRow(0);
		}
		for (var i = 0; i < result.length; i++) {
			addRow(result[i]);
		}
	}
	timeoutID = window.setTimeout(poller, timeout);

}

function addRow(row) {
	const tableRef = document.getElementById("roomMessage");
	const newRow = tableRef.insertRow();

	
		const newCell = newRow.insertCell();
		const newText = document.createTextNode(row);
		newCell.appendChild(newText);
	
}


function clearInput() {
	document.getElementById("a").value = "";

}

window.addEventListener("load", setup, true);