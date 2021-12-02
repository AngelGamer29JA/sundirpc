import { readFile, writeFile, access } from 'fs/promises';
import { F_OK } from 'constants';

const encoder = new TextEncoder();

class Config implements ConfigProperties
{
    public Title: string;
    public Description: string;
    public ClientID: string;
    public Assets: AssetsProperties;
    public Buttons: ButtonsProperties[] = [];

    constructor(data?: {Title?: string, 
        			   Description?: string, 
        			   ClientID?: string, 
        			   Assets?: AssetsProperties})
    {
    	if (data === undefined) data = {Title: '', Description: '', ClientID: '', Assets: new Assets()}
    	this.Title = data?.Title ? data.Title : '';
    	this.Description = data?.Description ? data?.Description : '';
    	this.ClientID = data?.ClientID ? data?.ClientID : '';
    	this.Assets = data?.Assets ? data?.Assets : new Assets();
    }

    public toString() : string
    {
    	return JSON.stringify(this.toJson());
    }

    public toJson() : ConfigProperties
    {
    	return {
    		Title: this.Title,
    		Description: this.Description,
    		ClientID: this.ClientID,
			Assets: {
				Icon: this.Assets.Icon,
				IconText: this.Assets.IconText,
				MiniIcon: this.Assets.MiniIcon,
				MiniText: this.Assets.MiniText
			},
			Buttons: this.Buttons
    	}
    }
}

class Assets implements AssetsProperties
{
    public Icon: string;
    public IconText: string;
    public MiniIcon: string;
    public MiniText: string;

    constructor(icon?: string,
    			icontext?: string,
    			miniicon?: string,
    			minitext?: string)
    {
    	this.Icon = icon ? icon : '';
    	this.IconText = icontext ? icontext : '';
    	this.MiniIcon = miniicon ? miniicon : '';
    	this.MiniText = minitext ? minitext : '';
    }
}

async function parseConfig(path: string): Promise<string>
{
	try
	{
		const data = await readFile(path, {
			encoding: 'utf8'
		});
		return data;
	}
	catch(e)
	{
		console.error(e);
		return '{}';
	}
}

async function getConfig(path: string): Promise<ConfigProperties | Config | undefined>
{
	try
	{
		const data = await parseConfig(path);
		const parsedData: ConfigProperties = JSON.parse(data);
		return parsedData;
	}
	catch(e)
	{
		if (e instanceof SyntaxError)
		{
			let err = parseError(e.stack as string) as {line: string, token: string};
			console.error(`Error de configuración : \n\t${path}\nLinea: ${err?.line}\nCausa del error >>> \n\t${err.token}\n\t${'^'.repeat(err.token.length)}`);
			process.exit(1);
			/*

				Error de configuracion :
					C:\users\config.json
				Linea: 1
				Causa del error >>> 
					papa
					^^^^

			*/

		}
		return undefined;
	}
}


async function setConfig(path: string, config: Config | ConfigProperties): Promise<void>
{
	try
	{
		let config_str = ((config instanceof Config) ? config.toString() : config);
		let data = encoder.encode(JSON.stringify(config_str, null, '\t'));

		return await writeFile(path, data, {
			encoding: 'utf8'
		});
	}
	catch(e)
	{
		console.error(e);
	}
}

async function createConfig(path: string) : Promise<boolean>
{
	try
	{
		await access(path, F_OK);
		return true;
	}
	catch(e)
	{
		const config = {
			'Title': 'Hola mundo 🥵',
			'Description': 'Hola soy una descripción 🤣',
			'ClientID': '791471696925818930',
			'Assets': {
				'Icon': 'mark-zuckerberg',
				'IconText': 'I love you, Mark Zuckerbeg',
				'MiniIcon': 'adam',
				'MiniText': 'Hola de nuevo'
			},
			'Buttons': [
				{
					'Text': 'Click me!',
					'Url': 'https://youtube.com/'
				}
			]
		}
		await setConfig(path, config);
		return false;
	}
}

function parseError(err: string)
{
	const data = err.match(/Unexpected token ([a-z]+) in JSON at position ([0-9]+)/);
	if (data === null) return null;

	return {
		token: data[1],
		line: data[2]
	};
}

function parseButtons(buttons: ButtonsProperties[])
{
	let new_buttons = [];
	for (const d of buttons)
	{
		new_buttons.push({
			label: d.Text,
			url: d.Url
		})
	}
	return new_buttons;
}

export {
	parseConfig,
	setConfig,
	getConfig,
	Assets,
	Config,
	createConfig,
	parseButtons
}