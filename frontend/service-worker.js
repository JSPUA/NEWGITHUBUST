self.addEventListener('push', event => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'http://image.ibb.co/frYOFd/tmlogo.png'
    });
  });