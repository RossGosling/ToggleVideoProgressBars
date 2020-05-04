(async() => {
    try {

        //////////////////////////////////////////////////////

        // Methods

        const addCSS = () => {
            try {

                const element = document.createElement("link");

                element.setAttribute("id", ELEMENT_NAME);
                element.setAttribute("type", "text/css");
                element.setAttribute("rel", "stylesheet");
                element.setAttribute("href", browser.extension.getURL(`style/${siteName}.css`));

                document.body.appendChild(element);

            } catch (error) {

                console.log(error);
            }
        }

        const removeCSS = () => {
            try {

                const element = document.getElementById(ELEMENT_NAME);

                if (element) {

                    element.parentNode.removeChild(element);
                }

                // Error handling if there were more elements for some reason
                if (document.getElementById(ELEMENT_NAME)) {

                    return removeCSS();
                }

            } catch (error) {
                console.error(error);
            }
        }

        //////////////////////////////////////////////////////

        const siteName = window.location.hostname.split('.').reduce((result, string) => {

            if (typeof result !== 'undefined') {
                return  result;
            }

            return Object.keys(config).find(
                (supportedSiteName) => string
                    .toLowerCase()
                    .includes(
                        supportedSiteName.toLowerCase()
                    )
            );

        }, undefined);

        if (typeof siteName !== 'undefined') {

            //////////////////////////////////////////////////////

            if (await setting.isHidden()) {

                addCSS();

            } else {

                removeCSS();
            }

            console.log(`Instantiated ${siteName} document!`);

            //////////////////////////////////////////////////////

            // Register Listener for Background Messages

            browser.runtime.onMessage.addListener(
                (message) => {
                    try {

                        //console.log('message', message);

                        switch(message.type) {

                            case MESSAGE_ADD_CSS:
                                return addCSS();

                            case MESSAGE_REMOVE_CSS:
                                return removeCSS();

                            default:
                                console.error('Error message.type', message.type);
                        }

                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        }

        //////////////////////////////////////////////////////

    } catch (error) {
        console.error(error);
    }
})();