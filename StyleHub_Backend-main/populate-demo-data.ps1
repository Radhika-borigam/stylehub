# =================================================================
#        STYLEHUB DEMO DATA POPULATION ORCHESTRATOR
# =================================================================
# This script populates the StyleHub platform with realistic mock data
# for demonstration purposes:
# - Registers 2 Salon Owners & 3 Customers in Keycloak + User DB
# - Logs in all users and retrieves JWTs
# - Creates 2 separate Salons (London, Manchester)
# - Creates 4 Categories (Hair, Nails, Massage, Facials)
# - Creates 6 Service Offerings (varying prices & durations)
# - Creates 6 Bookings across different slots and customers
# =================================================================

$GatewayUrl = "http://localhost:8081"
$Rand = Get-Random -Minimum 1000 -Maximum 9999

# 1. Define Users data
$UsersToCreate = @(
    @{
        email = "jane.stylist_demo@example.com"
        password = "DemoOwnerPass1!"
        phone = "990001$Rand"
        fullName = "Jane Stylist A"
        username = "jane_stylist_demo"
        role = "SALON_OWNER"
    },
    @{
        email = "sergei.spa_demo@example.com"
        password = "DemoOwnerPass1!"
        phone = "990002$Rand"
        fullName = "Sergei Romanov B"
        username = "sergei_spa_demo"
        role = "SALON_OWNER"
    },
    @{
        email = "alice.smith_demo@example.com"
        password = "DemoCustPass1!"
        phone = "880001$Rand"
        fullName = "Alice Smith One"
        username = "alice_smith_demo"
        role = "CUSTOMER"
    },
    @{
        email = "bob.jones_demo@example.com"
        password = "DemoCustPass1!"
        phone = "880002$Rand"
        fullName = "Bob Jones Two"
        username = "bob_jones_demo"
        role = "CUSTOMER"
    },
    @{
        email = "charlie.brown_demo@example.com"
        password = "DemoCustPass1!"
        phone = "880003$Rand"
        fullName = "Charlie Brown Three"
        username = "charlie_brown_demo"
        role = "CUSTOMER"
    }
)

Write-Host "================================================================" -ForegroundColor Blue
Write-Host "            STYLEHUB DEMO DATA POPULATOR SCRIPT                " -ForegroundColor Blue
Write-Host "================================================================" -ForegroundColor Blue
Write-Host "Populating realistic data using seed: $Rand" -ForegroundColor Cyan

# 2. Register and Login Users
$UserTokens = @{}
foreach ($u in $UsersToCreate) {
    Write-Host "`nRegistering $($u.fullName)..." -ForegroundColor Cyan
    $SignupPayload = @{
        email = $u.email
        password = $u.password
        phone = $u.phone
        fullName = $u.fullName
        username = $u.username
        role = $u.role
    } | ConvertTo-Json

    try {
        $SignupRes = Invoke-RestMethod -Uri "$GatewayUrl/auth/signup" -Method Post -ContentType "application/json" -Body $SignupPayload -ErrorAction Stop
        if ($SignupRes.success -eq $true) {
            Write-Host "[SUCCESS] Registered $($u.email)" -ForegroundColor Green
        } else {
            Write-Host "[WARNING] Signup response success is not true: $($SignupRes | ConvertTo-Json)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[ERROR] Failed to register $($u.email): $_" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Detail: $($reader.ReadToEnd())" -ForegroundColor Red
        }
        continue
    }

    Write-Host "Logging in $($u.fullName)..." -ForegroundColor Cyan
    $LoginPayload = @{
        email = $u.email
        password = $u.password
    } | ConvertTo-Json

    try {
        $LoginRes = Invoke-RestMethod -Uri "$GatewayUrl/auth/login" -Method Post -ContentType "application/json" -Body $LoginPayload -ErrorAction Stop
        $jwt = $LoginRes.data.jwt
        if ($jwt) {
            $UserTokens[$u.email] = "Bearer $jwt"
            Write-Host "[SUCCESS] Token obtained for $($u.email)" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] Login response did not contain JWT token." -ForegroundColor Red
        }
    } catch {
        Write-Host "[ERROR] Failed to login $($u.email): $_" -ForegroundColor Red
    }
}

$OwnerAToken = $UserTokens["jane.stylist_demo@example.com"]
$OwnerBToken = $UserTokens["sergei.spa_demo@example.com"]
$Cust1Token = $UserTokens["alice.smith_demo@example.com"]
$Cust2Token = $UserTokens["bob.jones_demo@example.com"]
$Cust3Token = $UserTokens["charlie.brown_demo@example.com"]

