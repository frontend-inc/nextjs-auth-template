(function() {
  const script = document.createElement('script');
  const timestamp = new Date().getTime();
  script.src = `https://frontend-ai.s3.us-east-2.amazonaws.com/frontend.js?t=${timestamp}`;
  document.body.appendChild(script);
})();