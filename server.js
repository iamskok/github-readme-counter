const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

const PLACES = 7;
let counter = 0;

function getCountImage(count) {
  // This is not the greatest way for generating an SVG but it'll do for now
  const countArray = count
    .toString()
    .padStart(PLACES, "0")
    .split("");

  const parts = countArray.reduce(
    (acc, next, index) => `
        ${acc}
        <rect id="Rectangle" fill="#000000" x="${index *
          32}" y="0.5" width="29" height="29"></rect>
        <text id="0" font-family="Courier" font-size="24" font-weight="normal" fill="#00FF13">
            <tspan x="${index * 32 + 7}" y="22">${next}</tspan>
        </text>
`,
    ""
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${PLACES *
    32}px" height="30px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Count</title>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      ${parts}
    </g>
</svg>
`;
}

// get the image
app.get("/count.svg", (req, res) => {
  counter = fs.readFileSync(path.join(__dirname, "counter.txt"));
  counter++;
  fs.writeFileSync(path.join(__dirname, "counter.txt"), counter.toString());
  
  // This helps with GitHub's image cache
  //   see more: https://rushter.com/counter.svg
  res.set({
    'content-type': 'image/svg+xml',
    "cache-control": "max-age=0, no-cache, no-store, must-revalidate"
  });

  // Send the generated SVG as the result
  res.send(getCountImage(counter));
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
