# GifTastic
Giphy Homework Assignment

## Overview

This project uses the Giphy API to download topical GIFs for the user to
observe. The number of GIFs downloaded per topic is currently set to 10,
but that can be adjusted by modifying a single variable. Once the images
are visible, the user can click on any of the images to animate the GIF.
Clicking on an animated GIF will place it back into a static image.

## Setting GIF Topics

The application currently uses a single default topic of 'Trending'.
Additional default topics may be added by adding the topic or phrase
to an array of default topics.

Topics and/or phrases for GIF searches may be added one at a time, and
once added, are displayed as buttons at the top of the page. Duplicate
topics are prevented, with a user notification.

Once topics are displayed as a button, clicking on the topic button
will download the specified number of GIFs. Clicking on a new button will
download and replace the next specified number of GIFs.

## Animating GIFs

Once images for the selected topic are downloaded, they are displayed as
static images. Clicking on an image will animate the image. Clicking on
an animated image will return it to a static image.

## Resetting the page

Re-loading the page will reset the topics and the GIF images.

### Link to the deployed game

[GitHub](https://rossnr3.github.io/GifTastic/ "GifTastic")

