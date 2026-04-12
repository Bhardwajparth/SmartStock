const https = require('https');
const fs = require('fs');
const path = require('path');

const apiKey = "AQ.Ab8RN6JJbGCcUwIvM7HPao9KHpwmpoVOCHfSFbB-Hq8u8nHUog";
const apiUrl = "https://stitch.googleapis.com/mcp";
const projectId = "10555145636534669123";

const screenIds = {
  "DesignSystem": "asset-stub-assets-99d31837accd42a2bfc0f263ec3f5d20-1775931518335",
  "Orders": "a2975209ce784dd481aab406dafcc99f",
  "Inventory": "ce63598aac2c40ad88d031a7a54526fa",
  "Dashboard": "2b7a9ee4622a44d9ba5529c09010642c",
  "Manufacturing": "5553ec4f7ef244a69062dd944f9bf17b",
  "Reports": "75e360bb4ea848f0b1092f9435063281"
};

function requestMCP(method, params) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params
    });

    const options = {
      hostname: 'stitch.googleapis.com',
      path: '/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets');
  }

  for (const [name, screenId] of Object.entries(screenIds)) {
    console.log(`Fetching ${name} (${screenId})...`);
    try {
      const response = await requestMCP("tools/call", {
        name: "get_screen",
        arguments: {
          projectId,
          screenId,
          name: `projects/${projectId}/screens/${screenId}`
        }
      });

      if (response.error) {
        console.error(`Error fetching ${name}:`, response.error);
        continue;
      }

      const toolResult = response.result.content[0].text;
      const screenData = JSON.parse(toolResult);
      // It will likely return a JSON containing htmlCode, screenshot, etc.
      // E.g., screenData.htmlCode.uri, screenData.screenshot.uri
      fs.writeFileSync(`assets/${name}.json`, toolResult, 'utf8');

      if (screenData.htmlCode && screenData.htmlCode.downloadUrl) {
        console.log(`Downloading HTML for ${name}...`);
        await downloadFile(screenData.htmlCode.downloadUrl, `assets/${name}.html`);
      }
      
      if (screenData.screenshot && screenData.screenshot.downloadUrl) {
        console.log(`Downloading Screenshot for ${name}...`);
        await downloadFile(screenData.screenshot.downloadUrl, `assets/${name}.jpg`);
      }
      
    } catch (e) {
      console.error(`Failed to process ${name}:`, e.message);
    }
  }
  console.log('Done!');
}

main();
