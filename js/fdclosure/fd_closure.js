function FdPair(fdFrom, fdTo) {
	this.fdFrom = null;
	this.fdTo = null;
	if (fdFrom.constructor === String && fdTo.constructor === String) {
		this.fdFrom = removeDups(fdFrom);
		this.fdTo = removeDups(fdTo);
	} else { // assume set 
		this.fdFrom = fdFrom;
		this.fdTo = fdTo;
	}

	this.values = function () {
		// note 2d-array!
		return [this.fdFrom.values().sort(), this.fdTo.values().sort()];	
	};

	this.toString = function() {
		return this.fdFrom.values() + "->" + this.fdTo.values();
	};
}

/*
  while(true) 
    for_each D in F+: 
      apply reflexivity and augmentation to D 
      add the new FD's to F+ 

    for_each pair P of FD's in F+: 
      apply the transitivity rule to P 
      add the new FD's to F+ 
  break when F+ no longer changes
*/
function fdClosure(fdPairSet) {
	var closureSet = fdPairSet;
	var prevSize = fdPairSet.size();

 	done:
 	while(true) {
		for (x in closureSet) {
						

		}

/*
		for () {

		}

		if(prevSize == )
			break done;
*/
 	}

	return closureSet;
}

/*
 * all inference rules returns array of FdPairs
 */
function reflexivity(fd) { // FdPair
	// generate trivial fd's
	var rv = new HashSet();
	var fdFromArr = fd.fdFrom.values();
	// note that we don't care about fdTo values
	var fromLen =fdFromArr.length;
	for (var start=0; start<fromLen; start++) {
		for (var end=start+1; end<=fromLen; end++) {
			var to = fdFromArr.slice(start, end).join("");
			rv.add(new FdPair(fd.fdFrom.values().join(""), to));
		}
	}
	return rv;
}

function augmentation(fd, attr) { // fd: FdPair, attr: str
        // Note: ex) if attr== "" -> doesn't return fd itself

        if (attr == "" || attr == null)
            return null;

	var attrArr = removeDups(attr).values();
	var attrLen = attrArr.length;
	var from = fd.fdFrom.values().join("");
	var to = fd.fdTo.values().join("");
	var rv = new HashSet();

	for (var start=0; start<attrLen; start++) {
		for (var end=start+1; end<=attrLen; end++) {
			var target = attrArr.slice(start,end).join("");
			rv.add(new FdPair(from.concat(target),to.concat(target)));
		}
	}
	return rv; // HashSet of Fd pair
}

// return: set of FdPair (only contains single element...)
function transivity(fd_A, fd_B) { // args:FdPair
        if(fd_A == null || fd_B == null)
            return null;

        var rv = new HashSet();
	if(equalDeep(fd_A.fdTo, fd_B.fdFrom))
		return rv.add(new FdPair(fd_A.fdFrom, fd_B.fdTo));
	else if(equalDeep(fd_B.fdTo, fd_A.fdFrom))
		return rv.add(new FdPair(fd_B.fdFrom, fd_A.fdTo));
	else
		return null;
}

function removeDups(str) {
	var attr = new HashSet();
	attr.addAll(str.split(""));
	return attr;
}


equalDeep = function () {

    var innerEquiv; // the real equiv function
    var callers = []; // stack to decide between skip/abort functions
    var parents = []; // stack to avoiding loops from circular referencing

    // Call the o related callback with the given arguments.
    function bindCallbacks(o, callbacks, args) {
        var prop = QUnit.objectType(o);
        if (prop) {
            if (QUnit.objectType(callbacks[prop]) === "function") {
                return callbacks[prop].apply(callbacks, args);
            } else {
                return callbacks[prop]; // or undefined
            }
        }
    }
    
    var callbacks = function () {

        // for string, boolean, number and null
        function useStrictEquality(b, a) {
            if (b instanceof a.constructor || a instanceof b.constructor) {
                // to catch short annotaion VS 'new' annotation of a declaration
                // e.g. var i = 1;
                //      var j = new Number(1);
                return a == b;
            } else {
                return a === b;
            }
        }

        return {
            "string": useStrictEquality,
            "boolean": useStrictEquality,
            "number": useStrictEquality,
            "null": useStrictEquality,
            "undefined": useStrictEquality,

            "nan": function (b) {
                return isNaN(b);
            },

            "date": function (b, a) {
                return QUnit.objectType(b) === "date" && a.valueOf() === b.valueOf();
            },

            "regexp": function (b, a) {
                return QUnit.objectType(b) === "regexp" &&
                    a.source === b.source && // the regex itself
                    a.global === b.global && // and its modifers (gmi) ...
                    a.ignoreCase === b.ignoreCase &&
                    a.multiline === b.multiline;
            },

            // - skip when the property is a method of an instance (OOP)
            // - abort otherwise,
            //   initial === would have catch identical references anyway
            "function": function () {
                var caller = callers[callers.length - 1];
                return caller !== Object &&
                        typeof caller !== "undefined";
            },

            "array": function (b, a) {
                var i, j, loop;
                var len;

                // b could be an object literal here
                if ( ! (QUnit.objectType(b) === "array")) {
                    return false;
                }   
                
                len = a.length;
                if (len !== b.length) { // safe and faster
                    return false;
                }
                
                //track reference to avoid circular references
                parents.push(a);
                for (i = 0; i < len; i++) {
                    loop = false;
                    for(j=0;j<parents.length;j++){
                        if(parents[j] === a[i]){
                            loop = true;//dont rewalk array
                        }
                    }
                    if (!loop && ! innerEquiv(a[i], b[i])) {
                        parents.pop();
                        return false;
                    }
                }
                parents.pop();
                return true;
            },

            "object": function (b, a) {
                var i, j, loop;
                var eq = true; // unless we can proove it
                var aProperties = [], bProperties = []; // collection of strings

                // comparing constructors is more strict than using instanceof
                if ( a.constructor !== b.constructor) {
                    return false;
                }

                // stack constructor before traversing properties
                callers.push(a.constructor);
                //track reference to avoid circular references
                parents.push(a);
                
                for (i in a) { // be strict: don't ensures hasOwnProperty and go deep
                    loop = false;
                    for(j=0;j<parents.length;j++){
                        if(parents[j] === a[i])
                            loop = true; //don't go down the same path twice
                    }
                    aProperties.push(i); // collect a's properties

                    if (!loop && ! innerEquiv(a[i], b[i])) {
                        eq = false;
                        break;
                    }
                }

                callers.pop(); // unstack, we are done
                parents.pop();

                for (i in b) {
                    bProperties.push(i); // collect b's properties
                }

                // Ensures identical properties name
                return eq && innerEquiv(aProperties.sort(), bProperties.sort());
            }
        };
    }();

    innerEquiv = function () { // can take multiple arguments
        var args = Array.prototype.slice.apply(arguments);
        if (args.length < 2) {
            return true; // end transition
        }

        return (function (a, b) {
            if (a === b) {
                return true; // catch the most you can
            } else if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined" || QUnit.objectType(a) !== QUnit.objectType(b)) {
                return false; // don't lose time with error prone cases
            } else {
                return bindCallbacks(a, callbacks, [b, a]);
            }

        // apply transition with (1..n) arguments
        })(args[0], args[1]) && arguments.callee.apply(this, args.splice(1, args.length -1));
    };

    return innerEquiv;

}();
