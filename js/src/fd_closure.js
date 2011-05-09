/*
 * 
 * fd_closure.js - contains main algorithm for FD closure
 * Author: Yo Han Ko (yohanko1)
 * 
 */
JS.require('JS.Class', 'JS.Module', 'JS.Set', 'JS.Hash');
// Constructor
function FuncDep(fdFrom, fdTo) { // accepts arrays
	this.fdFrom = removeDups(fdFrom);
	//this.fdTo = differenceArray(removeDups(fdTo), this.fdFrom); 
	this.fdTo = removeDups(fdTo);

	this.toString = function () {
		return this.fdFrom.join("") + "->" + this.fdTo.join("");
	}
	this.equals = function(fd) {
		return (equalArray(this.fdFrom, fd.fdFrom) &&
			equalArray(this.fdTo, fd.fdTo));
	}
	this.forEach = function(block, context) {
		if(!block)
			return this.enumFor('forEach');
		for (var i = 0, n=this._list.length; i<n; i++)
			block.call(context || null, this._list[i]);

		return this;
	}
}
function main(output_div) {
    var outDiv = document.getElementById(output_div);
    if(document.getElementById(output_field_id)) {
        var child = document.getElementById(output_field_id);
        outDiv.removeChild(child);
    }
    
    var fdPairSet = processInput("attr","fdTo_", "fdFrom_");
    var fdClosureHash = fdClosure(toHash(fdPairSet));

    output(output_div, fdClosureHash);
}

// Main logic for FD closure
function fdClosure(fdPairHash) {
	var set = jQuery.extend(true, {}, fdPairHash);
	var old = null;

	while (!(set.equals(old))) {
		old = jQuery.extend(true, {}, set);
		old.forEachPair( function(from1, to1) {
			old.forEachPair( function(from2, to2) {
				if(equalArray(from1, from2)) {
					var i = "";
				} else if(equalArray(intersectArray(unionArray(from1,to1),from2),from2)) {
					set.store(from1, unionArray(set.get(from1), differenceArray(to2,from1)));
				} else {
					var temp = unionArray(from1, from2);
					var det = differenceArray(temp,to1);
					var dep = differenceArray(to2, det);
					set.store(det, unionArray(set.get(det), dep));
				}
			});
		});
	}

	old = null;
	while(!(set.equals(old))) {
		old = jQuery.extend(true, {}, set);
		old.forEachPair( function(from1, to1) {
			var implied = set.map(function(p) {
				if((!equalArray(from1, p.key)) &&
				equalArray(intersectArray(from1, p.key),p.key)) {
					return p.value;
				} else {
					return [];
				}
			});
			implied = removeDups(flatten(implied));
			if (equalArray(intersectArray(implied, to1),to1)) {
				set.remove(from1);
			}
			//console.log(implied);
		});
	}
	return set;
}

/*
 *
 * All auxiliary functions
 *
 */
function toHash(set) {
	var rv = new JS.Hash( function(hash, key) {
		var arr = new Array();
		hash.store(key, arr);
		return arr;
	});
	var arr = set.toArray();
	for (x in arr) {
		var from = arr[x].fdFrom;
		var to = arr[x].fdTo;
		rv.store(from, rv.get(from).concat(to));
	}

	rv.forEachPair( function(key, value) {
		rv.store(key, removeDups(value));
	});
	return rv;
}

function equalArray(array1, array2) {
	if(array1 == null || array2 == null)
		return false;
	var temp = new Array();
	if ( (!array1[0]) || (!array2[0]) ) { // If either is not an array
		return false;
	}
	if (array1.length != array2.length) {
		return false;
	}
	// Put all the elements from array1 into a "tagged" array
	for (var i=0; i<array1.length; i++) {
		key = (typeof array1[i]) + "~" + array1[i];
		// Use "typeof" so a number 1 isn't equal to a string "1".
		if (temp[key]) {
			temp[key]++;
		} else {
			temp[key] = 1;
		}
		// temp[key] = # of occurrences of the value (so an element could appear multiple times)
	}
	// Go through array2 - if same tag missing in "tagged" array, not equal
	for (var i=0; i<array2.length; i++) {
		key = (typeof array2[i]) + "~" + array2[i];
		if (temp[key]) {
			if (temp[key] == 0) {
				return false;
			} else {
				temp[key]--;
			}
			// Subtract to keep track of # of appearances in array2
		} else { // Key didn't appear in array1, arrays are not equal.
			return false;
		}
	}
	// If we get to this point, then every generated key in array1 showed up the exact same
	// number of times in array2, so the arrays are equal.
	return true;
}

function removeDups(arr) {
	var attr = new JS.Set(arr);
	return attr.toArray().sort(); // returns array
}

function differenceArray(arr1, arr2) {
	return ((new JS.Set(arr1)).difference(new JS.Set(arr2))).toArray().join("").split("");
}

function intersectArray(arr1, arr2) {
	return ((new JS.Set(arr1)).intersection(new JS.Set(arr2))).toArray().join("").split("");
}

function unionArray(arr1, arr2) {
	return ((new JS.Set(arr1)).union(new JS.Set(arr2))).toArray().join("").split("");
}

function flatten(array) {
	var flat = [];
	for (var i = 0, l = array.length; i < l; i++) {
		var type = Object.prototype.toString.call(array[i]).split(' ').pop().split(']').shift().toLowerCase();
		if (type) {
			flat = flat.concat(/^(array|collection|arguments|object)$/.test(type) ? flatten(array[i]) : array[i]);
		}
	}
	return flat;
}
