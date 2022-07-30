(async() => {
    try {

        //////////////////////////////////////////////////////

        // Define Methods

        const setIcon = (isHidden) => {

            browser.browserAction.setIcon({
                path: (isHidden) ? "./icon/hidden.png" : "./icon/visible.png",
            });
        }

        const setContextMenuText = (isHidden) => {

            browser.contextMenus.update(
                CONTEXTMENU_ID,
                {
                    title:  `${CONTEXTMENU_TITLE_PREFIX}${(isHidden) ? 'visible' : 'hidden'}${CONTEXTMENU_TITLE_SUFFIX}`,
                }
            );
        }

        const toggleHidden = async() => {
            try {

                const isHidden = !(await setting.isHidden());

                console.info('Set isHidden to', (isHidden) ? 'hidden' : 'visible');

                await setting.setHidden(isHidden)

                setIcon(isHidden);
                setContextMenuText(isHidden);

                if (isHidden) {

                    await browser.tabs.query(
                        {},
                        (tabs) => tabs.map(
                            (tab) => {
                                try {
                                    return browser.tabs.sendMessage(
                                        tab.id,
                                        {
                                            type: MESSAGE_SET_HIDDEN,
                                        }
                                    );

                                } catch (error) {
                                    console.error(error);
                                }
                            }
                        )
                    );

                } else {

                    await browser.tabs.query(
                        {},
                        (tabs) => tabs.map(
                            (tab) => {
                                try {
                                    return browser.tabs.sendMessage(
                                        tab.id,
                                        {
                                            type: MESSAGE_SET_VISIBLE,
                                        }
                                    );

                                } catch (error) {
                                    console.error(error);
                                }
                            }
                        )
                    );
                }

                return isHidden;

            } catch (error) {
                console.error(error);
            }
        }

        //////////////////////////////////////////////////////

        // Run on startup

        const isHidden = await setting.isHidden();
        setIcon(isHidden);
        console.log(`Instantiated background - Hidden: ${isHidden}!`)

        //////////////////////////////////////////////////////

        // Register Button

        browser.browserAction.onClicked.addListener(
            () => {
                try {

                    return toggleHidden();

                } catch (error) {
                    console.error(error);
                }
            }
        );

        // Register Context Menu Option

        browser.contextMenus.create(
            {
                id: CONTEXTMENU_ID,
                title: `${CONTEXTMENU_TITLE_PREFIX}${(!isHidden) ? 'hidden' : 'visible'}${CONTEXTMENU_TITLE_SUFFIX}`,

                onclick: toggleHidden,
            }
        );

        // Register Listener for Document Messages

        browser.runtime.onMessage.addListener(
            (message) => {
                try {

                    // console.log('message', message);

                    switch(message.type) {

                        case MESSAGE_TOGGLE:
                            return Promise.resolve(toggleHidden());

                        default:
                            console.error('Error message.type', message.type);
                    }

                } catch (error) {
                    console.error(error);
                }
            }
        );

        //////////////////////////////////////////////////////

    } catch (error) {
        console.error(error);
    }
})();