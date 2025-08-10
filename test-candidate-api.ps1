# Test script for candidate API endpoints

Write-Host "Testing Candidate API Endpoints" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Step 1: Login as candidate
Write-Host "`n1. Logging in as candidate..." -ForegroundColor Yellow
$loginBody = @{
    email = "candidate@test.com"
    password = "Test123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "   ✓ Login successful" -ForegroundColor Green
    Write-Host "   Token: $($loginResponse.token.Substring(0, 20))..." -ForegroundColor Gray
    $token = $loginResponse.token
} catch {
    Write-Host "   ✗ Login failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Get profile
Write-Host "`n2. Getting profile..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/profile" -Method GET -Headers $headers
    Write-Host "   ✓ Profile retrieved" -ForegroundColor Green
    Write-Host "   User: $($profileResponse.email) - Role: $($profileResponse.role)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Profile failed: $_" -ForegroundColor Red
}

# Step 3: Get candidate invitations
Write-Host "`n3. Getting candidate invitations..." -ForegroundColor Yellow
try {
    $invitationsResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/candidates/my-invitations" -Method GET -Headers $headers
    Write-Host "   ✓ Invitations retrieved" -ForegroundColor Green
    if ($invitationsResponse.invitations) {
        Write-Host "   Found $($invitationsResponse.invitations.Count) invitation(s):" -ForegroundColor Gray
        foreach ($invitation in $invitationsResponse.invitations) {
            Write-Host "     - $($invitation.title) (Status: $($invitation.status))" -ForegroundColor Gray
        }
    } else {
        Write-Host "   No invitations found" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ Invitations failed: $_" -ForegroundColor Red
    Write-Host "   Response: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Step 4: Get candidate submissions
Write-Host "`n4. Getting candidate submissions..." -ForegroundColor Yellow
try {
    $submissionsResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/candidates/my-submissions" -Method GET -Headers $headers
    Write-Host "   ✓ Submissions retrieved" -ForegroundColor Green
    if ($submissionsResponse.submissions) {
        Write-Host "   Found $($submissionsResponse.submissions.Count) submission(s)" -ForegroundColor Gray
    } else {
        Write-Host "   No submissions found" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ Submissions failed: $_" -ForegroundColor Red
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Test completed!" -ForegroundColor Cyan
