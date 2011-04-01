module("Structures");
test("Test hashset", function() {
	var a = new HashSet();
	a.addAll("HELLO".split(""));
	notEqual(['H','E','L','O'], a.values(), "HELLO test");	
	deepEqual(['H','E','L','O'], a.values(), "HELLO test");	
});
test("Test FdPair", function() {
	var a = new FdPair("A", "B");
	var b = new FdPair("A", "B");
	deepEqual(b.values(), a.values(), "Simple fd equality test");

	a = new FdPair("AB", "B");
	b = new FdPair("BA", "B");
	deepEqual(b.values(), a.values(), "Simple fd equality test");

	a = new FdPair("ABC", "DB");
	b = new FdPair("BCA", "BD");
	deepEqual(b.values(), a.values(), "Simple fd equality test");
});

module("Armstrong's Axioms - Reflexivity");
test("Basic Reflexibity", function() {
	var fd = new FdPair("A", "A");
	var ex = new FdPair("A", "A");
	var rv = reflexivity(fd);

	equal(1,rv.size(), "size test");
	deepEqual([["A"], ["A"]], rv.values()[0].values(), "A->A test");
});
test("More Reflexibity", function() {
	var fd = new FdPair("AB", "A");
	var ex1 = new FdPair("AB", "A");
	var ex2 = new FdPair("AB", "B");
	var ex3 = new FdPair("AB", "AB");
	var ex = new HashSet();
	ex.add(ex1);
	ex.add(ex2);
	ex.add(ex3);
	var rv = reflexivity(fd).values();

	equal(3, rv.length, "size test");
	deepEqual(ex.values(), rv, "AB->A test");

        for (i in rv) {
            notEqual(rv[i].values(), null,"See values inside of the set");
        }
});
module("Armstrong's Axioms - Augmentation");
test("Null Test", function() {
        var fd = new FdPair("A", "B")
        var rv = augmentation(fd, "");
        deepEqual(null, rv, "Returns nothing");
        rv = augmentation(fd, null);
        deepEqual(null, rv, "Returns nothing");
});

test("One Attr", function() {
	var fd = new FdPair("A", "B");
	var attr = "C";
	var rv = augmentation(fd,attr).values();
	deepEqual([["A","C"], ["B","C"]], rv[0].values(), "A->B with C");		

});
test("With Two Attr", function() {
	var fd = new FdPair("A", "B");
	var attr = "CD";
	var rv = augmentation(fd,attr).values();

        var expected = new HashSet();
        expected.add(new FdPair("AD", "BD"));
        expected.add(new FdPair("AC", "BC"));
        expected.add(new FdPair("ACD", "BCD"));
        expected = expected.values();
	deepEqual(rv, expected,"Advanced Augmentation");

        for (i in rv) 
	    notEqual(rv[i].values(), null, "See values inside of the set");		
});

module("Armstrong's Axioms - Transivity");
test("Null Test", function() {
    var fda = null
    var fdb = new FdPair("ABC", "B");
    var rv = transivity(fda, fdb);
    deepEqual(rv, null, "Null Exepcted");
});

test("With One Attr", function() {
    var fda = new FdPair("A","B")
    var fdb = new FdPair("B","C");
    var rv = transivity(fda, fdb);
    var expected = new HashSet().add(new FdPair("A", "C"));
    deepEqual(rv, expected, "Simple Transitivity");
    rv = transivity(fdb, fda);
    deepEqual(rv, expected, "Simple Transitivity - reverse");
});

test("With Two Middle Attr", function() {
    var fda = new FdPair("A","BC")
    var fdb = new FdPair("CB","D");
    var rv = transivity(fda, fdb);
    var expected = new HashSet().add(new FdPair("A", "D"));
    deepEqual(rv, expected, "A->BC, CB->D => A->D");
    rv = transivity(fdb, fda);
    deepEqual(rv, expected, "CB->D, A->BC => A->D");

    fda = new FdPair("AC","BC")
    fdb = new FdPair("CB","DC");
    expected = new HashSet().add(new FdPair("AC", "DC"));
    rv = transivity(fda, fdb);
    deepEqual(rv, expected, "AC->BC, CB->DC => AC->CD");
});
