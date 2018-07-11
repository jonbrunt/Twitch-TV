//initializes program on page load
init();
//assigns the array of objects for Twitch users and passes this to authentication function
function init() {
	const users = [{ name: 'cretetion' }, { name: 'ESL_SC2' }, { name: 'freecodecamp' }, { name: 'habathcx' }, { name: 'Luminosity' }, { name: 'noobs2ninjas' }, { name: 'OgamingSC2' }, { name: 'RobotCaleb' }];
	authenticateUsers(users);
}
//checks that username has a valid Twitch profile
function authenticateUsers(arr) {
	var j = 0; //counter for valid username array
	var working = []; //initializes valid username array
	for (let i = 0; i < arr.length; i++) {
		//concatenates url for ajax based on username
		let url = 'https://api.twitch.tv/kraken/users/' + arr[i].name + '?client_id=rcfkj3r7mfq36cedgzu9i3ymi8m8tg';
		fetch(url)
			.then(res => res.json())
			.then(function (data) {
				//validates user in returned object
				if (data.hasOwnProperty('display_name')) {
					working.push(arr[i]); //pushes valid user object to array
					working[j].logo = data.logo; //assigns logo data to object
					j++; //increments counter for valid username array
				}
			})
			.catch(function (error) { //ajax error backup
				alert('An error ocurred while trying to load the results. Please try again.');
			})
	}
	//timeout added to ensure synchronous execution of functions
	setTimeout(function () {
		//passes valid user objects to check for streaming status
		streamCheck(working);
	}, 2000);
}
//checks if validated users are currently streaming
function streamCheck(arr) {
	var working = arr;
	for (let i = 0; i < arr.length; i++) {
		//concatenates url based on username
		let url = 'https://api.twitch.tv/kraken/streams/' + arr[i].name + '?client_id=rcfkj3r7mfq36cedgzu9i3ymi8m8tg';
		fetch(url)
			.then(res => res.json())
			.then(function (data) {
				//adds streaming status/property to object
				working[i].stream = data.stream;
			})
			.catch(function (error) { //ajax error backup
				alert('An error ocurred while trying to load the results. Please try again.');
			})
	}
	//timeout set to ensure synchronous execution of functions
	setTimeout(function () {
		//sends array of objects to be sorted
		sort(working);
	}, 2000);

}

function sort(arr) {
	//initializes arrays for online and offline users
	let online = [];
	let offline = [];
	//iterates over array and pushes to appropriate new array based on stream status 
	arr.forEach(function (obj) {
		if (obj.stream === null) { offline.push(obj); }
		else online.push(obj);
	});
	//concatenates an array of all users, with online appearing first 
	let allUsers = online.concat(offline);
	update(allUsers); //passes array of all users to update
	buttons(allUsers, online, offline); //passes all arrays to buttons function
}

function update(arr) {
	removeUl(); //checks for and removes existing results
	//Changes banner text and reveals toggle buttons
	document.querySelector('#loadBanner').innerText = 'Twitch User Status';
	document.querySelector('.toggle').style.display = 'block';
	let listNode = document.createElement('ul'); //creates ul in empty div
	document.querySelector('.results').appendChild(listNode);
	//iterates over the argument array, creating a li for each object in array
	for (let i = 0; i < arr.length; i++) {
		var status = undefined;
		//creates new list element
		let itemNode = document.createElement('li');
		//assigns status based on stream status
		if (arr[i].stream === null) {
			status = 'OFFLINE';
		}
		else {
			status = 'Now Streaming:&nbsp;&nbsp;' + arr[i].stream.game;
		}
		//concatenates the inner HTML of the new li
		itemNode.innerHTML = '<img src="' + arr[i].logo + '">&nbsp;&nbsp;' + '<a href="https://www.twitch.tv/' + arr[i].name + '" target="_blank">' + arr[i].name + '</a>&nbsp&nbsp' + status;
		//appends li to ul
		document.querySelector('ul').appendChild(itemNode);
		//targets and assigns background color based on online/offline status
		let background = document.querySelectorAll('li');
		if (status === 'OFFLINE') { background[i].style.backgroundColor = '#ffffff' }
		else background[i].style.backgroundColor = '#ffa500';
	}
	//reveals footer
	document.querySelector('.footer').style.display = 'initial';
}
//checks for and removes ul if necessary
function removeUl() {
	let ul = document.querySelector('ul');
	if (ul) {
		let parent = document.querySelector(".results");
		parent.removeChild(ul);
	}
}
//adds event listener for list toggle buttons and passes appropriate array of objects to update(), based on button selected
function buttons(all, on, off) {
	document.querySelector('#all').addEventListener('click', function () {
		update(all);
	});
	document.querySelector('#online').addEventListener('click', function () {
		update(on);
	});
	document.querySelector('#offline').addEventListener('click', function () {
		update(off);
	});
}