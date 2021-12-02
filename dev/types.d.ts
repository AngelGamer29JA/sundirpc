interface ConfigProperties
{
	Title: string,
	Description: string,
	ClientID: string,
	Assets: AssetsProperties,
	Buttons: ButtonsProperties[]
}


interface ButtonsProperties 
{
	Text: string,
	Url: string
}

interface AssetsProperties
{
	Icon: string; 
	IconText: string; 
	MiniIcon: string; 
	MiniText: string; 
}
