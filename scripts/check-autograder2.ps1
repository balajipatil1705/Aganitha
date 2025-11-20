Param(
  [string]$BaseUrl = 'http://localhost:3000'
)

Write-Host "Waiting for $BaseUrl/healthz..."
for ($i=0; $i -lt 30; $i++) {
  try {
    $h = Invoke-RestMethod -Method Get -Uri "$BaseUrl/healthz" -TimeoutSec 3 -ErrorAction Stop
    Write-Host "Health: $(ConvertTo-Json $h -Depth 3)" -ForegroundColor Green
    break
  } catch {
    Start-Sleep -Seconds 1
  }
  if ($i -eq 29) { Write-Host "Health check failed after waiting" -ForegroundColor Red; exit 2 }
}

# Create link
try {
  $body = @{ target = 'https://example.com/test' } | ConvertTo-Json
  $created = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/links" -Body $body -ContentType 'application/json' -ErrorAction Stop
  Write-Host "Created: $($created | ConvertTo-Json -Depth 3)" -ForegroundColor Green
} catch {
  Write-Host "Create failed: $_" -ForegroundColor Red; exit 3
}

$code = $created.code
if (-not $code) { Write-Host "No code returned" -ForegroundColor Red; exit 4 }

# Check redirect using curl.exe (don't follow redirects)
$curl = "curl.exe"
$curlArgs = "-I -s -S http://localhost:3000/$code"
Write-Host "Checking redirect for code $code"
$out = & $curl -I -s -S "http://localhost:3000/$code" 2>&1
Write-Host $out

# Fetch stats
try {
  $stats = Invoke-RestMethod -Method Get -Uri "$BaseUrl/api/links/$code" -ErrorAction Stop
  Write-Host "Stats: $($stats | ConvertTo-Json -Depth 3)" -ForegroundColor Green
} catch {
  Write-Host "Stats fetch failed: $_" -ForegroundColor Red; exit 5
}

# Delete
try {
  Invoke-RestMethod -Method Delete -Uri "$BaseUrl/api/links/$code" -ErrorAction Stop
  Write-Host "Deleted $code" -ForegroundColor Green
} catch {
  Write-Host "Delete failed: $_" -ForegroundColor Red; exit 6
}

# Verify 404 after delete
$out2 = & $curl -I -s -S "http://localhost:3000/$code" 2>&1
Write-Host "After delete header:"; Write-Host $out2

Write-Host "Checks complete" -ForegroundColor Cyan
exit 0
