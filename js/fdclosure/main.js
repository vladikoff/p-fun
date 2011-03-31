/**
 *
 */
var gInitialCall = true;

function inputValidation(input) {
}

function main(outputFieldId) {
	if(gInitialCall == false)
		return;
	gInitialCall = false;

	var fdPairSet = processInput("fdTo_", "fdFrom_");
	var fdClosureSet = fdClosure(fdPairSet)

	output(outputFieldId, fdClosureSet);
}

// assume input is validated...
function processInput(fdToIdPrefix, fdFromIdPrefix) {
	var fdPairs = new HashSet();
	var fdIndex = 1; // start from 1 !
	while(true) {
		var fdFromField = document.getElementById(fdFromIdPrefix+fdIndex);
		var fdToField = document.getElementById(fdToIdPrefix+fdIndex);
		fdIndex++;
		if(fdToField == null || fdFromField == null)
			break;

		if(fdFromField.value == "" || fdToField.value == "")
			continue;
		
		fdPairs.add(new FdPair(fdFromField.value, fdToField.value));
	}
	return fdPairs; // array of fd's (from->to pairs)
}


function addField(area,fromField,toField,limit) {
	if(!document.getElementById)
		return; //Prevent older browsers from getting any further.
	var field_area = document.getElementById(area);
	var all_inputs = field_area.getElementsByTagName("input"); //Get all the input fields in the given area.
	//Find the count of the last element of the list. It will be in the format '<field><number>'. If the
	//		field given in the argument is 'friend_' the last id will be 'friend_4'.
	var last_item = all_inputs.length - 1;
	var last = all_inputs[last_item].id;
	var count = Number(last.split("_")[1]) + 1;

	//If the maximum number of elements have been reached, exit the function.
	//		If the given limit is lower than 0, infinite number of fields can be created.
	if(count > limit && limit > 0)
		return;

	if(document.createElement) { //W3C Dom method.
		var li = document.createElement("li");
		var fdFrom = document.createElement("input");
		fdFrom.type = "text";
		fdFrom.id = fromField+count;
		fdFrom.name = fromField+count;

		var maps = document.createTextNode(" -> ")

		var fdTo = document.createElement("input");
		fdTo.type = "text";
		fdTo.id = toField+count;
		fdTo.name = toField+count;

		var fdRemove = document.createElement("a");
		fdRemove.textContent = "Remove FD";
		fdRemove.style.color = "blue";
		fdRemove.style.cursor = "pointer"
		fdRemove.onclick = function() {
			this.parentNode.parentNode.removeChild(this.parentNode)
		};
		li.appendChild(fdFrom);
		li.appendChild(maps);
		li.appendChild(fdTo);
		li.appendChild(fdRemove);
		field_area.appendChild(li);

	} else { //Older Method
		field_area.innerHTML += "<li><input name='"+(field+count)+"' id='"+(field+count)+"' type='text' /></li>";
	}
}

function output(outputFieldId, fdPairSet) {
	document.getElementById(outputFieldId).appendChild(document.createTextNode("FD closure"));
	var maps = "->";

	var arr = fdPairSet.values();
	for (var i in arr) {
		var elem = document.createElement("li");
		elem.appendChild(document.createTextNode(
			arr[i].fdFrom.values()+maps+arr[i].fdTo.values()));
		document.getElementById(outputFieldId).appendChild(elem);
	}
}
