# Cambiar a la carpeta de tu repo
cd "C:\Users\ppasc\OneDrive\Documentos\GitHub\Backend"

# Crear un diccionario para contar líneas por autor
$dict = @{}

# Recorrer todos los archivos rastreados por Git
git ls-files | ForEach-Object {
    git blame --line-porcelain $_ | ForEach-Object {
        if ($_ -match "^author (.+)$") {
            $author = $matches[1]
            if (-not $dict.ContainsKey($author)) { $dict[$author] = 0 }
            $dict[$author]++
        }
    }
}

# Mostrar resultados ordenados de mayor a menor
$dict.GetEnumerator() | Sort-Object -Property Value -Descending | ForEach-Object {
    "{0} : {1}" -f $_.Key, $_.Value
}