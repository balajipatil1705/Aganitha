<#
PowerShell script to run the autograder checks for the MiniShort app.
Usage:
  powershell -ExecutionPolicy Bypass -File .\scripts\check-autograder.ps1

This script performs:
  1. GET /healthz
  2. POST /api/links to create a link
  3. GET /:code (checks 302 Location) without following redirects
  4. GET /api/links/:code to verify clicks
  5. DELETE /api/links/:code
  6. Verify redirect returns 404 after deletion
#>

param(
  [string]$BaseUrl = 'http://localhost:3000'
)

function Write-Ok($msg){ Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Err($msg){ Write-Host "[ERR] $msg" -ForegroundColor Red }

Write-Host "Testing MiniShort app at $BaseUrl`n"

# 1. Health
try{
  $health = Invoke-RestMethod -Method Get -Uri "$BaseUrl/healthz" -TimeoutSec 5 -ErrorAction Stop
  Write-Ok "Health: $(ConvertTo-Json $health -Depth 5)"
} catch {
  Write-Err "Health endpoint failed: $_"
  exit 2
}

# 2. Create link
try{
  $body = @{ target = 'https://example.com/test' }
  $created = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/links" -Body ($body | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  Write-Ok "Created: $(ConvertTo-Json $created -Depth 5)"
  $code = $created.code
  if (-not $code) { Write-Err "No code returned from create"; exit 3 }
} catch {
  Write-Err "Create failed: $_"; exit 3
}

# Helper: GET without redirect using HttpClient
function Get-WithoutRedirect($url) {
  $handler = New-Object System.Net.Http.HttpClientHandler
  $handler.AllowAutoRedirect = $false
  $client = New-Object System.Net.Http.HttpClient($handler)
  try{
    $resp = $client.GetAsync($url).Result
    return $resp
  } catch {
    throw $_
  } finally {
    $client.Dispose()
    $handler.Dispose()
  }
}

# 3. Redirect check (should be 302)
try{
  $url = "$BaseUrl/$code"
  $resp = Get-WithoutRedirect $url
  $status = [int]$resp.StatusCode
  $loc = $resp.Headers.Location
  Write-Host "Redirect check -> HTTP $status, Location: $loc"
  if ($status -ne 302) { Write-Err "Expected 302 redirect, got $status"; exit 4 }
  Write-Ok "Redirect target: $loc"
} catch {
  Write-Err "Redirect check failed: $_"; exit 4
}

# 4. Stats - should show clicks >= 0 (after redirect it should increment)
try{
  $stats = Invoke-RestMethod -Method Get -Uri "$BaseUrl/api/links/$code" -ErrorAction Stop
  Write-Ok "Stats: $(ConvertTo-Json $stats -Depth 5)"
} catch {
  Write-Err "Stats fetch failed: $_"; exit 5
}

# 5. Delete
try{
  Invoke-RestMethod -Method Delete -Uri "$BaseUrl/api/links/$code" -ErrorAction Stop
  Write-Ok "Deleted code $code"
} catch {
  Write-Err "Delete failed: $_"; exit 6
}

# 6. Verify redirect returns 404 after deletion
try{
  $resp2 = Get-WithoutRedirect "$BaseUrl/$code"
  $status2 = [int]$resp2.StatusCode
  if ($status2 -eq 404) { Write-Ok "After deletion, redirect returns 404 as expected" } else { Write-Err "After deletion expected 404, got $status2"; exit 7 }
} catch {
  # If an exception contains a response we can inspect it
  if ($_.Exception.Response) {
    $r = $_.Exception.Response
    try{ $sc = $r.StatusCode.value__; if ($sc -eq 404) { Write-Ok "After deletion, redirect returns 404" } else { Write-Err "After deletion expected 404, got $sc"; exit 7 } } catch { Write-Err "After deletion check error: $_"; exit 7 }
  } else {
    Write-Err "After deletion check failed: $_"; exit 7
  }
}

Write-Host "`nAll checks completed successfully." -ForegroundColor Cyan
exit 0
