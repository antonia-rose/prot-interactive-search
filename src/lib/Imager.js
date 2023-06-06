// eslint-disable-next-line unicorn/filename-case
(function (window, document) {
    'use strict';

    var Imager = function (selector, opts) {
        var self = this;

        opts = opts || {};

        this.className                = opts.className || 'image-replace';
        this.selector                 = selector;

        this.replaceWidth = function (src, width) {
            return src.replace(/{width}/g, width);
        };

        this.replaceFileEx = function (src, replace, replacement) {
            return src.replace(replace, replacement);
        };

        this.isInViewport = function (element) {
            var rect = element.getBoundingClientRect();
             return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                Math.round(rect.bottom) <= (window.innerHeight || document.documentElement.clientHeight) &&
                Math.round(rect.right) <= (window.innerWidth || document.documentElement.clientWidth)
            );
        };

        self.replacePlaceholder();

        this.registerScrollEvent();
        this.registerResizeEvent();
        this.registerGliderEvent();
    };

    Imager.prototype.createPictureElement = function (element) {
        var self = this;
        var parentClientWidth = element.parentNode.clientWidth;
        var originalImageSrc = element.getAttribute('data-src');
        var imageSrc = self.replaceWidth(originalImageSrc, parentClientWidth);
        var imageWebpSrc = self.replaceFileEx(imageSrc, /as=\w+/g, 'as=webp');
        var imageJpegSrc = self.replaceFileEx(imageSrc, /as=\w+/g, 'as=jpg');


        // Create picture
        var picture = document.createElement('picture');
        picture.setAttribute('data-src', originalImageSrc);
        picture.className = this.className;

        // Create picture source webp and add to picture
        var sourceWebp = document.createElement('source');
        sourceWebp.setAttribute('srcset', imageWebpSrc);
        sourceWebp.setAttribute('type', 'image/webp');

        // Create fallback image and add to picture
        var image = document.createElement('img');
        image.setAttribute('src', imageJpegSrc);
        if(element.getAttribute('data-alt')) {
            image.setAttribute('alt', element.getAttribute('data-alt'));
        }
        if(element.getAttribute('data-height')) {
            image.setAttribute('height', element.getAttribute('data-height'));
        }
        if(element.getAttribute('data-width')) {
            image.setAttribute('width', element.getAttribute('data-width'));
        }
        if(element.getAttribute('data-class')) {
            image.setAttribute('class', element.getAttribute('data-class'));
        }
        image.onload = function () {
            var imageRect = this.getBoundingClientRect();
            if(imageRect.height > 0) {
                this.setAttribute('height', imageRect.height);
            }
            if(imageRect.width > 0) {
                this.setAttribute('width', imageRect.width);
            }
        };

        // Apply error event to handle fallback strategy
        if(element.hasAttribute('data-url-fallback')) {
            var fallbackImageSrc = element.getAttribute('data-url-fallback');
            var fallbackSrc = self.replaceWidth(fallbackImageSrc, parentClientWidth);
            var webpFallbackSrc = self.replaceFileEx(fallbackSrc, /as=\w+/g, 'as=webp');
            var jpgFallbackSrc = self.replaceFileEx(fallbackSrc, /as=\w+/g, 'as=jpg');

            image.addEventListener('error', function () {
                image.src = jpgFallbackSrc;
                sourceWebp.setAttribute('srcset', webpFallbackSrc);
            });
        }

        // Add the source elements to dom
        picture.appendChild(sourceWebp);
        picture.appendChild(image);

        return picture;
    };

    Imager.prototype.registerScrollEvent = function () {
        var self = this;
        document.addEventListener('scroll', function () {
            self.replacePlaceholder();
        }, { passive: true });
    };

    Imager.prototype.registerGliderEvent = function () {
        var self = this;
        // Read https://nickpiscitelli.github.io/Glider.js/#events
        document.addEventListener('glider-animated', function () {
            self.replacePlaceholder();
        }, { passive: true });
    };

    Imager.prototype.registerResizeEvent = function () {
        var self = this;
        window.addEventListener('resize', function () {
            self.replacePlaceholder();
        });
    };

    Imager.prototype.hasSize = function (element) {
        var self = this;
        var expectedSize = element.parentNode ? element.parentNode.clientWidth : 0;
        if(expectedSize === 0) {
            expectedSize = self.getSizeFromSource(element.getAttribute('data-src'));
        }
        return expectedSize > 0;
    };

    Imager.prototype.getSizeFromSource = function (source) {
        var result = /\/(lh|lw|h|w)(\d+)\//gm.exec(source);
        return result ? parseInt(result[2]) : 0;
    };

    Imager.prototype.replacePlaceholder = function () {
        var self = this;
        var elements = document.querySelectorAll(self.selector);
        if (elements && elements.length > 0) {
            elements.forEach(function(element){
              /* remove hasSize for now, to support local images, unless we changed to dynamic images */
              // if(self.isInViewport(element) && self.hasSize(element)) {
                if(self.isInViewport(element)) {
                    element.parentNode.replaceChild(self.createPictureElement(element), element);
                }
            });
        }
    };

    window.Imager = Imager;

}(window, document));
