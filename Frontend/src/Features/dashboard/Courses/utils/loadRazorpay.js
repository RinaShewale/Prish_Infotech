let loaded = false;

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (loaded) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      loaded = true;
      resolve(true);
    };

    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export default loadRazorpay;