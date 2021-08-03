const main = async () => {
  const ws = new WebSocket("ws://localhost:4321");
  ws.onmessage = console.log;
  ws.onclose = console.log;
  ws.onerror = console.log;
  await new Promise((res) => {
    ws.onopen = res;
  });

  const data = {
    hello: "world",
    123: 456,
  };
  ws.send(JSON.stringify(data));
  ws.send(JSON.stringify(data));
  ws.send(JSON.stringify(data));
};

main().catch((err) => {
  console.log(err);
});