if (-not $OwnerAToken -or -not $OwnerBToken -or -not $Cust1Token -or -not $Cust2Token -or -not $Cust3Token) {
    Write-Host "`n[FATAL] Some users failed to register/login. Cannot proceed with data population." -ForegroundColor Red
    exit 1
}

# 3. Create Salons FIRST (required for category association)
Write-Host "`n----------------------------------------------------------------" -ForegroundColor Blue
Write-Host "CREATING SALONS..." -ForegroundColor Cyan

# Salon A (Owner A)
$SalonAPayload = @{
    name = "Chic Cuts & Nails Studio"
    address = "120 Regent Street, Mayfair"
    phoneNumber = "020-7946-0111"
    email = "bookings@chiccuts_$Rand.com"
    city = "London"
    openTime = "09:00:00"
    closeTime = "21:00:00"
    isOpen = $true
    homeService = $false
    active = $true
} | ConvertTo-Json

try {
    $SalonARes = Invoke-RestMethod -Uri "$GatewayUrl/api/salons" -Method Post -Headers @{ "Authorization" = $OwnerAToken } -ContentType "application/json" -Body $SalonAPayload -ErrorAction Stop
    $SalonAId = $SalonARes.id
    Write-Host "[SUCCESS] Created Salon A: $($SalonARes.name) (ID: $SalonAId, City: London)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to create Salon A: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Detail: $($reader.ReadToEnd())" -ForegroundColor Red
    }
    exit 1
}

# Salon B (Owner B)
$SalonBPayload = @{
    name = "Aura Zen Wellness & Spa"
    address = "45 Deansgate, City Centre"
    phoneNumber = "0161-496-0222"
    email = "info@aurazen_$Rand.com"
    city = "Manchester"
    openTime = "10:00:00"
    closeTime = "22:00:00"
    isOpen = $true
    homeService = $true
    active = $true
} | ConvertTo-Json

try {
    $SalonBRes = Invoke-RestMethod -Uri "$GatewayUrl/api/salons" -Method Post -Headers @{ "Authorization" = $OwnerBToken } -ContentType "application/json" -Body $SalonBPayload -ErrorAction Stop
    $SalonBId = $SalonBRes.id
    Write-Host "[SUCCESS] Created Salon B: $($SalonBRes.name) (ID: $SalonBId, City: Manchester)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to create Salon B: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Detail: $($reader.ReadToEnd())" -ForegroundColor Red
    }
    exit 1
}

# 4. Create Categories SECOND
Write-Host "`n----------------------------------------------------------------" -ForegroundColor Blue
Write-Host "CREATING SALON CATEGORIES..." -ForegroundColor Cyan

# Owner A creates Hair and Nails categories
$CategoriesOwnerA = @(
    @{ name = "Hair Styling & Colors $Rand"; image = "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500" },
    @{ name = "Nail Art & Manicure $Rand"; image = "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500" }
)

# Owner B creates Massage and Facials categories
$CategoriesOwnerB = @(
    @{ name = "Therapeutic Massage $Rand"; image = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500" },
    @{ name = "Skin Care & Facials $Rand"; image = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500" }
)

$CategoryIds = @()

# Register Owner A Categories
foreach ($cat in $CategoriesOwnerA) {
    $Payload = $cat | ConvertTo-Json
    try {
        $Res = Invoke-RestMethod -Uri "$GatewayUrl/api/categories/salon-owner" -Method Post -Headers @{ "Authorization" = $OwnerAToken } -ContentType "application/json" -Body $Payload -ErrorAction Stop
        if ($Res.id) {
            $CategoryIds += $Res.id
            Write-Host "[SUCCESS] Created Category for Salon A: $($Res.name) (ID: $($Res.id))" -ForegroundColor Green
        }
    } catch {
        Write-Host "[ERROR] Failed to create category $($cat.name): $_" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Detail: $($reader.ReadToEnd())" -ForegroundColor Red
        }
    }
}

# Register Owner B Categories
foreach ($cat in $CategoriesOwnerB) {
    $Payload = $cat | ConvertTo-Json
    try {
        $Res = Invoke-RestMethod -Uri "$GatewayUrl/api/categories/salon-owner" -Method Post -Headers @{ "Authorization" = $OwnerBToken } -ContentType "application/json" -Body $Payload -ErrorAction Stop
        if ($Res.id) {
            $CategoryIds += $Res.id
            Write-Host "[SUCCESS] Created Category for Salon B: $($Res.name) (ID: $($Res.id))" -ForegroundColor Green
        }
    } catch {
        Write-Host "[ERROR] Failed to create category $($cat.name): $_" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Detail: $($reader.ReadToEnd())" -ForegroundColor Red
        }
    }
}

