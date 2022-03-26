const express = require("express");
const { registerFont, createCanvas, loadImage } = require("canvas");
const app = express();
const port = 7788;

// We need to register our font file to be used in canvas
registerFont("./fonts/DINWeb-Bold.woff", { family: "DINWeb" });

async function getImage(title, id, imageNum) {
  // Define the canvas
  const width = 600; // width of the image
  const height = 474; // height of the image
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // Define the font style
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = "#FFFFFF";
  context.font = "50px 'DINWeb' bold";

  try {
    // Load and draw the background image first
    const image = await loadImage("./images/background4.jpg");

    context.fillRect(0, 0, 600, 474);

    // Draw the background
    context.drawImage(image, 0, 0, 600, 474);

    context.fillStyle = "#393939";
    // Draw the text
    context.fillText("Title:", 300, 120);
    context.fillText(title, 300, 170);
    context.fillText(id, 300, 280);
    if (imageNum) {
      context.fillText(imageNum, 300, 330);
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
  let title = decodeURI(req.query.name);
  let id = "Submission id: " + decodeURI(req.query.id);
  let imageNum = "Image: " + decodeURI(req.query.imagenum);

  // Set and send the response as a PNG
  res.set({ "Content-Type": "image/png" });
  res.send(await getImage(title, id, imageNum));
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
