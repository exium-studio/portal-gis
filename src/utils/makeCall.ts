function makeCall(phoneNumber: string) {
  const isTelSupported =
    navigator.userAgent.includes("Android") ||
    navigator.userAgent.includes("iPhone") ||
    navigator.userAgent.includes("iPad") ||
    navigator.userAgent.includes("Windows Phone");

  if (isTelSupported) {
    window.location.href = `tel:${phoneNumber}`;
  } else {
    alert("This device does not support phone calls.");
  }
}
