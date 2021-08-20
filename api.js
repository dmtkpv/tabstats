
const promise = (context, method, params, onSuccess, onError) => {
    if (!onSuccess) onSuccess = result => result;
    if (!onError) onError = () => null;
    if (!Array.isArray(params)) params = [params];
    return new Promise(resolve => {

        if (!params) context[method](resolve)

        context[method](...params, resolve)

    }).then(onSuccess).catch(error => {
        console.log(error);
        return onError(error);
    });
}



// --------------------
// Tabs helper
// --------------------

export const Tabs = {

    exec (id) {
        return promise(chrome.scripting, 'executeScript', {
            target: { tabId: id },
            files: ['content.js']
        })
    },

    getProcess (id) {
        return chrome.processes && promise(chrome.processes, 'getProcessIdForTab', id);
    },

    getActive () {
        return promise(chrome.tabs, 'query', { active: true, currentWindow: true }, result => result[0].id);
    },

    sendMessage (id, key, data) {
        return promise(chrome.tabs, 'sendMessage', [id, { key, data }]);
    }


}



// --------------------
// Storage helper
// --------------------

export const Storage = {

    set (key, value) {
        return promise(chrome.storage.local, 'set', { ['' + key]: value });
    },

    get (key) {
        return promise(chrome.storage.local, 'get', '' + key, result => result[key]);
    },

    del (key) {
        return promise(chrome.storage.local, 'remove', '' + key);
    },

    clear () {
        return chrome.storage.local.clear();
    }

}



// --------------------
// Stats
// --------------------

export const Icon = {

    set (id, data = {}) {

        const size = 16;
        const bar = 2;
        const margin = 1;
        const height = size - margin * 2;

        const canvas = new OffscreenCanvas(size, size);
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = data.active ? '#3774E0' : '#3D4043';

        for (let x = margin; x < size; x += bar + margin) {
            const h = Math.sin(x / size * Math.PI) * height;
            const y = margin + height - h;
            ctx.fillRect(x, y, bar, h);
        }

        return promise(chrome.action, 'setIcon', {
            tabId: id,
            imageData: ctx.getImageData(0, 0, size, size)
        })

    }

}