RegisterNetEvent('lojafivem:spawnVehicle', function(model)
    local hash = joaat(model)
    if not IsModelInCdimage(hash) or not IsModelAVehicle(hash) then
        TriggerEvent('chat:addMessage', { color = {255, 80, 80}, args = {'Loja', 'Modelo de veiculo invalido: ' .. tostring(model)} })
        return
    end

    RequestModel(hash)
    local timeout = 0
    while not HasModelLoaded(hash) and timeout < 100 do
        Wait(50)
        timeout = timeout + 1
    end

    if not HasModelLoaded(hash) then return end

    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    local heading = GetEntityHeading(ped)
    local forward = GetEntityForwardVector(ped)

    local x = coords.x + forward.x * 4.0
    local y = coords.y + forward.y * 4.0
    local z = coords.z

    local veh = CreateVehicle(hash, x, y, z, heading, true, false)
    SetVehicleOnGroundProperly(veh)
    SetEntityAsMissionEntity(veh, true, true)
    SetVehicleNumberPlateText(veh, 'LOJA')
    SetPedIntoVehicle(ped, veh, -1)
    SetModelAsNoLongerNeeded(hash)

    TriggerEvent('chat:addMessage', { color = {80, 150, 255}, args = {'Loja', 'Seu veiculo foi entregue! Aproveite.'} })
end)

RegisterNetEvent('lojafivem:notify', function(message)
    TriggerEvent('chat:addMessage', { color = {80, 150, 255}, multiline = true, args = {'Loja', message or 'Pedido entregue!'} })
end)
