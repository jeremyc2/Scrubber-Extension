// Context Menus - https://stackoverflow.com/a/13783536

var isLoadingFrames = false;

function loadFrames(video) {

    var thumbnails = [];

    isLoadingFrames = true;

    // INIT NEW ELEMENTS

    var frameBuilder = document.createElement("canvas"),
        frames = document.createElement("div"),
        percentLoaded = document.createElement("progress"),
        framesProgress = document.createElement("div"),
        tempVideo = document.createElement("video"),
        context = frameBuilder.getContext('2d');

    frameBuilder.classList.add("frame-builder");
    frames.classList.add("frames");
    percentLoaded.classList.add("percent-loaded");
    framesProgress.classList.add("frames-progress");
    tempVideo.classList.add("temp-video");

    frames.appendChild(percentLoaded);
    frames.appendChild(framesProgress);

    video.appendChild(frameBuilder);
    video.appendChild(frames);
    video.appendChild(tempVideo);

    // EVENT LISTENERS

    video.addEventListener("timeupdate", function focusFrame() {

        if(isLoadingFrames)
            return;
        
        var frameNumber = Math.floor(this.currentTime / 5);
        document.querySelector(`#thumbnail${frameNumber}`).focus();
        frames.scrollTop = Math.floor(frameNumber / 3) * 
            document.querySelector("#thumbnail0").getBoundingClientRect().height;

    });

    tempVideo.addEventListener("loadeddata", function() {

        this.currentTime = 0;
        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;

    });

    tempVideo.addEventListener("seeked", function generateThumbnail() {

        if(!isLoadingFrames)
            return;

        context.drawImage(tempVideo, 0, 0);
        canvas.toBlob(blob => {

            if(!isLoadingFrames)
                return;
                
            thumbnails.push(URL.createObjectURL(blob));

            // if we are not passed end, seek to next interval
            if (this.currentTime + 5 <= this.duration) {
                // this will trigger another seeked event
                this.currentTime += 5;
                var percent = (this.currentTime / this.duration) * 100;
                percentLoaded.value = percent;
            }
            else {
                // Done!, next action
                isLoadingFrames = false;

                // Generate Thumbnails
                var index = 0;
                thumbnails.forEach(thumbnailSrc => {
                    var thumbnail = document.createElement("img");
                    thumbnail.setAttribute("data-index", index);
                    thumbnail.setAttribute("tabindex", -1);
                    thumbnail.id = `thumbnail${index++}`;
                    thumbnail.src = thumbnailSrc;

                    thumbnail.addEventListener("click", function() {
                        video.currentTime = parseInt(this.getAttribute("data-index")) * 5;
                    });

                    frames.appendChild(thumbnail);
                });

            }

        }, 'image/jpeg');
    });

    frames.addEventListener("scroll", function updateProgress() {
        framesProgress.style.width = this.getBoundingClientRect().width * 
            (this.scrollTop / this.scrollHeight) * 1.06;
    });

}