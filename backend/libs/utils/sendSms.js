import pkg from 'follow-redirects'

const { https } = pkg

export const sendsms = (phoneNumber, message) => {
    const options = {
        method: 'POST',
        hostname: process.env.INFOBIP_API_URL,
        path: '/sms/2/text/advanced',
        headers: {
            'Authorization': process.env.INFOBIP_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        maxRedirects: 20
    };

    const req = https.request(options, (res) => {
        let chunks = [];

        res.on("data", (chunk) => {
            chunks.push(chunk);
        });

        res.on("end", () => {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });

        res.on("error", (error) => {
            console.error(error);
        });
    });

    const postData = JSON.stringify({
        messages: [
            {
                destinations: [{ to: phoneNumber }],
                from: "447491163443",
                text: message
            }
        ]
    });

    req.write(postData);
    req.end();
};
