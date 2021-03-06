# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). Users will create an account which will then allow them to create and store shortened URLs, accessible in a list on the main page. Users may edit the URL redirect value for their shortened URLs as well as delete them if they choose to. While other users and those not logged in can not edit or delete someone's URLs, they can use the shortened URLs to be redirected accordingly.

## Final Product

!["Main page displaying all URLs for logged in user."](https://github.com/zackorykelly/tinyapp/blob/master/docs/urls-page.png)
!["Login form using hashing for security."](https://github.com/zackorykelly/tinyapp/blob/master/docs/login-page.png)
!["Edit page lets URL owner edit the long URL for a given ID."](https://github.com/zackorykelly/tinyapp/blob/master/docs/edit-page.png)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.