<h1 align="center">$(JDOM)</h1>
<h3 align="center">1.0 Development</h2>
<br><br>

```javascript
$("Introduction").text("Hello!");
```
This project isn't finished yet! You can contribute to project this :)

#### $(Overview)
- [Using JDom](#Using-JDom)

- [Examples](#Examples)
  - [Start](#Start)
  - [Animations](#Animations)
  - [Events](#Events)
## Using JDom
You want to use JDom?
The best way to use it is to download it and adding it to your page.

```html
<script src="/assets/js/jdom.js"></script>
```

### NPM
```bash
npm install jdomjs
```

### Try JDom
You want to try JDom for testing purposes?
Get the newest version from github:
```html
<script src="https://raw.githubusercontent.com/interaapps/jdom/master/jdom.js"></script>
```

## Examples

### Start
#### CSS
```javascript
$("#myElement").css({
    background: "#000000",
    color: "#FFFFFF",
    marginRight: "10px"
});
```

#### Foreach
```javascript
$(".myElements").each(function(element) {
    $(element).text("Hi");
});
```

#### Child selector
```javascript
$("#myElement").$("#childElement").each(function(element) {
    $(element).text("Hi");
});
```

#### Builder pattern
```javascript
$("#myElement").text("Welcome!").attr({
   href: "/"
}).css({
    background: "#000000",
    color: "#FFFFFF"
});
```

#### Create a new element
```javascript
var myNewElement = $n("div").html("<p>New Element</p>").addClass("myClass");
// Appending to the Html Body
$("body").append(myNewElement);
```

### Animations

#### Animations
```javascript
$("#myElement").animate({
    background: "#989898"
}, 1000, function(){
    console.log("done");
});
```

#### Animator
```javascript
$("#myElement").animator([{
    css: {
        background: "#4343FF"
    },
    then: function() {
        console.log("Nice");
    },
    duration: 500
}, {
    css: {
        background: "#FF9898"
    },
    then: function() {
        console.log("Nice2");
    },
    duration: 500
}]);
```

### Events
#### On
```javascript
$("#myElement").on("click", function() {
    console.log("Hello world!");
});
```
#### Built in
```javascript
// (Works just for some)
$("#myElement").click(function() {
    console.log("Hello world!");
});
```
#### Binds
```javascript
$("a").bind({
    click: function() {
        alert("Left Clicked!");
    },
    contextmenu: function() {
        alert("Right Clicked!");
    }
});
```

#### Removing Events
```javascript
onClickEvent = function(event) {
    console.log("hello!");
    $("a").rmEvent("click", onClickEvent);
}
$("a").on("click", onClickEvent);
```

### More

#### Cajax example (Ajax)
[You need Cajax.js for this example. (Click here)](https://github.com/interaapps/cajax)
```javascript
Cajax.get("/api/getWeather", {
    zipcode: 97201
}).then(function(resp) {
    $("#weather-temp").html("<strong>" + resp.responseText + "</strong> degrees");
}).send();
```