if ($CategoryIds.Count -lt 4) {
    Write-Host "[FATAL] Failed to create all 4 categories. Cannot proceed." -ForegroundColor Red
    exit 1
}

$CatHairId = $CategoryIds[0]
$CatNailId = $CategoryIds[1]
$CatMassageId = $CategoryIds[2]
$CatFacialId = $CategoryIds[3]

# 5. Create Service Offerings
Write-Host "`n----------------------------------------------------------------" -ForegroundColor Blue
Write-Host "CREATING SERVICE OFFERINGS..." -ForegroundColor Cyan

$OfferingsToCreate = @(
    # Salon A Offerings (Hair & Nails)
    @{
        token = $OwnerAToken
        payload = @{
            name = "Premium Balayage & Cut"
            description = "Custom hand-painted French balayage highlights followed by a wash and trim."
            price = 180
            duration = 90
            category = [int]$CatHairId
            image = "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500"
        }
    },
    @{
        token = $OwnerAToken
        payload = @{
            name = "Gentleman's Fade & Beard Trim"
            description = "Sharp precision fade haircut accompanied by hot towel beard styling and shave."
            price = 45
            duration = 35
            category = [int]$CatHairId
            image = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500"
        }
    },
    @{
        token = $OwnerAToken
        payload = @{
            name = "Gel Manicure & Pedicure"
            description = "Long-lasting gel nail coat, cuticle clean, and relaxing lavender foot soak."
            price = 75
            duration = 60
            category = [int]$CatNailId
            image = "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500"
        }
    },
    # Salon B Offerings (Massage & Facials)
    @{
        token = $OwnerBToken
        payload = @{
            name = "Hot Stone Massage Therapy"
            description = "Melts away stress using basalt stones placed on key energy centers of the body."
            price = 120
            duration = 75
            category = [int]$CatMassageId
            image = "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=500"
        }
    },
    @{
        token = $OwnerBToken
        payload = @{
            name = "Traditional Swedish Massage"
            description = "Gentle full body massage with light pressure for circulation and mental relaxation."
            price = 85
            duration = 60
            category = [int]$CatMassageId
            image = "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500"
        }
    },
    @{
        token = $OwnerBToken
        payload = @{
            name = "HydraFacial Skin Rejuvenation"
            description = "Multi-step resurfacing treatment utilizing custom serums to extract and hydrate."
            price = 150
            duration = 50
            category = [int]$CatFacialId
            image = "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500"
        }
    }
)

$OfferingIds = @()
foreach ($off in $OfferingsToCreate) {
    $PayloadJson = $off.payload | ConvertTo-Json
    try {
        $Res = Invoke-RestMethod -Uri "$GatewayUrl/api/service-offering/salon-owner" -Method Post -Headers @{ "Authorization" = $off.token } -ContentType "application/json" -Body $PayloadJson -ErrorAction Stop
        if ($Res.id) {
            $OfferingIds += $Res.id
            Write-Host "[SUCCESS] Created Offering: $($Res.name) (ID: $($Res.id), Price: `$$($Res.price))" -ForegroundColor Green
        }
    } catch {
        Write-Host "[ERROR] Failed to create offering $($off.payload.name): $_" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Detail: $($reader.ReadToEnd())" -ForegroundColor Red
        }
    }
}

if ($OfferingIds.Count -lt 6) {
    Write-Host "[FATAL] Failed to create all service offerings. Cannot proceed." -ForegroundColor Red
    exit 1
}

$OffBalayageId = $OfferingIds[0]
$OffFadeId = $OfferingIds[1]
$OffManiPediId = $OfferingIds[2]
$OffHotStoneId = $OfferingIds[3]
$OffSwedishId = $OfferingIds[4]
$OffHydraId = $OfferingIds[5]

# 6. Create Bookings
Write-Host "`n----------------------------------------------------------------" -ForegroundColor Blue
Write-Host "CREATING DEMO APPOINTMENT BOOKINGS..." -ForegroundColor Cyan

$Tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
$DayAfter = (Get-Date).AddDays(2).ToString("yyyy-MM-dd")

