(function() {
  const script = document.createElement('script');
  const timestamp = new Date().getTime();
  script.src = `https://supabase.frontend.co/storage/v1/object/public/assets/frontend.js?t=${timestamp}`;
  document.body.appendChild(script);
})();