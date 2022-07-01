const express = require("express");
const { registerFont, createCanvas, loadImage } = require("canvas");
const randomColor = require("randomcolor");
const app = express();
const port = 7788;

// We need to register our font file to be used in canvas
registerFont("./fonts/DINWeb-Bold.woff", { family: "DINWeb" });

async function getImage(title, id, imageNum, width = 600, height = 474) {
  console.log(width, height);
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // Define the font style
  context.textAlign = "center";
  context.textBaseline = "top";
  context.font = "35px 'DINWeb' bold";
  const colors = randomColor({
    count: 10,
    hue: "#00a9a7",
  });
  let index = -1;
  index > colors.length - 1 ? (index = 0) : index++;
  try {
    // Load and draw the background image first
    const image = await loadImage("./images/background4.jpg");

    //draw rectangle with red background
    context.fillStyle = colors[index];

    context.fillRect(0, 0, width, height);

    context.globalAlpha = 0.3;
    // Draw the background
    context.drawImage(image, 0, 0, width, height);

    context.globalAlpha = 0.9;
    context.fillStyle = "#393939";
    // Draw the text
    context.textAlign = "center";
    context.fillText("Title: " + title, width / 2, height / 2 - 100);

    context.fillText(id, width / 2, height / 2);
    if (imageNum) {
      context.fillText(imageNum, width / 2, height / 2 + 100);
    }

    // Convert the Canvas to a buffer
    const buffer = canvas.toBuffer("image/png");

    return buffer;
  } catch (err) {
    console.log(err);
  }
}

app.get("/image", async (req, res) => {
  // Grab first name from query
  let title = decodeURI(req.query.title);
  let id = "Sub id: " + decodeURI(req.query.id);
  let imageNum = "Image: " + decodeURI(req.query.imagenum);
  const width = parseInt(decodeURI(req.query.width));
  const height = parseInt(decodeURI(req.query.height));

  console.log("width in handler", width);
  console.log("height in handler", height);

  // Set and send the response as a PNG
  res.set({ "Content-Type": "image/png" });
  if (width === NaN || height === NaN) {
    res.send(await getImage(title, id, imageNum));
  } else {
    console.log("calling full getimage");
    res.send(await getImage(title, id, imageNum, width, height));
  }
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
