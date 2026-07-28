-- Exemplo de extensão customizada (estilo CentralCart)
-- Edite este arquivo para integrar com vRP, ESX ou QBCore

AddEventHandler('lojafivem.ready', function()
    exports['loja-fivem-delivery']:RegisterStoreCommand('exemplo', function(userId)
        print('[LojaFiveM Extension] Comando exemplo para ID: ' .. tostring(userId))
        return 'OK'
    end)
end)

-- Exemplo vRP:
--[[
local Proxy = module("vrp", "lib/Proxy")
local vRP = Proxy.getInterface("vRP")

AddEventHandler('lojafivem.ready', function()
    exports['loja-fivem-delivery']:RegisterStoreCommand('addPremium', function(user_id)
        local source = vRP.getUserSource(tonumber(user_id))
        if not source then
            return 'OK (offline - entregue na proxima conexao)'
        end
        vRP.SetPremium(tonumber(user_id))
        return 'OK'
    end)
end)
]]
