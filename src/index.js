export default {
  async fetch(request) {
    try {
      if (request.method === "HEAD") {
        console.log("new head req");
        return new Response(null, { status: 200 });
      } else if (request.method === "GET" || request.method === "POST") {
        const [serverIP, ClientIPAndPort] = new URL(request.url).pathname
          .replace("/", "")
          .split("/");

        console.log(request.method, serverIP, ClientIPAndPort);

        const res = await fetch(
          `http://${serverIP}.nip.io/${ClientIPAndPort}`,
          { method: request.method }
        );

        if (res.status != 200) throw Error();

        if (request.method == "GET") {
          const port = await res.text();
          return new Response(port);
        } else {
          return new Response(null, { status: 200 });
        }
      } else {
        return new Response(null, { status: 400 });
      }
    } catch (error) {
      console.log(error);
      return new Response(null, { status: 400 });
    }
  },
};
