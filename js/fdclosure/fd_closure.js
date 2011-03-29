/**
 *
 */

function removeDups(str) {
	var attr = new HashSet();
	attr.addAll(str.split(""));
	return attr;
}

function FdPair(fdFrom, fdTo) {
	this.fdFrom = null;
	this.fdTo = null;
	if (fdFrom.constructor === String && fdTo.constructor === String) {
		this.fdFrom = removeDups(fdFrom);
		this.fdTo = removeDups(fdTo);
	} else { // assume set as args
		this.fdFrom = fdFrom;
		this.fdTo = fdTo;
	}

	this.values = function () {
		return [this.fdFrom.values(), this.fdTo.values()];	
	};

	// not sure...
	this.equals = function (fdPair) {
		return deepEqual(this,fdPair,"");
	}
}

function fdClosure(fdPairArr) {
	var closureArr = fdPairArr;

	/*
 	done:
 	while(true) {
 	for (x in closureArr) {
 	closureArr.push(new FdPair("liojoef", "ljdoifj"));
 	if(closureArr.length > 5) {
 	break done;
 	}
 	}

 	}
 	*/

	return closureArr;
}

/*
 * all inference rules returns array of FdPairs
 */
function reflexivity(fd) { // FdPair
	// generate trivial fd's
	var rv = new Array();
	var fdFromArr = fd.values();
	// note that we don't care about fdTo values
	var fromLen =fdFromArr.length;
	for (var start=0; start<fromLen; start++) {
		for (var end=start+1; end<=fromLen; end++) {
			var to = fdFromArr.slice(start, end).join("");
			rv.push(new FdPair(fd.fdFrom.join(""), to));
		}
	}
	return rv;
}

function augmentation(fd, attr) { // fd: hashSet, attr: hashSet of attributes
	var attrArr = attr.values();
	var attrLen = attrArr.length();
	var from = fd.fdFrom.values().join("");
	var to = fd.fdTo.values().join("");

	for (var start=0; start<attrLen; start++) {
		for (var end=start+1; end<=attrLen; end++) {
			// doc says shallow copy!??! but looks like deep copy...
			rv.push(new FdPair(
				from.concat(attrArr.slice(start,end)),to));
		}
	}
}

function transivity(fd_A, fd_B) { // args are FdPair
	if(fd_A.fdTo.eqauls(fd_B.fdFrom))
		return [new FdPair(fd_A.fdFrom, fd_B.fdTo)];
	else if(fd_B.fdTo.eqauls(fd_A.fdFrom))
		return [new FdPair(fd_B.fdFrom, fd_A.fdTo)];
	else
		return null;
}
