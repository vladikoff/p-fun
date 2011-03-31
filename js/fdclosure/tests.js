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
	equal(true, equalDeep(a,b));
	deepEqual(b.values(), a.values(), "Simple fd equality test");
});

module("Reflexivity");
test("Basic Reflexibity", function() {
	var fd = new FdPair("A", "A");
	var ex = new FdPair("A", "A");
	var rv = reflexivity(fd);
	equal(3, rv.length, "length");
	for (r in rv)
		equal(null, rv[r].values(), "haha");
	deepEqual(ex, (rv[0]), "A->A test");
});
/*

module("Augmentation");
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
