/*global chrome */

String.prototype.count = function(search) {
    var m = this.match(new RegExp(search.toString().replace(/(?=[.\\+*?[^\]$(){}\|])/, '\\'), 'gi'));
    return m ? m.length:0;
};

var message;

chrome.runtime.onMessage.addListener(function(request) {
    if (request.action == 'getSource') {
        var html = request.source;
        var result = {};

        // TODO: fix naive approach -> index words as we iterate
        for (var i = 0; i < words.length; i++) {
            var count = 0;
            count = html.count(words[i]);
            result[words[i]] = count;
        }

        //TODO: make this prettier
        message.innerText = JSON.stringify(result);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    message = document.querySelector('#message');

    chrome.tabs.executeScript(null, {
        file: 'js/getPagesSource.js'
    }, function() {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
            message.innerText = 'An unexpected error occurred';
        }
    });
});

// TODO: add more words
var words = [
    'diversity',
    'paradigm shift',
    'streamline',
    'synergy'
];
