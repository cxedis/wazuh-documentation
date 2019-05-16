/*
 * Wazuh documentation - Version selector script
 * Copyright (C) 2019 Wazuh, Inc.
 */

var versions = [
    {name: "3.9 (current)", url: "/new-design-c1a-tree"},
    {name: "3.8", url: "/3.8"},
    {name: "3.7", url: "/3.7"},
    {name: "3.6", url: "/3.6"},
    {name: "3.5", url: "/3.5"},
    {name: "3.4", url: "/3.4"},
    {name: "3.3", url: "/3.3"},
    {name: "3.2", url: "/3.2"},
    {name: "3.1", url: "/3.1"},
    {name: "3.0", url: "/3.0"},
    {name: "2.1", url: "/2.1"},
];

var current_version = "3.9";

$( document ).ready(function() {
    addVersions();
    checkLatestDocs();
});

function addVersions() {
    var version = $(".version");
    var select_version = $("#select-version");
    var path = document.location.pathname.split('/')[1];

    if (version == null) {
        console.error("No such element of class 'version'");
        return;
    }

    if (select_version == null) {
        console.error("No such element 'select-version'");
        return;
    }

    if (path == "current" || path == "3.x" || path == "new-design") {
        path = current_version;
    }

    for (var i = 0; i < versions.length; i++) {
        option = document.createElement("option");
        option.text = versions[i].name;
        option.value = versions[i].url;
        select_version.append(option);
    }

    select_version.val('/' + path);

    select_version.change(function(event) {
        var pathTokens = document.location.pathname.split('/');
        var extraPath = '';
        if( pathTokens.length >= 3 ) {
            for(var i = 2; i < pathTokens.length; i++) {
                extraPath += '/' + pathTokens[i];
            }
        }

        if(extraPath === '/not_found.html') extraPath = '';

        $.ajax({
            type: 'HEAD',
            url: event.target.value + extraPath,
            success: function(){
                window.location.href = event.target.value + extraPath;
            },
            error: function() {
                window.location.href = event.target.value + '/not_found.html';
            }
        });
    });
}

function checkLatestDocs(){
  /* Shows a warning message to the user if current doc version is not the latest version */
  /* Note: For this to work, it requires the documentation version variable (in file conf.py) and the array of versions (in this script) to be updated */
  var currentVersion = document.querySelector('.no-latest-notice').getAttribute('data-version');
  var latestVersion = versions[0].url.replace('/','');
  if ( currentVersion !== latestVersion ){
    var page = document.querySelector('#page');
    page.classList.add('no-latest-docs');
  }

  // Updates link to the latest version with the correct path (documentation's home)
  var link = document.querySelector('.link-latest');
  link.setAttribute('href', 'https://' + window.location.hostname + '/' + latestVersion + '/index.html');
}
