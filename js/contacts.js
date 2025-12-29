// This script ensures the social media links open correctly
document.addEventListener("DOMContentLoaded", () => {
  console.log("Contact page loaded successfully.");

  const facebookLink = document.getElementById("fb-link");
  const tiktokLink = document.getElementById("tt-link");

  // Simple alert or log when a user clicks a social link
  facebookLink.addEventListener("click", () => {
    console.log("Navigating to Facebook...");
  });

  tiktokLink.addEventListener("click", () => {
    console.log("Navigating to TikTok...");
  });
});
