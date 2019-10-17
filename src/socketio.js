import mitt from 'mitt';

export default (url, options) => {
  const emitter = mitt();
  const {
    socket,
    logEvent = 'logLines',
    logErrorEvent = 'logError',
    logEndEvent = 'logEnd',
  } = options;

  emitter.on('start', async () => {
    socket.on(logErrorEvent, err => {
      emitter.emit('error', err);
    });

    socket.on(logEvent, lines => {
      emitter.emit('update', { lines });
    });

    socket.on(logEndEvent, () => {
      emitter.emit('end', null);
    });
  });

  emitter.on('abort', async () => {
    socket.off(logEvent);
    socket.off(logErrorEvent);
    socket.off(logEndEvent);
  });

  return emitter;
};
