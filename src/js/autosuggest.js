'use strict';

(function(global) {

    global.springer = global.springer ? global.springer : {};
    global.springer.search = global.springer.search ? global.springer.search : {};
    global.springer.language = global.springer.language ? global.springer.language : {};

    var isAdvancedSuggest = global.springer.search.advancedSuggest;

    var _opts = {
        hasAdvancedSuggestions: isAdvancedSuggest !== undefined && isAdvancedSuggest !== null ? isAdvancedSuggest : true,
        searchService: 'http://localhost:3030/',
        url: '/suggestions',
        advancedSuggestionsUrl: '/advancedSuggestions',
        minSizeQuery: '(min-width: 640px) and (min-height: 640px)',
        language: global.springer.language.iso ? global.springer.language.iso : 'de'
    };


    function AutoSuggestUrlCreator(urls, suggestionConfig) {
        this.urls = urls;
        this.suggestionConfig = suggestionConfig;
    }

    AutoSuggestUrlCreator.prototype.url = function(value) {
        var searchService = this.urls.searchService;
        var searchServiceUrl = searchService && searchService !== '' ? (searchService.replace(new RegExp('\/$'),'') + '/') : '/';
        var queryParams =  '?query=' + value + '&searchType=' + this.suggestionConfig.searchType;
        if(this.suggestionConfig.isAdvancedEnabled()) {
            return searchServiceUrl + this.suggestionConfig.languageIso + this.urls.advancedUrl + queryParams;
        } else {
            return searchServiceUrl + this.suggestionConfig.languageIso + this.urls.defaultUrl + queryParams;
        }
    };

    function AutoSuggestHttpClient(createUrl, xmlHttpRequestCreator) {
        this.xmlHttpRequestCreator = xmlHttpRequestCreator ? xmlHttpRequestCreator : function() {
            return new XMLHttpRequest();
        };
        this.createUrl = createUrl;
    }

    AutoSuggestHttpClient.prototype.get = function(inputData) {
        var self = this;
        return function(onSuccess, onDone, onError) {
            var xhr = self.xmlHttpRequestCreator();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        onSuccess(JSON.parse(xhr.responseText));
                    } else {
                        if(onError) {
                            onError();
                        }
                    }
                    if(onDone) {
                        onDone();
                    }
                }

            };
            xhr.open('GET', self.createUrl(inputData), true);
            xhr.send();
        };
    };

    function AutoSuggestSearchFieldEventHandler(
        keyUpCallBack,
        navigationCallBack,
        resetCallBack,
        clickCallBack,
        callTimeoutInMillis,
        clickTimeoutInMillis,
        callTimeoutFnct,
        clearTimeoutFnct,
        clickTimeoutFnct
    ) {
        this.runningTimeout = null;
        var setCallTimeoutFnct = callTimeoutFnct ? callTimeoutFnct : setTimeout;
        var setClickTimeoutFnct = clickTimeoutFnct ? clickTimeoutFnct : setTimeout;

        var clear = clearTimeoutFnct ? clearTimeoutFnct : clearTimeout;
        this.callTimeoutFnct = function(value) {
            if(this.runningTimeout) {
                clear(this.runningTimeout);
            }
            return setCallTimeoutFnct(function () {
                keyUpCallBack(value);
            }, callTimeoutInMillis);
        };
        this.clickTimeoutFnct = function(call) {
            return setClickTimeoutFnct(call, clickTimeoutInMillis);
        }
        this.resetCallBack = resetCallBack;
        this.navigationCallBack = navigationCallBack;
        this.clickCallBack = clickCallBack;
    }

    AutoSuggestSearchFieldEventHandler.prototype.call = function(inputEl) {
        var inputText = inputEl.value.trim();
        if(inputText !== '' && inputText.length >= 2) {
            this.runningTimeout = this.callTimeoutFnct(inputText);
        } else {
            this.resetCallBack();
        }
    };

    AutoSuggestSearchFieldEventHandler.prototype.registerEvents = function(inputEl) {

        var self = this;

        inputEl.addEventListener('click', function() {
            self.clickTimeoutFnct(function() {
               var inputText = inputEl.value.trim();
               if(inputEl !== '' && inputText.length >= 2) {
                   self.clickCallBack();
               } else {
                   self.resetCallBack();
               }
            });
        });

        inputEl.addEventListener('keyup', function(event) {
            var keyCode = event.keyCode ? event.keyCode : event.which;
            if(self.isInRange(keyCode)) {
                self.call(inputEl);
            }
        });
        inputEl.addEventListener('keydown', function(event) {
            var keyCode = event.keyCode ? event.keyCode : event.which;
            if(self.isArrowUp(keyCode)) {
                event.preventDefault();
                self.navigationCallBack('up');
            } else if(self.isArrowDown(keyCode)) {
                event.preventDefault();
                self.navigationCallBack('down');
            } else if(self.isArrowLeft(keyCode)) {
                self.navigationCallBack('left');
            } else if(self.isArrowRight(keyCode)) {
                self.navigationCallBack('right');
            } else if(self.isEscape(keyCode)) {
                self.resetCallBack();
            }
        });
    };

    AutoSuggestSearchFieldEventHandler.prototype.isInRange = function(keyCode) {
        return !(
            this.isEscape(keyCode) ||
            this.isArrowUp(keyCode) ||
            this.isArrowDown(keyCode) ||
            this.isArrowLeft(keyCode) ||
            this.isArrowRight(keyCode) ||
            this.isEnter(keyCode)
        );
    };

    AutoSuggestSearchFieldEventHandler.prototype.isEscape = function(keyCode) {
        return keyCode === 27;
    };

    AutoSuggestSearchFieldEventHandler.prototype.isArrowUp = function(keyCode) {
        return keyCode === 38;
    };

    AutoSuggestSearchFieldEventHandler.prototype.isArrowDown = function(keyCode) {
        return keyCode === 40;
    };

    AutoSuggestSearchFieldEventHandler.prototype.isArrowLeft = function(keyCode) {
        return keyCode === 37;
    };

    AutoSuggestSearchFieldEventHandler.prototype.isArrowRight = function(keyCode) {
        return keyCode === 39;
    };

    AutoSuggestSearchFieldEventHandler.prototype.isEnter = function(keyCode) {
        return keyCode === 13;
    };

    function AutoSuggestRenderer(autoSuggest) {
        this.autoSuggest = autoSuggest;
    }

    AutoSuggestRenderer.prototype.createElement = function(tag, attributes, content) {
        var div = document.createElement(tag);
        var tagAttributes = attributes && typeof attributes === 'object' ? attributes : {};
        Object.keys(tagAttributes).map(function(attributeKey) {
            if(tagAttributes[attributeKey]) {
                div.setAttribute(attributeKey, tagAttributes[attributeKey]);
            }
        });
        if(content) { div.innerHTML = content; }
        return div;
    };

    AutoSuggestRenderer.prototype.suggestions = function(data) {
        return (data.suggestions ? data.suggestions : []).map(function(item) {
            return {
                title: item.s
            };
        });
    };

    AutoSuggestRenderer.prototype.epediaSuggestions = function(data) {
        return (data.epedia ? [data.epedia] : []).map(function(epedia) {
            return {
                class: 'epedia-suggestions',
                groupName: epedia.name,
                suggestions: (epedia.suggestions ? epedia.suggestions: []).map(function(item) {
                    return {
                        blank: true,
                        title: item.title,
                        bookTitle: item.bookTitle,
                        target: item.url
                    };
                })
            };
        });
    };

    AutoSuggestRenderer.prototype.groupSuggestions = function(data) {
        return (data.groups ? data.groups : []).map(function(group) {
            return {
                groupName: group.name,
                suggestions: (group.suggestions ? group.suggestions : []).map(function(item) {
                    var entry = item.s;
                    return {
                        blank: false,
                        title: entry.teaserTitle,
                        target: '/link/' + entry.id.substring(entry.id.lastIndexOf(':') + 1)
                    };
                })
            };
        });
    };

    AutoSuggestRenderer.prototype.render = function(data) {
        var self = this;
        var autocompleteList = self.createElement('div', {id: 'autocomplete-list'});
        var createLink =
            function(href, content, isBlank) {
                var targetStr = isBlank ? '_blank' : null;
                var link = self.createElement('a', { href: href, target: targetStr }, content);
                //some hidden knowledge here - we know that the service delivers span tags
                Array.from(link.getElementsByTagName('span')).forEach(function(item) {
                    item.setAttribute('class', 'autocomplete-item__title');
                });
                return link;
            };

        var suggestions = self.suggestions(data);
        var groupList = self.epediaSuggestions(data).concat(self.groupSuggestions(data));

        var hasExtendedSearchElements = groupList.map(function(group) {
            return group.suggestions.length > 0;
        }).indexOf(true) > -1;

        var extendedItemsClass = hasExtendedSearchElements ? 'autocomplete-suggestion-items' : '';

        var registerMouseOverEvent = function(item) {
            item.addEventListener('mouseover', function() {
                self.autoSuggest.onMouseOver(item);
            });
            item.addEventListener('mouseout', function() {
                self.autoSuggest.onMouseOut();
            });
        };

        if(suggestions.length > 0) {
            var suggUlElement = self.createElement('ul' , {class: 'autocomplete-items ' + extendedItemsClass});

            suggestions.forEach(function(item) {
                var liElement = self.createElement('li', {class: 'autocomplete-item'});
                registerMouseOverEvent(liElement);
                var link = createLink('#', item.title);
                liElement.addEventListener('click', function() {
                    self.autoSuggest.onSuggestClick(link.textContent);
                });
                link.addEventListener('click', function(event) {
                   event.preventDefault();
                });
                liElement.appendChild(link);

                suggUlElement.appendChild(liElement);
            });
            autocompleteList.appendChild(suggUlElement);
        }

        if(hasExtendedSearchElements) {
            var ulElement = self.createElement('ul', {class: 'autocomplete-items autocomplete-grouped-items' });
            groupList.forEach(function(group) {

                var groupSuggestions = group.suggestions;
                if(groupSuggestions.length > 0) {

                    var liElement = self.createElement('li', { class: 'autocomplete-item__headline' });

                    var headline = self.createElement('h4', {}, group.groupName);
                    liElement.appendChild(headline);

                    var innerUlElement = self.createElement('ul', { class: 'autocomplete-sub-items' });
                    liElement.appendChild(innerUlElement);

                    groupSuggestions.forEach(function(item) {
                        var innerLiElement = self.createElement('li', { class: 'autocomplete-item' });
                        registerMouseOverEvent(innerLiElement);
                        var innerLink = createLink(item.target, item.title, item.blank);
                        innerLiElement.appendChild(innerLink);
                        innerLiElement.addEventListener('click', function() {
                           innerLink.click();
                        });
                        if(item.bookTitle) {
                            var bookSpan = self.createElement('span', { class: 'autocomplete-item__bookTitle' }, item.bookTitle);
                            innerLiElement.insertAdjacentHTML('beforeend', bookSpan.outerHTML);
                        }
                        innerUlElement.appendChild(innerLiElement);
                    });

                    ulElement.appendChild(liElement);
                }
            });
            autocompleteList.appendChild(ulElement);
        }

        return autocompleteList;
    };

    function AutoSuggest(
        searchField,
        autoCompleteWrapper,
        searchForm
    ) {

        this.searchField = searchField;
        this.autoCompleteWrapper = autoCompleteWrapper;
        this.searchForm = searchForm;

    }

    AutoSuggest.prototype.isInWrapper = function(tag) {
        if(tag !== this.autoCompleteWrapper && tag !== this.searchField) {
            var parent = tag.parentElement;
            if(parent) {
                return this.isInWrapper(parent);
            }
        } else {
            return true;
        }
        return false;
    };

    AutoSuggest.prototype.resetCallBack = function() {
        this.autoCompleteWrapper.innerHTML = '';
    };

    AutoSuggest.prototype.onSuggestClick = function(title) {
        this.searchField.value = title;
        this.searchForm.submit();
    };

    AutoSuggest.prototype.toggleOnItem = function(item) {
        if(item) {
            var classAttr = item.getAttribute('class');
            var activeClass = ' autocomplete-item__active';
            if(!classAttr || !classAttr.includes(activeClass.trim())) {
                item.setAttribute('class', (classAttr ? classAttr : '') + activeClass);
            }
        }
    };

    AutoSuggest.prototype.toggleOffItem = function(item) {
        if(item) {
            var classAttr = item.getAttribute('class');
            var activeClass = ' autocomplete-item__active';
            if(classAttr && classAttr.includes(activeClass)) {
                item.setAttribute('class', classAttr.replace(activeClass, ''));
            }
        }
    };

    AutoSuggest.prototype.toggleOffAllItems = function() {
        var self = this;
        var items = Array.from(this.autoCompleteWrapper.querySelectorAll('.autocomplete-item'));
        items.forEach(function(item) {
            self.toggleOffItem(item);
        });
    };

    AutoSuggest.prototype.onMouseOver = function(item) {
        this.toggleOffAllItems();
        this.toggleOnItem(item);
    };

    AutoSuggest.prototype.onMouseOut = function() {
        this.toggleOffAllItems();
    };

    AutoSuggest.prototype.updateSearchField = function(item) {
        var rightGroup = this.autoCompleteWrapper.querySelector('.autocomplete-grouped-items');
        if(rightGroup) {
            var rightItems = Array.from(rightGroup.querySelectorAll('.autocomplete-item'));
            if(rightItems.indexOf(item) > -1) {
                return;
            }
        }
        this.searchField.value = item.textContent;
    };

    AutoSuggest.prototype.switchColumn = function(activeItem, activeIndex) {
        var leftGroup = this.autoCompleteWrapper.querySelector('.autocomplete-suggestion-items');
        var rightGroup = this.autoCompleteWrapper.querySelector('.autocomplete-grouped-items');

        if(leftGroup && rightGroup && activeIndex > -1) {
            var leftItems = Array.from(leftGroup.querySelectorAll('.autocomplete-item'));
            var rightItems = Array.from(rightGroup.querySelectorAll('.autocomplete-item'));
            if(leftItems.indexOf(activeItem) > -1) {
                this.toggleOnItem(rightItems[0]);
            } else {
                this.toggleOnItem(leftItems[0]);
                this.updateSearchField(leftItems[0]);
            }
        }
    };


    function AutoSuggestNavCallBackHandler(autoCompleteWrapper, autoSuggest) {
        this.autoCompleteWrapper = autoCompleteWrapper;
        this.autoSuggest = autoSuggest;
    }

    AutoSuggestNavCallBackHandler.prototype.nav = function(direction) {
        var allItems = Array.from(this.autoCompleteWrapper.querySelectorAll('.autocomplete-item'));
        var activeItem = allItems.filter(function(item) {
            var classAttr = item.getAttribute('class');
            return classAttr && classAttr.includes(' autocomplete-item__active');
        })[0];

        var activeIndex = allItems.indexOf(activeItem);
        this.autoSuggest.toggleOffAllItems();

        if(direction === 'up') {
            this.navUp(activeItem, activeIndex, allItems);
        } else if(direction === 'down') {
            this.navDown(activeItem, activeIndex, allItems);
        } else {
            this.leftRight(activeItem, activeIndex);
        }
    };

    AutoSuggestNavCallBackHandler.prototype.navDown = function(activeItem, activeIndex, allItems) {
        if(activeItem) {
            var isLastItem = activeIndex === allItems.length - 1;
            if(!isLastItem) {
                this.autoSuggest.toggleOnItem(allItems[activeIndex + 1]);
                this.autoSuggest.updateSearchField(allItems[activeIndex + 1]);
            }
        } else {
            this.autoSuggest.toggleOnItem(allItems[0]);
            this.autoSuggest.updateSearchField(allItems[0]);
        }
    };

    AutoSuggestNavCallBackHandler.prototype.navUp = function(activeItem, activeIndex, allItems) {
        if(activeItem) {
            var isFirstItem = activeIndex === 0;
            if(!isFirstItem) {
                this.autoSuggest.toggleOnItem(allItems[activeIndex - 1]);
                this.autoSuggest.updateSearchField(allItems[activeIndex - 1]);
            }
        }
    };

    AutoSuggestNavCallBackHandler.prototype.leftRight = function(activeItem, activeIndex) {
        this.autoSuggest.switchColumn(activeItem, activeIndex);
    };

    function AutoSuggestWindowEventHandler(autoSuggest) {
        this.autoSuggest = autoSuggest;
    }

    AutoSuggestWindowEventHandler.prototype.registerEvents = function(win) {
        var self = this;
        win.addEventListener('click', function(event) {
            if(!self.autoSuggest.isInWrapper(event.target)) {
                self.autoSuggest.resetCallBack();
            }
        });

        var innerWidth = null;
        win.addEventListener('resize', function() {
            if(innerWidth !== win.innerWidth) {
                self.autoSuggest.resetCallBack();
            }
            innerWidth = win.innerWidth;
        });
    };

    function autoSuggestRegisterFormEvents(autoCompleteWrapper, searchForm, searchField) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            var activeItem = autoCompleteWrapper.querySelector('.autocomplete-item__active');
            var link = activeItem ? activeItem.getElementsByTagName('a')[0] : null;
            if(link) {
                var href = link.getAttribute('href');
                if(href && href.indexOf('#') === 0) {
                    searchField.value = link.textContent;
                    searchForm.submit();
                } else if(href) {
                    link.click();
                }
            } else if(searchField.value.trim() !== '') {
                searchForm.submit();
            }
        });
    }

    function initAutoSuggest(searchBox, options, win) {
        var searchField = searchBox.querySelector('.a-search-box__content');
        var searchTypeField = searchBox.querySelector('[name="searchType"]');
        var autoCompleteWrapper = searchBox.querySelector('.autocomplete-wrapper');
        var searchForm = searchBox.querySelector('.a-search-box__form');

        if(autoCompleteWrapper && searchField && searchTypeField && searchForm) {

            var autoSuggest = new AutoSuggest(searchField, autoCompleteWrapper, searchForm);

            var urlCreator = new AutoSuggestUrlCreator(
                {
                    advancedUrl: options.advancedSuggestionsUrl,
                    defaultUrl: options.url,
                    searchService: options.searchService
                }, {
                    isAdvancedEnabled: function() {
                        var hasSize = win.matchMedia(options.minSizeQuery).matches;
                        var enabled = options.hasAdvancedSuggestions;
                        return hasSize && enabled && searchTypeField.value === 'StandardSearchType';
                    },
                    languageIso: options.language,
                    searchType: searchTypeField.value
                }
            );
            var httpClient = new AutoSuggestHttpClient(urlCreator.url.bind(urlCreator));
            var httpClientBinding = httpClient.get.bind(httpClient);

            var renderer = new AutoSuggestRenderer(autoSuggest);
            var rendererBinding = renderer.render.bind(renderer);

            var keyUpCallBack = function(value) {
                httpClientBinding(value)(function (data) {
                    var content = rendererBinding(data);
                    autoCompleteWrapper.innerHTML = '';
                    if(content.innerHTML !== '') {
                        autoCompleteWrapper.appendChild(content);
                    }
                });
            };

            var autoSuggestNavHandler = new AutoSuggestNavCallBackHandler(autoCompleteWrapper, autoSuggest);
            var navCallbackBinding = autoSuggestNavHandler.nav.bind(autoSuggestNavHandler);

            var resetCallBackBinding = autoSuggest.resetCallBack.bind(autoSuggest);

            var clickCallBack = function() {
                setTimeout(function() {
                    if(searchField.value.length > 0) {
                        autoSuggest.toggleOffAllItems();
                        keyUpCallBack(searchField.value);
                    } else {
                        autoSuggest.resetCallBack();
                    }
                }, 20);
            };

            var searchFieldEventHandler = new AutoSuggestSearchFieldEventHandler(
                keyUpCallBack,
                navCallbackBinding,
                resetCallBackBinding,
                clickCallBack,
                150,
                20);
            searchFieldEventHandler.registerEvents(searchField);

            var autoSuggestWindowEventHandler = new AutoSuggestWindowEventHandler(autoSuggest);
            autoSuggestWindowEventHandler.registerEvents(win);

            autoSuggestRegisterFormEvents(autoCompleteWrapper, searchForm, searchField);
        }
    }

    global.window.addEventListener('load', function() {
        //collect all search fields from the given page
        var searchBoxes = Array.from(document.querySelectorAll('.a-search-box'));
        searchBoxes.forEach(function(searchBox) {
            initAutoSuggest(searchBox, _opts, global.window);
        });
    });

    global.AutoSuggest = AutoSuggest;
    global.AutoSuggestUrlCreator = AutoSuggestUrlCreator;
    global.AutoSuggestHttpClient = AutoSuggestHttpClient;
    global.AutoSuggestRenderer = AutoSuggestRenderer;
    global.AutoSuggestNavCallBackHandler = AutoSuggestNavCallBackHandler;
    global.AutoSuggestSearchFieldEventHandler = AutoSuggestSearchFieldEventHandler;
    global.AutoSuggestWindowEventHandler = AutoSuggestWindowEventHandler;
    global.autoSuggestRegisterFormEvents = autoSuggestRegisterFormEvents;
    global.initAutoSuggest = initAutoSuggest;

})(window);
