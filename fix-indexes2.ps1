# Read the file
$lines = Get-Content "drizzle/schema.ts"
$inTable = ""

for ($i = 0; $i \u003c $lines.Count; $i++) {
    $line = $lines[$i]
    
    # Detect which table we're in
    if ($line -match 'export const (\w+) = pgTable') {
        $inTable = $matches[1]
    }
    
    # Replace index names based on current table
    if ($line -match 'index\("([^"]+)"\)') {
        $indexName = $matches[1]
        $newIndexName = "${inTable}_${indexName}"
        $lines[$i] = $line -replace "index\(`"$indexName`")", "index(`"$newIndexName`")"
    }
}

$lines | Set-Content "drizzle/schema.ts"
Write-Host "Fixed all index names with table prefixes!"
