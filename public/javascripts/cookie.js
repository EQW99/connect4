if (document.cookie == "") { // initialise cookie
    document.cookie="games=0;path=/";
}

function showCookieInfo(info) {
    var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)games\s*\=\s*([^;]*).*$)|^.*$/, "$1"); // get number from cookie string
    document.getElementById("cookieInfo").innerHTML = "You have played " + cookieValue + " games";
}

showCookieInfo(document.cookie);