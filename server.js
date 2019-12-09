function bootstrapSocketServer(io) {
	io.on('connection', (socket) => {
		socket.on('register', (data) => {
			socket.emit('welcomeMessage', `Welcome ${data.username} !!`);
			data.channels.forEach(channel => {
				socket.join(channel);
				socket.emit('addedToChannel', { channel });
			});
			socket.on('joinChannel', (joinChannelData) => {
				socket.join(joinChannelData.channel);
				socket.emit('addedToChannel', { channel: joinChannelData.channel });
			});
			socket.on('leaveChannel', (leaveChannelData) => {
				socket.leave(leaveChannelData.channel);
				socket.emit('removedFromChannel', { channel: leaveChannelData.channel });
			});
			socket.on('message', (newMessageData) => {
				socket.to(newMessageData.channel).emit('newMessage', newMessageData);
			});
		});
	});
}

module.exports = bootstrapSocketServer;
