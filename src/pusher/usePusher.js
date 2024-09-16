import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const usePusher = ( channelName, eventName ) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(channelName);

    channel.bind(eventName, (data) => {
      setData(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe(channelName);
    };
  }, [channelName, eventName]);

  return data
};

export default usePusher;
