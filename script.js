
// only allow to type Number and some special letters
document.getElementById('display').addEventListener('input', function(event) {
    // Allow only numbers and special characters
    this.value = this.value.replace(/[^0-9!@#$%^&*()_+={}|\[\]:;"'<>,.?/\\-]/g, '');
});
  

// Function to update CSS variables color based on user input
document.getElementById('base-color').addEventListener('input', function(event) {
// Get the color value from the color picker
const baseColor = event.target.value;

// Set the base color and the calculated border colors as CSS variables
document.documentElement.style.setProperty('--base-color', baseColor);

// Calculate border and focus colors based on the base color
const darkerColor = darkenColor(baseColor, 0.3); // Darken by 30% for border
const focusColor = darkenColor(baseColor, 0.5); // Darken by 50% for focus state

// Set the calculated colors
document.documentElement.style.setProperty('--calculator-outer', darkerColor);
document.documentElement.style.setProperty('--calculator-inner', focusColor);
});

// Function to darken the color by a certain percentage
function darkenColor(color, percent) {
// Convert hex to RGB
let hex = color.replace('#', '');
let r = parseInt(hex.substring(0, 2), 16);
let g = parseInt(hex.substring(2, 4), 16);
let b = parseInt(hex.substring(4, 6), 16);

// Darken by multiplying with the percent
r = Math.max(0, Math.min(255, r * (1 - percent)));
g = Math.max(0, Math.min(255, g * (1 - percent)));
b = Math.max(0, Math.min(255, b * (1 - percent)));

// Convert RGB back to hex
return `rgb(${r}, ${g}, ${b})`;
}

// Set the initial colors when the page loads
document.getElementById('base-color').dispatchEvent(new Event('input'));