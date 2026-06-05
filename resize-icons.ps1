Add-Type -AssemblyName System.Drawing

$src = "C:\Users\HP\.gemini\antigravity-ide\brain\7d80470b-0753-4b74-9cf4-c5e20a82ee57\lifeos_icon_1780639331359.png"
$outDir = "D:\Projects\Sanskar's OS\public"

foreach ($size in @(72, 96, 128, 144, 152, 192, 384, 512)) {
    $img = [System.Drawing.Image]::FromFile($src)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $size, $size)
    $outPath = "$outDir\icon-$size.png"
    $bmp.Save($outPath)
    $g.Dispose()
    $bmp.Dispose()
    $img.Dispose()
    Write-Host "Created $outPath"
}

Write-Host "All icons generated!"
