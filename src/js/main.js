
//  + Jonas Raoni Soares Silva
//  @ http://jsfromhell.com/string/rot13 [rev. #1]
var rot13 = function (string) {
    return string.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
    })
}
//  Retreive the rot13 encoded data-attr for user and domain, decode them and merge them into a beautiful botproof email adress.
var emailRots = document.querySelectorAll('[data-rot-email]')
Array.prototype.forEach.call(emailRots, function (el, i) {
    var email = rot13(el.getAttribute('data-rot-email'))
    el.setAttribute('href', 'mailto:' + email)
    if (el.innerHTML.indexOf('@') >= 0) {
        el.innerHTML = email
    }
})
