/*
 * 
 * main.js - takes care of input and output
 * Author: Yo Han Ko (yohanko1)
 * 
 */
var output_field_id = "fd_closure_list";

function main(output_div) {
    var outDiv = document.getElementById(output_div);
    if(document.getElementById(output_field_id)) {
        var child = document.getElementById(output_field_id);
        outDiv.removeChild(child);
    }
    
    var fdPairSet = processInput("fdTo_", "fdFrom_");
    var fdClosureSet = fdClosure(fdPairSet)

    output(output_div, fdClosureSet);
}

function validate(input) {
    input.value = input.value.toUpperCase();
        
    var str = input.value;
    var str2 = str;
    var len = str.length;
            
    // Text Validation
    for(var i=0; i<len; i++)
    {
        var c = str2.charAt(i);
        if(!(c >= 'A' && c <= 'Z'))   
        {
           str = str.replace(c, "");
        }
    }
    input.value = str;
}


// assume input is validated...
function processInput(fdToIdPrefix, fdFromIdPrefix) {
	var fds = new JS.Set();
	var fdIndex = 1; // start from 1 !
	while(true) {
		var fdFromField = document.getElementById(fdFromIdPrefix+fdIndex);
		var fdToField = document.getElementById(fdToIdPrefix+fdIndex);
		fdIndex++;
		if(fdToField == null || fdFromField == null)
			break;

		if(fdFromField.value == "" || fdToField.value == "")
			continue;
		
		// don't add if already exist
		var currPair = new FuncDep(fdFromField.value.split(""), fdToField.value.split("")); 
		fds.add(currPair);
	}
	return fds; 
}


function addField(area,fromField,toField, field, limit) {

	var field_area = document.getElementById(area);
	var all_inputs = field_area.getElementsByTagName("input");
	var last_item = all_inputs.length - 1;
	var last = all_inputs[last_item].id;
	var count = Number(last.split("_")[1]) + 1;
	
	var next = (new String(field.id)).split("_")[0] + "_" + (count);
	if(document.getElementById(next))
		return;
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
		fdFrom.onkeyup = function() {
			validate(this);
		}; 
		var maps = document.createElement("font");
		maps.setAttribute("face","Symbol");
		maps.appendChild(document.createTextNode(" \u2192 "));
		//<font face="Symbol">&rarr;</font>

		var fdTo = document.createElement("input");
		fdTo.type = "text";
		fdTo.id = toField+count;
		fdTo.name = toField+count;
		fdTo.onkeyup = function() {
			validate(this);
		};
		fdTo.onfocus =function() {
			addField('fd_list','fdFrom_','fdTo_', this, 20);
		}; 

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

function output(output_div, fdHash) {
    var list = document.createElement("ul");
    list.id = output_field_id;
    
    fdHash.forEachPair(function(key,value) {
            if (key.length == 0 || value.length == 0){
            	var i = 0; // place holder...	
            } else {
            var elem = document.createElement("li");
            elem.appendChild(document.createTextNode(key.sort()+"->"+value.sort()));
            list.appendChild(elem);
            }
            });

    document.getElementById(output_div).appendChild(list);
}
