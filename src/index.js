export default {
  async fetch(request) {
    try {
      if (request.method === "HEAD") {
        return new Response(null, { status: 200 });
      } else if (request.method === "GET" || request.method === "POST") {
        let clientIP = request.headers.get("X-Forwarded-For");
        if (!clientIP) clientIP = request.headers.get("Cf-Connecting-Ip");
        const [serverIP, clientPort] = new URL(request.url).pathname
          .replace("/", "")
          .split("/");

        const res = await fetch(
          `http://${serverIP}.nip.io/${clientIP}:${clientPort}`,
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
