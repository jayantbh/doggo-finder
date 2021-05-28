# Technical

This document talks about some of the codebase related decisions.

## Project Architecture

### Directory structure

This project is small enough that it doesn't need a proper pod structure. Instead, files have been stored in directories separated by technical concern. So all components go in the `components` directory together, and styles go together in the `styles` directory, and so on.

Files are not grouped by their purpose (e.g. components related to gallery logic being in a `components/gallery` directory), because that would have been overkill for this project.

### File Naming

Component files are named the same as their component names, casing included. Relevant style files are named with the same name as the component they belong to. However, sometimes different components share a bunch of common styles, and so they share the same SCSS module file.

No file (except the index page) is named `index.*` to avoid confusion in some IDEs/editors that only show the name of the open file in the tab, instead of the path too somewhere in the UI.

### Types

All shared types are stored in the `types` directory. `types/api.ts` contains the types for the API endpoints that are used. `types/worker.ts` contains the `MessageEvent` types for communication between main thread and web worker.

## Code Considerations

### ML and Image Classification

We're using Tensorflow with the Mobilenet v1 model. For a given image, the model returns detections results of all kinds, which is later filtered to determine is an image contains a dog breed or not.

### Performance and Workers

Loading the ML model or image classification can be heavy on the CPU, and tends to block main thread time, resulting on janky animations on page load. We've moved all ML code execution to a web worker to avoid blocking the main thread. The worker informs the main thread about the state of the model (loaded, failure, etc.) through `postMessage`.

### Contexts

Things like Toasts, Worker, File Upload, involve functionality that may need to be accessed anywhere in the app, and passing this functionality down through props is unreasonable even for a codebase of this size. These things have been wrapped up in contexts for easy access through the app.

### Error Handling

Most likely-to-fail logic in the app is wrapped in try/catch blocks. As such, any caught errors result in a toast being shown on the UI with a default hiding time. The following are some of the key kinds of errors that are caught and trigger a toast on the UI:

- Corrupted image uploaded
- Model not available when image was uploaded
- Model (or breeds API) failed to load
- Images endpoint errored out

This is not an exhaustive list.

### Tests

This codebase contains largely only unit tests for now. Some key utilities have tests, so do some of the key components and providers. But testing is pretty lacking at the moment. More tests will be added. This project is still being actively worked on.

## User Interface

### Accessibility

**Hotkeys**

The project is fully covered with hotkeys to make it fully keyboard accessible. Hotkey options are visible by default on every UI component that supports a hotkey action.

The same action may sometimes have multiple hotkeys bound to it. For example: Viewing the next image in the horizontal gallery can be done by pressing D or LeftArrow, depending on right-handedness or left-handedness.

On phones, or touch devices, the hotkeys are hidden. They would still work, but the hotkey indicators would not be visible anymore. In the future we'd add a toggle to show/hide the hotkey indicators on demand.

**Vision, and SEO**

The color scheme and several key UI elements were tested for contrast and colour difference. Accessibility attributes, focusable elements, SEO tags, etc. Except a few element where the contrast score was around 3.5, most text has a contract over over 6.

According to lighthouse, the Accessibility, SEO, and Best Practices rating is 100. (Though I'm doubtful about how it tested a few things, so, take this with a grain of salt.)

### Image Input

There are two ways (as of now) to upload an image to the app. The regular file browser method, and paste from clipboard method. The latter should be a more convenient option if your OS support copying a screenshot to the clipboard.

**Corrupted Images**

It's possible to obtain and upload corrupted images, or rename a text file to have a .png extension and try to upload that to this UI. These conditions have been taken care of by using the Image.onerror event, or checking the Image.naturalHeight/Image.naturalWidth properties. A good image will have a naturalHeight and naturalWidth greater than 0.

### Animations

There's a copious amount of animations in the app, powered by `framer-motion`. This library basically offers a convenient way to implement JS driven CSS transforms, or FLIP based [shared-UI transitions](http://jayant.tech/experiments/shared-element-transitions#/).

Writing CSS transforms by hand, without using the library would likely have been more [performant](http://jayant.tech/experiments/animation-comparisons), and also about 200-times more time consuming.

### Multiple Galleries

There are two different ways to load images for a detected breed. There's a `HorizontalGallery` and a `VerticalGallery`.

The Horizontal one offers a nicer, more dynamic viewing experience, and is useful for viewing one image at a time since it allows for larger images. The Vertical one offers a better "summary" view experience, where you can see all images of interest on screen at the same time.

The `HorizontalGallery` is limited to showing about 60 images at most, even if more images are available to be shown in the `VerticalGallery`. That is due to performance considerations. This gallery is extremely animation heavy, and hence with enough images, it can cause performance drops on weaker hardware. 60 seemed like a good number to satisfy someone's curiosities about a specific breed.

**Future Scope**

It may have been useful to implment a "lightbox" view that allows you to view a single image in a full-screen mode. It would be fairly straight forward (much easier than `HorizontalGallery` anyway), so we'll pick that in a later release.

### Fetching Images

**Duplication**

Images are loaded using the [dog.ceo/api -> /random](https://dog.ceo/dog-api/documentation/random) endpoints.
Since it is random, for a given breed, a map is stored containing every URL fetched so far. On subsequent fetches, any image URLs fetched that already exist in the existing map are filtered out, only appending the new URLs to the links list, which is then rendered on the UI.

**Fetching, and Infinite Scroll**

For the `HorizontalGallery`, much fewer images are loaded at a time (due to manual loading [on Enter]), as compared to the `VerticalGallery` which has _infinite scroll_ functionality using `IntersectionObserver`s. Since the `VerticalGallery` can show a much larger number of images at a time, the above endpoint is used to fetch a much larger number of image links.

**Image Sizing**

Every image has a default size before it's loaded, after loading, the height fits the aspect ratio of the image, and the width is equal to the column that the image is present in.

There was one "side-effect" to deal with here, which is that if a certain column happens to have much shorter than usual images, and another column having taller than usual images, then the columns can look pretty uneven. Fortunately, it's not a big deal for now because most of the time it averages out reasonably well, and there are not that many images per breed on that endpoint, so you run out of images before the problem becomes severe enough.

We could _mitigate_ this by adding images to the UI **after** they are loaded, as in, use the image constructor, or maybe just keep them hidden while the images are loading, and then add the image to the column where the height of the contained images happens to be the least.

### Mobile Support

The app is responsive enough to work fairly well on most phones. We've additionally added support for swipe gestures to allow swiping left or right on the `HorizontalGallery` to go back and forth through the images.

**Potential improvements**
On phones, the gallery controls may be hard to access on large enough devices, when viewing the `VerticalGallery`. But moving it down closer to where the fingers would be breaks the current UX, where the image feed goes all the way to the bottom of the screen.

We can introduce swipe gestures for the common actions, or at least to go back to the `HorizontalGallery` view to make the controls be better accessible.

## Future Scope

There's two key things that we'd add in the future.

- Lightbox for images
- Real-time breed detection

**Lightbox for images**

This will be fairly straight-forward to implement. We'll create another context and provider to hold state for, and show an image laid over the rest of the UI taking up all the space.

**Real-time breed detection**

This will be a very fun one. You should be able to point your camera towards any dog, and we'll call the TF model as frequently as we can (but one classification call at a time) to show you the detection results. It's not going to be as practical, because on Android, the file upload dialog gives you the option to not just upload a file, but to use the camera to take a photo right then and upload that photo, so that's convenient, not sure if it's the same on iOS. But, it'll be very fun to make and use. Will need to deal with canvas stuff.
