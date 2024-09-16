import Pusher from 'pusher-js';

const pusher = new Pusher('85894bf4df6d2b94f247', {
    cluster: 'ap2',
  });

export default pusher;
