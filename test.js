// Context Menus - https://stackoverflow.com/a/13783536

var videoFrames = {},
    nextID = 0;

function showFrames(video) {
    getFramesContainer(video).classList.remove("hide");
}

function hideFrames(video) {
    getFramesContainer(video).classList.add("hide");
}

function getFramesContainer(video) {

    if(video == null)
        video = document.querySelector("video");

    return document.getElementById('frames-container' + video.getAttribute("container-ID"));
}

function loadFrames(video) {

    if(video == null)
        video = document.querySelector("video");

    var id;

    if(video.hasAttribute("container-id")) {

        // RESET CONTAINER

        id = video.getAttribute("container-id");
        videoFrames[id] = {isLoading: true, thumbnails: []};

        var container = document.getElementById(`frames-container${id}`),
            tempVideo = container.querySelector('.temp-video'),
            percentLoaded = container.querySelector('.percent-loaded'),
            thumbnails = [...container.querySelectorAll('.frames img')];

        thumbnails.forEach(thumbnail => thumbnail.parentNode.removeChild(thumbnail));

        tempVideo.src = video.src;
        percentLoaded.value = 0;
        container.classList.remove("hide");
        percentLoaded.classList.remove("hide");
        return;
    }

    id = nextID++;
    video.setAttribute("container-ID", id);
    videoFrames[id] = {isLoading: true, thumbnails: []};

    // INIT NEW ELEMENTS

    var container = document.createElement("div"),
        frameBuilder = document.createElement("canvas"),
        frames = document.createElement("div"),
        wrapper = document.createElement("div"),
        percentLoaded = document.createElement("progress"),
        framesProgress = document.createElement("div"),
        tempVideo = document.createElement("video"),
        context = frameBuilder.getContext('2d');

    container.classList.add("scrubber-container");
    container.id = 'frames-container' + video.getAttribute("container-ID");
    frameBuilder.classList.add("frame-builder");
    frames.classList.add("frames");
    wrapper.classList.add("wrapper");
    percentLoaded.classList.add("percent-loaded");
    framesProgress.classList.add("frames-progress");
    tempVideo.classList.add("temp-video");

    container.style.zIndex = Number.MAX_SAFE_INTEGER;

    frames.appendChild(percentLoaded);
    frames.appendChild(framesProgress);

    wrapper.appendChild(frames);

    container.appendChild(frameBuilder);
    container.appendChild(wrapper);
    container.appendChild(tempVideo);

    document.body.appendChild(container);

    console.log("Cross Origin: ", video.crossOrigin);

    tempVideo.src = video.src;
    percentLoaded.value = 0;

    // EVENT LISTENERS

    video.addEventListener("timeupdate", function focusFrame() {

        if(videoFrames[id].isLoading)
            return;
        
        var frameNumber = Math.floor(this.currentTime / 5);
        document.querySelector(`#thumbnail${frameNumber}`).focus();
        frames.scrollTop = Math.floor(frameNumber / 3) * 
            document.querySelector("#thumbnail0").getBoundingClientRect().height;

    });

    tempVideo.addEventListener("loadeddata", function() {

        this.currentTime = 0;
        frameBuilder.width = this.videoWidth;
        frameBuilder.height = this.videoHeight;

    });

    tempVideo.addEventListener("seeked", function generateThumbnail() {

        if(!videoFrames[id].isLoading)
            return;

        context.drawImage(tempVideo, 0, 0);
        frameBuilder.toBlob(blob => {

            if(!videoFrames[id].isLoading)
                return;
                
            videoFrames[id].thumbnails.push(URL.createObjectURL(blob));

            // if we are not passed end, seek to next interval
            if (this.currentTime + 5 <= this.duration) {
                // this will trigger another seeked event
                this.currentTime += 5;
                var percent = this.currentTime / this.duration;
                percentLoaded.value = percent;
            }
            else {
                // Done!, next action
                videoFrames[id].isLoading = false;
                percentLoaded.classList.add("hide");

                // Generate Thumbnails
                var index = 0;
                videoFrames[id].thumbnails.forEach(thumbnailSrc => {
                    var thumbnail = document.createElement("img");
                    thumbnail.setAttribute("data-index", index);
                    thumbnail.setAttribute("tabindex", -1);
                    thumbnail.id = `thumbnail${index++}`;
                    thumbnail.src = thumbnailSrc;

                    thumbnail.addEventListener("click", function() {
                        video.currentTime = parseInt(this.getAttribute("data-index")) * 5;
                        container.classList.add("hide");
                    });

                    frames.appendChild(thumbnail);
                });

            }

        }, 'image/jpeg');
    });

    frames.addEventListener("scroll", function updateProgress() {
        framesProgress.style.width = this.getBoundingClientRect().width * 
            this.scrollTop / (this.scrollHeight - this.getBoundingClientRect().height)
    });

}