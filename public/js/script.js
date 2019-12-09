function addMessageInChatContainer(message, type) {
	let msg = document.createTextNode(message);
	let msgPara = document.createElement('p');
	msgPara.className = 'card-text';
	msgPara.appendChild(msg);
	let msgDiv = document.createElement('div');
	msgDiv.className = 'card-body';
	msgDiv.appendChild(msgPara);
	let childDiv = document.createElement('div');
	childDiv.className = `card ${type}-message`;
	childDiv.appendChild(msgDiv);
	let mainDiv = document.createElement('div');
	mainDiv.className = 'col-12';
	mainDiv.appendChild(childDiv);
	let chatContainer = document.getElementById('chatContainer');
	chatContainer.insertBefore(mainDiv, chatContainer.firstChild);
}

function addAlertMessageInContainer(alertMessage) {
	const alertNode = `<div class="alert alert-success alert-dismissible fade show" role="alert">
							${alertMessage}
							<button type="button" class="close" data-dismiss="alert" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>`;
	let wrapper = document.createElement('div');
	wrapper.innerHTML = alertNode;
	let alertContainer = document.getElementById('alertContainer');
	alertContainer.appendChild(wrapper);
}

function addChannelInList(newchannel) {
	let option = document.createElement('option');
	option.id = `ch-${newchannel}`;
	option.innerHTML = newchannel;
	let channelList = document.getElementById('channelsList');
	channelList.appendChild(option);
}

function removeChannelFromList(channel) {
	let option = document.getElementById(`ch-${channel}`);
	let channelsList = document.getElementById('channelsList');
	channelsList.removeChild(option);
}

function sendMessage(event, socket) {
	event.preventDefault();
	let message = document.getElementById('message').value;
	let channel = document.getElementById('channel').value;
	// get username
	const usernameInpt = document.getElementById('username').value;
	const username = usernameInpt === '' ? 'Anonymous' : usernameInpt;
	// emit message
	socket.emit('message', { username: username, channel: channel, message: message });
	// add message in chatContainer
	addMessageInChatContainer(`Me : ${message}`, 'sent');
	document.getElementById('message').value = '';
	document.getElementById('channel').value = '';
}

function joinChannel(event, socket) {
	let newchannel = document.getElementById('newchannel').value;
	// emit message
	socket.emit('joinChannel', { channel: newchannel });
	document.getElementById('newchannel').value = '';
}

function leaveChannel(event, socket) {
	let newchannel = document.getElementById('newchannel').value;
	// emit message
	socket.emit('leaveChannel', { channel: newchannel });
}

function onWelcomeMessageReceived(data) {
	let message = `System : ${data}`;
	addMessageInChatContainer(message, 'received');
}

function onNewMessageReceived(data) {
	let message = `${data.username} : ${data.message}`;
	addMessageInChatContainer(message, 'received');
}

function onAddedToNewChannelReceived(data) {
	addChannelInList(data.channel);
	const alertMessage = `You are added to <strong>${data.channel}</strong> successfully!`;
	addAlertMessageInContainer(alertMessage);
}

function onRemovedFromChannelReceived(data) {
	removeChannelFromList(data.channel);
	const alertMessage = `You are removed to <strong>${data.channel}</strong> successfully!`;
	addAlertMessageInContainer(alertMessage);
}

module.exports = {
	sendMessage,
	joinChannel,
	leaveChannel,
	onWelcomeMessageReceived,
	onNewMessageReceived,
	onAddedToNewChannelReceived,
	onRemovedFromChannelReceived
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution

