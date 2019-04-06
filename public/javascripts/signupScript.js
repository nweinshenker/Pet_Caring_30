function show() {
	// Get Values
	var matric  = document.getElementById('Name' ).value;
	var name    = document.getElementById('emailid'   ).value;
	var faculty = document.getElementById('password').value;
	
	// Alert
	alert("--- Your Input ---\nMatric: " + matric + "\nName: " + name + "\nFaculty: " + faculty);
}


function check(event) {
	// Get Values
	var name  = document.getElementById('Name' ).value;
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
	if(name.length == 0) {
		alert("Invalid name");
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