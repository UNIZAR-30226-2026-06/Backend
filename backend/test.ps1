# test.ps1
# Script de pruebas para backend NotUno

# --- 1️⃣ Registro ---
$bodyRegister = @{
    nombre_usuario = "gonza"
    password       = "Test123!"
    correo         = "gonza@test.com"
} | ConvertTo-Json

Write-Host "`n=== REGISTRO ==="
try {
    $responseRegister = Invoke-RestMethod -Uri http://localhost:3000/auth/register -Method POST -Body $bodyRegister -ContentType "application/json"
    Write-Host "Usuario registrado. Token recibido:`n$responseRegister.token"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# --- 2️⃣ Login ---
$bodyLogin = @{
    nombre_usuario = "gonza"
    password       = "Test123!"
} | ConvertTo-Json

Write-Host "`n=== LOGIN ==="
try {
    $responseLogin = Invoke-RestMethod -Uri http://localhost:3000/auth/login -Method POST -Body $bodyLogin -ContentType "application/json"
    $token = $responseLogin.token
    Write-Host "Login exitoso. Token:`n$token"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# --- 3️⃣ Obtener perfil (/me) ---
Write-Host "`n=== PERFIL (/me) ==="
$headers = @{ Authorization = "Bearer $token" }

try {
    $profile = Invoke-RestMethod -Uri http://localhost:3000/auth/me -Method GET -Headers $headers
    Write-Host "Datos de usuario:`n$($profile | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# --- 4️⃣ Cambiar contraseña ---
$bodyChangePass = @{
    contrasena_actual = "Test123!"
    nueva_contrasena  = "Test456!"
} | ConvertTo-Json

Write-Host "`n=== CAMBIAR CONTRASEÑA ==="
try {
    $changePass = Invoke-RestMethod -Uri http://localhost:3000/users/change-password -Method POST -Body $bodyChangePass -Headers $headers -ContentType "application/json"
    Write-Host $changePass.mensaje
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# --- 5️⃣ Recuperar contraseña ---
$bodyForgot = @{
    correo = "gonza@test.com"
} | ConvertTo-Json

Write-Host "`n=== RECUPERAR CONTRASEÑA ==="
try {
    $forgot = Invoke-RestMethod -Uri http://localhost:3000/users/forgot-password -Method POST -Body $bodyForgot -ContentType "application/json"
    Write-Host "Nueva contraseña temporal: $($forgot.nueva_contrasena_temporal)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}