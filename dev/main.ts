import { register } from "discord-rpc";
import path from "path/posix";
import { Application } from "./SundiRPC/Application";
import { createConfig, getConfig } from "./SundiRPC/Config"
import { send } from "./util/cli";
import { CONFIG_FILE } from "./util/constants"

const config_path = path.join(__dirname, CONFIG_FILE); 

(async function main(){

	const _conf = await createConfig(config_path);
	if (!_conf) {
		send('WARN', 'El archivo de configuracion se encontro');
		send('INFO', 'Archivo de configuracion creado');
	}

	const config = await getConfig(CONFIG_FILE) as ConfigProperties;

	register('sundirpc');

	const App = new Application(config);

	App.on('ready', () => {
		App.isReady = true;
		send('INFO', 'Discord: Servicio inicializado');
		send('INFO', `Discord: Usuario detectado ${App.user.username}#${App.user.discriminator}`);
	})


	await App.login({
		clientId: config?.ClientID as string
	});

	await App.run();
})()
