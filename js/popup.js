/*global chrome */

// TODO: allow user to modify list of words
// TODO: highlight Buzzwords on page, allow user to toggle this feature

String.prototype.count = function(search) {
    var m = this.match(new RegExp(search.toString().replace(/(?=[.\\+*?[^\]$(){}\|])/, '\\'), 'gi'));
    return m ? m.length:0;
};

var message;

chrome.runtime.onMessage.addListener(function(request) {
    if (request.action == 'getSource') {
        var html = request.source;
        var result = {};
        var total = 0;

        var start = Date.now();
        for (var i = 0; i < words.length; i++) {
            var count = 0;
            count = html.count(words[i]);
            result[words[i]] = count;
            total += count;
        }
        var end = Date.now();
        console.log((end - start) + 'ms'); // eslint-disable-line

        // TODO: prettify this
        var tableHtml = '<table><tbody><tr class="header"><th>Word</th><th>Occurrences</th></tr>';

        for (var key in result) {
            tableHtml += '<tr><td>' + key + '</td><td>' + result[key] + '</td></tr>';
        }

        tableHtml += '</tbody></table>';
        message.innerHTML = tableHtml;

        chrome.browserAction.setBadgeText({ text: total.toString() });
        chrome.browserAction.setTitle({ title:'Found ' + total + ' Buzzwords' });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    message = document.querySelector('#message');

    chrome.tabs.executeScript(null, {
        file: 'js/getPagesSource.js'
    }, function() {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
            message.innerText = 'An unexpected error occurred: ' + chrome.runtime.lastError.message;
        }
    });
});

// TODO: add more words
var words = [
    'diversity',
    'paradigm shift',
    'streamline',
    'synergy',
    'empowerment',
    'generation x',
    'millennial',
    'disruptive',
    'innovative',
    'innovation',
    'drill down',
    'cloud computing',
    'big data',
    'bleeding edge',
    'data mining',
    'internet of things',
    'saas',
    'paas',
];
