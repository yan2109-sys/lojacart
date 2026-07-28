fx_version 'cerulean'
game 'gta5'

name 'loja-fivem-delivery'
description 'Entrega automática de produtos da loja FiveM'
author 'mente.ia'
version '1.0.0'

client_scripts {
    'client/main.lua',
}

server_scripts {
    'config.lua',
    'server/main.lua',
    'extensions/*.lua',
}

lua54 'yes'
