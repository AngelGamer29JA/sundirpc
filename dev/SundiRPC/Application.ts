import DiscordRPC from 'discord-rpc';

import { CONFIG_FILE } from '../util/constants';
import { prompt, send } from '../util/cli';
import { Config, getConfig, parseButtons, setConfig } from './Config';

class Application extends DiscordRPC.Client
{
	public isOpen: boolean;
	public isReady: boolean;
	public config: ConfigProperties;
	public StartTime: number;

	public async run(): Promise<void>
	{
		this.isOpen = true;


		setInterval(() => {
			if (this.isReady === true) this.updatePresence();
		}, 2000);

		let input: string = '';
		while (this.isOpen === true)
		{
			input = await prompt('SundiRPC > ');
			if (input === 'exit')
			{
				await this.destroy();
				send('INFO', 'Discord: Servicio detenido');

				this.isOpen = false;
				process.exit(0);
			}
			else
			{
				if (this.isReady)
				{
					let new_config = await getConfig(CONFIG_FILE) as Config;
					if (new_config !== undefined) new_config.Description = input;
					await setConfig(CONFIG_FILE, new_config);
					this.config = new_config;
				}
				else
				{
					// send('ERROR', 'No se ha iniciado el servicio');
				}
			}
		}
	}

	public async updatePresence(): Promise<void>
	{
		let config = this.config;
		await this.setActivity({
			state: config?.Title,
			details: config?.Description,
			largeImageKey: config?.Assets.Icon,
			largeImageText: config?.Assets.IconText,
			smallImageKey: config?.Assets.MiniIcon,
			smallImageText: config?.Assets.MiniText,
			buttons: parseButtons(config?.Buttons),
			startTimestamp: this.StartTime,
			instance: true
		});
	}

	public constructor(config: ConfigProperties | Config)
	{
		super({ transport: 'ipc' });
		this.config = config;
		this.isOpen = false;
		this.isReady = false;
		this.StartTime = Date.now();
	}

}

export {
	Application
}