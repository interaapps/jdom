<h1 align="center">JDOM</h1>
This project isn't finished! You can fork this, edit this and send a merge Request!

## Examples

#### CSS
```javascript
$("#myElement").css({
    background: "#000000",
    color: "#FFFFFF",
    marginRight: "10px"
});
```

#### Events
```javascript
$("#myElement").on(function() {
    console.log("Hello world!");
});

//Or (Works just for some)
$("#myElement").click(function() {
    console.log("Hello world!");
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