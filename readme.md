# JDOM
This project isn't finished! You can fork this, edit this and send a merge Request!

## Examples


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