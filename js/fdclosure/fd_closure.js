/**
 *
 */

function removeDups(str) {
	var attr = new HashSet();
	attr.addAll(str.split(""));
	return attr;
}

function FdPair(fdFrom, fdTo) { // both should be strings
	if (fdFrom.constructor === String && fdTo.constructor === String) {
		this.fdFrom = removeDups(fdFrom);
		this.fdTo = removeDups(fdTo);
	} else { // assume set as args
		this.fdFrom = fdFrom;
		this.fdTo = fdTo;
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
	var fromLen =fdFromArr.length;
	for (var i=0; i<fromLen; i++) {
		for (var len=1; len<=fromLen; len++) {
			fdFromArr[x]
			rv.push(new FdPair(fd.fdFrom, fd.fdTo))
		}
	}
	return rv;
}

function augmentation(fd, attr) { // fd: hashSet, attr: hashSet of attributes

}

function transivity(fd_A, fd_B) { // args are FdPair
	if(fd_A.fdTo.eqauls(fd_B.fdFrom))
		return [new FdPair(fd_A.fdFrom, fd_B.fdTo)];
	else if(fd_B.fdTo.eqauls(fd_A.fdFrom))
		return [new FdPair(fd_B.fdFrom, fd_A.fdTo)];
	else
		return null;
}
