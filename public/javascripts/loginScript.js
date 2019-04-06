function check(event) {
	// Get Values
	// var name  = document.getElementById('Name' ).value;
	var id    = document.getElementById('emailid'   ).value;
	var password = document.getElementById('password').value;
	var re = /\S+@\S+\.\S+/;
	// Simple Check
	if(re.test(id)==false) {
		alert("Invalid email id");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	
	// if(faculty.length != 3) {
	// 	alert("Invalid faculty code");
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	return false;
	// }
}