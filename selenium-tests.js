"use strict";
let webdriver = require("selenium-webdriver");
let By = webdriver.By;
let until = webdriver.until;

let m = main();
m.next();

function* main() {
  try {
    let driver = getDriver();

    yield visitLoginPage(driver);

    let submitButton = driver.findElement(By.id("facebook-btn"));
    //
    submitButton.click();

    let usernameField = driver.findElement(By.id("email"));
    let passwordField = driver.findElement(By.id("pass"));

    usernameField.sendKeys( "user001" );
    passwordField.sendKeys( "qwerty" );

    let currentUrl = yield getCurrentUrl(driver);

    console.log(currentUrl);
  }
  catch( error ) {
    console.log(error);
  }
}

function getDriver() {
  return new webdriver.Builder()
    .withCapabilities(
      webdriver.Capabilities.chrome())
    .build();
}

function visitLoginPage(driver) {
  driver.get("http://localhost:1337/login");

  let promise = driver.wait(
    until.elementLocated(By.id("facebook-btn")),
    1000);

  promise.then(onFulfill, onReject);

  function onFulfill(element) {
    m.next();
  }

  function onReject() {
    let error = new Error("Could not load page");
    m.throw(error);
  }
}

function getCurrentUrl(driver) {
  driver.getCurrentUrl().then(function(value) {
    m.next( value );
  });
}