/*
 * 
 * bcnf.js - takes care of input and output
 * Author: Yo Han Ko (yohanko1)
 * 
 */
JS.require('JS.Class', 'JS.Module', 'JS.Set', 'JS.Hash');
var output_field_id = "output_field";
var target_attr = null;
var relation = document.getElementById("rel");

function bcnf_main(output_div) {
    var outDiv = document.getElementById(output_div);
    if(document.getElementById(output_field_id)) {
        var child = document.getElementById(output_field_id);
        outDiv.removeChild(child);
    }
    
    var fdPairSet = processInput("rel","fdTo_", "fdFrom_");
    var fdClosureSet = bcnf((new JS.Set(relation.value)).toArray(), 
                            toHash(fdPairSet));
    checkBCNF(fdClosureSet);
    outputBCNF(output_div, fdClosureSet);
}

function checkBCNF(fd) {
    fd.forEachPair(function(rel, hash){
            if(rel.length == 1)
               fd.remove(rel);
            });
}

function isBCNF(relFdHash, fd_closed) { // hash(rel:hash of FuncDep)
    var violation = "";
    relFdHash.forEachPair(function(rel, fdHash) {
        var r = new JS.Set(rel);

        fdHash.find(function(pair) {
            var closure = attrClosure(new String(pair.key), fd_closed);
            var f = new JS.Set(closure);
            if(!(r.isSubset(f))) {
                return (violation = ((new String(pair.key)) +','+closure));
            }
            return violation;

            });
    });

    return violation;
}

function bcnf(rel, fd) { // arr, hash of FuncDep
    // Hash(rel : arr of fd)
    var bcnfHash = new JS.Hash([rel, fd])
    if(fd.length == 1)
        return bcnfHash;

    var fd_closed;//= fdClosure(fd);
    bcnfHash.forEachPair(function(rel, fdHash) {
        var temp = new JS.Hash(function(hash,key) {
                var arr = new Array();
                hash.store(key, arr);
                return arr;
        });
        fdHash.forEachPair(function(from, to){
            temp.store(from.join("").split(""), to.join("").split(""));
        });

        fd_closed = fdClosure(temp);
    });
        
    var vio = isBCNF(bcnfHash, fd_closed);

    if(vio == "" || vio == null) {
        return bcnfHash;
    } else {
        var cv = vio.split(",");
        var from = cv[0].split("");
        var closure = cv[1].split("");
        var to = fd.remove(from);

        var rel1 = intersectArray(closure,rel);
        var rel2 = unionArray(from, differenceArray(rel,closure));
        var fds1 = new JS.Hash([from, to]);
        var fds2 = fd;
        var rv1 = bcnf(rel1, fds1);
        var rv2 = bcnf(rel2, fds2);

        bcnfHash.clear();
        bcnfHash = bcnfHash.merge(rv1.merge(rv2));
    }

    return bcnfHash; //Hash(rel: hash of funcdep)
}
function outputBCNF(output_div, fdHash) {
    var outputElem = document.createElement("div");
    outputElem.id = output_field_id;
    var brElem = document.createElement('br');

    outputElem.appendChild(brElem.cloneNode(true));
    outputElem.appendChild(document.createTextNode("In BCNF:"));
    var list = document.createElement("ul");
    list.id = "fd_list";
    
    fdHash.forEachPair(function(key,value) {
            if (key.length == 0 || value.length == 0){
            	var i = 0; // place holder...	
            } else {
            var elem = document.createElement("li");

            var out = "Relation: " +key.sort().join("")+" with   FD's: ";

            value.forEachPair(function(from, to){
                out = out + from.join("") + "->" + to.join("") + ", ";
            });
            out = out.slice(0, out.length-2);
            elem.appendChild(document.createTextNode(out));
            list.appendChild(elem);
            }
    });
    outputElem.appendChild(list);

    document.getElementById(output_div).appendChild(outputElem);
}
