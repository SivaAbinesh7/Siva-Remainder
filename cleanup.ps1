$base = "c:\Users\dell\Downloads\Siva-Remainder"

# Misc unused files
Remove-Item "$base\bun.lockb" -Force -ErrorAction SilentlyContinue
Remove-Item "$base\vite.config.ts.timestamp-1758736069971-46d52b53042ba.mjs" -Force -ErrorAction SilentlyContinue
Remove-Item "$base\dist" -Recurse -Force -ErrorAction SilentlyContinue

# Unused component
Remove-Item "$base\src\components\HeartCursor.tsx" -Force -ErrorAction SilentlyContinue

# Unused UI components
$unusedUI = @(
    "accordion", "alert-dialog", "alert", "aspect-ratio", "avatar",
    "badge", "breadcrumb", "calendar", "carousel", "chart",
    "collapsible", "command", "context-menu", "dialog", "drawer",
    "dropdown-menu", "form", "hover-card", "input-otp", "label",
    "menubar", "navigation-menu", "pagination", "popover", "progress",
    "radio-group", "resizable", "scroll-area", "select", "separator",
    "sheet", "sidebar", "skeleton", "slider", "switch",
    "table", "tabs", "textarea", "toggle", "toggle-group"
)

foreach ($component in $unusedUI) {
    Remove-Item "$base\src\components\ui\$component.tsx" -Force -ErrorAction SilentlyContinue
    Write-Host "Deleted: $component.tsx"
}

Write-Host ""
Write-Host "=== Cleanup Complete ==="
Write-Host "Remaining UI components:"
Get-ChildItem "$base\src\components\ui" | Select-Object -ExpandProperty Name
