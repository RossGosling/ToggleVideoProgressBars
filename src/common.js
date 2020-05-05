
//////////////////////////////////////////////////////

// Configuration

const config = {

    Netflix: {
        pathPattern: '/watch'
    },

    YouTube: {
        pathPattern: ''
    },

    Amazon: {
        pathPattern: '/video/detail/'
    },

    Vimeo: {
        pathPattern: '/'
    }
};

//////////////////////////////////////////////////////

// Constants

const CONTEXTMENU_ID = 'context.menu';

const CONTEXTMENU_TITLE_PREFIX = 'Toggle Progress Bars to ';
const CONTEXTMENU_TITLE_SUFFIX = '';

const ELEMENT_NAME = 'InjectedStylesheetElement';

const MESSAGE_TOGGLE = 'toggle';
const MESSAGE_ADD_CSS = 'add css';
const MESSAGE_REMOVE_CSS = 'remove css';

//////////////////////////////////////////////////////

const _getHiddenSetting = () => {
    return new Promise((resolve, reject) => {
        try {
            browser.storage.local.get('isHidden', (result) => resolve(result))
        } catch(error) {
            reject(error);
        }
    })
}

const setting = {

    isHidden: async() => {

        const settingObject = await _getHiddenSetting();

        return (settingObject && 'isHidden' in settingObject) ?
            settingObject.isHidden :
            false;
    },

    setHidden: async(isHidden) => browser.storage.local.set({ isHidden }),
}

//////////////////////////////////////////////////////

// Logging override

window.console = (() => {

    const prefix = ['ToggleVideoProgressBars:'];

    const originalConsole = window.console;

    const getNow = () => new Date()
        .toISOString()
        .substring(11, 19);

    return {
        log: (...args) => originalConsole.log(`[LOG: ${getNow()}]`, prefix.join(' '), ...args),
        info: (...args) => originalConsole.info(`[INFO: ${getNow()}]`, prefix.join(' '), ...args),
        warn: (...args) => originalConsole.warn(`[WARN: ${getNow()}]`, prefix.join(' '), ...args),
        error: (...args) => originalConsole.error(`[ERROR: ${getNow()}]`, prefix.join(' '), ...args),
    };

})();

//////////////////////////////////////////////////////

// Chrome supporting standard browser object, no bespoke bs here

if (typeof browser === 'undefined') {

    browser = chrome;
}

//////////////////////////////////////////////////////
