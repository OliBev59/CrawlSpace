document.querySelector('#loginForm').addEventListener('submit', () => {
    setCookie('user', document.querySelector('#username').value, '/')
    setCookie('pass', document.querySelector('#password').value, '/')
  })

  if(!getCookie('username')||!getCookie('pasword')) if(location.href != 'https://somelocation.example/index.html/') location.replace('https://somelocation.example/index.html/')

  // Cookies setting and getting functions

  function setCookie(name, value, path, options = {}) {
          options = {
              path: path,
              ...options
          }; if (options.expires instanceof Date) {
              options.expires = options.expires.toUTCString();
          } let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value)
          for (let optionKey in options) {
              updatedCookie += "; " + optionKey
              let optionValue = options[optionKey]
              if (optionValue !== true) {
                  updatedCookie += "=" + optionValue
              }
          }
          document.cookie = updatedCookie;
  }

  function getCookie(name) {
          let matches = document.cookie.match(new RegExp(
              "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
              ))
          return matches ? decodeURIComponent(matches[1]) : undefined
  }

  