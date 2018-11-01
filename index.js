const { Client, Util } = require('discord.js');
const { PREFIX } = require('./config');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const client = new Client({ disableEveryone: true });

const youtube = new YouTube(process.env.YT);

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Liguei'));

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));
const Discord = require('discord.js')
client.on('message', async msg => { // eslint-disable-line
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(PREFIX.length)

	if (command === 'play') {
if(args.length < 1) msg.reply('⬇ **|** Agora irei mostrar as músicas mais populares.')
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send(':x: **|** Ocorreu um erro ao se conectar no canal de voz');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send(':x: **|** Vish... Parece que não tenho a tal permissão de `CONNECT`');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('🤐 **|** Ouch, eu não posso falar como assim?! Preciso da permissão de `SPEAK`');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {

				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
console.log(playlist)
console.log(videos)
			return msg.channel.send('💾 **|** Hmm. Verifiquei `'+playlist.title+'` como uma certa lista de reprodução, vamos tocar!');
		} else {
			try {
				var video = await youtube.getVideo(url);
                                
                                
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
                                    
					let index = 0;
					var emb2 = new Discord.RichEmbed()
					.setAuthor('Seleção de músicas', client.user.avatarURL)
					.setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`)
					.setTimestamp()
					.setFooter('Por favor envie um número para selecionar a música de 1 à 10.', msg.author.displayAvatarURL)
						 msg.channel.send(emb2)
	
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('⏰ **|** Pelo jeito o tempo acabou e você não selecionou nenhuma das músicas. ');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);


				} catch (err) {
					console.error(err);
					return msg.channel.send('👁 Deculpe, mas eu não encontrei nenhum resultado...');
				}
			}
			return handleVideo(video, msg, voiceChannel);
        }
  
} else if (command === 'skip') {
		if (!msg.member.voiceChannel) return msg.channel.send(':x: **|** Ocorreu um erro inesperado ao conectar-se em um canal de voz.');
		if (!serverQueue) return msg.channel.send('🎧 **|** Nada tocando. Que tal usar o meu comando k!play');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
	} else if (command === 'stop') {
		if (!msg.member.voiceChannel) return msg.channel.send(':x: **|** Ocorreu um erro inesperado ao conectar-se em um canal de voz.');
		if (!serverQueue) return msg.channel.send('🎧 **|** Nada tocando. Que tal usar o meu comando k!play');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
	} else if (command === 'volume') {
		if(args[1] < 1) return msg.reply('🔇 **|** O volume não pode ser menor que o número 1(um) para o conforto de todos.')
		if(args[1] > 8) return msg.reply('🔈 **|** O volume não pode ser maior que o número 8(oito) para o conforto de todos.')
		if (!msg.member.voiceChannel) return msg.channel.send(':x: **|** Ocorreu um erro inesperado ao conectar-se em um canal de voz.');
		if (!serverQueue) return msg.channel.send('🎧 **|** Nada tocando. Que tal usar o meu comando k!play');
		if (!args[1]) return msg.channel.send('🔈 **|** O volume atual é: '+serverQueue.volume);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send('✅ **|** Alterei o volume para: '+args[1]);
	} else if (command === 'np') {
 
		if (!serverQueue) return msg.channel.send('🎧 **|** Nada tocando. Que tal usar o meu comando k!play');
    
        return msg.channel.send(`💿 **|** Tocando agora: **${serverQueue.songs[0].title}** `);
    } else if (command === 'queue') {
		if (!serverQueue) return msg.channel.send('🎧 **|** Nada tocando. Que tal usar o meu comando k!play');
		let index2 = 0;
	const hastebin = require('hastebin-gen');
hastebin(serverQueue.songs.map(song => ` - ${song.title}`).join('\n'), "js").then(r => {
  
	msg.channel.send(`📄 **|** Gerei um link dessa fila de músicas: ${r}`)

    })
	 } else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ **|** Agora a música tocando está pausada, use k!resume para resumir e continuar.');
		}
		return msg.channel.send('🎧 **|** Nada tocando. Que tal usar o meu comando k!play');
 } else if (command === 'repetir') {
		if (serverQueue && serverQueue.playing) {
			console.log(serverQueue)
			serverQueue.connection.dispatcher_repeat = serverQueue
			return msg.channel.send('⏸ **|** Agora a música tocando está pausada, use k!resume para resumir e continuar.');
		}
return msg.channel.send('🎧 **|** Nada tocando. Que tal usar o meu comando k!play');
	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ **|** A música está sendo resumida. Aguarde.');
		}
		return msg.channel.send('<:err:449743511391305748> **|** Ei, aconteceu algo inesperado.');
	}

	return undefined;

})
async function handleVideo(video,  msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);

	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 3,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`:x: **|** Um erro ocorreu: ${error}`);
		}
	} else {
		const Discord2 = require('discord.js')
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return;


const embedbla = new Discord2.RichEmbed()
.setTitle(`__${msg.author.tag} adicionou músicas à lista de reprodução__`)
.setDescription(`<💿> **|** __${song.title}__`)
.setTimestamp()
.setFooter(`Música`, msg.author.displayAvatarURL)
		 return msg.channel.send(embedbla)
	}
	return undefined;
}


function play(guild, song) {
	const serverQueue = queue.get(guild.id);
    if (serverQueue.voiceChannel.bitrate > 64) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return serverQueue.textChannel.send('🔇 **|** Desculpe mas eu não consigo reproduzir a mais de 64 de bitrate, reduza para poder usar meu serviço de música.')
	}
	if (!song) {
		serverQueue.voiceChannel.leave();
		
		return;
	}
	console.log(serverQueue.songs);
const bla = ytdl(song.url, {
 filter: 'audioonly',
quality: 'lowest',
 format: '18', 
lang: 'br'
 })
	const dispatcher = serverQueue.connection.playStream(bla)
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);


	serverQueue.textChannel.send('📀 **|** Eu coloquei para tocar: `'+song.title+'`');
}

client.login(process.env.TOKEN);