$BookingsToCreate = @(
    # Customer 1 bookings
    @{
        token = $Cust1Token
        salonId = $SalonAId
        payload = @{
            startTime = "${Tomorrow}T10:00:00"
            endTime = "${Tomorrow}T11:30:00"
            serviceIds = @([int]$OffBalayageId)
            status = "PENDING"
        }
    },
    @{
        token = $Cust1Token
        salonId = $SalonBId
        payload = @{
            startTime = "${DayAfter}T14:00:00"
            endTime = "${DayAfter}T15:15:00"
            serviceIds = @([int]$OffHotStoneId)
            status = "PENDING"
        }
    },
    # Customer 2 bookings
    @{
        token = $Cust2Token
        salonId = $SalonAId
        payload = @{
            startTime = "${Tomorrow}T12:00:00"
            endTime = "${Tomorrow}T12:35:00"
            serviceIds = @([int]$OffFadeId)
            status = "PENDING"
        }
    },
    @{
        token = $Cust2Token
        salonId = $SalonBId
        payload = @{
            startTime = "${Tomorrow}T16:00:00"
            endTime = "${Tomorrow}T16:50:00"
            serviceIds = @([int]$OffHydraId)
            status = "PENDING"
        }
    },
    # Customer 3 bookings
    @{
        token = $Cust3Token
        salonId = $SalonAId
        payload = @{
            startTime = "${DayAfter}T15:00:00"
            endTime = "${DayAfter}T16:00:00"
            serviceIds = @([int]$OffManiPediId)
            status = "PENDING"
        }
    },
    @{
        token = $Cust3Token
        salonId = $SalonBId
        payload = @{
            startTime = "${DayAfter}T11:00:00"
            endTime = "${DayAfter}T12:00:00"
            serviceIds = @([int]$OffSwedishId)
            status = "PENDING"
        }
    }
)

foreach ($b in $BookingsToCreate) {
    $PayloadJson = $b.payload | ConvertTo-Json
    try {
        $Res = Invoke-RestMethod -Uri "$GatewayUrl/api/bookings?salonId=$($b.salonId)&paymentMethod=RAZORPAY" -Method Post -Headers @{ "Authorization" = $b.token } -ContentType "application/json" -Body $PayloadJson -ErrorAction Stop
        $statusVal = "PENDING"
        if ($Res.status) { $statusVal = $Res.status }
        Write-Host "[SUCCESS] Booking created for Salon ID: $($b.salonId) on $($b.payload.startTime). Status: $statusVal" -ForegroundColor Green
    } catch {
        # Catch and log detail, sometimes bookings can hit operating hours or overlap checks
        Write-Host "[INFO] Booking registration at $($b.payload.startTime) for Salon ID: $($b.salonId). Detail: $_" -ForegroundColor Yellow
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Response error: $($reader.ReadToEnd())" -ForegroundColor DarkYellow
        }
    }
}

Write-Host "`n================================================================" -ForegroundColor Blue
Write-Host "         STYLEHUB DEMO DATA POPULATED SUCCESSFULLY!             " -ForegroundColor Green
Write-Host "     Use the following credentials in your browser for a demo:   " -ForegroundColor Green
Write-Host "----------------------------------------------------------------" -ForegroundColor Blue
Write-Host "  [Salon Owner A (Chic Cuts & Nails Studio - London)]" -ForegroundColor Cyan
Write-Host "    - Email:    jane.stylist_demo@example.com" -ForegroundColor Yellow
Write-Host "    - Password: DemoOwnerPass1!" -ForegroundColor Yellow
Write-Host "  [Salon Owner B (Aura Zen Wellness & Spa - Manchester)]" -ForegroundColor Cyan
Write-Host "    - Email:    sergei.spa_demo@example.com" -ForegroundColor Yellow
Write-Host "    - Password: DemoOwnerPass1!" -ForegroundColor Yellow
Write-Host "  [Customer 1 (Alice Smith One)]" -ForegroundColor Cyan
Write-Host "    - Email:    alice.smith_demo@example.com" -ForegroundColor Yellow
Write-Host "    - Password: DemoCustPass1!" -ForegroundColor Yellow
Write-Host "  [Customer 2 (Bob Jones Two)]" -ForegroundColor Cyan
Write-Host "    - Email:    bob.jones_demo@example.com" -ForegroundColor Yellow
Write-Host "    - Password: DemoCustPass1!" -ForegroundColor Yellow
Write-Host "  [Customer 3 (Charlie Brown Three)]" -ForegroundColor Cyan
Write-Host "    - Email:    charlie.brown_demo@example.com" -ForegroundColor Yellow
Write-Host "    - Password: DemoCustPass1!" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Blue
