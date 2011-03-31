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
});
test("Test equality", function() {
	var a = new FdPair("AB", "B");
	var b = new FdPair("BA", "B");
	deepEqual(b.values(), a.values(), "Simple fd equality test");
});
test("Test equality", function() {
	var a = new FdPair("ABC", "DB");
	var b = new FdPair("BCA", "BD");
	deepEqual(b.values(), a.values(), "Simple fd equality test");
});

module("Reflexivity");
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
	var rv = reflexivity(fd);

	equal(3, rv.size(), "size test");
	deepEqual(ex.values(), rv.values(), "AB->A test");

/* To see values inside...which exactly matches expected ones
	deepEqual(null, rv.values()[0].values(), "AB->A test");
	deepEqual(null, rv.values()[1].values(), "AB->A test");
	deepEqual(null, rv.values()[2].values(), "AB->A test");
*/
});

module("Augmentation");
test("Basic Augmentation Test", function() {
	var fd = new FdPair("A", "B");
	var attr = "C";
	var rv = augmentation(fd,attr).values();
	deepEqual([["A","C"], ["B","C"]], rv[0].values(), "A->B with C");		

});

/*
module("Transivity");
test("a basic test example", function() {
  ok( true, "this test is fine" );
  var value = "hello";
  equals( "hello", value, "We expect value to be hello" );
});


test("first test within module", function() {
  ok( true, "all pass" );
});

test("second test within module", function() {
  ok( true, "all pass" );
});

test("some other test", function() {
  expect(2);
  equals( true, false, "failing test" );
  equals( true, true, "passing test" );
});
*/
