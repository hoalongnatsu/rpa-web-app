function register(config) {

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => {
      console.log('Service worker registered!')
    })
    .catch(function(err) {
      console.log(err);
    });
  }
}

export default {
  register
}