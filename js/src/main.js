/*
 * 
 * main.js - takes care of input and output
 * Author: Yo Han Ko (yohanko1)
 * 
 */
var output_field_id = "output_field";
var target_attr = null;

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

function processInput(attr, fdToIdPrefix, fdFromIdPrefix) {
        // check for target attr 
        var attrField = document.getElementById(attr);
        target_attr = attrField.value;

        // now check for FD
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

function hasEmptyBox(fromField, toField, lastIndex) {
        for(var i=lastIndex; i>0; --i) {
            var fromElem = document.getElementById(fromField+i);
            var toElem = document.getElementById(toField+i);
            if (fromElem == null || toElem == null)
                continue;
           if(fromElem.value == "" && toElem.value == "")
                return true;
        }
        return false;
}

function addField(area,fromField,toField, field, limit) {
	var field_area = document.getElementById(area);
        var lastIndex = (field_area.getElementsByTagName("input").length)/2;
	
        var arr = new String(field.id).split("_");
	var count = Number(arr[1])+1;
	var next = arr[0] + "_" + count;

	if(hasEmptyBox(fromField, toField, lastIndex))
		return;
        
        var fromElem = document.getElementById(fromField+count);
        var toElem = document.getElementById(toField+count);
        if(fromElem != null || toElem != null)
            return;
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

function attrClosure(attr, fdHash) {
    if (attr != null && attr != "") {
        var attr_closure = attr;
        for(var start=0; start<=attr.length; start++ ) {
            for(var end=start+1; end<=attr.length; end++ ) {
                var toValue = fdHash.get(attr.slice(start,end).split(""));
                attr_closure += toValue.join("");
            }
        }
        attr_closure = new JS.Set(attr_closure);
        attr_closure = attr_closure.toArray().join("");

        return attr_closure;
    }

    return "";
}

function output(output_div, fdHash) {
    var outputElem = document.createElement("div");
    outputElem.id = output_field_id;
    var brElem = document.createElement('br');

    // attr closure
    if (target_attr != null && target_attr != "") {
        var attr_closure = target_attr;
        for(var start=0; start<=target_attr.length; start++ ) {
            for(var end=start+1; end<=target_attr.length; end++ ) {
                var toValue = fdHash.get(target_attr.slice(start,end).split(""));
                attr_closure += toValue.join("");
            }
        }
        attr_closure = new JS.Set(attr_closure);
        attr_closure = attr_closure.toArray().join("");

        outputElem.appendChild(document.createTextNode("Closure of "+target_attr+" is "+attr_closure));
    }

    // fd closure
    outputElem.appendChild(brElem.cloneNode(true));
    outputElem.appendChild(document.createTextNode("FD Closure"));
    var list = document.createElement("ul");
    list.id = "fd_list";
    
    fdHash.forEachPair(function(key,value) {
            if (key.length == 0 || value.length == 0){
            	var i = 0; // place holder...	
            } else {
            var elem = document.createElement("li");
            elem.appendChild(document.createTextNode(key.sort().join("")+"->"+value.sort().join("")));
            list.appendChild(elem);
            }
    });
    outputElem.appendChild(list);

    document.getElementById(output_div).appendChild(outputElem);
}
