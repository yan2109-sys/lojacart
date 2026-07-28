local pendingDeliveries = {}
local Commands = {}

function RegisterStoreCommand(name, handler)
    Commands[name] = handler
    if Config.Debug then
        print("[LojaFiveM] Comando registrado: " .. name)
    end
end

exports('RegisterStoreCommand', RegisterStoreCommand)

local function findPlayerSource(identifier)
    if not identifier then return nil end

    local asNumber = tonumber(identifier)
    if asNumber and GetPlayerName(asNumber) then
        return asNumber
    end

    for _, src in ipairs(GetPlayers()) do
        local srcNum = tonumber(src)
        local license = GetPlayerIdentifierByType(srcNum, 'license')
        local steam = GetPlayerIdentifierByType(srcNum, 'steam')

        if license and (license == identifier or string.find(license, identifier, 1, true)) then
            return srcNum
        end
        if steam and (steam == identifier or string.find(steam, identifier, 1, true)) then
            return srcNum
        end
    end

    return nil
end

local function notifyPlayer(src, message)
    if src and GetPlayerName(src) then
        TriggerClientEvent('lojafivem:notify', src, message)
    end
end

local function executeDelivery(delivery)
    local cmd = delivery.command
    local args = delivery.args or {}

    if Config.Debug then
        print("[LojaFiveM] Executando: " .. cmd .. " | args: " .. json.encode(args))
    end

    if Commands[cmd] then
        local ok, result = pcall(function()
            return Commands[cmd](table.unpack(args))
        end)
        return ok, result
    end

    if cmd == "notify" then
        local src = findPlayerSource(args[1]) or tonumber(args[1])
        notifyPlayer(src, "Seu pedido foi entregue! Obrigado pela compra.")
        return true, "OK"
    end

    if cmd == "addvip" then
        local identifier = args[1]
        local tier = args[2] or "bronze"
        local days = args[3] or "30"
        local src = findPlayerSource(identifier)
        print("[LojaFiveM] VIP " .. tier .. " (" .. days .. " dias) para ID: " .. tostring(identifier))
        notifyPlayer(src, "VIP " .. tier .. " ativado por " .. days .. " dias!")
        return true, "VIP added"
    end

    if cmd == "givemoney" then
        local identifier = args[1]
        local amount = args[2] or "0"
        local src = findPlayerSource(identifier)
        print("[LojaFiveM] R$" .. amount .. " para ID: " .. tostring(identifier))
        notifyPlayer(src, "R$" .. amount .. " creditados na sua conta!")
        return true, "Money added"
    end

    if cmd == "spawnvehicle" or cmd == "givevehicle" then
        local identifier = args[1]
        local model = args[2] or "adder"
        local src = findPlayerSource(identifier)

        if not src then
            print("[LojaFiveM] Jogador offline para spawn: " .. tostring(identifier))
            return false, "Jogador offline"
        end

        TriggerClientEvent('lojafivem:spawnVehicle', src, model)
        print("[LojaFiveM] Veiculo " .. model .. " spawnado para source " .. tostring(src))
        return true, "Vehicle spawned"
    end

    print("[LojaFiveM] Comando desconhecido: " .. cmd)
    return false, "Unknown command"
end

local function completeDelivery(deliveryId, success, result)
    PerformHttpRequest(
        Config.StoreUrl .. "/api/fivem/deliveries?token=" .. Config.ApiToken,
        function(statusCode, response, headers)
            if Config.Debug then
                print("[LojaFiveM] Resposta complete: " .. tostring(statusCode))
            end
        end,
        'POST',
        json.encode({ deliveryId = deliveryId, success = success, result = tostring(result or "") }),
        { ['Content-Type'] = 'application/json' }
    )
end

local function pollDeliveries()
    PerformHttpRequest(
        Config.StoreUrl .. "/api/fivem/deliveries?token=" .. Config.ApiToken,
        function(statusCode, response, headers)
            if statusCode ~= 200 then
                if Config.Debug then
                    print("[LojaFiveM] Erro ao buscar entregas: " .. tostring(statusCode))
                end
                return
            end

            local data = json.decode(response)
            if not data or not data.success or not data.data then return end

            for _, delivery in ipairs(data.data) do
                CreateThread(function()
                    local ok, result = executeDelivery(delivery)
                    completeDelivery(delivery.id, ok, result)
                end)
            end
        end,
        'GET'
    )
end

CreateThread(function()
    print("[LojaFiveM] Sistema de entrega iniciado")
    print("[LojaFiveM] URL: " .. Config.StoreUrl)

    while true do
        pollDeliveries()
        Wait(Config.PollInterval)
    end
end)

TriggerEvent('lojafivem.ready')
