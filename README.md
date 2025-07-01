# Wearly

A simple web app that lets you try clothing on your own photo directly in the browser. Upload a user picture and a clothing item image, then drag and scale the clothing overlay. When you click **Generate**, the page uses the BodyPix machine learning model from TensorFlow.js to segment the user image and compose a new photo with the selected clothing item.

This project is designed to run on GitHub Pages. To test locally, open `index.html` in any modern browser with internet access so the TensorFlow.js model can load from the CDN.
